<template>
  <div class="container">
    <el-form ref="searchForm" :model="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="searchForm.messageType" placeholder="请选择" clearable filterable>
            <el-option v-for="item in messageTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否已读" prop="readed">
          <el-select v-model="searchForm.readed" placeholder="请选择" clearable filterable>
            <el-option v-for="item in isReadList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button style="margin-top: 3px;" type="primary" size="small" :loading="searchLoading" @click="search">查询</el-button>
        <el-button style="margin-top: 3px;" type="primary" size="small" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary" size="mini" @click="markReaded"> <i class="el-icons-jd-yidu"></i> 标记已读</el-button>
      <el-button class="el-button--primary" size="mini" @click="allReaded"> <i class="el-icons-jd-quanbuyidu"></i> 全部已读</el-button>
      <!--<el-button class="el-button&#45;&#45;primary" size="mini" @click="allUnread"> <i class="el-icons-jd-quanbuyidu"></i> 全部未读</el-button>-->
    </div>

    <el-table
      :data="messageList"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="消息内容">
        <template slot-scope="scope">
          {{scope.row.message}}
        </template>
      </el-table-column>
      <el-table-column label="消息类型" width="180">
        <template slot-scope="scope">
          {{scope.row.messageType === 1 ? '订单变更' : scope.row.messageType === 2 ? '订单超时' : '库存预警' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="是否已读" width="180">
        <template slot-scope="scope">
          {{scope.row.readed === 0 ? '否' : '是'}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 15px;"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 15, 20, 25, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { list, read, readAll, resetData } from '@/api/messageCenter'

  export default {
    name: 'messageCenter',
    data() {
      return {
        searchForm: {
          messageType: '',
          readed: ''
        },
        messageTypeList: [{
          value: '1',
          label: '订单变更'
        }, {
          value: '2',
          label: '订单超时'
        }, {
          value: '3',
          label: '库存预警'
        }],
        isReadList: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '0',
            label: '否'
          }
        ],
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        messageList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        multipleSelection: []
      }
    },
    watch: {
      messageList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(messageType, readed, pageNum, pageSize) {
        this.listLoading = true
        return list(
          messageType,
          readed,
          pageNum,
          pageSize
        ).then(resp => {
          this.messageList = resp.data.data.rows
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.total = resp.data.data.total
          this.messageList.forEach((e, i) => {
            e['idx'] = i
          })
          if (resp.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = resp.data.data.pages
          }
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 标记已读 */
      markReaded() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作'
          })
          return
        }
        const ids = []
        this.multipleSelection.forEach((e, i) => {
          ids.push(e.id)
        })
        read(ids.join(',')).then(resp => {
          if (resp.data.status === 200) {
            this.$message({
              type: 'success',
              message: '标记成功',
              onClose: () => {
                this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize)
              }
            })
          }
        })
      },
      /* 全部已读 */
      allReaded() {
        readAll().then(resp => {
          if (resp.data.status === 200) {
            this.$message({
              type: 'success',
              message: '标记成功',
              onClose: () => {
                this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize)
              }
            })
          }
        })
      },
      allUnread() {
        resetData().then(resp => {
          if (resp.data.status === 200) {
            this.$message({
              type: 'success',
              message: '标记未读成功',
              onClose: () => {
                this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize)
              }
            })
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.messageType, this.searchForm.readed, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style scoped>
</style>

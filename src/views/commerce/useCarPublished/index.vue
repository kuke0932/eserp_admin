<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row>
        <el-form-item label="用车人" prop="createName">
          <el-input clearable v-model="searchForm.createName"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="carModel">
          <el-input clearable v-model="searchForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="领取人" prop="receiverName">
          <el-input clearable v-model="searchForm.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="领取时间" prop="receiverTime">
          <el-date-picker
            v-model="searchForm.receiverTime"
            type="month"
            :editable="false"
            placeholder="选择领取时间"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" :clearable="true" filterable>
            <el-option label="已保存" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="已领取" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="getTask" @click="receive" :loading="receiveLoading">
        <i class="el-icons-jd-lingqurenwu"></i>&nbsp;领取任务
      </el-button>
      <el-button type="primary hidden" code="export" @click="download" :loading="downloadLoading">导出数据</el-button>
    </div>
    <!--用车信息列表-->
    <el-table
      :data="useList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="用车人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.departmentName}}
        </template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">
          {{scope.row.carModel}}
        </template>
      </el-table-column>
      <el-table-column label="用途">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.usage"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.usage"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看用途</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" >
        <template slot-scope="scope">
          {{scope.row.useTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.status == 0 ? '已保存' : scope.row.status == 1 ? '已发布' : scope.row.status == 2 ? '已领取' :  '已完成'}}
        </template>
      </el-table-column>
      <el-table-column label="领取人">
        <template slot-scope="scope">
          {{scope.row.receiverName}}
        </template>
      </el-table-column>
      <el-table-column label="领取时间">
        <template slot-scope="scope">
          {{scope.row.receiverTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status == 1"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="领取任务">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="getTask" icon="el-icons-jd-lingqurenwu" @click="receiveLine(scope.row.id)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--操作-->
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
  import Tinymce from '@/components/Tinymce' /* 文本编辑器组件 */
  import BaseTable from '@/components/BaseTable' /* 文本编辑器组件 */
  import { list, receive } from '@/api/useCar'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'useCarPublished',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        useList: null,
        multipleSelection: [],
        searchForm: {
          createName: null,
          carModel: null,
          receiverName: null,
          receiverTime: null,
          status: null
        },
        createName: null,
        receiverName: '',
        receiverTime: null,
        carModel: null,
        status: null,
        listLoading: false,
        searchLoading: false,
        receiveLoading: false,
        downloadLoading: false
      }
    },
    watch: {
      useList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, true, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 用车信息列表 */
      fetchData(createName, carModel, status, isAll = true, receiverName, receiverTime, pageNum, pageSize) {
        this.listLoading = true
        return list(
          createName,
          carModel,
          status,
          isAll,
          receiverName,
          receiverTime,
          pageNum,
          pageSize
        ).then(response => {
          this.useList = response.data.data.rows
          this.useList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status, true,
          this.searchForm.receiverName, this.searchForm.receiverTime, this.pageNum, this.pageSize)
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status, true,
          this.searchForm.receiverName, this.searchForm.receiverTime, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.createName = this.searchForm.createName
        this.carModel = this.searchForm.carModel
        this.receiverName = this.searchForm.receiverName
        this.receiverTime = this.searchForm.receiverTime
        this.status = this.searchForm.status
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status, true,
          this.searchForm.receiverName, this.searchForm.receiverTime, this.pageNum, this.pageSize)
      },
      /* 领取任务 */
      receive() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status !== 1) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【已发布】的进行领取！',
              duration: 1500
            })
            return
          }
        }
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        this.receiveLoading = true
        this.listLoading = true
        receive(ids.join(',')).then(resp => {
          this.$message({
            type: 'success',
            message: '领取成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status, true,
                this.searchForm.receiverName, this.searchForm.receiverTime, this.pageNum, this.pageSize).then(resp => {
                this.receiveLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.receiveLoading = false
          this.listLoading = false
        })
      },
      receiveLine(id) {
        this.receiveLoading = true
        this.listLoading = true
        receive(id).then(resp => {
          this.$message({
            type: 'success',
            message: '领取成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status, true,
                this.searchForm.receiverName, this.searchForm.receiverTime, this.pageNum, this.pageSize).then(resp => {
                this.receiveLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.receiveLoading = false
          this.listLoading = false
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 获得日期 */
      getDate() {
        return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      },
      /* excel导出 */
      download() {
        if (this.receiverTime === null || this.receiverTime === '' || this.receiverTime === 'null') {
          this.$message({
            type: 'warning',
            message: '请选择领取时间,查询之后再导出!'
          })
          return
        }
        // this.downloadLoading = true
        const token = getToken()
        if (this.status === null || this.status === 'null') {
          this.status = ''
        }
        location.href = process.env.BASE_API + '/commerce/admin/useCar/download?createName=' + this.createName + '&status=' + this.status + '&carModel=' + this.carModel + '&receiverName=' + this.receiverName + '&receiverTime=' + this.receiverTime + '&x=' + token
      }
    }
  }
</script>
<style scoped>
</style>
<style>
  .el-table--medium td, .el-table--medium th{
    height: 34px;
  }
</style>

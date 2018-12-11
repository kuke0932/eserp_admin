<template>
  <el-dialog
    title="选择库位"
    :visible.sync="_visible"
    width="50%"
    :append-to-body=true
    @close="close"
    :before-close="handleClose">
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="货架编码" prop="shelfCode">
          <el-input clearable v-model="searchForm.shelfCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-button type="primary" @click="gotoSave">保存</el-button>
    <!--货架列表-->
    <el-table
      :data="storageList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="货位编码">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
      </el-table-column>
      <el-table-column label="货架编码">
        <template slot-scope="scope">
          {{scope.row.shelfCode}}
        </template>
      </el-table-column>
      <el-table-column label="货架层">
        <template slot-scope="scope">
          {{scope.row.shelfFloor}}
        </template>
      </el-table-column>
      <el-table-column label="货架区域">
        <template slot-scope="scope">
          {{scope.row.shelfArea}}
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
  </el-dialog>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { list } from '@/api/storage'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  export default {
    name: 'material',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      departmentId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        storageList: null,
        multipleSelection: [],
        departmentSelections: [],
        searchForm: {
          shelfCode: null
        },
        enableDepartmentSelection: false,
        listLoading: false,
        searchLoading: false
      }
    },
    computed: {
      _visible: {
        get: function() {
          return this.visible
        },
        set: function(val) {
        }
      }
    },
    watch: {
      storageList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      },
      departmentId: {
        handler(e) {
          this.fetchData(null, this.pageNum, this.pageSize)
        }
      }
    },
    mounted() {
      this.fetchData(null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 查询货架列表 */
      fetchData(shelfCode, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(this.departmentId)
        setAreaType(1)
        list(
          shelfCode,
          pageNum,
          pageSize
        ).then(response => {
          this.storageList = response.data.data.rows
          this.storageList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          if (response.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = response.data.data.pages
          }
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.shelfCode, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.shelfCode, this.pageNum, this.pageSize)
      },
      /* 查询 */
      search() {
        this.shelfCode = this.searchForm.shelfCode
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.shelfCode, this.pageNum, this.pageSize)
        }
      },
      /* 点击保存按钮执行的操作 */
      gotoSave() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.$emit('closeStorage', { storageLocationCode: this.multipleSelection[0].storageLocationCode })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      close() {
        this.$emit('update:visible', false)
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch((e) => {
          // console.log(e)
          if (e !== 'cancel') {
            done()
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>

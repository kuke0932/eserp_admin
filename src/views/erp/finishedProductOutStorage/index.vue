<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品编码" prop="productNumber">
          <el-input clearable v-model="searchForm.productNumber"  clearable />
        </el-form-item>
        <el-form-item label="产品型号编码" prop="productTypeCode">
          <el-input clearable v-model="searchForm.productTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="出库时间" prop="outStorageTime">
          <el-date-picker
            v-model="searchForm.outStorageTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库状态" prop="status">
          <el-select v-model="searchForm.status" :clearable="true" filterable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" :loading="searchLoading" @click="search">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddOutStorage"><i class="el-icons-jd-add"></i>&nbsp;添加出库单
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditOutStorage"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改出库单
      </el-button>
      <!--<el-button class="el-button&#45;&#45;danger" code="remove" @click="deleteOutStorage"><i class="el-icons-jd-shanchu"></i>&nbsp;删除出库单</el-button>-->
      <el-button class="el-button--primary hidden" code="confirm" :loading="btnConfirmApplyOutStorageLoading"
                 @click="goConfirmApplyOutStorage"><i class="el-icons-jd-queren"></i>&nbsp;确认申请出库
      </el-button>
      <el-button class="el-button--primary hidden" code="audit" :loading="btnGetMatchProductLoading"
                 @click="goGetMatchProduct"><i class="el-icons-jd-shenheyijian"></i>&nbsp;审核出库单
      </el-button>
      <el-button class="el-button--primary hidden" code="export" @click="download"><i class="el-icons-jd-chuli"></i>&nbsp;导出数据
      </el-button>
    </div>
    <!--添加出库单对话框-->
    <add :visible.sync="dialogVisible" :departmentId="searchForm.departmentId" @fetchData="search"></add>
    <edit ref="initDialog" :visible.sync="editDialogVisible" :departmentId="searchForm.departmentId" :id = "id" @fetchData="search"></edit>
    <match :visible.sync="matchDialogVisible" :applyFormId = "applyFormId" :productNo = "productNo" @fetchData="search"></match>
    <audit :visible.sync="auditDialogVisible" :applyFormId = "applyFormId" :productNo = "productNo" @fetchData="search"></audit>
    <!--出库列表-->
    <el-table
      :data="finishedProductList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="产品编号">
        <template slot-scope="scope">
          {{scope.row.productNumber}}
        </template>
      </el-table-column>
      <el-table-column label="产品内容">
        <template slot-scope="scope">
          {{scope.row.productContent}}
        </template>
      </el-table-column>
      <el-table-column label="库位编号">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
      </el-table-column>
      <el-table-column label="状态" :formatter="tableFormatter">
      </el-table-column>
      <el-table-column label="出库原因">
        <template slot-scope="scope">
          {{scope.row.reason}}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改出库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1"
                       @click="eidtOutStorage(scope.row.id, scope.row.demandStatus)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 1"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认申请出库">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirm" icon="el-icons-jd-queren"
                       @click="goConfirmApplyOutStorageLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 2"
            placement="top-start"
            width="100"
            trigger="hover"
            content="审核出库单">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="audit" icon="el-icons-jd-shenheyijian"
                       @click="goGetMatchProductLine(scope.row.id, scope.row.productNumber, scope.row.used)"></el-button>
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
  import { list, remove, apply } from '@/api/finishedProductOutStorage'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'
  import Add from './add'
  import Edit from './edit'
  import Match from './getMatchProduct'
  import Audit from './audit'
  import { getToken } from '@/utils/auth'

  export default {
    name: '脚垫出库',
    components: {
      Tinymce, /* 文本编辑器组件 */
      Add,
      Edit,
      Match,
      Audit
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        finishedProductList: null,
        multipleSelection: [],
        departmentSelections: [],
        materialTypeOptions: [{
          value: 1,
          name: '原材料'
        }, {
          value: 2,
          name: '辅料'
        }],
        statusOptions: [{
          value: 1,
          name: '待申请'
        }, {
          value: 2,
          name: '已确认申请'
        }, {
          value: 3,
          name: '维修'
        }, {
          value: 4,
          name: '重组'
        }, {
          value: 5,
          name: '不同意出库'
        }],
        searchForm: {
          productNumber: null,
          productTypeCode: null,
          outStorageTime: null,
          departmentId: '',
          status: null
        },
        storage: {
          id: null,
          reason: '',
          storageLocationCode: ''
        },
        enableDepartmentSelection: false,
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        btnConfirmApplyOutStorageLoading: false, // 确认申请出库按钮
        btnGetMatchProductLoading: false, // 审核出库按钮
        dialogVisible: false,
        editDialogVisible: false,
        matchDialogVisible: false,
        auditDialogVisible: false,
        editDisabled: false,
        id: null,
        applyFormId: null,
        productNo: ''
      }
    },
    watch: {
      finishedProductList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(2)
    },
    methods: {
      /* 获取部门下拉框 */
      getDepartmentSelections(departmentType) {
        getSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          if (this.departmentSelections.length > 1) {
            this.enableDepartmentSelection = true
          }
          this.searchForm.departmentId = this.departmentSelections[0].code
          this.fetchData(null, null, null, null, this.departmentSelections[0].code, this.pageNum, this.pageSize)
        })
      },
      /* 查询出库 */
      fetchData(productNumber, productTypeCode, outStorageTime, status, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        return list(
          productNumber,
          productTypeCode,
          outStorageTime,
          status,
          pageNum,
          pageSize
        ).then(resp => {
          this.finishedProductList = resp.data.data.rows
          this.finishedProductList.forEach((e, i) => { e['idx'] = i })
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          if (resp.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = resp.data.data.pages
          }
          this.listLoading = false
          this.searchLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
          this.searchLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.productNumber,
          this.searchForm.productTypeCode,
          this.searchForm.outStorageTime,
          this.searchForm.status,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.productNumber,
          this.searchForm.productTypeCode,
          this.searchForm.outStorageTime,
          this.searchForm.status,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      /* 获取所勾选出库信息 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.fetchData(
          this.searchForm.productNumber,
          this.searchForm.productTypeCode,
          this.searchForm.outStorageTime,
          this.searchForm.status,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        ).then(resp => {
          this.searchLoading = false
        })
      },
      /* 打开添加出库信息对话框 */
      goAddOutStorage() {
        this.dialogVisible = true
      },
      /* 打开修改出库信息对话框 */
      goEditOutStorage() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.id = this.multipleSelection[0].id
        if (this.multipleSelection[0].status !== 1) {
          this.$message({
            type: 'warning',
            message: '出库单已确认审核！'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
      },
      /* 点击右侧操作修改小按钮 */
      eidtOutStorage(id) {
        this.id = id
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
      },
      tableFormatter(row, column, cellValue, index) {
        if (row.status) {
          return this.statusOptions[row.status - 1].name
        }
      },
      /* 删除出库信息-已注释*/
      deleteOutStorage() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeCode,
                  this.searchForm.outStorageTime,
                  this.searchForm.status,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                )
              }
            })
          })
        })
      },
      /* 确认申请出库 */
      goConfirmApplyOutStorage() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        const list = this.multipleSelection
        for (let i = 0; i < list.length; i++) {
          if (list[i].status !== 1) {
            this.$message({
              type: 'warning',
              message: '出库单已经确认',
              duration: 1500
            })
            return
          }
        }
        this.$confirm('此操作将确认申请出库，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnConfirmApplyOutStorageLoading = true
          this.listLoading = true
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          apply(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '确认申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeCode,
                  this.searchForm.outStorageTime,
                  this.searchForm.status,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnConfirmApplyOutStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnConfirmApplyOutStorageLoading = false
            this.listLoading = false
          })
        })
      },
      /* 确认申请出库-行内 */
      goConfirmApplyOutStorageLine(id) {
        this.$confirm('此操作将确认申请出库，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnConfirmApplyOutStorageLoading = true
          this.listLoading = true
          apply(id).then(response => {
            this.$message({
              type: 'success',
              message: '确认申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeCode,
                  this.searchForm.outStorageTime,
                  this.searchForm.status,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnConfirmApplyOutStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnConfirmApplyOutStorageLoading = false
            this.listLoading = false
          })
        })
      },
      /* 审核出库单 */
      goGetMatchProduct() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        const element = this.multipleSelection[0]
        if (element.status !== 2) {
          this.$message({
            type: 'warning',
            message: '请选择已确认申请的记录',
            duration: 1500
          })
          return
        }
        if (element.status < 3) {
          this.applyFormId = element.id
          this.productNo = element.productNumber
          // 如果used==1，说明是正常出库
          if (element.used === 1) {
            // 打开正常出库审核界面
            this.auditDialogVisible = true
          } else {
            // used!==1说明匹配出库
            this.matchDialogVisible = true
          }
        } else {
          this.$message({
            type: 'warning',
            message: '您选择的状态不能审核',
            duration: 1500
          })
          return
        }
      },
      /* 审核出库单-行内 */
      goGetMatchProductLine(id, productNumber, used) {
        this.applyFormId = id
        this.productNo = productNumber
        // 如果used==1，说明是正常出库
        if (used === 1) {
          this.auditDialogVisible = true
        } else {
          // used!==1说明匹配出库
          this.matchDialogVisible = true
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 导出excel数据 */
      download() {
        if (this.searchForm.productNumber === null || this.searchForm.productNumber === '' || this.searchForm.productNumber === 'null') {
          this.searchForm.productNumber = ''
        }
        if (this.searchForm.productTypeCode === null || this.searchForm.productTypeCode === '' || this.searchForm.productTypeCode === 'null') {
          this.searchForm.productTypeCode = ''
        }
        if (this.searchForm.outStorageTime === null || this.searchForm.outStorageTime === '' || this.searchForm.outStorageTime === 'null') {
          this.searchForm.outStorageTime = ''
        }
        if (this.searchForm.status === null || this.searchForm.status === '' || this.searchForm.status === 'null') {
          this.searchForm.status = ''
        }
        const token = getToken()
        location.href = process.env.BASE_API + '/erp/admin/finishedProductOutStorage/download?productNumber=' +
          this.searchForm.productNumber + '&productTypeCode=' + this.searchForm.productTypeCode +
          '&departmentId=' + this.searchForm.departmentId +
          '&outStorageTime=' + this.searchForm.outStorageTime + '&status=' + this.searchForm.status + '&x=' + token
      }
    }
  }
</script>
<style scoped>
  img{
    width:20px;
    height: 20px;
  }
  .supplier{
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    text-align: center;
    font-size: 24px;
    border-radius: 50%;
    float: left;
    padding: 0;
    margin-left: 2%;
  }
</style>

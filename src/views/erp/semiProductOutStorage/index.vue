<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="部门" prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料类型" prop="materialType" v-if="areaType === 1">
          <el-select v-model="searchForm.materialType" placeholder="请选择物料类型" filterable>
            <el-option v-for="item in materialTypeOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input clearable v-model="searchForm.materialCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input clearable v-model="searchForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="出库状态" prop="status">
          <el-select v-model="searchForm.status" :clearable="true" filterable>
            <el-option v-for="item in statusSelections" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间" prop="outStorageTime">
          <el-date-picker
            v-model="searchForm.outStorageTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="出库时间" prop="outStorageTime">-->
          <!--<el-input clearable v-model="searchForm.outStorageTime"></el-input>-->
        <!--</el-form-item>-->
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
        class="el-icons-jd-xiugai1"></i>&nbsp;修改出库信息
      </el-button>
      <el-button class="el-button--primary hidden" code="confirm" :loading="btnGoAuditOutStorageLoading"
                 @click="goAuditOutStorage"><i class="el-icons-jd-queren"></i>&nbsp;确认出库
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteOutStorage"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除出库单
      </el-button>
      <el-button class="el-button--primary" @click="goRefresh"><i
        class="el-icons-jd-iconmanzutiaojian"></i>&nbsp;刷新
      </el-button>
      <el-button class="el-button--primary hidden" code="export" @click="download"><i class="el-icons-jd-chuli"></i>&nbsp;导出数据
      </el-button>
    </div>
    <!--添加出库单对话框-->
    <add :visible.sync="dialogVisible" :departmentId="searchForm.departmentId" :areaType="areaType"
         :materialType.sync="searchForm.materialType" @fetchData="search"></add>
    <edit ref="initDialog" :visible.sync="editDialogVisible" :departmentId="searchForm.departmentId"
          :areaType="areaType" :materialType.sync="searchForm.materialType" :id = "id" @fetchData="search"></edit>
    <!--原材料出库列表-->
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
      <el-table-column label="物料类型">
        <template slot-scope="scope">
          {{scope.row.materialTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="物料编码">
        <template slot-scope="scope">
          {{scope.row.materialCode}}
        </template>
      </el-table-column>
      <el-table-column label="物料名称">
        <template slot-scope="scope">
          {{scope.row.materialName}}
        </template>
      </el-table-column>
      <el-table-column label="规格">
        <template slot-scope="scope">
          {{scope.row.materialSpecification}}
        </template>
      </el-table-column>
      <el-table-column label="数量" >
        <template slot-scope="scope">
          {{scope.row.materialAmount}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>
      <el-table-column label="库位">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
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
      <el-table-column label="出库状态">
        <template slot-scope="scope">
          {{scope.row.status === 2 ? '已出库' : '未出库'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status == 1"
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改出库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="editOutStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status == 1"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认出库">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirm" icon="el-icons-jd-queren" @click="auditOutStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status == 1"
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除出库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteOutStorage(scope.row)"></el-button>
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
  import BaseTable from '@/components/BaseTable'
  import { list, remove, audit, refresh } from '@/api/semiProductOutStorage'
  import { getSelections } from '@/api/department'
  import Add from './add'
  import Edit from './edit'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  import { getToken } from '@/utils/auth'
  export default {
    name: '',
    components: {
      extends: BaseTable,
      Tinymce, /* 文本编辑器组件 */
      Add,
      Edit
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
        areaType: null,
        materialTypeOptions: [{
          value: 1,
          name: '原材料'
        }, {
          value: 2,
          name: '辅料'
        }],
        statusSelections: [{
          value: 1,
          name: '未出库'
        }, {
          value: 2,
          name: '已出库'
        }],
        searchForm: {
          materialType: 3,
          materialCode: null,
          materialName: null,
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
        btnGoAuditOutStorageLoading: false, // 确认出库按钮
        removeLoading: false, // 删除按钮
        dialogVisible: false,
        editDialogVisible: false,
        id: null
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(this.searchForm.materialType, null, null, null, this.searchForm.departmentId, this.pageNum, this.pageSize)
      next()
    },
    watch: {
      storageList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      },
      $route: {
        handler(e) {
          this.areaType = parseInt(e.query.areaType)
          if (this.areaType && this.areaType !== 1) {
            this.searchForm.materialType = 1
          } else {
            this.searchForm.materialType = this.materialTypeOptions[0].value
          }
        },
        immediate: true
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
          this.fetchData(this.searchForm.materialType, null, null, this.searchForm.status, this.outStorageTime, this.searchForm.departmentId, this.pageNum, this.pageSize)
        })
      },
      /* 查询出库 */
      fetchData(materialType, materialCode, materialName, status, outStorageTime, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        setAreaType(this.areaType)
        return list(
          materialType,
          materialCode,
          materialName,
          status,
          outStorageTime,
          pageNum,
          pageSize
        ).then(resp => {
          this.storageList = resp.data.data.rows
          this.storageList.forEach((e, i) => { e['idx'] = i })
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
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
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.materialType,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.status,
          this.searchForm.outStorageTime,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.materialType,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.status,
          this.searchForm.outStorageTime,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      /* 获取所勾选出库信息 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.searchForm.materialType = this.materialTypeOptions[2].value
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.demandName = this.searchForm.demandName
        this.demandContent = this.searchForm.demandContent
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.materialType,
            this.searchForm.materialCode,
            this.searchForm.materialName,
            this.searchForm.status,
            this.searchForm.outStorageTime,
            this.searchForm.departmentId,
            this.pageNum,
            this.pageSize
          ).then((resp) => {
            this.searchLoading = false
          })
        }
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
            message: '请选择出库状态为【未出库】的再执行此操作!'
          })
          return
        }
        const outStorageRecord = this.multipleSelection[0]
        if (outStorageRecord.status === 2) {
          this.$message({
            type: 'warning',
            message: '该出库单已出库，禁止修改!'
          })
          return
        }
        this.id = outStorageRecord.id
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
      },
      /* 点击右侧操作修改小按钮 */
      editOutStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该出库单已出库，禁止修改!'
          })
          return
        }
        this.id = row.id
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
      },
      /* 确认出库 */
      goAuditOutStorage() {
        const rows = this.multipleSelection
        if (rows.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].status === 2) {
            this.$message({
              type: 'warning',
              message: '请选择出库状态为【未出库】的进行操作!'
            })
            return
          }
        }
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].storageLocationCode === '库存不足') {
            this.$message({
              type: 'warning',
              message: '有产品库存不足!请更正'
            })
            return
          }
        }
        this.$confirm('出库以后将不能再修改和删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnGoAuditOutStorageLoading = true
          this.listLoading = true
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          setAreaType(this.areaType)
          audit(ids.join(',')).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.status,
                  this.searchForm.outStorageTime,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnGoAuditOutStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnGoAuditOutStorageLoading = false
            this.listLoading = false
          })
        })
      },
      /* 点击右侧操作确认出库小按钮 */
      auditOutStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该出库单已出库!'
          })
          return
        }
        this.$confirm('出库以后将不能再修改和删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnGoAuditOutStorageLoading = true
          this.listLoading = true
          setAreaType(this.areaType)
          audit(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.status,
                  this.searchForm.outStorageTime,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnGoAuditOutStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnGoAuditOutStorageLoading = false
            this.listLoading = false
          })
        })
      },
      /* 删除出库信息 */
      deleteOutStorage() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 2) {
            this.$message({
              type: 'warning',
              message: '请选择出库状态为【未出库】的进行删除!'
            })
            return
          }
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
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
                  this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.status,
                  this.searchForm.outStorageTime,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.removeLoading = false
            this.listLoading = false
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteOutStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该出库单已出库，禁止删除!'
          })
          return
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.status,
                  this.searchForm.outStorageTime,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.removeLoading = false
            this.listLoading = false
          })
        })
      },
      download() {
        if (this.searchForm.materialType === null || this.searchForm.materialType === '' || this.searchForm.materialType === 'null') {
          this.searchForm.materialType = ''
        }
        if (this.searchForm.materialCode === null || this.searchForm.materialCode === '' || this.searchForm.materialCode === 'null') {
          this.searchForm.materialCode = ''
        }
        if (this.searchForm.materialName === null || this.searchForm.materialName === '' || this.searchForm.materialName === 'null') {
          this.searchForm.materialName = ''
        }
        if (this.searchForm.status === null || this.searchForm.status === '' || this.searchForm.status === 'null') {
          this.searchForm.status = ''
        }
        if (this.searchForm.outStorageTime === null || this.searchForm.outStorageTime === '' || this.searchForm.outStorageTime === 'null') {
          this.searchForm.outStorageTime = ''
        }
        const token = getToken()
        location.href = process.env.BASE_API + '/erp/admin/semiProductOutStorage/download?materialType=' +
           this.searchForm.materialType + '&materialCode=' + this.searchForm.materialCode +
          '&areaType=' + this.areaType + '&departmentId=' + this.searchForm.departmentId + '&outStorageTime=' + this.searchForm.outStorageTime +
        '&materialName=' + this.searchForm.materialName + '&status=' + this.searchForm.status + '&x=' + token
      },
      /* 刷新出库单 */
      goRefresh() {
        setAreaType(this.areaType)
        refresh(this.searchForm.materialType).then(res => {
          this.fetchData(this.searchForm.materialType, null, null, this.searchForm.status, this.outStorageTime, this.searchForm.departmentId, this.pageNum, this.pageSize)
        })
      }
    }
  }
</script>
<style scoped>
</style>

<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="部门" prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input clearable v-model="searchForm.materialCode">{{areaType}}</el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input clearable v-model="searchForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="入库时间" prop="visitTime">
          <el-date-picker
            v-model="searchForm.inStorageTime"
            type="month"
            :editable="false"
            placeholder="选择入库时间"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库状态" prop="status">
          <el-select v-model="searchForm.inStatus" :clearable="true" filterable>
            <el-option v-for="item in statusSelections" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchButton">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddInStorage"><i class="el-icons-jd-add"></i>&nbsp;添加入库单
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditInStorage"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改入库信息
      </el-button>
      <el-button class="el-button--primary hidden" code="confirm" @click="goAuditInStorage" :loading="confirmLoading"><i
        class="el-icons-jd-queren"></i>&nbsp;确认入库
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" @click="deleteInStorage" :loading="removeLoading"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除入库单
      </el-button>
      <!-- <el-button class="el-button&#45;&#45;primary hidden" code="confirm" @click="goPrintQrCode"><i
        class="el-icons-jd-queren"></i>&nbsp;打印二维码
      </el-button>-->
    </div>
    <!--添加入库单对话框-->
    <el-dialog
      title="添加入库单"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addFormLoading" :element-loading-text="loadingText">
        <el-form-item label="供应商" prop="supplierName">
          <el-input clearable v-model="addForm.supplierName" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="seeSupplier">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="物料编码" prop="code">
          <el-input clearable v-model="addForm.code" :disabled="true" style="width: 93%; float: left;"></el-input>
          <el-button class="supplier" code="add" @click="seeMaterialCode">+</el-button>
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-input clearable v-model="addForm.name" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="specificationValue">
          <el-input clearable v-model="addForm.specificationValue" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitName">
          <el-input clearable v-model="addForm.unitName" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="materialAmount">
          <el-input clearable v-model="addForm.materialAmount" type="number" style="width: 93%; float: left;"></el-input>
        </el-form-item>
        <el-form-item label="库位" prop="storageLocationCode">
          <el-input clearable v-model="addForm.storageLocationCode" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="seeLocation">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="入库原因" prop="reason">
          <el-input clearable v-model="addForm.reason" style="width: 93%; float: left;"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改入库信息对话框-->
    <el-dialog
      title="修改入库信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editFormLoading" :element-loading-text="loadingText">
        <el-form-item label="供应商" prop="supplierName">
          <el-input clearable v-model="editForm.supplierName" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="editSupplier">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="物料编码" prop="code">
          <el-input clearable v-model="editForm.code" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="seeMaterialCodeEdit">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-input clearable v-model="editForm.name" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="specificationValue">
          <el-input clearable v-model="editForm.specificationValue" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitName">
          <el-input clearable v-model="editForm.unitName" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="materialAmount">
          <el-input clearable v-model="editForm.materialAmount" style="width: 93%; float: left;"></el-input>
        </el-form-item>
        <el-form-item label="库位" prop="storageLocationCode">
          <el-input clearable v-model="editForm.storageLocationCode" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="editLocation">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="入库原因" prop="reason">
          <el-input clearable v-model="editForm.reason" style="width: 93%; float: left;"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加供应商时打开的对话框-->
    <el-dialog
      title="供应商"
      :visible.sync="valueManageDialogVisible"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <material-value :addForm="addForm" :addOrUpdate="true" @closeSupplier="closeSupplier"></material-value>
    </el-dialog>
    <!--修改供应商时打开的对话框-->
    <el-dialog
      title="供应商"
      :visible.sync="valueManageDialogVisibleEdit"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <material-value :editForm="editForm" :addOrUpdate="false" @closeSupplier="closeSupplierEdit"></material-value>
    </el-dialog>
    <!--添加 物料编码 打开的对话框-->
    <el-dialog
      title="物料编码"
      :visible.sync="materialDialogVisible"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <material-code :material="addForm" :departmentId="searchForm.departmentId"
                     :areaType="areaType" :addOrUpdate="true" @closeSupplier="closeMaterial"></material-code>
    </el-dialog>
    <!--修改 物料编码 打开的对话框-->
    <el-dialog
      title="物料编码"
      :visible.sync="materialDialogVisibleEdit"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <material-code :materialEdit="editForm" :departmentId="searchForm.departmentId"
                     :areaType="areaType" :addOrUpdate="false" @closeSupplier="closeMaterialEdit"></material-code>
    </el-dialog>
    <!--添加 库位管理 打开的对话框-->
    <el-dialog
      title="库位管理"
      :visible.sync="locationManageVisibleAdd"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <storage-value :storage.sync="addForm" :departmentId="searchForm.departmentId"
                     :areaType="areaType" :addOrUpdate="true" @closeSupplier="closeLocationAdd"></storage-value>
    </el-dialog>
    <!--修改 库位管理 打开的对话框-->
    <el-dialog
      title="库位管理"
      :visible.sync="locationManageVisibleEdit"
      width="50%"
      height="80%"
      :before-close="handleCloseForm">
      <storage-value :editStorage.sync="editForm" :departmentId="searchForm.departmentId"
                     :areaType="areaType" :addOrUpdate="false" @closeSupplier="closeLocationEdit"></storage-value>
    </el-dialog>
    <!--原材料入库列表-->
    <el-table
      :data="storageList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
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
      <el-table-column label="数量">
        <template slot-scope="scope">
          {{scope.row.materialAmount}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>
      <el-table-column label="供应商">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="库位">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
      </el-table-column>
      <el-table-column label="入库原因">
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
      <el-table-column label="入库状态">
        <template slot-scope="scope">
          {{scope.row.status === 2 ? '已入库' : '未入库'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改入库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1"
                       @click="editInStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 1 "
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认入库">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirm" icon="el-icons-jd-queren"
                       @click="auditInStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除入库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu"
                       @click="goDeleteInStorage(scope.row)"></el-button>
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
  import Tinymce from '@/components/Tinymce'
  import BaseTable from '@/components/BaseTable'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  /* 文本编辑器组件 */
  import { list, save, update, remove, getInfoById, audit, printQrCode } from '@/api/semiProductInStorage'
  import { getSelections } from '@/api/department'
  import MaterialValue from './supplierValue'
  /* 通过组件形式引入供应商管理 */
  import MaterialCode from './materialCode'
  /* 通过组件形式引入库位管理 */
  import StorageValue from './storage'
  export default {
    name: '',
    extends: BaseTable,
    components: {
      Tinymce, /* 文本编辑器组件 */
      MaterialValue,
      MaterialCode,
      StorageValue
    },
    data() {
      return {
        loadingText: '拼命加载中',
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        storageList: [],
        multipleSelection: [],
        departmentSelections: [],
        areaType: null,
        statusSelections: [{
          value: 1,
          name: '未入库'
        }, {
          value: 2,
          name: '已入库'
        }],
        searchForm: {
          materialType: 3,
          materialCode: null,
          materialName: null,
          inStorageTime: null,
          inStatus: null,
          departmentId: ''
        },
        storage: {
          id: null,
          reason: '',
          storageLocationCode: ''
        },
        enableDepartmentSelection: false,
        listLoading: false,
        addFormLoading: false,
        editFormLoading: false,
        searchButton: false,
        dialogVisible: false,
        removeLoading: false,
        confirmLoading: false,
        editDialogVisible: false,
        valueManageDialogVisible: false,
        materialDialogVisible: false,
        materialDialogVisibleEdit: false,
        locationManageVisibleAdd: false,
        locationManageVisibleEdit: false,
        valueManageDialogVisibleEdit: false,
        addForm: {
          materialSpecification: '',
          unitName: '',
          materialAmount: null,
          storageLocationCode: '',
          reason: '',
          supplierId: null,
          materialId: null,
          supplierName: '',
          id: null,
          code: '',
          name: '',
          specificationValue: ''
        },
        editForm: {
          id: '',
          materialSpecification: '',
          unitName: '',
          materialAmount: null,
          storageLocationCode: '',
          reason: '',
          supplierId: null,
          materialId: null,
          supplierName: '',
          code: '',
          name: '',
          specificationValue: ''
        },
        rules: {
          materialType: [
            { required: true, message: '请选择物料类型', trigger: 'blur' }
          ],
          supplierName: [
            { required: true, message: '请选择供应商信息' }
          ],
          code: [
            { required: true, message: '请输入物料编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入物料名称', trigger: 'blur' }
          ],
          specificationValue: [
            { required: true, message: '请输入规格', trigger: 'blur' }
          ],
          unitName: [
            { required: true, message: '请输入单位', trigger: 'blur' }
          ],
          materialAmount: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          storageLocationCode: [
            { required: true, message: '请输入库位', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请输入入库原因', trigger: 'blur' }
          ]
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(this.searchForm.materialType, null, null, null, null, this.searchForm.departmentId, this.pageNum, this.pageSize)
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
            this.searchForm.materialType = 3
          } else {
            this.searchForm.materialType = 3
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
          this.fetchData(this.searchForm.materialType, null, null, null, null, this.searchForm.departmentId, this.pageNum, this.pageSize)
        })
      },
      /* 查询入库 */
      fetchData(materialType, materialCode, materialName, inStorageTime, inStatus, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        setAreaType(this.areaType)
        return list(
          3,
          materialCode,
          materialName,
          inStorageTime,
          inStatus,
          pageNum,
          pageSize
        ).then(response => {
          this.storageList = response.data.data.rows
          this.storageList.forEach((e, i) => {
            e['idx'] = i
          })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          if (response.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = response.data.data.pages
          }
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.materialType,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.inStorageTime,
          this.searchForm.inStatus,
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
          this.searchForm.inStorageTime,
          this.searchForm.inStatus,
          this.searchForm.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      /* 获取所勾选入库信息 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.searchButton = true
        this.demandName = this.searchForm.demandName
        this.demandContent = this.searchForm.demandContent
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(3,
            this.searchForm.materialCode,
            this.searchForm.materialName,
            this.searchForm.inStorageTime,
            this.searchForm.inStatus,
            this.searchForm.departmentId,
            this.pageNum,
            this.pageSize
          ).then(resp => {
            this.searchButton = false
          })
        }
      },
      /* 打开添加入库信息对话框 */
      goAddInStorage() {
        this.dialogVisible = true
      },
      /* 打开修改入库信息对话框 */
      goEditInStorage() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选择入库状态为【未入库】的再执行此操作!'
          })
          return
        }
        const inStorageRecord = this.multipleSelection[0]
        if (inStorageRecord.status === 2) {
          this.$message({
            type: 'warning',
            message: '该入库单已入库，禁止修改!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editFormLoading = true
        this.listLoading = true
        getInfoById(inStorageRecord.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.materialType = resp.data.data.materialType
          this.editForm.supplierName = resp.data.data.supplierName
          this.editForm.code = resp.data.data.materialCode
          this.editForm.name = resp.data.data.materialName
          this.editForm.specificationValue = resp.data.data.materialSpecification
          this.editForm.unitName = resp.data.data.unitName
          this.editForm.materialAmount = resp.data.data.materialAmount
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.reason = resp.data.data.reason
          this.editFormLoading = false
          this.listLoading = false
        }).catch(e => {
          this.editFormLoading = false
          this.listLoading = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      editInStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该入库单已入库，禁止修改!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editFormLoading = true
        this.listLoading = true
        getInfoById(row.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.materialType = resp.data.data.materialType
          this.editForm.supplierName = resp.data.data.supplierName
          this.editForm.code = resp.data.data.materialCode
          this.editForm.name = resp.data.data.materialName
          this.editForm.specificationValue = resp.data.data.materialSpecification
          this.editForm.unitName = resp.data.data.unitName
          this.editForm.materialAmount = resp.data.data.materialAmount
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.reason = resp.data.data.reason
          this.editFormLoading = false
          this.listLoading = false
        }).catch(e => {
          this.editFormLoading = false
          this.listLoading = false
        })
      },
      /* 确认入库 */
      goAuditInStorage() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 2) {
            this.$message({
              type: 'warning',
              message: '请选择入库状态为【未入库】的进行操作!'
            })
            return
          }
        }
        this.$confirm('入库以后将不能再修改和删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          this.confirmLoading = true
          this.listLoading = true
          setAreaType(this.areaType)
          audit(ids.join(',')).then(resp => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.confirmLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmLoading = false
            this.listLoading = false
          })
        })
      },
      /* 点击右侧操作确认入库小按钮 */
      auditInStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该入库单已入库!'
          })
          return
        }
        this.$confirm('入库以后将不能再修改和删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmLoading = true
          this.listLoading = true
          setAreaType(this.areaType)
          audit(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.confirmLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmLoading = false
            this.listLoading = false
          })
        })
      },
      /* 删除入库信息 */
      deleteInStorage() {
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
              message: '请选择入库状态为【未入库】的进行删除!'
            })
            return
          }
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          this.listLoading = true
          this.removeLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.listLoading = false
                  this.removeLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.removeLoading = false
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteInStorage(row) {
        if (row.status === 2) {
          this.$message({
            type: 'warning',
            message: '该入库单已入库，禁止删除!'
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
                this.fetchData(this.searchForm.materialType,
                  this.searchForm.materialCode,
                  this.searchForm.materialName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.listLoading = false
                  this.removeLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.removeLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        const materialAmount = Number(this.addForm.materialAmount)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              setAreaType(this.areaType)
              const jsonData = {
                'departmentId': this.searchForm.departmentId,
                'id': 0,
                'materialAmount': materialAmount,
                'materialId': this.addForm.materialId,
                'reason': this.addForm.reason,
                'storageLocationCode': this.addForm.storageLocationCode,
                'supplierId': this.addForm.supplierId
              }
              this.addFormLoading = true
              this.loadingText = '正在提交'
              save(jsonData).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.materialType,
                      this.searchForm.materialCode,
                      this.searchForm.materialName,
                      this.searchForm.inStorageTime,
                      this.searchForm.inStatus,
                      this.searchForm.departmentId,
                      this.pageNum,
                      this.pageSize
                    ).then(resp => {
                      this.addFormLoading = false
                      this.loadingText = '拼命加载中'
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.addFormLoading = false
                this.loadingText = '拼命加载中'
              })
            } else if (formName === 'editForm') {
              this.editFormLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                1,
                this.editForm.materialAmount,
                this.editForm.materialId,
                this.editForm.reason,
                this.editForm.storageLocationCode,
                this.editForm.supplierId,
                1
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.fetchData(this.searchForm.materialType,
                      this.searchForm.materialCode,
                      this.searchForm.materialName,
                      this.searchForm.inStorageTime,
                      this.searchForm.inStatus,
                      this.searchForm.departmentId,
                      this.pageNum,
                      this.pageSize
                    ).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.editFormLoading = false
                    })
                  }
                })
              }).catch(e => {
                this.editFormLoading = false
                this.loadingText = '拼命加载中'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 添加时打开供应商页面 */
      seeSupplier() {
        this.valueManageDialogVisible = true
      },
      editSupplier() {
        this.valueManageDialogVisibleEdit = true
      },
      /* 添加时打开物料编码 */
      seeMaterialCode() {
        this.materialDialogVisible = true
      },
      /* 修改时打开物料编码 */
      seeMaterialCodeEdit() {
        this.materialDialogVisibleEdit = true
      },
      /* 添加时打开库位管理 */
      seeLocation() {
        this.locationManageVisibleAdd = true
      },
      /* 修改时打开库位管理 */
      editLocation() {
        this.locationManageVisibleEdit = true
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.searchForm.inStorageTime = ''
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.addFormLoading === true || this.editFormLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      },
      /* 关闭二级对话框 */
      handleCloseForm(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.closeSupplier()
          this.closeSupplierEdit()
          this.closeMaterial()
          this.closeMaterialEdit()
          this.closeLocationAdd()
          this.closeLocationEdit()
        }).catch(() => {

        })
      },
      closeSupplier() {
        this.valueManageDialogVisible = false
      },
      closeSupplierEdit() {
        this.valueManageDialogVisibleEdit = false
      },
      closeMaterial() {
        this.materialDialogVisible = false
      },
      closeMaterialEdit() {
        this.materialDialogVisibleEdit = false
      },
      closeLocationAdd() {
        this.locationManageVisibleAdd = false
      },
      closeLocationEdit() {
        this.locationManageVisibleEdit = false
      },
      /* 打印二维码 */
      goPrintQrCode(list) {
        const rows = []
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            this.$message({
              type: 'warning',
              message: '请选择入库状态为【已入库】的进行操作!'
            })
            return
          }
          rows.push(this.multipleSelection[i].id)
        }
        printQrCode(rows.join(',')).then(res => {
          const list = res.data.data
          const urls = list.join(',')
          if (urls === '' || urls === null) {
            this.$message({
              type: 'warning',
              message: '没有可打印的材料'
            })
            return
          }
          window.open('/manage/static/printWater/semiProductQrCode.html?qrCodeUrl=' + encodeURIComponent(urls))
        })
      }
    }
  }
</script>
<style scoped>
  img {
    width: 20px;
    height: 20px;
  }

  .supplier {
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

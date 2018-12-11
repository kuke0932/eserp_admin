<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品编号" prop="productNumber">
          <el-input clearable v-model="searchForm.productNumber"></el-input>
        </el-form-item>
        <el-form-item label="产品型号名称" prop="productTypeName">
          <el-input clearable v-model="searchForm.productTypeName"></el-input>
        </el-form-item>
        <el-form-item label="入库时间" prop="visitTime">
          <el-date-picker
            v-model="searchForm.inStorageTime"
            type="month"
            :editable="false"
            placeholder="选择入库时间"
            value-format="yyyy-MM">
          </el-date-picker>
          <el-form-item label="入库状态" prop="status">
            <el-select v-model="searchForm.inStatus" :clearable="true" filterable>
              <el-option v-for="item in statusSelections" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">查询</el-button>
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
      <el-button class="el-button--danger hidden" code="remove" @click="deleteInStorage" :loading="deleteLoading"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除入库单
      </el-button>
      <!--<el-button class="el-button&#45;&#45;primary" code="enable" @click="enable"><i class="el-icons-jd-qiyong"></i>&nbsp;启用入库单</el-button>-->
    </div>
    <!--添加入库单对话框-->
    <el-dialog
      title="添加入库单"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addLoading" :element-loading-text="loadingText">
        <el-form-item label="产品编号" prop="productNumber">
          <el-input clearable v-model="addForm.productNumber" @keyup.enter.native="resetProductNo(addForm)"></el-input>
        </el-form-item>
        <el-form-item  label="产品组合" prop="produceType">
          <el-input clearable v-model="addForm.produceType">
            <el-button type="primary" slot="append" @mouseover.native="sketchMapVisible = true" @mouseleave.native="mouseleave" icon="el-icons-jd-wenhao"></el-button>
          </el-input>
          <div class="divSketchMap" v-if="sketchMapVisible" >
            <sketch-map :produce-type.sync="addForm.produceType" @mouseover.native="enterSketchMap" @mouseleave.native="leaveSketchMap" :readonly="false"></sketch-map>
          </div>
        </el-form-item>
        <el-form-item label="库位" prop="storageLocationCode">
          <el-input clearable v-model="addForm.storageLocationCode" :disabled="true">
            <el-button slot="append" type="primary" code="add" @click="seeLocation">+</el-button>
          </el-input>

        </el-form-item>
        <el-form-item label="入库原因" prop="reason">
          <el-input clearable v-model="addForm.reason"></el-input>
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
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="产品编号" prop="productNumber">
          <el-input clearable v-model="editForm.productNumber" style="width: 93%; float: left;" @keyup.enter.native="resetProductNo(editForm)"></el-input>
        </el-form-item>
        <el-form-item  label="产品组合" prop="produceType">
          <el-input clearable v-model="editForm.produceType" style="flex: 5;">
            <el-button type="primary" slot="append" @mouseover.native="sketchMapVisible = true" @mouseleave.native="mouseleave" icon="el-icons-jd-wenhao"></el-button>
          </el-input>
          <div class="divSketchMap" v-if="sketchMapVisible" >
            <sketch-map :produce-type.sync="editForm.produceType" @mouseover.native="enterSketchMap" @mouseleave.native="leaveSketchMap" :readonly="false"></sketch-map>
          </div>
        </el-form-item>
        <el-form-item label="库位" prop="storageLocationCode">
          <el-input clearable v-model="editForm.storageLocationCode" style="width: 93%; float: left;"  :disabled="true">
            <el-button code="add" slot="append" @click="editLocation">+</el-button>
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
    <!--添加库位管理时打开的对话框-->
    <el-dialog
      title="库位管理"
      :visible.sync="locationManageVisibleAdd"
      width="50%"
      height="80%"
      :before-close="handleClose">
      <storage-value :storage.sync="addForm" :departmentId="searchForm.departmentId"
                     :addOrUpdate="true" @closeSupplier="closeLocationAdd"></storage-value>
    </el-dialog>
    <!--修改库位管理时打开的对话框-->
    <el-dialog
      title="库位管理"
      :visible.sync="locationManageVisibleEdit"
      width="50%"
      height="80%"
      :before-close="handleClose">
      <storage-value :editStorage.sync="editForm" :departmentId="searchForm.departmentId"
                     :addOrUpdate="false" @closeSupplier="closeLocationEdit"></storage-value>
    </el-dialog>
    <!--原材料入库列表-->
    <el-table
      :data="storageList"
      v-loading="listLoading"
      :element-loading-text="loadingText"
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
      <el-table-column label="产品型号名称">
        <template slot-scope="scope">
          {{scope.row.productTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="产品规格顔色">
        <template slot-scope="scope">
          {{scope.row.productSpecification + ' ' + scope.row.productColor}}
        </template>
      </el-table-column>
      <el-table-column label="库位编码" >
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
      </el-table-column>
      <el-table-column label="入库原因">
        <template slot-scope="scope">
          {{scope.row.reason}}
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label=" 禁用启用状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
      <el-table-column label=" 入库状态">
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
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="editInStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认入库">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirm" icon="el-icons-jd-queren" @click="auditInStorage(scope.row)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除入库信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteInStorage(scope.row)"></el-button>
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
  import { list, save, update, remove, getInfoById, updateStatus, audit } from '@/api/finishedProductInStorage'
  import { getSelections } from '@/api/department'
  import StorageValue from './storage' /* 通过组件形式引入库位管理 */
  import { setDepartmentId } from '@/utils/departmentManage'
  import SketchMap from '@/components/SketchMap'
  import _ from 'lodash'
  export default {
    name: '成品入库',
    extends: BaseTable,
    components: {
      Tinymce, /* 文本编辑器组件 */
      StorageValue,
      SketchMap
    },
    data() {
      return {
        loadingText: '拼命加载中',
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        storageList: null,
        multipleSelection: [],
        departmentSelections: [],
        searchForm: {
          productNumber: null,
          productTypeName: null,
          inStorageTime: null,
          departmentId: null,
          inStatus: null
        },
        storage: {
          id: null,
          storageLocationCode: '',
          reason: ''
        },
        enableDepartmentSelection: false,
        listLoading: false,
        searchLoading: false,
        confirmLoading: false,
        editLoading: false,
        deleteLoading: false,
        addLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        valueManageDialogVisible: false,
        viewMenuDialogVisible: false,
        locationManageVisibleAdd: false,
        locationManageVisibleEdit: false,
        statusSelections: [{
          value: 1,
          name: '未入库'
        }, {
          value: 2,
          name: '已入库'
        }],
        sketchMapVisible: false,
        isEnterSketchMap: false,
        addForm: {
          id: null,
          productNumber: '',
          reason: '',
          storageLocationCode: '',
          produceType: ''
        },
        editForm: {
          id: '',
          productNumber: '',
          reason: '',
          storageLocationCode: '',
          produceType: ''
        },
        rules: {
          departmentId: [
            { required: true, message: '请输入部门id', trigger: 'blur' }
          ],
          productNumber: [
            { required: true, message: '请输入产品编号', trigger: 'blur' }
          ],
          produceType: [
            { required: true, message: '请选择产品产品组合', trigger: 'blur' },
            { pattern: /^[0-3]{5}$/, message: '请填写正确的产品生产类型', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请输入入库原因', trigger: 'blur' }
          ],
          storageLocationCode: [
            { required: true, message: '请输入库位', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      storageList() {
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
      mouseleave: _.debounce(function() {
        if (!this.isEnterSketchMap) {
          this.sketchMapVisible = false
        }
      }, 500),
      enterSketchMap() {
        this.sketchMapVisible = true
        this.isEnterSketchMap = true
      },
      leaveSketchMap() {
        this.sketchMapVisible = false
        this.isEnterSketchMap = false
      },
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
      /* 查询入库 */
      fetchData(productNumber, productTypeName, inStorageTime, inStatus, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        return list(
          productNumber,
          productTypeName,
          inStorageTime,
          inStatus,
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
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      resetProductNo(form) {
        // if (form.productNumber.indexOf('=') >= 0) {
        //   this.$alert('请切换当前输入法为英文输入法！', '提示', {
        //     confirmButtonText: '确定'
        //   })
        //   return
        // }
        if (form.productNumber.indexOf('?') >= 0) {
          form.productNumber = this.getQueryVariable(form.productNumber.split('?')[1], 'productNo')
        }
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.productNumber,
          this.searchForm.productTypeName,
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
        this.fetchData(this.searchForm.productNumber,
          this.searchForm.productTypeName,
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
        this.searchLoading = true
        this.productNumber = this.searchForm.productNumber
        this.productTypeName = this.searchForm.productTypeName
        this.inStorageTime = this.searchForm.inStorageTime
        this.departmentId = this.searchForm.departmentId
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.productNumber,
            this.searchForm.productTypeName,
            this.searchForm.inStorageTime,
            this.searchForm.inStatus,
            this.searchForm.departmentId,
            this.pageNum,
            this.pageSize
          ).then(resp => {
            this.searchLoading = false
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
        const inStorage = this.multipleSelection[0]
        if (inStorage.status === 2) {
          this.$message({
            type: 'warning',
            message: '该入库单已入库，禁止修改!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(inStorage.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.reason = resp.data.data.reason
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.produceType = resp.data.data.produceType
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
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
        this.editLoading = true
        getInfoById(row.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.reason = resp.data.data.reason
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.produceType = resp.data.data.produceType
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
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
          audit(ids.join(',')).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeName,
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
          audit(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeName,
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
          this.deleteLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.listLoading = false
                  this.deleteLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.deleteLoading = false
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
          this.listLoading = true
          this.deleteLoading = true
          remove(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.productTypeName,
                  this.searchForm.inStorageTime,
                  this.searchForm.inStatus,
                  this.searchForm.departmentId,
                  this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.listLoading = false
                  this.deleteLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.deleteLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                null,
                1,
                this.addForm.productNumber,
                this.addForm.produceType,
                this.addForm.reason,
                this.addForm.storageLocationCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.productNumber,
                      this.searchForm.productTypeName,
                      this.searchForm.inStorageTime,
                      this.searchForm.inStatus,
                      this.searchForm.departmentId,
                      this.pageNum,
                      this.pageSize
                    ).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.addLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addLoading = false
              })
            } else if (formName === 'editForm') {
              this.editLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                1,
                this.editForm.productNumber,
                this.editForm.produceType,
                this.editForm.reason,
                this.editForm.storageLocationCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.productNumber,
                      this.searchForm.productTypeName,
                      this.searchForm.inStorageTime,
                      this.searchForm.inStatus,
                      this.searchForm.departmentId,
                      this.pageNum,
                      this.pageSize
                    ).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.editLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.editLoading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 启用入库信息 */
      enable() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        } else {
          const rows = this.multipleSelection
          const ids = []
          const status = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
            status.push(rows[i].enableStatus)
          }
          for (let j = 0; j < status.length; j++) {
            if (status[0] !== status[j]) {
              this.lag = true
              break
            }
          }
          if (this.lag === false) {
            // 判断是0还是1
            if (status[0] === 1) {
              this.$message({
                type: 'warning',
                message: '您已经启用了',
                duration: 1500
              })
              return
            } else {
              this.enableStatus = 1
              updateStatus(ids.join(','), this.enableStatus).then(response => {
                this.$message({
                  type: 'success',
                  message: '启用成功',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.productNumber,
                      this.searchForm.productTypeName,
                      this.searchForm.inStorageTime,
                      this.searchForm.inStatus,
                      this.searchForm.departmentId,
                      this.pageNum,
                      this.pageSize
                    )
                  }
                })
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请选择一致的状态',
              duration: 1500
            })
            this.lag = false
            return
          }
        }
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
        if (this.addLoading === true || this.editLoading === true) {
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
      closeLocationAdd() {
        this.locationManageVisibleAdd = false
      },
      closeLocationEdit() {
        this.locationManageVisibleEdit = false
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
  .divSketchMap{
    display: block;
    position: absolute;
    right: -291px;
    top: -100px;
    background: rgb(255, 255, 255);
  }
</style>

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
        <el-form-item label="货架编码" prop="shelfCode">
          <el-input clearable v-model="searchForm.shelfCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchButton">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddStorage"><i class="el-icons-jd-add"></i>&nbsp;添加货位
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="editStorage"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改货位
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" @click="deleteStorage"
                 :loading="deleteLoding"><i class="el-icons-jd-shanchu"></i>&nbsp;删除货位
      </el-button>
      <el-button class="el-button--primary hidden" code="see" @click="seeMaterial"><i
        class="el-icons-jd-chakanxiangqing1"></i>&nbsp;查看物料
      </el-button>
    </div>
    <!--添加库位-->
    <el-dialog
      title="添加货位"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="100px" v-loading="addPosition" :element-loading-text="loadingText">
        <el-form-item label="货位编码" prop="storageLocationCode">
          <el-input clearable v-model="addForm.storageLocationCode"></el-input>
        </el-form-item>
        <el-form-item label="货架" prop="shelfCode">
          <el-select v-model="addForm.shelfCode" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in shelfOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货架层" prop="onFloor">
          <el-input clearable v-model="addForm.onFloor"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改库位-->
    <el-dialog
      title="修改货位"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="100px" v-loading="editPosition" :element-loading-text="loadingText">
        <el-form-item label="货位编码" prop="storageLocationCode" >
          <el-input clearable v-model="editForm.storageLocationCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="货架编码" prop="shelfCode">
          <el-select v-model="editForm.shelfCode" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in shelfOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货架层" prop="onFloor" >
          <el-input clearable v-model="editForm.onFloor"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="属性值"
      :visible.sync="valueManageDialogVisible"
      width="80%"
      height="80%"
      :before-close="handleClose">
      <see-material :specificationCode="specificationCode" :departmentId="searchForm.departmentId"
                    :areaType="areaType"></see-material>
    </el-dialog>
    <!--货架列表-->
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
      <!--操作-->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改库位">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditStorage(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除库位">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteStorage(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="查看物料">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="see" icon="el-icons-jd-chakanxiangqing1" @click="goseeMaterial"></el-button>
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
  import { list, save, update, remove, getInfoById } from '@/api/storage'
  import { getShelfSelections } from '@/api/shelf'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  import SeeMaterial from './seeMaterial'
  export default {
    name: '',
    components: { SeeMaterial },
    data() {
      return {
        loadingText: '拼命加载中',
        deleteLoding: false,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        storageList: null,
        areaType: null,
        multipleSelection: [],
        departmentSelections: [],
        searchForm: {
          departmentId: null,
          shelfCode: null
        },
        shelfOptions: [],
        value: '',
        specificationCode: '',
        enableDepartmentSelection: false,
        listLoading: false,
        addPosition: false,
        editPosition: false,
        searchButton: false,
        dialogVisible: false,
        editDialogVisible: false,
        editDisabled: false,
        valueManageDialogVisible: false,
        addForm: {
          shelfCode: '',
          storageLocationCode: '',
          onFloor: ''
        },
        editForm: {
          id: '',
          shelfCode: '',
          storageLocationCode: '',
          onFloor: ''
        },
        rules: {
          shelfCode: [
            { required: true, message: '请选择货架', trigger: 'change' }
          ],
          storageLocationCode: [
            { required: true, message: '请输入货位编码', trigger: 'blur' }
          ],
          onFloor: [
            { required: true, message: '请输入货架层数', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ]
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(null, this.departmentSelections[0].code, this.pageNum, this.pageSize)
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
          this.fetchData(null, this.departmentSelections[0].code, this.pageNum, this.pageSize)
        }).then(() => {
          this.getShelfSelections(this.departmentSelections[0].code)
        })
      },
      /* 查询货架列表 */
      fetchData(shelfCode, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        setAreaType(this.areaType)
        return list(
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
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 获取货架下拉 */
      getShelfSelections(departmentId) {
        setAreaType(this.areaType)
        getShelfSelections(departmentId).then(resp => {
          this.shelfOptions = resp.data.data
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
      },
      /* 查询 */
      search() {
        this.searchButton = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
            this.searchButton = false
          })
        }
      },
      /* 打开添加货架对话框 */
      goAddStorage() {
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      editStorage() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editPosition = true
        const shelf = this.multipleSelection[0]
        getInfoById(shelf.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.shelfCode = resp.data.data.shelfCode
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.onFloor = resp.data.data.shelfFloor
          this.editPosition = false
        }).catch(e => {
          this.editPosition = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditStorage(id) {
        if (id === null || id === undefined) {
          if (this.multipleSelection.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return Promise.reject(new Error('error'))
          }
          id = this.multipleSelection[0].id
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editPosition = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.shelfCode = resp.data.data.shelfCode
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.onFloor = resp.data.data.shelfFloor
          this.editPosition = false
        }).catch(e => {
          this.editPosition = false
        })
      },
      /* 删除货架 */
      deleteStorage() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
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
          this.deleteLoding = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoding = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.deleteLoding = false
            this.listLoading = false
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteStorage(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoding = true
          this.listLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoding = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.deleteLoding = false
            this.listLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addPosition = true
              this.loadingText = '正在提交'
              setAreaType(this.areaType)
              save(
                this.addForm.shelfCode,
                this.addForm.storageLocationCode,
                this.addForm.onFloor
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.loadingText = '拼命加载中'
                    this.dialogVisible = false
                    this.addPosition = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addPosition = false
              })
            } else if (formName === 'editForm') {
              this.editPosition = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.onFloor,
                this.editForm.shelfCode,
                this.editForm.storageLocationCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
                    this.loadingText = '拼命加载中'
                    this.editDialogVisible = false
                    this.editPosition = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.editPosition = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 打开查看物料页面
      seeMaterial() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
        } else {
          const rows = this.multipleSelection
          this.specificationCode = rows[0].storageLocationCode
          this.valueManageDialogVisible = true
        }
      },
      goseeMaterial() {
        this.valueManageDialogVisible = true
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.addPosition === true || this.editPosition === true) {
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
      }
    }
  }
</script>
<style scoped>

</style>

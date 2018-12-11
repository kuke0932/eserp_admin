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
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddShelf"><i class="el-icons-jd-add"></i>&nbsp;添加货架</el-button>
      <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="editShelf"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改货架</el-button>
      <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" :loading="removeLoading" @click="deleteShelf"><i class="el-icons-jd-shanchu"></i>&nbsp;删除货架</el-button>
    </div>
    <!--添加货架-->
    <el-dialog
      title="添加货架"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="100px" v-loading="addList" :element-loading-text="loadingText">
        <el-form-item label="货架编码" prop="shelfCode">
          <el-input clearable v-model="addForm.shelfCode"></el-input>
        </el-form-item>
        <el-form-item label="货架层数" prop="shelfFloor">
          <el-input clearable v-model="addForm.shelfFloor"></el-input>
        </el-form-item>
        <el-form-item label="货架区域" prop="shelfArea">
          <el-input clearable v-model="addForm.shelfArea"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')" :loading="addSubmit">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改规格对话框-->
    <el-dialog
      title="修改货架"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="100px" v-loading="editList" :element-loading-text="loadingText">
        <el-form-item label="货架编码" prop="shelfCode" >
          <el-input clearable v-model="editForm.shelfCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="货架层数" prop="shelfFloor">
          <el-input clearable v-model="editForm.shelfFloor"></el-input>
        </el-form-item>
        <el-form-item label="货架区域" prop="shelfArea" >
          <el-input clearable v-model="editForm.shelfArea"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')" :loading="editSubmit">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--货架列表-->
    <el-table
      :data="shelfList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="货架编码">
        <template slot-scope="scope">
          {{scope.row.shelfCode}}
        </template>
      </el-table-column>
      <el-table-column label="货架层数">
        <template slot-scope="scope">
          {{scope.row.shelfFloor}}
        </template>
      </el-table-column>
      <el-table-column label="货架区域">
        <template slot-scope="scope">
          {{scope.row.shelfArea}}
        </template>
      </el-table-column>
      <!--列表右侧操作按钮-->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改货架">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditShelf(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除货架">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteShelf(scope.row.id)"></el-button>
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
  import { list, save, update, remove, getInfoById } from '@/api/shelf'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  export default {
    name: '',
    data() {
      return {
        loadingText: '拼命加载中',
        addList: false,
        addSubmit: false,
        editList: false,
        editSubmit: false,
        searchLoading: false,
        removeLoading: false,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        shelfList: null,
        areaType: null,
        multipleSelection: [],
        searchForm: {
          departmentId: null,
          shelfCode: null
        },
        enableDepartmentSelection: false,
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        editDisabled: false,
        departmentSelections: [],
        addForm: {
          departmentId: '',
          shelfArea: '',
          shelfCode: '',
          shelfFloor: ''
        },
        editForm: {
          id: '',
          departmentId: '',
          shelfArea: '',
          shelfCode: '',
          shelfFloor: ''
        },
        rules: {
          shelfArea: [
            { required: true, message: '请输入货架区域', trigger: 'blur' }
          ],
          shelfCode: [
            { required: true, message: '请输入货架编码', trigger: 'blur' }
          ],
          shelfFloor: [
            { required: true, message: '请输入货架层数', trigger: 'blur' }
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
      shelfList() {
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
          this.shelfList = response.data.data.rows
          this.shelfList.forEach((e, i) => { e['idx'] = i })
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
        this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 分页 */
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize)
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加货架对话框 */
      goAddShelf() {
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      editShelf() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editList = true
        const shelf = this.multipleSelection[0]
        getInfoById(shelf.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.shelfArea = resp.data.data.shelfArea
          this.editForm.shelfCode = resp.data.data.shelfCode
          this.editForm.shelfFloor = resp.data.data.shelfFloor
          this.editList = false
        }).catch(e => {
          this.editList = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditShelf(id) {
        if (id === null || id === undefined) {
          id = this.multipleSelection[0].id
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editList = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.shelfArea = resp.data.data.shelfArea
          this.editForm.shelfCode = resp.data.data.shelfCode
          this.editForm.shelfFloor = resp.data.data.shelfFloor
          this.editList = false
        }).catch(e => {
          this.editList = false
        })
      },
      /* 删除货架 */
      deleteShelf() {
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
          this.listLoading = true
          this.removeLoading = true
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
                this.fetchData(null, null, this.pageNum, this.pageSize).then(() => {
                  this.listLoading = true
                  this.removeLoading = true
                })
              }
            })
          }).catch(e => {
            this.listLoading = true
            this.removeLoading = true
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteShelf(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.removeLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize).then(() => {
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addList = true
              this.addSubmit = true
              this.loadingText = '正在提交'
              setAreaType(this.areaType)
              save(
                this.addForm.shelfArea,
                this.addForm.shelfCode,
                this.addForm.shelfFloor,
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.addList = false
                      this.addSubmit = false
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addList = false
                this.addSubmit = false
              })
            } else if (formName === 'editForm') {
              this.editList = true
              this.editSubmit = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.shelfArea,
                this.editForm.shelfCode,
                this.editForm.shelfFloor
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.fetchData(this.searchForm.shelfCode, this.searchForm.departmentId, this.pageNum, this.pageSize).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.editList = false
                      this.editSubmit = false
                    })
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.editList = false
                this.editSubmit = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.addList === true || this.editList === true) {
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

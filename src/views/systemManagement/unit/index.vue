<template>
  <div class="container">
    <el-form ref="searchForm" :model="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="单位编码" prop="unitCode">
          <el-input clearable v-model="searchForm.unitCode"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input clearable v-model="searchForm.unitName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="unitStatus">
          <el-select v-model="searchForm.unitStatus" placeholder="请选择" clearable filterable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button style="margin-top: 3px;" type="primary" size="small" :loading="searchLoading" @click="search">查询</el-button>
        <el-button style="margin-top: 3px;" type="primary" size="small" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" size="mini" code="add" @click="save"><i class="el-icons-jd-add"></i>&nbsp;添加单位
      </el-button>
      <el-button class="el-button--primary hidden" size="mini" code="edit" :disabled="editDisabled" @click="update"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改单位
      </el-button>
      <el-button class="el-button--primary hidden" size="mini" code="enable" :loading="enableLoading" @click="enable"><i class="el-icons-jd-qiyong"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger hidden" size="mini" code="disabled" :loading="disabledLoading" @click="disabled"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
      <el-button class="el-button--danger hidden" size="mini" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除单位
      </el-button>
    </div>

    <el-dialog
      title="添加单位 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="单位名称" prop="unitName">
          <el-input clearable v-model="addForm.unitName"></el-input>
        </el-form-item>
        <el-form-item label="单位编码" prop="unitCode">
          <el-input clearable v-model="addForm.unitCode"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改单位"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="单位名称" prop="unitName">
          <el-input clearable v-model="editForm.unitName"></el-input>
        </el-form-item>
        <el-form-item label="单位编码" prop="unitCode">
          <el-input clearable v-model="editForm.unitCode" disabled></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="unitList"
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
      <el-table-column label="单位名称" width="180">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>
      <el-table-column label="单位编码" width="180">
        <template slot-scope="scope">
          {{scope.row.unitCode}}
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="180">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <!--<el-button class="el-button&#45;&#45;primary" code="add" size="small" @click="">1</el-button>-->
          <!--<el-button class="el-button&#45;&#45;primary" code="add" size="small" @click="">2</el-button>-->

        </template>
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改单位">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用单位">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用单位">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除单位">
          <el-button class="icon-btn hidden" slot="reference" type="text"  code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
          </el-popover>
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
  import { getById, list, save, update, updateStatus, remove } from '@/api/unit'

  export default {
    name: 'unit',
    data() {
      return {
        options: [{
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        value: '',
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        enableLoading: false, // 启用按钮
        disabledLoading: false, // 禁用按钮
        removeLoading: false, // 删除按钮
        unitList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        searchUnitCode: null,
        searchUnitName: null,
        searchStatus: null,
        list: null,
        dialogVisible: false,
        editDialogVisible: false,
        multipleSelection: [],
        editDisabled: false,
        enableStatus: null,
        addForm: {
          unitName: '',
          unitCode: ''
        },
        editForm: {
          id: null,
          unitName: '',
          unitCode: ''
        },
        searchForm: {
          unitName: '',
          unitCode: '',
          unitStatus: ''
        },
        rules: {
          unitName: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ],
          unitCode: [
            { required: true, message: '请输入单位编码', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      unitList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(unitCode, unitName, status, pageNum, pageSize) {
        this.listLoading = true
        return list(
          unitCode,
          unitName,
          status,
          pageNum,
          pageSize
        ).then(resp => {
          this.unitList = resp.data.data.rows
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.total = resp.data.data.total
          this.unitList.forEach((e, i) => {
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
        this.searchUnitCode = this.searchForm.unitCode
        this.searchUnitName = this.searchForm.unitName
        this.searchStatus = this.searchForm.unitStatus
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(
            this.searchUnitCode,
            this.searchUnitName,
            this.searchStatus,
            this.pageNum,
            this.pageSize
          ).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加单位对话框 */
      save() {
        this.dialogVisible = true
      },
      /* 打开修改单位对话框 */
      update() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editFormLoading = true
        const unit = this.multipleSelection[0]
        this.editForm.id = unit.id
        getById(this.editForm.id).then(resp => {
          this.editForm.unitName = resp.data.data.unitName
          this.editForm.unitCode = resp.data.data.unitCode
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      goEditLine(id) {
        this.editFormLoading = true
        this.editForm.id = id
        getById(this.editForm.id).then(resp => {
          this.editForm.unitName = resp.data.data.unitName
          this.editForm.unitCode = resp.data.data.unitCode
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.submitLoading = true
              this.addFormLoading = true
              this.loadingText = '正在提交......'
              save(
                this.addForm.unitName,
                this.addForm.unitCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                      this.addFormLoading = false
                      this.submitLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.addFormLoading = false
                this.submitLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'editForm') {
              this.submitLoading = true
              this.editFormLoading = true
              this.loadingText = '正在提交......'
              update(
                this.editForm.id,
                this.editForm.unitName,
                this.editForm.unitCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.editFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.editFormLoading = false
                this.loadingText = '拼命加载中......'
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
        if (this.editFormLoading === true || this.submitLoading === true) {
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
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 启用单位 */
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
          if (status.indexOf(0) === -1) {
            this.$message({
              type: 'warning',
              message: '您已经启用了',
              duration: 1500
            })
          } else {
            if (status.indexOf(1) === -1) {
              for (let i = 0; i < status.length; i++) {
                status[i] = 1
              }
              this.$confirm('是否启用', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.enableLoading = true
                this.listLoading = true
                const rows = this.multipleSelection
                const ids = []
                for (let i = 0; i < rows.length; i++) {
                  ids.push(rows[i].id)
                }
                this.enableStatus = 1
                updateStatus(ids.join(','), this.enableStatus).then(response => {
                  this.$message({
                    type: 'success',
                    message: '启用成功',
                    duration: 1000,
                    onClose: () => {
                      this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                        this.listLoading = false
                        this.enableLoading = false
                      })
                    }
                  })
                }).catch(e => {
                  this.listLoading = false
                  this.enableLoading = false
                })
              })
            } else {
              this.$message({
                type: 'warning',
                message: '请选择状态一致的',
                duration: 1500
              })
            }
          }
        }
      },
      enableLine(id, nowEnableStatus) {
        if (nowEnableStatus !== undefined && nowEnableStatus === 1) {
          this.$message({
            type: 'warning',
            message: '您选择的数据已经启用！',
            duration: 1500
          })
          return
        }
        this.enableLoading = true
        this.listLoading = true
        updateStatus(id, 1).then(response => {
          this.$message({
            type: 'success',
            message: '启用成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                this.enableLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 禁用单位 */
      disabled() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
        } else {
          const rows = this.multipleSelection
          const ids = []
          const status = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
            status.push(rows[i].enableStatus)
          }
          if (status.indexOf(1) === -1) {
            this.$message({
              type: 'warning',
              message: '您已经禁用了',
              duration: 1500
            })
          } else {
            if (status.indexOf(0) === -1) {
              for (let i = 0; i < status.length; i++) {
                status[i] = 1
              }
              this.$confirm('是否禁用', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.disabledLoading = true
                this.listLoading = true
                this.enableStatus = 0
                const rows = this.multipleSelection
                const ids = []
                for (let i = 0; i < rows.length; i++) {
                  ids.push(rows[i].id)
                }
                this.enableStatus = 0
                updateStatus(ids.join(','), this.enableStatus).then(response => {
                  this.$message({
                    type: 'success',
                    message: '禁用成功',
                    duration: 1000,
                    onClose: () => {
                      this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                        this.listLoading = false
                        this.disabledLoading = false
                      })
                    }
                  })
                }).catch(e => {
                  this.listLoading = false
                  this.disabledLoading = false
                })
              })
            } else {
              this.$message({
                type: 'warning',
                message: '请选择状态一致的',
                duration: 1500
              })
            }
          }
        }
      },
      disableLine(id, nowEnableStatus) {
        if (nowEnableStatus !== undefined && nowEnableStatus === 0) {
          this.$message({
            type: 'warning',
            message: '您选择的数据已经禁用的！',
            duration: 1500
          })
          return
        }
        this.disabledLoading = true
        this.listLoading = true
        updateStatus(id, 0).then(response => {
          this.$message({
            type: 'success',
            message: '禁用成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                this.disabledLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.listLoading = false
        })
      },
      remove() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          this.removeLoading = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.pageNum = 1
                this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
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
      removeLine(ids) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.pageNum = 1
                this.fetchData(this.searchUnitCode, this.searchUnitName, this.searchStatus, this.pageNum, this.pageSize).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>

<style>

</style>

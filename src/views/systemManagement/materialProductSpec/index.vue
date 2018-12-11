<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="规格名称" prop="specificationName">
          <el-input clearable v-model="searchForm.specificationName"></el-input>
        </el-form-item>
        <el-form-item label="规格code" prop="specificationCode">
          <el-input clearable v-model="searchForm.specificationCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" :loading="searchLoading" @click="search">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddSpec"><i class="el-icons-jd-add"></i>&nbsp;添加规格
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditMaterial"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改规格
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteMaterial"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除规格
      </el-button>
      <el-button class="el-button--primary hidden" code="able" :loading="enableLoading" @click="enable"><i
        class="el-icons-jd-iconmanzutiaojian"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger hidden" code="disable" size="mini" :loading="disabledLoading"
                 @click="disabled"><i class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
    </div>
    <!--添加规格对话框-->
    <el-dialog
      title="添加规格 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="100px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="规格名称" prop="specificationName" >
          <el-input clearable v-model="addForm.specificationName"></el-input>
        </el-form-item>
        <el-form-item label="规格code" prop="specificationCode">
          <el-input clearable v-model="addForm.specificationCode"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改规格对话框-->
    <el-dialog
      title="修改规格"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="100px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="规格名称" prop="specificationName" >
          <el-input clearable v-model="editForm.specificationName"></el-input>
        </el-form-item>
        <el-form-item label="规格code" prop="specificationCode">
          <el-input clearable v-model="editForm.specificationCode" disabled></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--规格列表-->
    <el-table
      :data="dataList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="规格名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="规格code">
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" >
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus== 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改规格">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditSpecification(scope.row.id, scope.row.demandStatus)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除规格">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteSpecification(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用单位">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="able" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用单位">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
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
  import { list, save, update, remove, getInfoById, updateStatus } from '@/api/materialProductSpec'
  import { setAreaType } from '@/utils/areaTypeManage'
  export default {
    name: 'materialProductSpec',
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        dataList: null,
        areaType: null,
        multipleSelection: [],
        searchForm: {
          specificationName: null,
          specificationCode: null
        },
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        enableLoading: false, // 启用按钮
        disabledLoading: false, // 禁用按钮
        removeLoading: false, // 删除按钮
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          specificationCode: '',
          specificationName: ''
        },
        editForm: {
          id: '',
          specificationCode: '',
          specificationName: ''
        },
        rules: {
          specificationCode: [
            { required: true, message: '请输入规格code', trigger: 'blur' }
          ],
          specificationName: [
            { required: true, message: '请输入规格名称', trigger: 'blur' }
          ]
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(null, null, this.pageNum, this.pageSize)
      next()
    },
    watch: {
      dataList() {
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
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 查询物料规格列表 */
      fetchData(specificationName, specificationCode, pageNum, pageSize) {
        this.listLoading = true
        setAreaType(this.areaType)
        return list(
          3,
          specificationName,
          specificationCode,
          pageNum,
          pageSize
        ).then(resp => {
          this.dataList = resp.data.data.rows
          this.dataList.forEach((e, i) => { e['idx'] = i })
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
        this.fetchData(this.searchForm.specificationName, this.searchForm.specificationCode, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.specificationName, this.searchForm.specificationCode, this.pageNum, this.pageSize)
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.searchForm.specificationName, this.searchForm.specificationCode, this.pageNum, this.pageSize).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加规格对话框 */
      goAddSpec() {
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      goEditMaterial() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editFormLoading = true
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        const spec = this.multipleSelection[0]
        getInfoById(spec.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.specificationCode = resp.data.data.code
          this.editForm.specificationName = resp.data.data.name
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditSpecification(id) {
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
        this.editFormLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.specificationCode = resp.data.data.code
          this.editForm.specificationName = resp.data.data.name
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
      },
      /* 删除物料规格 */
      deleteMaterial() {
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
                this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
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
      goDeleteSpecification(ids) {
        this.ids = ids
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(this.ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
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
              setAreaType(this.areaType)
              this.submitLoading = true
              this.addFormLoading = true
              this.loadingText = '正在提交......'
              save(
                this.addForm.specificationCode,
                this.addForm.specificationName,
                3
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
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
                this.editForm.specificationCode,
                this.editForm.specificationName
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.editFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
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
      /* 启用物料规格 */
      enable() {
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
                      this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
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
                      this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
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
      enableLine(id, nowEnableStatus) {
        if (nowEnableStatus !== undefined && nowEnableStatus === 1) {
          this.$message({
            type: 'warning',
            message: '您选择的数据已经启用！',
            duration: 1500
          })
          return
        }
        this.listLoading = true
        this.enableLoading = true
        updateStatus(id, 1).then(response => {
          this.$message({
            type: 'success',
            message: '启用成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
                this.listLoading = false
                this.enableLoading = false
              })
            }
          })
        }).catch(e => {
          this.listLoading = false
          this.enableLoading = false
        })
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
              this.fetchData(null, null, this.pageNum, this.pageSize).then((resp) => {
                this.listLoading = false
                this.disabledLoading = false
              })
            }
          })
        }).catch(e => {
          this.listLoading = false
          this.disabledLoading = false
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
      }
    }
  }
</script>
<style scoped>

</style>

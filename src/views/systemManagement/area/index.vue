<template>
  <div class="container my-container">

    <el-row class="el-rows" style="border-bottom: 0;">
      <el-col :span="3">
        <h1 class="treeTitle">行政区划树</h1>
        <el-scrollbar class="scrollbar"  :style="{ height: treeHeight + 'px' }" >
          <el-tree
            :data="treeMenu"
            v-loading.body="listLoading"
            element-loading-text="拼命加载中"
            node-key="id"
            ref="treeArea"
            highlight-current
            :default-expand-all="false"
            :expand-on-click-node="true"
            :props="defaultProps"
            @node-click="getCurrentObj">
          </el-tree>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" style="margin-left: 38px;">
        <h1 class="treeDetail">详细信息</h1>
        <el-row  style="border-bottom: 0; margin-top: 7px;">
          <div class="btn_box" style="margin-top: 14px;margin-bottom: 21px;">
            <el-button class="el-button--primary" size="small" code="add" @click="goAddArea"><i class="el-icons-jd-add"></i>&nbsp;添加行政区划</el-button>
            <el-button class="el-button--primary" size="small" code="edit" :loading="editLoading" @click="goEditArea"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改行政区划</el-button>
            <!--<el-button class="el-button&#45;&#45;primary" size="small" code="edit" @click="goDisableArea"><i class="el-icons-jd-jinyong"></i>&nbsp;禁用行政区划</el-button>-->
            <el-button class="el-button--danger hidden" size="small" code="remove" :loading="removeLoading" @click="deleteArea"><i class="el-icons-jd-shanchu"></i>&nbsp;删除行政区划</el-button>
          </div>

          <el-dialog :visible.sync="dialogVisible" title="添加行政区划" width="40%">
            <el-popover ref="popoverTree" placement="bottom-start" title="行政区划列表" width="400" trigger="click">
              <el-scrollbar class="scrollbar"  :style="{ height: 600+ 'px' }" >
                <el-tree
                  :data="treeMenu"
                  ref="treeAdd"
                  highlight-current
                  :props="defaultProps"
                  :expand-on-click-node='false'
                  :check-strictly='true'
                  @node-click="addSelectParentMenu">
                </el-tree>
              </el-scrollbar>
            </el-popover>

            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="150px"
                     v-loading="addFormLoading"
                     :element-loading-text="loadingText">
              <el-form-item label="行政区划名称" prop="areaName">
                <el-input clearable v-model="addForm.areaName"></el-input>
              </el-form-item>
              <el-form-item label="行政区划编码" prop="areaCode">
                <el-input clearable v-model="addForm.areaCode"></el-input>
              </el-form-item>
              <el-form-item label="父级别行政区划名称" prop="parentName">
                <el-input clearable v-popover:popoverTree readonly v-model="addForm.parentName"></el-input>
              </el-form-item>
              <el-form-item class="btn_box">
                <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
                <el-button @click="resetForm('addForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-row>
        <el-popover
          ref="popoverTree"
          placement="bottom-start"
          title="菜单列表"
          width="400"
          :disabled="isDisable"
          trigger="click">
          <el-scrollbar class="scrollbar"  :style="{ height: 600+ 'px' }" >
            <el-tree
              :data="treeMenu"
              ref="editAdd"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node='false'
              :check-strictly='true'
              @node-click="editSelectParentMenu">
            </el-tree>
          </el-scrollbar>
        </el-popover>
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="150px"
                 v-loading="editFormLoading"
                 :element-loading-text="loadingText">
          <el-form-item label="行政区划名称" prop="areaName">
            <el-input clearable :readonly="isReadonly" v-model="editForm.areaName" style="width: 558px"></el-input>
          </el-form-item>
          <el-form-item label="行政区划编码" prop="areaCode">
            <el-input clearable disabled v-model="editForm.areaCode" style="width: 558px"></el-input>
          </el-form-item>
          <el-form-item label="父级别行政区划名称" prop="parentName">
            <el-input clearable v-model="editForm.parentName" readonly v-popover:popoverTree style="width: 558px"></el-input>
          </el-form-item>
          <el-form-item class="btn_box" v-show="isBtnShow">
            <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">保存</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { getById, save, remove, tree, update, updateStatus } from '@/api/area'
  export default {
    name: 'area',
    data() {
      return {
        listLoading: false, // 左侧树
        editLoading: false, // 修改按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        removeLoading: false, // 删除按钮
        treeHeight: 0,
        treeMenu: null,
        isDisable: true,
        currentId: null,
        parentId: null,
        parentAreaId: null,
        isReadonly: true,
        dialogVisible: false,
        isBtnShow: false,
        editDisabled: false,
        status: null,
        ids: null,
        arrayIds: [],
        childNodes: [],
        editForm: {
          areaName: '',
          areaCode: '',
          parentName: ''
        },
        addForm: {
          areaName: '',
          areaCode: '',
          parentName: ''
        },
        rules: {},
        addRules: {
          areaName: [
            { required: true, message: '请输入区划名称', trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: '请输入区划编码', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '请选择父级别行政区划', trigger: 'change' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.treeHeight = document.body.clientHeight - 200
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData()
    },
    methods: {
      /* 初始化菜单树 */
      fetchData() {
        this.listLoading = true
        return tree().then(resp => {
          this.treeMenu = resp.data.data
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 获取菜单树当前点击节点及父节点 */
      getCurrentObj(obj, node) {
        if (obj.id === 1) {
          this.editDisabled = true
        } else {
          this.editDisabled = false
        }
        if (this.isBtnShow) {
          this.$confirm('尚未保存修改，要放弃修改吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.editLoading = false
            this.isReadonly = true
            this.isBtnShow = false
            this.handleRules()
          })
          return
        }
        this.childNodes = []
        this.getCurrentNodeAndChildrenIds(node)
        this.currentId = obj.id
        if (this.arrayIds.indexOf(this.currentId) === -1) {
          this.arrayIds.push(this.currentId)
        }
        this.ids = this.arrayIds.join(',')
        this.parentId = node.parent.data.id
        this.$refs['editForm'].resetFields()
        this.editFormLoading = true
        getById(this.currentId).then(response => {
          this.editForm.areaName = response.data.data.areaName
          this.editForm.parentName = node.parent.data.label || '无'
          this.editForm.areaCode = response.data.data.areaCode
          this.status = response.data.data.status
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
      },
      /* 打开添加菜单 */
      goAddArea() {
        this.dialogVisible = true
      },
      /* 点击修改行政区划 */
      goEditArea() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧菜单列表中选一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.editLoading = true
        this.isReadonly = false
        this.isBtnShow = true
        this.isDisable = false
        this.handleRules()
      },
      goDisableArea() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧菜单列表中选一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('是否禁用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(this.ids, 0).then(response => {
            this.$message({
              type: 'success',
              message: '禁用成功',
              duration: 1000,
              onClose: () => {
                this.fetchData()
              }
            })
          }).catch(e => {
            this.listLoading = false
          })
        })
      },
      /* 获取菜单树当前点击节点及子节点 */
      getCurrentNodeAndChildrenIds(node) {
        if (node.childNodes.length > 0) {
          for (let i = 0; i < node.childNodes.length; i++) {
            this.getCurrentNodeAndChildrenIds(node.childNodes[i])
          }
        }
        this.childNodes.push(node.key)
      },
      /* 删除行政区划 */
      deleteArea() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧菜单列表中选一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将永久删除该菜单，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(this.childNodes.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData().then((resp) => {
                  this.$refs['editForm'].resetFields()
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
      /* 添加选择父菜单 */
      addSelectParentMenu(node) {
        this.parentAreaId = node.id
        this.addForm.parentName = node.label
      },
      /* 修改选择父菜单 */
      editSelectParentMenu(node) {
        this.parentAreaId = node.id
        this.editForm.parentName = node.label
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addFormLoading = true
              this.listLoading = true
              this.submitLoading = true
              save(
                this.addForm.areaName,
                this.addForm.areaCode,
                this.parentAreaId
              ).then(resp => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData().then((resp) => {
                      this.listLoading = false
                      this.addFormLoading = false
                      this.submitLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.resetForm('editForm')
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.listLoading = false
                this.addFormLoading = false
                this.submitLoading = false
              })
            } else if (formName === 'editForm') {
              this.editFormLoading = true
              this.listLoading = true
              this.submitLoading = true
              update(
                this.editForm.areaCode,
                this.editForm.areaName,
                this.currentId,
                this.parentAreaId
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData()
                    this.$refs[formName].resetFields()
                    this.isBtnShow = false
                    this.isReadonly = true
                    this.isDisable = true
                    this.editFormLoading = false
                    this.editLoading = false
                    this.submitLoading = false
                    this.listLoading = false
                  }
                })
              }).catch(e => {
                this.editFormLoading = false
                this.editLoading = false
                this.submitLoading = false
                this.listLoading = false
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
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
        }).catch(() => {
        })
      },
      /* 只读状态下不显示验证 */
      handleRules() {
        if (!this.isReadonly) {
          this.rules = {
            areaName: [
              { required: true, message: '请输入区划名称', trigger: 'blur' }
            ],
            parentName: [
              { required: true, message: '请选择父区划名称', trigger: 'change' }
            ],
            areaCode: [
              { required: true, message: '请输入区划编号', trigger: 'blur' },
              { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
            ]
          }
        } else {
          this.rules = {}
        }
      }
    }
  }
</script>

<style scoped>
</style>

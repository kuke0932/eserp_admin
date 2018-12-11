<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
          <el-form-item label="需求名称" prop="demandName">
            <el-input clearable v-model="searchForm.demandName"></el-input>
          </el-form-item>
          <el-form-item label="需求内容" prop="demandContent">
            <el-input clearable v-model="searchForm.demandContent"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchLoading">查询</el-button>
            <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
      </el-row>
    </el-form>
      <div class="btn_box">
        <el-button class="el-button--primary hidden" code="add" @click="goAddDemand"><i class="el-icons-jd-add"></i>&nbsp;添加需求</el-button>
        <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="goEditDemand"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改需求</el-button>
        <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" @click="deleteDemand" :loading="deleteLoading"><i class="el-icons-jd-shanchu"></i>&nbsp;删除需求</el-button>
        <el-button class="el-button--primary hidden" code="satisfy" :disabled="editDisabled" @click="enable" :loading="enableLoading"><i class="el-icons-jd-iconmanzutiaojian"></i>&nbsp;满足需求</el-button>
      </div>
      <!--添加需求对话框-->
      <el-dialog
        title="添加需求 "
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addLoading" :element-loading-text="loadingText">
          <el-form-item label="提出者" prop="presenterName" >
            <el-input clearable v-model="addForm.presenterName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay">
            <el-input clearable v-model="addForm.contactWay" maxlength="11" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="提出时间" prop="demandTime"  style="width: 100%;">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="addForm.demandTime"
              type="datetime"
              placeholder="选择提出时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求名称" prop="demandName">
            <el-input clearable v-model="addForm.demandName"></el-input>
          </el-form-item>
          <el-form-item label="需求内容" prop="demandContent">
            <tinymce v-model="addForm.demandContent"></tinymce>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--修改需求对话框-->
      <el-dialog
        title="修改需求"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
          <el-form-item label="客户昵称" prop="presenterName">
            <el-input clearable v-model="editForm.presenterName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay">
            <el-input clearable v-model="editForm.contactWay" maxlength="11" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="提出时间" prop="demandTime">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="editForm.demandTime"
              type="datetime"
              placeholder="选择提出时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求名称" prop="presenterName">
            <el-input clearable v-model="editForm.demandName"></el-input>
          </el-form-item>
          <el-form-item label="需求内容" prop="contactWay">
            <tinymce v-model="editForm.demandContent"></tinymce>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>


    <!--需求维护列表-->
      <el-table
        :data="satisfyList"
        v-loading.body="listLoading"
        :element-loading-text="loadingText"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="提出者">
          <template slot-scope="scope">
            {{scope.row.presenterName}}
          </template>
        </el-table-column>
        <el-table-column label="联系方式">
          <template slot-scope="scope">
            {{scope.row.contactWay}}
          </template>
        </el-table-column>
        <el-table-column label="需求名称">
          <template slot-scope="scope">
            {{scope.row.demandName}}
          </template>
        </el-table-column>
        <el-table-column label="需求内容">
            <template slot-scope="scope">
              <el-popover v-if="!!scope.row.demandContent"
                          placement="top-start"
                          width="300"
                          trigger="hover">
                <div v-html="scope.row.demandContent"></div>
                <div slot="reference" class="introduction">查看需求内容</div>
              </el-popover>
            </template>
        </el-table-column>
        <el-table-column label="提出需求时间" >
          <template slot-scope="scope">
            {{scope.row.demandTime}}
          </template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">
            {{scope.row.createName}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="需求状态">
          <template slot-scope="scope">
            {{scope.row.demandStatus}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.demandStatus === '未满足'"
              placement="top-start"
              width="100"
              trigger="hover"
              content="修改需求">
              <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditRequire(scope.row.id, scope.row.demandStatus)"></el-button>
            </el-popover>
            <el-popover v-if="scope.row.demandStatus === '未满足'"
              placement="top-start"
              width="100"
              trigger="hover"
              content="满足需求">
              <el-button class="icon-btn hidden" slot="reference"  type="text" code="satisfy" icon="el-icons-jd-iconmanzutiaojian" @click="enableRequire(scope.row.id, scope.row.demandStatus)"></el-button>
            </el-popover>
            <el-popover v-if="scope.row.demandStatus === '未满足'"
              placement="top-start"
              width="100"
              trigger="hover"
              content="删除需求">
              <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteRequire(scope.row.id, scope.row.demandStatus)"></el-button>
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
  import { list, save, update, remove, getInfoById, satisfy } from '@/api/satisfy'
  export default {
    name: 'satisfy',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        satisfyList: null,
        multipleSelection: [],
        searchForm: {
          demandName: null,
          demandContent: null
        },
        demandName: null,
        demandContent: null,
        demandTime: null,
        presenterName: null,
        contactWay: null,
        loadingText: '拼命加载中',
        listLoading: false,
        searchLoading: false,
        dialogVisible: false,
        addLoading: false,
        enableLoading: false,
        editLoading: false,
        deleteLoading: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        carouselDialogVisible: false,
        editDisabled: false,
        id: null,
        ids: null,
        addForm: {
          contactWay: '',
          demandContent: '',
          demandName: '',
          demandTime: '',
          presenterName: ''
        },
        editForm: {
          id: '',
          contactWay: '',
          demandContent: '',
          demandName: '',
          demandTime: '',
          presenterName: ''
        },
        rules: {
          presenterName: [
            { required: true, message: '请输入提出者', trigger: 'blur' }
          ],
          contactWay: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ],
          demandTime: [
            { required: true, message: '请选择提出时间', trigger: 'blur' }
          ],
          demandName: [
            { required: true, message: '请输入需求名称', trigger: 'blur' }
          ],
          demandContent: [
            { required: true, message: '请输入需求内容', trigger: 'blur' }
          ]
        },
        options: [{}],
        value: '',
        carTypeName: ''
      }
    },
    watch: {
      satisfyList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 查询需求维护信息 */
      fetchData(demandName, demandContent, pageNum, pageSize) {
        this.listLoading = true
        this.searchLoading = true
        list(
          demandName,
          demandContent,
          pageNum,
          pageSize
        ).then(response => {
          this.satisfyList = response.data.data.rows
          this.satisfyList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          if (response.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = response.data.data.pages
          }
          this.listLoading = false
          this.searchLoading = false
        }).catch(e => {
          this.listLoading = false
          this.searchLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.demandName, this.demandContent, this.pageNum, this.pageSize)
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.demandName, this.demandContent, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.demandName = this.searchForm.demandName
        this.demandContent = this.searchForm.demandContent
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.demandName, this.demandContent, this.pageNum, this.pageSize)
        }
      },
      /* 打开添加需求对话框 */
      goAddDemand() {
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      goEditDemand() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        if (this.multipleSelection[0].demandStatus.indexOf('未满足') === -1) {
          this.$message({
            type: 'warning',
            message: '只能选择状态为【未满足】的进行修改！',
            duration: 1500
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const car = this.multipleSelection[0]
        getInfoById(car.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.contactWay = resp.data.data.contactWay
          this.editForm.demandContent = resp.data.data.demandContent
          this.editForm.demandName = resp.data.data.demandName
          this.editForm.demandTime = resp.data.data.demandTime
          this.editForm.presenterName = resp.data.data.presenterName
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditRequire(id, demandStatus) {
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
        if (demandStatus.indexOf('未满足') === -1) {
          this.$message({
            type: 'warning',
            message: '只能选择状态为【未满足】的进行修改！',
            duration: 1500
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.contactWay = resp.data.data.contactWay
          this.editForm.demandContent = resp.data.data.demandContent
          this.editForm.demandName = resp.data.data.demandName
          this.editForm.demandTime = resp.data.data.demandTime
          this.editForm.presenterName = resp.data.data.presenterName
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除需求 */
      deleteDemand() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        if (this.multipleSelection[0].demandStatus.indexOf('未满足') === -1) {
          this.$message({
            type: 'warning',
            message: '只能选择状态为【未满足】的进行删除！',
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
          this.deleteLoading = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize)
                this.deleteLoading = false
              }
            })
          }).catch(e => {
            this.deleteLoading = false
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteRequire(ids, demandStatus) {
        if (demandStatus.indexOf('未满足') === -1) {
          this.$message({
            type: 'warning',
            message: '只能选择状态为【未满足】的进行删除！',
            duration: 1500
          })
          return
        }
        this.ids = ids
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoading = true
          this.listLoading = true
          remove(this.ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize)
                this.deleteLoading = false
              }
            })
          }).catch(e => {
            this.deleteLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              /* const id = this.satisfyList.length !== 0 ? this.satisfyList[this.satisfyList.length - 1].id + 1 : 1 */
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                null,
                this.addForm.contactWay, // 联系方式
                this.addForm.demandContent, // 需求内容
                this.addForm.demandName, // 需求名称
                this.addForm.demandTime, // 需求提出时间
                this.addForm.presenterName, // 提出者
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.addForm.demandContent = ''
                    this.fetchData(this.demandName, this.demandContent, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.loadingText = '拼命加载中'
                    this.addLoading = false
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addLoading = false
                this.dialogVisible = false
              })
            } else if (formName === 'editForm') {
              this.editLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.contactWay,
                this.editForm.demandContent,
                this.editForm.demandName,
                this.editForm.demandTime,
                this.editForm.presenterName
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.demandName, this.demandContent, this.pageNum, this.pageSize)
                    this.editDialogVisible = false
                    this.editLoading = false
                    this.loadingText = '拼命加载中'
                  }
                })
              }).catch(e => {
                this.editLoading = false
                this.loadingText = '拼命加载中'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 满足需求判断 */
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
            status.push(rows[i].demandStatus)
          }
          if (status.indexOf('未满足') === -1) {
            this.$message({
              type: 'warning',
              message: '您已经满足需求',
              duration: 1500
            })
          } else {
            if (status.indexOf('已满足') === -1) {
              for (let i = 0; i < status.length; i++) {
                status[i] = 1
              }
              this.$confirm('此操作将满足需求', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const rows = this.multipleSelection
                const ids = []
                for (let i = 0; i < rows.length; i++) {
                  ids.push(rows[i].id)
                }
                this.enableStatus = 0
                this.enableLoading = true
                this.listLoading = true
                satisfy(ids.join(','), this.enableStatus).then(response => {
                  this.$message({
                    type: 'success',
                    message: '满足成功',
                    duration: 1000,
                    onClose: () => {
                      this.fetchData(null, null, this.pageNum, this.pageSize)
                      this.enableLoading = false
                    }
                  })
                }).catch(e => {
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
      /* 操作小按钮——满足需求 */
      enableRequire(ids, demandStatus) {
        if (demandStatus !== undefined && demandStatus.indexOf('未满足') === -1) {
          this.$message({
            type: 'warning',
            message: '您选择的需求数据已经满足！',
            duration: 1500
          })
          return
        } else {
          this.$confirm('此操作将满足需求', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.enableLoading = true
            this.listLoading = true
            satisfy(ids, this.demandStatus).then(response => {
              this.$message({
                type: 'success',
                message: '满足成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(null, null, this.pageNum, this.pageSize)
                  this.enableLoading = false
                }
              })
            }).catch(e => {
              this.enableLoading = false
            })
          })
        }
      },
      seeAll(demandContent) {
        if (this.demandContent.length === 0) {
          this.$message({
            type: 'warning',
            message: '暂无内容显示!',
            duration: 1500
          })
          return
        }
        this.carouselDialogVisible = true
      },
      /* 打开查看用户 */
      viewUser(id) {
        this.id = Number.parseInt(id)
        this.viewUserDialogVisible = true
      },
      /* 打开查看菜单 */
      viewMenu(id) {
        this.id = Number.parseInt(id)
        this.viewMenuDialogVisible = true
      },
      closeViewMenu() {
        this.viewMenuDialogVisible = false
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editLoading === true || this.addLoading === true) {
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
  img{
    width:20px;
    height: 20px;
  }
  .el-table--medium td, .el-table--medium th{
    height: 34px;
  }
</style>

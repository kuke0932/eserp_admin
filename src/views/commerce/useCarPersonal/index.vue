<template>
  <div class="container">
    <el-form ref="searchForm"  class="searchForm" :inline="true" :model="searchForm">
      <el-row>
        <el-form-item label="用车人" prop="createName">
          <el-input clearable v-model="searchForm.createName"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="carModel">
          <el-input clearable v-model="searchForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" :clearable="true" filterable>
            <el-option label="已保存" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="已领取" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddDemand"><i class="el-icons-jd-add"></i>&nbsp;发布用车信息</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditDemand"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改用车信息</el-button>
      <el-button class="el-button--danger hidden" code="remove" @click="deleteDemand" :loading="deleteLoading"><i class="el-icons-jd-shanchu"></i>&nbsp;删除用车信息</el-button>
      <el-button class="el-button--primary hidden" code="publish" @click="publish" :loading="publishLoading"><i class="el-icons-jd-fabu"></i>&nbsp;发布</el-button>
      <el-button class="el-button--primary hidden" code="finish" @click="goFinish"><i class="el-icons-jd-wancheng"></i>&nbsp;完成</el-button>
    </div>
    <!--发布用车信息-->
    <el-dialog
      title="发布用车信息 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="carLoading" :element-loading-text="loadingText">
        <el-form-item label="车型信息" prop="carModel" >
          <el-input clearable v-model="addForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <tinymce v-model="addForm.usage"></tinymce>
        </el-form-item>
        <el-form-item label="使用时间" prop="useTime"  style="width: 100%;">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="addForm.useTime"
            type="datetime"
            placeholder="选择使用时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用车信息-->
    <el-dialog
      title="修改用车信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="车型信息" prop="carModel">
          <el-input clearable v-model="editForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <tinymce v-model="editForm.usage"></tinymce>
        </el-form-item>
        <el-form-item label="使用时间" prop="useTime">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.useTime"
            type="datetime"
            placeholder="选择提出时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--完成对话框-->
    <el-dialog
      title="是否完成用车"
      :visible.sync="dialogFormVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="satisfyForm" v-loading="completeLloading" :element-loading-text="loadingText">
        <el-form-item label-width="110px" label="满足用车需求？">
          <el-select v-model="satisfyForm.value" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="110px" label="意见">
          <el-input clearable v-model="satisfyForm.result"></el-input>
        </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" @click="finish">提交</el-button>
        <el-button @click="resetForm('satisfyForm')">重置</el-button>
      </el-form-item>
      </el-form>
    </el-dialog>
    <!--用车信息列表-->
    <el-table
      :data="useList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="用车人">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.departmentName}}
        </template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">
          {{scope.row.carModel}}
        </template>
      </el-table-column>
      <el-table-column label="用途">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.usage"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.usage"></div>
            <div slot="reference" class="introduction">查看用途</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" >
        <template slot-scope="scope">
          {{scope.row.useTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.status == 0 ? '已保存' : scope.row.status == 1 ? '已发布' : scope.row.status == 2 ? '已领取' :  '已完成'}}
        </template>
      </el-table-column>
      <el-table-column label="领取人">
        <template slot-scope="scope">
          {{scope.row.receiverName}}
        </template>
      </el-table-column>
      <el-table-column label="领取时间">
        <template slot-scope="scope">
          {{scope.row.receiverTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status == 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改用车信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditDemandLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除用车信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeDemandLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover  v-if="scope.row.status == 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="发布">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="publish" icon="el-icons-jd-fabu" @click="publishLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover   v-if="scope.row.status == 2"
            placement="top-start"
            width="100"
            trigger="hover"
            content="完成">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="finish" icon="el-icons-jd-wancheng" @click="finishLine(scope.row.id)"></el-button>
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
  import BaseTable from '@/components/BaseTable' /* 文本编辑器组件 */
  import { list, save, update, remove, getInfoById, publish, finish } from '@/api/useCar'
  import { parseTime } from '@/utils/index'
  export default {
    name: 'useCarPersonal',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        useList: null,
        multipleSelection: [],
        createName: null,
        carModel: null,
        status: null,
        ids: null,
        selectId: null,
        listLoading: false,
        searchForm: {
          createName: null,
          carModel: null,
          status: null
        },
        deleteLoading: false,
        publishLoading: false,
        dialogVisible: false,
        searchLoading: false,
        carLoading: false,
        editLoading: false,
        loadingText: '拼命加载中',
        editDialogVisible: false,
        dialogFormVisible: false,
        completeLloading: false,
        addForm: {
          carModel: '',
          usage: '',
          useTime: new Date()
        },
        editForm: {
          id: '',
          carModel: '',
          usage: '',
          useTime: ''
        },
        rules: {
          carModel: [
            { required: true, message: '请输入车型信息', trigger: 'blur' }
          ],
          usage: [
            { required: true, message: '请输入用途', trigger: 'blur' }
          ],
          useTime: [
            { required: true, message: '请选择使用时间', trigger: 'blur' }
          ]
        },
        options: [{
          value: 0,
          label: '非常满意'
        }, {
          value: 1,
          label: '满意'
        }, {
          value: 2,
          label: '不满意'
        }],
        satisfyForm: {
          value: '',
          result: ''
        }
      }
    },
    watch: {
      useList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, false, this.pageNum, this.pageSize)
    },
    methods: {
      /* 用车信息列表 */
      fetchData(createName, carModel, status, isAll = false, pageNum, pageSize) {
        this.listLoading = true
        return list(
          createName,
          carModel,
          status,
          isAll,
          null,
          null,
          pageNum,
          pageSize
        ).then(response => {
          this.useList = response.data.data.rows
          this.useList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
          false, this.pageNum, this.pageSize)
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
          false, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
          false, this.pageNum, this.pageSize)
      },
      /* 打开用车信息对话框 */
      goAddDemand() {
        this.dialogVisible = true
      },
      /* 打开用车信息对话框 */
      goEditDemand() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        if (this.multipleSelection[0].status !== 0) {
          this.$message({
            type: 'warning',
            message: '只能选择状态为【已保存】的进行修改！',
            duration: 1500
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const useCar = this.multipleSelection[0]
        getInfoById(useCar.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.carModel = resp.data.data.carModel
          this.editForm.usage = resp.data.data.usage
          this.editForm.useTime = resp.data.data.useTime
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      goEditDemandLine(id) {
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.carModel = resp.data.data.carModel
          this.editForm.usage = resp.data.data.usage
          this.editForm.useTime = resp.data.data.useTime
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 完成用车 */
      goFinish() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status !== 2) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【已领取】的进行完成！',
              duration: 1500
            })
            return
          }
        }
        const rows = this.multipleSelection
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        this.selectId = ids.join(',')
        this.dialogFormVisible = true
      },
      finishLine(id) {
        this.selectId = id
        this.dialogFormVisible = true
      },
      finish() {
        this.completeLloading = true
        this.loadingText = '正在提交'
        finish(this.selectId, this.satisfyForm.value, this.satisfyForm.result).then(resp => {
          this.$message({
            type: 'success',
            message: '完成了该用车记录',
            duration: 1000,
            onClose: () => {
              this.dialogFormVisible = false
              this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
                false, this.pageNum, this.pageSize).then(resp => {
                this.completeLloading = false
                this.loadingText = '拼命加载中'
              })
            }
          })
        }).catch(e => {
          this.completeLloading = false
          this.loadingText = '拼命加载中'
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
                this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
                  false, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoading = false
                  this.listLoading = false
                })
                this.dialogFormVisible = false
              }
            })
          }).catch(e => {
            this.deleteLoading = false
            this.listLoading = false
          })
        })
      },
      removeDemandLine(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoading = true
          this.listLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.createName,
                  this.searchForm.carModel,
                  this.searchForm.status,
                  false, this.pageNum,
                  this.pageSize
                ).then(resp => {
                  this.deleteLoading = false
                  this.listLoading = false
                })
                this.dialogFormVisible = false
              }
            })
          }).catch(e => {
            this.deleteLoading = false
            this.listLoading = false
          })
        })
      },
      /* 发布 */
      publish() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status !== 0) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【已保存】的进行发布！',
              duration: 1500
            })
            return
          }
        }
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        this.publishLoading = true
        this.listLoading = true
        publish(ids.join(',')).then(resp => {
          this.$message({
            type: 'success',
            message: '发布成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(
                this.searchForm.createName,
                this.searchForm.carModel,
                this.searchForm.status,
                false, this.pageNum,
                this.pageSize
              ).then(resp => {
                this.publishLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.publishLoading = false
          this.listLoading = false
        })
      },
      publishLine(id) {
        this.publishLoading = true
        this.listLoading = true
        publish(id).then(resp => {
          this.$message({
            type: 'success',
            message: '发布成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(
                this.searchForm.createName,
                this.searchForm.carModel,
                this.searchForm.status,
                false, this.pageNum,
                this.pageSize
              ).then(resp => {
                this.publishLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.publishLoading = false
          this.listLoading = false
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              /* const id = this.useList.length !== 0 ? this.useList[this.useList.length - 1].id + 1 : 1 */
              this.carLoading = true
              this.loadingText = '正在提交'
              save(
                this.addForm.carModel,
                this.addForm.usage,
                parseTime(this.addForm.useTime)
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
                      false, this.pageNum, this.pageSize).then(resp => {
                      this.carLoading = false
                      this.loadingText = '拼命加载中'
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.carLoading = false
              })
            } else if (formName === 'editForm') {
              this.editLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.carModel,
                this.editForm.usage,
                parseTime(this.editForm.useTime)
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.createName, this.searchForm.carModel, this.searchForm.status,
                      false, this.pageNum, this.pageSize).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.editLoading = false
                    })
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
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editLoading === true || this.carLoading === true || this.completeLloading === true) {
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

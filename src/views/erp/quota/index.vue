<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row>
        <el-form-item  label="车间名称" prop="departmentName">
          <el-input clearable v-model="searchForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" :loading="searchLoading" @click="searchQuota">查询</el-button>
          <el-button  type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="set" :loading="btnQuotaLoading" @click="goUpdateQuota"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;设置限额及比例
      </el-button>
    </div>

    <el-dialog
      title="设置限额及比例 "
      :visible.sync="quotaDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="quotaForm"
               :rules="rules"
               :model="quotaForm"
               label-width="80px"
               v-loading="quotaFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="设置入股金额" prop="sharesMoney">
          <el-input clearable v-model="quotaForm.sharesMoney"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="设置限额比例" prop="quotaProportion">
          <el-input clearable v-model="quotaForm.quotaProportion"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="设置管理比例" prop="managementProportion">
          <el-input clearable v-model="quotaForm.managementProportion"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('quotaForm')">提交</el-button>
          <el-button @click="resetForm('quotaForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table
      :data="quotaList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="车间名称">
        <template slot-scope="scope">
          {{scope.row.departmentName}}
        </template>
      </el-table-column>
      <el-table-column label="入股金额（万元）">
        <template slot-scope="scope">
          {{scope.row.sharesMoney}}
        </template>
      </el-table-column>
      <el-table-column label="限额比例">
        <template slot-scope="scope">
          {{scope.row.quotaProportion}}%
        </template>
      </el-table-column>
      <el-table-column label="采购限额（元）">
        <template slot-scope="scope">
          {{scope.row.purchaseQuota}}
        </template>
      </el-table-column>
      <el-table-column label="管理费比例">
        <template slot-scope="scope">
          {{scope.row.managementProportion}}%
        </template>
      </el-table-column>
      <el-table-column label="管理费（元）">
        <template slot-scope="scope">
          {{scope.row.management}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="设置限额及比例">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="set" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float:right;margin-top: 15px;"
      background
      layout="prev, pager, next"
      :current-page="pageNum"
      :page-count="pages"
      @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>

<script>
  import { list, update } from '@/api/quota'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: '限额管理',
    data() {
      return {
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        btnQuotaLoading: false, // 设置限额按钮
        submitLoading: false,
        quotaFormLoading: false, // 设置限额表单
        loadingText: '拼命加载中......', // 提示的文字

        quotaList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        list: null,
        quotaDialogVisible: false,
        multipleSelection: [],
        currentId: '',
        quotaForm: {
          id: '',
          sharesMoney: '',
          quotaProportion: '',
          managementProportion: ''
        },
        searchForm: {
          departmentName: ''
        },
        departmentName: '',
        rules: {
          sharesMoney: [
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          quotaProportion: [
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          managementProportion: [
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.fetchData(null, this.pageNum, this.pageSize)
    },
    watch: {
      quotaList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(departmentName, pageNum, pageSize) {
        this.listLoading = true
        return list(
          departmentName,
          pageNum,
          pageSize
        ).then(resp => {
          this.quotaList = resp.data.data.rows
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
      searchQuota() {
        this.searchLoading = true
        this.departmentName = this.searchForm.departmentName
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.departmentName, this.pageNum, this.pageSize).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 打开设置限额对话框 */
      goUpdateQuota() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.quotaDialogVisible = true

        this.btnQuotaLoading = true // 设置限额按钮为loading状态
        this.quotaFormLoading = true // 设置限额内容为loading状态

        const quota = this.multipleSelection[0]
        this.quotaForm.id = quota.id
        this.quotaForm.sharesMoney = quota.sharesMoney
        this.quotaForm.quotaProportion = quota.quotaProportion
        this.quotaForm.managementProportion = quota.managementProportion

        this.quotaFormLoading = false // 设置限额内容为正常状态
      },
      /* 表格里操作按钮 修改 */
      goEditLine(row) {
        this.quotaDialogVisible = true
        this.btnQuotaLoading = true // 设置限额按钮为loading状态
        this.quotaFormLoading = true // 设置限额内容为loading状态
        const quota = row
        this.quotaForm.id = quota.id
        this.quotaForm.sharesMoney = quota.sharesMoney
        this.quotaForm.quotaProportion = quota.quotaProportion
        this.quotaForm.managementProportion = quota.managementProportion
        this.quotaFormLoading = false // 设置限额内容为正常状态
      },
      /* 表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'quotaForm') {
              if (this.quotaForm.quotaProportion > 100) {
                this.$message({
                  type: 'warning',
                  message: '限额比例不能超过100%，请重新输入！'
                })
                return
              }
              if (this.quotaForm.managementProportion > 100) {
                this.$message({
                  type: 'warning',
                  message: '管理比例不能超过100%，请重新输入！'
                })
                return
              }
              this.submitLoading = true
              this.btnQuotaLoading = true
              this.quotaFormLoading = true
              this.loadingText = '提交中.....'
              this.listLoading = true
              update(
                this.quotaForm.id,
                this.quotaForm.sharesMoney,
                this.quotaForm.quotaProportion,
                this.quotaForm.managementProportion
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改限额成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(null, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.btnQuotaLoading = false // 设置限额按钮为loading状态
                      this.quotaFormLoading = false
                      this.loadingText = '拼命加载中.....'
                      this.listLoading = true
                    })
                    this.$refs[formName].resetFields()
                    this.quotaDialogVisible = false
                  }
                })
              }).catch(e => {
                this.submitLoading = false // 设置限额按钮为loading状态
                this.btnQuotaLoading = false // 设置限额按钮为loading状态
                this.quotaFormLoading = false
                this.loadingText = '拼命加载中.....'
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
        if (this.quotaFormLoading === true || this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.quotaDialogVisible = false
          this.btnQuotaLoading = false
          this.quotaFormLoading = false
          this.$refs['quotaForm'].resetFields()
        }).catch(() => {

        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.departmentName, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style scoped>
</style>

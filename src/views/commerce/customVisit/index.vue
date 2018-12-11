<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="回访状态" prop="visitStatus">
          <el-select  :clearable="true" v-model="searchForm.visitStatus" placeholder="请选择" filterable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input clearable  v-model="searchForm.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="回访时间" prop="visitTime">
          <el-date-picker
            v-model="searchForm.visitTime"
            type="month"
            :editable="false"
            placeholder="选择回访时间"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" :loading="searchLoading" @click="search">查询</el-button>
          <el-button  type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="saveCustomVisit">填写回访内容</el-button>
      <el-button  type="primary hidden" code="export" @click="download">数据导出</el-button>
    </div>

    <el-dialog
      title="填写回访内容"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="customVisitFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="0px" label="" prop="visitResult">
          <el-input clearable type="textarea" v-model="addForm.visitResult" autosize></el-input>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">保存</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="customVisitList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="客户姓名" width="100">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="客户手机号" width="150">
        <template slot-scope="scope">
          {{scope.row.telephone}}
        </template>
      </el-table-column>
      <el-table-column label="签收时间" width="160">
        <template slot-scope="scope">
          {{scope.row.signTime}}
        </template>
      </el-table-column>
      <el-table-column label="淘宝订单编号" width="160">
        <template slot-scope="scope">
          {{scope.row.outerOrderNo}}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="160">
        <template slot-scope="scope">
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" width="160">
        <template slot-scope="scope">
          {{scope.row.expressNo}}
        </template>
      </el-table-column>
      <el-table-column label="订单内容" width="200">
        <template slot-scope="scope">
          {{scope.row.orderContent}}
        </template>
      </el-table-column>
      <el-table-column label="回访状态" width="80">
        <template slot-scope="scope">
          {{scope.row.visitStatus == 1 ? '待回访' : '已回访'}}
        </template>
      </el-table-column>
      <el-table-column label="回访时间" width="160">
        <template slot-scope="scope">
          {{scope.row.visitTime}}
        </template>
      </el-table-column>
      <el-table-column label="回访内容">
        <template slot-scope="scope">
          {{scope.row.visitResult}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="填写回访内容">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="add" icon="el-icons-jd-xiugai1" @click="saveCustomVisitLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="数据导出">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="export" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
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
  import { list, updateResult } from '@/api/customVisit'
  import { getToken } from '@/utils/auth'

  export default {
    name: '回访管理',
    data() {
      return {
        options: [{
          value: '2',
          label: '已回访'
        }, {
          value: '1',
          label: '待回访'
        }],
        value: '',
        valueC: '',
        valueD: '',
        pValue: '',
        cValue: '',
        dValue: '',
        listLoading: false,
        searchLoading: false,
        submitLoading: false, // 提交按钮
        customVisitFormLoading: false, // 填写回访对话框
        loadingText: '拼命加载中...',
        customVisitList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        list: null,
        dialogVisible: false,
        multipleSelection: [],
        addForm: {
          ids: '',
          visitResult: ''
        },
        searchForm: {
          visitStatus: '',
          orderNo: '',
          visitTime: this.getDate()
        },
        visitStatus: '',
        orderNo: '',
        visitTime: this.getDate(),
        rules: {
          supplierName: [
            { required: true, message: '请输入回访名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      customVisitList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, this.visitTime, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(visitStatus, orderNo, visitTime, pageNum, pageSize) {
        this.listLoading = true
        return list(
          visitStatus,
          orderNo,
          visitTime,
          pageNum,
          pageSize
        ).then(resp => {
          this.customVisitList = resp.data.data.rows
          this.customVisitList.forEach((e, i) => { e['idx'] = i })
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
      /* 查询 */
      search() {
        this.searchLoading = true
        this.visitStatus = this.searchForm.visitStatus
        this.orderNo = this.searchForm.orderNo
        this.visitTime = this.searchForm.visitTime
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.visitStatus, this.orderNo, this.visitTime, this.pageNum, this.pageSize).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加回访内容对话框 */
      saveCustomVisit() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        } else {
          const customVisit = this.multipleSelection[0]
          this.addForm.ids = customVisit.id
          this.dialogVisible = true
        }
      },
      /* 表格内-打开添加回访内容对话框 */
      saveCustomVisitLine(id) {
        this.dialogVisible = true
        this.addForm.ids = id
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            this.customVisitFormLoading = true
            if (formName === 'addForm') {
              updateResult(
                this.addForm.ids,
                this.addForm.visitResult
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '填写成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.visitStatus, this.orderNo, this.visitTime, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.customVisitFormLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.customVisitFormLoading = false
              })
            }
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        // location.reload()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          // this.province = []
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
          location.reload()
        }).catch(() => {

        })
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.orderNumber, this.searchForm.orderTime, this.searchForm.orderStatus, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.visitStatus, this.orderNo, this.visitTime, this.pageNum, this.pageSize)
      },
      /* 获得日期 */
      getDate() {
        return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
      },
      /* excel导出 */
      download() {
        if (this.visitTime === null || this.visitTime === '' || this.visitTime === 'null') {
          this.$message({
            type: 'warning',
            message: '请选择回访时间,查询之后再导出!'
          })
          return
        }
        if (!this.customVisitList.length) {
          this.$message({
            type: 'warning',
            message: '没有可导出的数据!'
          })
          return
        }
        const token = getToken()
        location.href = process.env.BASE_API + '/commerce/admin/customVisit/download?visitStatus=' + this.visitStatus + '&orderNo=' + this.orderNo + '&visitTime=' + this.visitTime + '&x=' + token
      }
    }
  }
</script>
<style scoped>
</style>

<style>
  .el-pagination .el-select .el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
</style>

<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row style="padding-bottom: 10px;">
        <el-form-item label="年月" prop="yearAndMounth">
         <!-- <el-date-picker
            v-model="searchForm.yearAndMounth"
            type="month"
            :editable="false"
            placeholder="选择年月"
            value-format="yyyy-MM">
          </el-date-picker>-->
          <el-date-picker
            v-model="searchForm.yearAndMounth"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工人工号" prop="workNumber">
          <el-input clearable v-model="searchForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="车间" prop="workShop">
          <el-select :clearable="true" v-model="searchForm.workShop" placeholder="请选择车间" clearable filterable>
            <el-option v-for="item in workShopList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <el-table
      :data="wagesList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <table class="tableInLine" cellspacing="0" cellpadding="0" v-for="(item, index) in scope.row.processCount" :key="index">
            <tr><th :colspan="Object.getOwnPropertyNames(item).length-1" style="text-align: center">{{item.produceType}}</th></tr>
            <tr>
              <td v-if="item.CJ1 !== undefined">裁剪下层</td>
              <td v-if="item.CJ2 !== undefined">裁剪上层</td>
              <td v-if="item.CJ1F !== undefined">裁剪(翻边)</td>
              <td v-if="item.PJ !== undefined">拼接</td>
              <td v-if="item.PJF !== undefined">拼接(翻边)</td>
              <td v-if="item.QB !== undefined">去边</td>
              <td v-if="item.BB !== undefined">包边</td>
              <td v-if="item.BBF !== undefined">包边(翻边)</td>
              <td v-if="item.DK !== undefined">钉扣</td>
            </tr>
            <tr class="tr2">
              <td v-if="item.CJ1 !== undefined" @click="processDetail(scope.row.loginName, 'CJ1', item.produceType,)">{{item.CJ1}}</td>
              <td v-if="item.CJ2 !== undefined" @click="processDetail(scope.row.loginName, 'CJ2', item.produceType,)">{{item.CJ2}}</td>
              <td v-if="item.CJ1F !== undefined" @click="processDetail(scope.row.loginName, 'CJ1F', item.produceType,)">{{item.CJ1F}}</td>
              <td v-if="item.PJ !== undefined" @click="processDetail(scope.row.loginName, 'PJ', item.produceType,)">{{item.PJ}}</td>
              <td v-if="item.PJF !== undefined" @click="processDetail(scope.row.loginName, 'PJF', item.produceType,)">{{item.PJF}}</td>
              <td v-if="item.QB !== undefined" @click="processDetail(scope.row.loginName, 'QB', item.produceType,)">{{item.QB}}</td>
              <td v-if="item.BB !== undefined" @click="processDetail(scope.row.loginName, 'BB', item.produceType,)">{{item.BB}}</td>
              <td v-if="item.BBF !== undefined" @click="processDetail(scope.row.loginName, 'BBF', item.produceType,)">{{item.BBF}}</td>
              <td v-if="item.DK !== undefined" @click="processDetail(scope.row.loginName, 'DK', item.produceType,)">{{item.DK}}</td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          {{scope.row.loginName}}
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.department}}
        </template>
      </el-table-column>
      <el-table-column label="合计">
        <template slot-scope="scope">
          {{scope.row.department}}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="processNo + '详情'"
      :visible.sync="detailVisible"
      width="40%"
      :before-close="handleClose">
      <el-table
        :data="processList"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row>
        <el-table-column label="工序开始时间">
          <template slot-scope="scope">
            {{scope.row.startTime}}
          </template>
        </el-table-column>
        <el-table-column label="工序结束时间">
          <template slot-scope="scope">
            {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column label="产品型号">
          <template slot-scope="scope">
            {{scope.row.productType}}
          </template>
        </el-table-column>
        <el-table-column label="产品编号">
          <template slot-scope="scope">
            {{scope.row.productNo}}
          </template>
        </el-table-column>
        <el-table-column label="产品内容">
          <template slot-scope="scope">
            {{scope.row.productContent}}%
          </template>
        </el-table-column>
        <el-table-column label="订单编号">
          <template slot-scope="scope">
            {{scope.row.orderNo}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px;"
        background
        @size-change="handleSizeChangeInDialog"
        @current-change="handleCurrentPageChangeInDialog"
        :current-page.sync="pageNumInDialog"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="pageSizeInDialog"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalInDialog">
      </el-pagination>
    </el-dialog>

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
  import { listUserSalaryCount, listDepartments, listStatisticsDetail } from '@/api/reportForm'
  export default {
    name: '工人工资统计',
    data() {
      return {
        workShopList: [],
        listLoading: false,
        searchLoading: false, // 查询按钮
        total: -1,
        pageNum: 1,
        pageSize: 10,
        wagesList: null,
        multipleSelection: [],
        searchForm: {
          yearAndMounth: [],
          workNumber: '',
          workShop: ''
        },
        detailVisible: false,
        processList: null,
        processNo: '',
        produceType: '',
        fb: '',
        userLoginName: '',
        tableLoading: false,
        totalInDialog: 0,
        pageNumInDialog: 1,
        pageSizeInDialog: 10
      }
    },
    mounted() {
      listDepartments(2).then(res => {
        this.workShopList = res.data.data
      })
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化列表 */
      fetchData(yearAndMounth, workNumber, workShop, pageNum, pageSize) {
        const date = []
        if (yearAndMounth === null) {
          date[0] = null
          date[1] = null
        } else {
          date[0] = yearAndMounth[0]
          date[1] = yearAndMounth[1]
        }
        this.listLoading = true
        return listUserSalaryCount(
          date[0],
          date[1],
          workNumber,
          workShop,
          pageNum,
          pageSize
        ).then(resp => {
          this.wagesList = resp.data.data.rows
          // console.log(this.wagesList)
          // console.log(this.wagesList[0].processCount)
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.listLoading = true
        this.searchLoading = true
        this.fetchData(this.searchForm.yearAndMounth, this.searchForm.workNumber, this.searchForm.workShop, this.pageNum, this.pageSize).then((resp) => {
          this.listLoading = false
          this.searchLoading = false
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        // location.reload()
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.yearAndMounth, this.searchForm.workNumber, this.searchForm.workShop, this.pageNum, this.pageSize)
      },
      handleSizeChangeInDialog(pageSize) {
        this.pageNumInDialog = 1
        this.pageSizeInDialog = pageSize
        listStatisticsDetail(
          this.userLoginName,
          this.searchForm.yearAndMounth[0],
          this.searchForm.yearAndMounth[1],
          this.processNo,
          this.fb,
          this.produceType,
          this.pageNumInDialog,
          this.pageSizeInDialog
        ).then(resp => {
          this.tableLoading = false
          this.processList = resp.data.data.rows
          // console.log(resp)
          this.totalInDialog = resp.data.data.total
          this.pageNumInDialog = resp.data.data.pageNum
          this.pageSizeInDialog = resp.data.data.pageSize
        }).catch(e => {
          this.tableLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.yearAndMounth, this.searchForm.workNumber, this.searchForm.workShop, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChangeInDialog(currentPage) {
        this.pageNumInDialog = currentPage
        listStatisticsDetail(
          this.userLoginName,
          this.searchForm.yearAndMounth[0],
          this.searchForm.yearAndMounth[1],
          this.processNo,
          this.fb,
          this.produceType,
          this.pageNumInDialog,
          this.pageSizeInDialog
        ).then(resp => {
          this.tableLoading = false
          this.processList = resp.data.data.rows
          // console.log(resp)
          this.totalInDialog = resp.data.data.total
          this.pageNumInDialog = resp.data.data.pageNum
          this.pageSizeInDialog = resp.data.data.pageSize
        }).catch(e => {
          this.tableLoading = false
        })
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      tableFormatter(row, column, cellValue, index) {
        const orderStatus = row.orderMainStatus
        if (orderStatus !== undefined && orderStatus !== '') {
          if (orderStatus === 4) {
            if (row.orderSubStatus) {
              return this.mainStatus[orderStatus] + '【' + this.subOptions[row.orderSubStatus] + '】'
            }
          } else {
            return this.mainStatus[orderStatus]
          }
        }
      },
      tableRowClassName({ row }) {
        if (row.productStatus === 0 && row.produceType !== 0) {
          return 'print_page_print-row'
        }
        return ''
      },
      processDetail(userLoginName, processNo, produceType) {
        this.detailVisible = true
        this.tableLoading = true
        this.userLoginName = userLoginName
        this.processNo = processNo
        if (this.processNo.indexOf('F') === -1) {
          this.fb = 'BFB'
        } else {
          this.fb = 'FB'
        }
        this.produceType = produceType
        if (this.searchForm.yearAndMounth.length === 0) {
          this.searchForm.yearAndMounth[0] = null
          this.searchForm.yearAndMounth[1] = null
        }
        listStatisticsDetail(
          this.userLoginName,
          this.searchForm.yearAndMounth[0],
          this.searchForm.yearAndMounth[1],
          this.processNo,
          this.fb,
          this.produceType,
          this.pageNumInDialog,
          this.pageSizeInDialog
        ).then(resp => {
          this.tableLoading = false
          this.processList = resp.data.data.rows
          // console.log(resp)
          this.totalInDialog = resp.data.data.total
          this.pageNumInDialog = resp.data.data.pageNum
          this.pageSizeInDialog = resp.data.data.pageSize
        }).catch(e => {
          this.tableLoading = false
        })
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.tableLoading = false
          this.detailVisible = false
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
  /*table,table tr th, table tr td {*/
    /*border-bottom:1px solid #e6e6e6;*/
    /*border-right: 0;*/
  /*}*/
  .tableInLine { float:left;border-left: 1px solid  #e6e6e6;border-top: 1px solid #e6e6e6;
    margin-bottom: 5px; }
  .tableInLine tr th{ text-align: center; }
  .tableInLine tr td{ text-align: center;
    padding: 0 5px;
  }
  .tableInLine tr.tr2 td{
    text-decoration: underline;
    cursor: pointer;
  }
</style>

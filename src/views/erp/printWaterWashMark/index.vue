<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row style="padding-bottom: 10px;">
          <el-form-item label="订单编号" prop="orderNo">
            <el-input clearable v-model="searchForm.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="产品编号" prop="productNo">
            <el-input clearable v-model="searchForm.productNo"></el-input>
          </el-form-item>
          <el-form-item label="快递单号" prop="expressNo" label-width="110px">
            <el-input clearable v-model="searchForm.expressNo"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="orderTime" label-width="110px">
            <!--<el-input clearable v-model="searchForm.orderTime"></el-input>-->
            <el-date-picker style="width: 200px;"
              v-model="searchForm.orderTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="品牌" prop="productBrand">
            <el-input clearable v-model="searchForm.productBrand"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="orderStatus">
            <el-select :clearable="true" v-model="searchForm.orderStatus" placeholder="请选择订单状态" filterable>
              <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存状态" prop="storageMatchedStatus">
            <el-select :clearable="true" v-model="searchForm.storageMatchedStatus" placeholder="请选择库存状态" filterable>
              <el-option v-for="item in storageMatchedStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单打印状态" prop="expressPrintStatus" label-width="110px">
            <el-select :clearable="true" v-model="searchForm.expressPrintStatus" placeholder="请选择打印状态" filterable>
              <el-option v-for="item in expressPrintStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="水洗标打印状态" prop="sewnInLabelPrintStatus" label-width="110px">
            <el-select :clearable="true" v-model="searchForm.sewnInLabelPrintStatus" placeholder="请选择打印状态" filterable>
              <el-option v-for="item in sewnInLabelPrintStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <!--打印快递单-->
    <el-dialog
      title="打印快递单和水洗标"
      :visible.sync="printExpressDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="expressForm" :rules="rules" :model="expressForm" label-width="130px"
               v-loading="printLoading"
               :element-loading-text="loadingText">
        <el-form-item label="打印类型" prop="printType">
          <el-select  :clearable="true" v-model="expressForm.printType">
            <el-option v-for="item in printTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="expressForm.printType !== 2">
          <el-form-item label="邮费支付方式" prop="payType">
            <el-select  :clearable="true" v-model="expressForm.payType" clearable filterable>
              <el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="expressForm.payType === 3" label="月结编码" prop="monthCode">
            <el-input clearable v-model="expressForm.monthCode"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input clearable v-model="expressForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="快递公司编码" prop="shipperCode">
            <el-select  :clearable="true" v-model="expressForm.shipperCode" placeholder="请选择快递公司" clearable filterable>
              <el-option v-for="item in expressCompanyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="searchLoading" @click="submitForm('expressForm')">打印</el-button>
          <el-button @click="resetForm('expressForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="btn_box">
      <el-button class="el-button--primary" @click="goPrintExpress"><i class="el-icons-jd-dayinkuaididan"></i>&nbsp;打印快递单</el-button>
      <!--<el-button class="el-button&#45;&#45;primary" @click="goWashingMark" v-if="areaType === 1">-->
        <!--<i class="el-icons-jd-shuixibiao01"></i>&nbsp;打印水洗标-->
      <!--</el-button>-->
      <el-button class="el-button--primary" @click="testDownload">
        <i class="el-icons-jd-shuixibiao01"></i>&nbsp;测试下载水洗快递单
      </el-button>
    </div>

    <form id="hideForm" action="http://www.kdniao.com/External/PrintOrder.aspx" method="post" target="_blank">
      <input type="hidden" name="RequestData">
      <input type="hidden" name="EBusinessID">
      <input type="hidden" name="DataSign">
      <input type="hidden" name="IsPreview">
    </form>

    <el-table
      :data="orderList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column label="订单编号" width="200">
        <template slot-scope="scope">
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" width="150">
        <template slot-scope="scope">
          {{scope.row.expressNo}}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="80">
        <template slot-scope="scope">
          {{scope.row.productBrand}}
        </template>
      </el-table-column>
      <el-table-column label="产品详情" width="100">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.productList.length > 0"
                      placement="top-start"
                      width="900"
                      trigger="click">
            <el-table :data="scope.row.productList" border>
              <el-table-column width="280" prop="productNo" label="产品编号"></el-table-column>
              <el-table-column width="290" prop="productContent" label="产品内容"></el-table-column>
              <el-table-column width="260" prop="productRemark" label="产品备注"></el-table-column>
              <el-table-column width="300" prop="saleRemark" label="销售备注"></el-table-column>
            </el-table>
            <div v-html="scope.row.productNo"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="匹配状态">
        <template slot-scope="scope">
          {{scope.row.matchStatus === 1 ? '匹配完成' : '匹配尚未完成,稍后再进行操作'}}
        </template>
      </el-table-column>
      <el-table-column label="库存匹配产品编号">
        <template slot-scope="scope">
          {{scope.row.storageMatchedProductNo}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" :formatter="tableFormatter"  width="100">
      </el-table-column>
      <el-table-column label="快递单打印状态">
        <template slot-scope="scope">
          {{expressPrintStatusJSON[scope.row.expressPrintStatus]}}
        </template>
      </el-table-column>
      <el-table-column label="水洗标打印状态">
        <template slot-scope="scope">
          {{expressPrintStatusJSON[scope.row.sewnInLabelPrintStatus]}}
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="70">
        <template slot-scope="scope">
          {{scope.row.priority == 3 ? '正常' : '加急'}}
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="160">
        <template slot-scope="scope">
          {{scope.row.orderTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope" >
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="打印快递单">
            <el-button class="icon-btn" slot="reference" type="text" icon="el-icons-jd-dayinkuaididan" @click="printExpressLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="areaType === 1"
            placement="top-start"
            width="100"
            trigger="hover"
            content="打印水洗标">
            <el-button class="icon-btn" slot="reference" type="text" icon="el-icons-jd-shuixibiao01" @click="printWashingMarkLine(scope.row)"></el-button>
          </el-popover>
        </template >
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
  import { listOrder, printEOrder, printWater } from '@/api/printWaterWashMark'
  import { listExpressCodes } from '@/api/returnRecord'
  import { setAreaType } from '@/utils/areaTypeManage'
  import { getToken } from '@/utils/auth'

  export default {
    name: '打印快递单水洗标（南宫）',
    data() {
      return {
        expressPluginVersion: 1.1,
        expressPluginRequiredVersion: 1.1, // expressPluginVersion 大于 expressPluginRequiredVersion，说明已安装且版本正常；小于说明安装了，但插件版本不够，需要升级，
        expressCompanyList: [],
        payTypeList: [{
          value: 3,
          label: '月结'
        }, {
          value: 1,
          label: '现付'
        }, {
          value: 2,
          label: '到付'
        }, {
          value: 4,
          label: '第三方支付'
        }],
        orderStatusOptions: [{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '待生效'
        }, {
          value: '2',
          label: '待打单'
        }, {
          value: '3',
          label: '待生产'
        }, {
          value: '4',
          label: '生产中'
        }, {
          value: '8',
          label: '待发货'
        }, {
          value: '9',
          label: '待揽件'
        }, {
          value: '10',
          label: '已揽件'
        }, {
          value: '11',
          label: '在途中'
        }, {
          value: '12',
          label: '签收'
        }, {
          value: '13',
          label: '问题件'
        }, {
          value: '14',
          label: '待回访'
        }, {
          value: '15',
          label: '已取消'
        }],
        mainStatus: {
          0: '待审核',
          1: '待生效',
          2: '待打单',
          3: '待生产',
          4: '生产中',
          8: '待发货',
          9: '待揽件',
          10: '已揽件',
          11: '在途中',
          12: '签收',
          13: '问题件',
          14: '待回访',
          15: '已取消'
        },
        subOptions: {
          1: '裁剪开始',
          2: '裁剪结束',
          3: '拼接开始',
          4: '拼接结束',
          5: '去边开始',
          6: '去边结束',
          7: '包边开始',
          8: '包边结束',
          9: '钉扣开始',
          10: '钉扣结束'
        },
        storageMatchedStatusOptions: [{
          value: 0,
          label: '不匹配'
        }, {
          value: 1,
          label: '部分匹配'
        }, {
          value: 2,
          label: '部分完全匹配'
        }, {
          value: 3,
          label: '完全匹配'
        }],
        printTypeList: [{
          value: 0,
          label: '全部打印'
        }, {
          value: 1,
          label: '打印快递单'
        }, {
          value: 2,
          label: '打印水洗标'
        }],
        expressPrintStatusOptions: [{
          value: 0,
          label: '未打印'
        }, {
          value: 1,
          label: '打印成功'
        }, {
          value: 2,
          label: '重新打印'
        }],
        sewnInLabelPrintStatusOptions: [{
          value: 0,
          label: '未打印'
        }, {
          value: 1,
          label: '打印成功'
        }],
        expressPrintStatusJSON: {
          0: '未打印',
          1: '打印成功',
          2: '重新打印【订单地址变更】',
          3: '重新打印【订单材质颜色变更】',
          4: '重新打印【订单变更双层】',
          5: '重新打印【订单变更单层】',
          10: '重新打印【维修发货】'
        },

        printExpressDialogVisible: false,
        wahingMarkDialogVisible: false,
        printLoading: false,
        loadingText: '拼命加载数据中......',
        listLoading: false,
        searchLoading: false,
        orderList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        list: null,
        areaType: null,
        multipleSelection: [],
        searchForm: {
          orderNo: '',
          productNo: '',
          expressNo: '',
          orderTime: null,
          productBrand: '',
          orderStatus: '',
          storageMatchedStatus: '',
          expressPrintStatus: null,
          sewnInLabelPrintStatus: null
        },
        orderIds: '',
        expressForm: {
          orderId: '',
          orderNo: '',
          expressPrintStatus: '',
          isPreview: 0,
          payType: '',
          monthCode: '',
          printType: 0,
          remark: '',
          senderMobile: '',
          senderName: '',
          shipperCode: ''
        },
        wahingMarkForm: {
          orderId: '',
          isPreview: '',
          payType: '',
          printType: 2,
          remark: '',
          senderMobile: '',
          senderName: '',
          shipperCode: ''
        },
        isFlag: true,
        rules: {
          orderId: [
            { required: true, message: '请输入订单编码', trigger: 'blur' }
          ],
          isPreview: [
            { required: true, message: '请选择是否预览', trigger: 'blur' }
          ],
          payType: [
            { required: true, message: '请选择支付方式', trigger: 'blur' }
          ],
          senderMobile: [
            { required: true, message: '请选择发件人手机号', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          senderName: [
            { required: true, message: '请选择发件人姓名', trigger: 'blur' }
          ],
          shipperCode: [
            { required: true, message: '请选择快递公司编码', trigger: 'change' }
          ]
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(null, null, null, null, null, null, null, null, null, this.pageNum, this.pageSize)
      next()
    },
    watch: {
      $route: {
        handler(e) {
          this.areaType = parseInt(e.query.areaType)
        },
        immediate: true
      }
    },
    mounted() {
      this.fetchData(null, null, null, null, null, null, null, null, null, this.pageNum, this.pageSize)
      listExpressCodes().then(response => {
        this.expressCompanyList = response.data.data
      })
      if (this.isElectronApp()) {
        this.expressPluginVersion = this.expressPluginRequiredVersion
      }
    },
    methods: {
      // 没安装提示
      printTips() {
        this.$message({
          dangerouslyUseHTMLString: true,
          duration: 0,
          showClose: true,
          message: '<div class="printTips">您尚未安装打印插件，请安装打印插件！<a href="/static/pluginHelp.html">查看帮助</a><a href="static/expressPlugin-' + this.expressPluginRequiredVersion + '.zip">下载</a></div>'
        })
        return
      },
      // 升级提示
      upgradeTips() {
        this.$message({
          dangerouslyUseHTMLString: true,
          duration: 0,
          showClose: true,
          message: '<div class="printTips">您的打印插件版本太低，请升级打印插件！<a href="/static/pluginHelp.html">查看帮助</a><a href="static/expressPlugin-' + this.expressPluginRequiredVersion + '.zip">下载</a></div>'
        })
        return
      },
      /* 初始化单位列表 */
      fetchData(orderNo, productNo, expressNo, orderTime, productBrand, orderStatus, storageMatchedStatus, expressPrintStatus, sewnInLabelPrintStatus, pageNum, pageSize) {
        this.listLoading = true
        setAreaType(this.areaType)
        return listOrder(
          orderNo,
          productNo,
          expressNo,
          orderTime,
          productBrand,
          orderStatus,
          storageMatchedStatus,
          expressPrintStatus,
          sewnInLabelPrintStatus,
          pageNum,
          pageSize
        ).then(resp => {
          this.orderList = resp.data.data.rows
          this.orderList.forEach((e, i) => {
            e['idx'] = i
          })
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
        this.searchLoading = true
        this.fetchData(
          this.searchForm.orderNo,
          this.searchForm.productNo,
          this.searchForm.expressNo,
          this.searchForm.orderTime,
          this.searchForm.productBrand,
          this.searchForm.orderStatus,
          this.searchForm.storageMatchedStatus,
          this.searchForm.expressPrintStatus,
          this.searchForm.sewnInLabelPrintStatus,
          this.pageNum,
          this.pageSize
        ).then((resp) => {
          this.searchLoading = false
        }).catch(e => {
          this.searchLoading = false
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        // location.reload()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.printLoading = false
          this.loadingText = '提交中.....'
          done()
          this.$refs['expressForm'].resetFields()
          this.$refs['wahingMarkForm'].resetFields()
          location.reload()
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.orderNo,
          this.searchForm.productNo,
          this.searchForm.expressNo,
          this.searchForm.orderTime,
          this.searchForm.productBrand,
          this.searchForm.orderStatus,
          this.searchForm.storageMatchedStatus,
          this.searchForm.expressPrintStatus,
          this.searchForm.sewnInLabelPrintStatus,
          this.pageNum,
          this.pageSize
        )
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.orderNo,
          this.searchForm.productNo,
          this.searchForm.expressNo,
          this.searchForm.orderTime,
          this.searchForm.productBrand,
          this.searchForm.orderStatus,
          this.searchForm.storageMatchedStatus,
          this.searchForm.expressPrintStatus,
          this.searchForm.sewnInLabelPrintStatus,
          this.pageNum,
          this.pageSize
        )
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
      /* 打印快递单按钮 */
      goPrintExpress() {
        if (this.expressPluginVersion === -1) {
          this.printTips()
        } else if (this.expressPluginVersion < this.expressPluginRequiredVersion) {
          this.upgradeTips()
        } else {
          if (this.multipleSelection.length === 0) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return
          }
          const ids = []
          const matchStatus = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
            matchStatus.push(this.multipleSelection[i].matchStatus)
          }
          for (let j = 0; j < matchStatus.length; j++) {
            if (matchStatus[j] !== 1) {
              this.isFlag = false
              break
            }
          }
          if (this.isFlag === false) {
            this.$message({
              type: 'warning',
              message: '库存匹配有未完成的!'
            })
            this.isFlag = true
            return
          }
          this.printExpressDialogVisible = true
          this.expressForm.orderId = ids.join(',')
          this.expressForm.orderNo = this.multipleSelection.map(v => v.orderNo).join(',')
          this.expressForm.expressPrintStatus = this.multipleSelection.map(v => v.expressPrintStatus).join(',')
        }
      },
      /* 行内打印快递单按钮 */
      printExpressLine(row) {
        if (this.expressPluginVersion === -1) {
          this.printTips()
        } else if (this.expressPluginVersion < this.expressPluginRequiredVersion) {
          this.upgradeTips()
        } else {
          console.log(this.expressPluginVersion)
        }
        if (row.matchStatus !== 1) {
          this.$message({
            type: 'warning',
            message: '库存匹配未完成!'
          })
          this.isFlag = true
          return
        }
        this.printExpressDialogVisible = true
        this.expressForm.orderId = row.id
        this.expressForm.orderNo = row.orderNo
        this.expressForm.expressPrintStatus = row.expressPrintStatus
      },
      /* 打印水洗标按钮 */
      goWashingMark() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        this.wahingMarkForm.orderId = ids.join(',')
        printWater(
          this.wahingMarkForm.orderId
        ).then(resp => {
          const washingMark = resp.data.data
          if (resp.data.status === 200) {
            const list = washingMark.sewnInLabelList
            const urls = list.map(e => e.qrcodeUrl + '*' + e.washLabelNo).join(',')
            window.open('/manage/static/printWater/printWaterLabel.html?qrCodeUrl=' + encodeURIComponent(urls))
            // this.hideForm.RequestData = washingMark.RequestData
            // this.hideForm.EBusinessID = washingMark.EBusinessID
            // this.hideForm.DataSign = washingMark.DataSign
            // this.hideForm.IsPreview = washingMark.IsPreview
          }
        })
      },
      /* 行内打印水洗标按钮 */
      printWashingMarkLine(row) {
        this.wahingMarkForm.orderId = row.id
        printWater(
          this.wahingMarkForm.orderId
        ).then(resp => {
          const washingMark = resp.data.data
          if (resp.data.status === 200) {
            const list = washingMark.sewnInLabelList
            const urls = list.map(e => e.qrcodeUrl + '*' + e.washLabelNo).join(',')
            window.open('/manage/static/printWater/printWaterLabel.html?qrCodeUrl=' + encodeURIComponent(urls))
            // this.hideForm.RequestData = washingMark.RequestData
            // this.hideForm.EBusinessID = washingMark.EBusinessID
            // this.hideForm.DataSign = washingMark.DataSign
            // this.hideForm.IsPreview = washingMark.IsPreview
          }
        })
      },
      testDownload() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const iframe = document.createElement('iframe')
        iframe.setAttribute('style', 'display:none')
        document.body.appendChild(iframe)

        const params = this.multipleSelection.map(t => t.expressNo + ',' + t.productList.filter(m => m.matOrNot === 1)[0].productNo + ',' + t.orderNo).join(';')
        document.querySelector('iframe').src = ('/system/admin/file/downloadPrint?printContents=' + params + '&x=' + getToken())
      },
      /* 打印快递单提交 */
      submitForm(formName) {
        if (this.expressForm.printType === 2) {
          this.printExpressDialogVisible = true
          this.searchLoading = true
          this.printLoading = true
          this.loadingText = '提交中.....'
          window.open('./static/printWater/printExpressAndWashingMark.html?ids=' + this.expressForm.orderId + '&printType=' + this.expressForm.printType)
          // this.printExpressDialogVisible = false
          this.searchLoading = false
          this.loadingText = '读取打印数据完毕，请关闭该对话框.....'
        } else {
          if (formName === 'expressForm') {
            this.printExpressDialogVisible = true
            this.searchLoading = true
            this.printLoading = true
            this.loadingText = '提交中.....'
            printEOrder(
              this.expressForm.orderId,
              this.expressForm.orderNo,
              this.expressForm.expressPrintStatus,
              this.expressForm.isPreview,
              this.expressForm.payType,
              this.expressForm.printType,
              this.expressForm.remark,
              this.expressForm.senderMobile,
              this.expressForm.senderName,
              this.expressForm.shipperCode
            ).then(resp => {
              const printExpress = resp.data.data
              if (resp.data.status === 200) {
                window.open('./static/printWater/printExpressAndWashingMark.html?sessionId=' + printExpress + '&ids=' + this.expressForm.orderId + '&printType=' + this.expressForm.printType)
                // this.printExpressDialogVisible = false
                this.searchLoading = false
                this.loadingText = '读取打印数据完毕，请关闭该对话框.....'
              }
            })
          }
        }
      },
      tableRowClassName({ row }) {
        if (row.productStatus === 0 && row.produceType !== 0) {
          return 'print_page_print-row'
        }
        return ''
      }
    }
  }
</script>

<style scoped>
</style>

<style>
  .printTips{
    width: 600px;
    color: #ff0000;
  }
  .printTips a{
    display: block;
    float: right;
    padding: 0 10px;
  }
  .printTips a:hover{
    text-decoration: underline;
  }
  .el-message{
    background: #f2f2f2;
  }
  .el-message .el-icon-info{
    color: #ff0000;

  }
</style>

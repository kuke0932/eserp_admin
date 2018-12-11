<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row>
          <el-form-item label="产品编号" prop="productNumber">
            <el-input clearable v-model="searchForm.productNumber"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="orderTime">
            <el-date-picker
              v-model="searchForm.orderTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="维修状态" prop="repairStatus">
            <el-select :clearable="true" v-model="searchForm.repairStatus" placeholder="请选择维修类型" clearable filterable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="repairSource">
            <el-select :clearable="true" v-model="searchForm.repairSource" placeholder="请选择来源" clearable filterable>
              <el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" :loading="searchLoading" @click="search">查询</el-button>
            <el-button  type="primary" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="save"><i class="el-icons-jd-add"></i>&nbsp;添加维修信息</el-button>
      <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="updateRepairRecord"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改维修信息</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteComplaint"><i class="el-icons-jd-shanchu"></i>&nbsp;删除信息</el-button>
      <el-button class="el-button--primary hidden" code="confirmRepair" :loading="confirmRepairLoading" @click="confirmRepairOk"><i class="el-icons-jd-weixiu"></i>&nbsp;确认维修</el-button>
      <el-button class="el-button--primary hidden" code="confirmRecive" :loading="confirmReciveLoading" @click="confirmReciveOk"><i class="el-icons-jd-iconddsho"></i>&nbsp;确认收货</el-button>
      <el-button class="el-button--primary hidden" code="auditOpinion" :loading="saveAuditOpinionLoading" @click="saveAuditOpinionOk"><i class="el-icons-jd-shenheyijian"></i>&nbsp;填写审核意见</el-button>
    </div>

    <el-dialog
      title="添加维修信息"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">

        <el-form-item label-width="100px" label="快递公司" prop="expressCompanyCode">
          <el-select v-model="addForm.expressCompanyCode" placeholder="请选择" clearable filterable>
            <el-option v-for="item in expressCompanyCodes" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="快递单号" prop="expressNo">
          <el-input clearable v-model="addForm.expressNo"></el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="产品编号" prop="productNumber">
          <el-input clearable v-model="addForm.productNumber"></el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="维修来源" prop="repairSource">
          <el-select style="min-width: 170px;width: 170px;" v-model="addForm.repairSource" placeholder="请选择来源" clearable filterable>
            <el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="维修原因" prop="repairReason">
          <tinymce v-model="addForm.repairReason"></tinymce>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改维修信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">

        <el-form-item label-width="100px" label="快递公司" prop="expressCompanyCode">
          <el-select v-model="editForm.expressCompanyCode" placeholder="请选择" clearable filterable>
            <el-option v-for="item in expressCompanyCodes" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="快递单号" prop="expressNo">
          <el-input clearable v-model="editForm.expressNo"></el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="产品编号" prop="productNumber">
          <el-input clearable v-model="editForm.productNumber"></el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="维修来源" prop="repairSource">
          <el-select style="min-width: 170px;width: 170px;" v-model="editForm.repairSource" placeholder="请选择来源" clearable filterable>
            <el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="维修原因" prop="repairReason">
          <tinymce v-model="editForm.repairReason"></tinymce>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="填写审核意见"
      :visible.sync="saveAuditOpinionDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="saveAuditOpinionForm" :rules="rules" :model="saveAuditOpinionForm" label-width="80px"
               v-loading="saveAuditOpinionFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="审核意见" prop="opinion">
          <tinymce v-model="saveAuditOpinionForm.opinion"></tinymce>
        </el-form-item>
        <el-form-item label="维修类型" prop="repairType">
          <el-select v-model="saveAuditOpinionForm.repairType" placeholder="请选择维修类型" clearable filterable>
            <el-option v-for="item in repairType"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修工人" prop="loginName">
          <el-select v-model="saveAuditOpinionForm.loginName" placeholder="请选择维修工人" clearable filterable>
            <el-option v-for="item in processOptions"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('saveAuditOpinionForm')">提交</el-button>
          <el-button @click="resetForm('saveAuditOpinionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="repairRecordList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="淘宝订单编号" width="150">
        <template slot-scope="scope">
          {{scope.row.taoBaoOrderNumber}}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="200">
        <template slot-scope="scope">
          {{scope.row.orderNumber}}
        </template>
      </el-table-column>
      <el-table-column label="产品编号" width="200">
        <template slot-scope="scope">
          {{scope.row.productNumber}}
        </template>
      </el-table-column>
      <el-table-column label="快递公司">
        <template slot-scope="scope">
          {{scope.row.expressCompany}}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" width="150">
        <template slot-scope="scope">
          {{scope.row.expressNumber}}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="80">
        <template slot-scope="scope">
          {{scope.row.brand}}
        </template>
      </el-table-column>
      <el-table-column label="买家信息" width="80">
        <template slot-scope="scope">
          {{scope.row.buyerName}}
        </template>
      </el-table-column>
      <el-table-column label="订单内容" width="200">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.orderContent"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.orderContent"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="维修原因" width="120">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.repairReason"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.repairReason"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" width="100">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.opinion"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.opinion"></div>
            <a slot="reference" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="维修状态" width="100">
        <template slot-scope="scope">
          {{scope.row.repairStatus}}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改维修信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditRepair(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeRepair(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.repairStatus === '主任已审核'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认维修">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirmRepair" icon="el-icons-jd-weixiu" @click="confirmRepairLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.repairStatus === '客服已保存'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认收货">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirmRecive" icon="el-icons-jd-iconddsho" @click="confirmReciveLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.repairStatus === '库管已收货'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="填写审核意见">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="auditOpinion" icon="el-icons-jd-shenheyijian" @click="auditOpinionLine(scope.row)"></el-button>
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
  import Tinymce from '@/components/Tinymce' /* 文本编辑器组件 */
  import { getInfoById, update, saveAuditOpinion, save, remove, list, confirmRepair, confirmRecive } from '@/api/repairRecord'
  import { authMenuButton } from '@/utils/authMenuButton'
  import { listExpressCodes } from '@/api/returnRecord'
  import { listProcess } from '@/api/finishedProductOutStorage'
  export default {
    name: 'repairRecord',
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        expressCompanyCodes: [],
        processOptions: [],
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
          label: '生产中裁剪'
        }, {
          value: '5',
          label: '生产中拼接'
        }, {
          value: '6',
          label: '生产中去边'
        }, {
          value: '7',
          label: '生产中包边'
        }, {
          value: '8',
          label: '生产中钉扣'
        }, {
          value: '9',
          label: '待发货'
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
        options: [{
          value: '0',
          label: '客服已保存'
        }, {
          value: '1',
          label: '库管已收货'
        }, {
          value: '2',
          label: '主任已审核'
        }, {
          value: '3',
          label: '客服已确认'
        }, {
          value: '4',
          label: '正在维修'
        }, {
          value: '5',
          label: '已发货'
        }],
        optionss: [{
          value: '0',
          label: '退货入库维修'
        }, {
          value: '1',
          label: '客户寄回维修'
        }, {
          value: '2',
          label: '出库维修'
        }],
        ids: '',
        value: '',
        valueC: '',
        valueD: '',
        pValue: '',
        cValue: '',
        dValue: '',
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        editLoading: false, // 修改按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        removeLoading: false, // 删除按钮
        confirmRepairLoading: false, // 确认维修
        confirmReciveLoading: false, // 确认收货
        saveAuditOpinionLoading: false, // 填写审核意见
        saveAuditOpinionFormLoading: false, // 填写审核意见对话框
        repairRecordList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        province: [],
        city: [],
        district: [],
        list: null,
        dialogVisible: false,
        editDialogVisible: false,
        saveAuditOpinionDialogVisible: false,
        multipleSelection: [],
        editDisabled: false,
        enableStatus: null,
        currentId: '',
        repairType: [{
          value: 1,
          name: '全部维修'
        }, {
          value: 2,
          name: '维修主驾'
        }, {
          value: 3,
          name: '维修副驾'
        }, {
          value: 4,
          name: '维修主副驾'
        }, {
          value: 5,
          name: '维修后座'
        }, {
          value: 6,
          name: '维修后座副驾'
        }, {
          value: 7,
          name: '维修主驾和后座'
        }, {
          value: 8,
          name: '维修卡扣'
        }, {
          value: 9,
          name: '维修网兜'
        }],
        addForm: {
          productNumber: '',
          repairSource: '',
          repairReason: '',
          expressCompanyCode: '',
          expressNo: ''
        },
        editForm: {
          id: '',
          productNumber: '',
          repairSource: '',
          repairReason: '',
          expressCompanyCode: '',
          expressNo: ''
        },
        searchForm: {
          productNumber: '',
          orderTime: '',
          repairStatus: '',
          repairSource: ''
        },
        saveAuditOpinionForm: {
          id: '',
          opinion: '',
          repairType: '',
          loginName: ''
        },
        rules: {
          expressCompanyCode: [
            { required: true, message: '请选择快递公司', trigger: 'change' }
          ],
          repairSource: [
            { required: true, message: '请选择维修来源', trigger: 'change' }
          ],
          expressNo: [
            { required: true, message: '请输入快递单号', trigger: 'blur' }
          ],
          productNumber: [
            { required: true, message: '请输入产品编号', trigger: 'blur' }
          ],
          repairReason: [
            { required: true, message: '请输入退货原因', trigger: 'blur' }
          ],
          repairType: [
            { required: true, message: '请选择维修类型', trigger: 'blur' }
          ],
          loginName: [
            { required: true, message: '请选择维修工人', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      repairRecordList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, null, this.pageNum, this.pageSize)
      this.fetchSelectData()
    },
    methods: {
      /* 初始化列表 */
      fetchData(productNumber, orderTime, repairStatus, repairSource, pageNum, pageSize) {
        this.listLoading = true
        return list(
          productNumber,
          orderTime,
          repairStatus,
          repairSource,
          pageNum,
          pageSize
        ).then(resp => {
          this.repairRecordList = resp.data.data.rows
          this.repairRecordList.forEach((e, i) => { e['idx'] = i })
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
      /* 初始化下拉框 */
      fetchSelectData() {
        listExpressCodes().then(response => {
          this.expressCompanyCodes = response.data.data
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(
            this.searchForm.productNumber,
            this.searchForm.orderTime,
            this.searchForm.repairStatus,
            this.searchForm.repairSource,
            this.pageNum, this.pageSize
          ).then((resp) => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加单位对话框 */
      save() {
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      updateRepairRecord() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true
        this.editFormLoading = true
        const complaint = this.multipleSelection[0]
        this.editForm.id = complaint.id
        getInfoById(this.editForm.id).then(resp => {
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.repairReason = resp.data.data.repairReason
          this.editForm.repairSource = resp.data.data.repairSource + ''
          this.editForm.expressCompanyCode = resp.data.data.expressComponyCode + ''
          this.editForm.expressNo = resp.data.data.expressNumber
          this.editLoading = false
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
      },
      goEditRepair(id) {
        this.editDialogVisible = true
        this.editFormLoading = true
        this.editForm.id = id
        getInfoById(this.editForm.id).then(resp => {
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.repairReason = resp.data.data.repairReason
          this.editForm.repairSource = resp.data.data.repairSource + ''
          this.editForm.expressCompanyCode = resp.data.data.expressComponyCode + ''
          this.editForm.expressNo = resp.data.data.expressNumber
          this.editLoading = false
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
      },
      /* 打开填写审核意见对话框 */
      saveAuditOpinionOk() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const repairRecord = this.multipleSelection[0]
        if (repairRecord.repairStatus !== '库管已收货') {
          this.$message({
            type: 'warning',
            message: '请选择审核状态为【库管已收货】的再执行此操作!'
          })
          return
        }
        listProcess(repairRecord.productNumber).then(res => {
          this.processOptions = res.data.data
          this.saveAuditOpinionForm.loginName = repairRecord.loginName
        })
        this.saveAuditOpinionLoading = true
        this.saveAuditOpinionFormLoading = true
        this.saveAuditOpinionForm.id = repairRecord.id
        this.saveAuditOpinionForm.opinion = repairRecord.opinion
        this.saveAuditOpinionLoading = false
        this.saveAuditOpinionFormLoading = false
        this.saveAuditOpinionDialogVisible = true
      },
      // 表格里-填写审核意见
      auditOpinionLine(row) {
        if (row.repairStatus !== '库管已收货') {
          this.$message({
            type: 'warning',
            message: '请选择审核状态为【库管已收货】的再执行此操作!'
          })
          return
        }
        this.saveAuditOpinionForm.id = row.id
        listProcess(row.productNumber).then(res => {
          this.processOptions = res.data.data
          this.saveAuditOpinionForm.loginName = row.loginName
        })
        this.saveAuditOpinionDialogVisible = true
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
                this.addForm.productNumber,
                this.addForm.repairReason,
                this.addForm.repairSource,
                this.addForm.expressCompanyCode,
                this.addForm.expressNo
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.productNumber,
                      this.searchForm.orderTime,
                      this.searchForm.repairStatus,
                      this.searchForm.repairSource,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
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
                this.editForm.productNumber,
                this.editForm.repairReason,
                this.editForm.repairSource,
                this.editForm.expressCompanyCode,
                this.editForm.expressNo
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.editForm.repairReason = ''
                    this.fetchData(
                      this.searchForm.productNumber,
                      this.searchForm.orderTime,
                      this.searchForm.repairStatus,
                      this.searchForm.repairSource,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.editFormLoading = false
                      this.submitLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.editFormLoading = false
                this.submitLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'saveAuditOpinionForm') {
              this.submitLoading = true
              this.saveAuditOpinionFormLoading = true
              this.loadingText = '正在提交......'
              saveAuditOpinion(
                this.saveAuditOpinionForm.id,
                this.saveAuditOpinionForm.opinion,
                this.saveAuditOpinionForm.repairType,
                this.saveAuditOpinionForm.loginName
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '填写成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.productNumber,
                      this.searchForm.orderTime,
                      this.searchForm.repairStatus,
                      this.searchForm.repairSource,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.saveAuditOpinionFormLoading = false
                      this.submitLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.saveAuditOpinionDialogVisible = false
                  }
                })
              }).catch(e => {
                this.editFormLoading = false
                this.submitLoading = false
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
        // location.reload()
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
          // this.province = []
          this.editDialogVisible = false
          this.dialogVisible = false
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.productNumber, this.searchForm.orderTime, this.searchForm.repairStatus, this.searchForm.repairSource, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.productNumber, this.searchForm.orderTime, this.searchForm.repairStatus, this.searchForm.repairSource, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.currentId = this.multipleSelection[0]
      },
      /* 删除信息 */
      deleteComplaint() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
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
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
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
      removeRepair(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
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
      /* 确认收货 */
      confirmReciveOk() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        const rows = this.multipleSelection
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].repairStatus !== '客服已保存') {
            this.$message({
              type: 'warning',
              message: '请选择维修状态为【客服已保存】的再执行此操作!'
            })
            return
          }
        }
        this.$confirm('是否确认收货', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmReciveLoading = true
          this.listLoading = true
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          confirmRecive(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '确认收货成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.confirmReciveLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmReciveLoading = false
            this.listLoading = false
          })
        })
      },
      confirmReciveLine(row) {
        if (row.repairStatus !== '客服已保存') {
          this.$message({
            type: 'warning',
            message: '请选择维修状态为【客服已保存】的再执行此操作!'
          })
          return
        }
        this.$confirm('是否确认收货', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmReciveLoading = true
          this.listLoading = true
          confirmRecive(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '确认收货成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.confirmReciveLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmReciveLoading = false
            this.listLoading = false
          })
        })
      },
      /* 确认维修 */
      confirmRepairOk() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        const rows = this.multipleSelection
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].repairStatus !== '主任已审核') {
            this.$message({
              type: 'warning',
              message: '请选择维修状态为【主任已审核】的再执行此操作!'
            })
            return
          }
        }
        this.$confirm('确认是否维修', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmRepairLoading = true
          this.listLoading = true
          const ids = []
          const productNos = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
            productNos.push(rows[i].productNumber)
          }
          confirmRepair(ids.join(','), productNos.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '确认维修成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum, this.pageSize
                ).then((resp) => {
                  this.confirmRepairLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmRepairLoading = false
            this.listLoading = false
          })
        })
      },
      confirmRepairLine(row) {
        if (row.repairStatus !== '主任已审核') {
          this.$message({
            type: 'warning',
            message: '请选择维修状态为【主任已审核】的再执行此操作!'
          })
          return
        }
        this.$confirm('确认是否维修', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmRepairLoading = true
          this.listLoading = true
          confirmRepair(row.id, row.productNumber).then(response => {
            this.$message({
              type: 'success',
              message: '确认维修成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.productNumber,
                  this.searchForm.orderTime,
                  this.searchForm.repairStatus,
                  this.searchForm.repairSource,
                  this.pageNum, this.pageSize
                ).then((resp) => {
                  this.confirmRepairLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmRepairLoading = false
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
  .el-pagination .el-select .el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
</style>

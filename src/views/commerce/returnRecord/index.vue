<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row>
          <el-form-item label="产品编号" prop="productNumber">
            <el-input clearable v-model="searchForm.productNumber"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="orderTime">
            <!--<el-input clearable style="min-width: 170px;width: 170px;" v-model="searchForm.orderTime"></el-input>-->
            <el-date-picker v-model="searchForm.orderTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <!--<el-form-item label="订单状态" prop="orderStatus">-->
            <!--<el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态">-->
              <!--<el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="退货状态" prop="returnStatus">
            <el-select v-model="searchForm.returnStatus" clearable filterable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
            <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="saveReturnRecord"><i class="el-icons-jd-add"></i>&nbsp;添加退换货信息</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="updateReturnRecord"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改退换货信息</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteComplaint"><i class="el-icons-jd-shanchu"></i>&nbsp;删除信息</el-button>
      <el-button class="el-button--primary hidden" code="confirmInStorage" :loading="confirmInStorageLoading" @click="confirmInStorageOk"><i class="el-icons-jd-ruku"></i>&nbsp;确认可入库</el-button>
      <!--<el-button class="el-button&#45;&#45;primary hidden" code="confirmRepair" @click="confirmRepairOk"><i class="el-icons-jd-weixiu"></i>&nbsp;确认维修</el-button>-->
      <el-button class="el-button--primary hidden" code="confirmReceive" :loading="confirmReciveLoading" @click="confirmReciveOk"><i class="el-icons-jd-iconddsho"></i>&nbsp;确认收货</el-button>
      <el-button class="el-button--primary hidden" code="auditOpinion" :loading="saveAuditOpinionLoading" @click="saveAuditOpinionOk"><i class="el-icons-jd-shenheyijian"></i>&nbsp;填写审核意见</el-button>
      <el-button class="el-button--primary hidden" code="inStorage" @click="finalInStorage"><i class="el-icons-jd-ruku"></i>&nbsp;库管入库</el-button>
    </div>

    <el-dialog
      title="添加退换货信息"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form
        ref="addForm"
        :rules="rules"
        :model="addForm"
        label-width="80px"
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

        <el-form-item label-width="100px" label="退货原因" prop="returnReason">
          <tinymce v-model="addForm.returnReason"></tinymce>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改退换货信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form
        ref="editForm"
        :rules="rules"
        :model="editForm"
        label-width="80px"
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

        <el-form-item label-width="100px" label="退货原因" prop="returnReason">
          <tinymce v-model="editForm.returnReason"></tinymce>
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
      <el-form ref="saveAuditOpinionForm" :rules="auditRules" :model="saveAuditOpinionForm" label-width="80px"
               v-loading="saveAuditOpinionFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="审核意见" prop="auditOpinion">
          <tinymce v-model="saveAuditOpinionForm.auditOpinion"></tinymce>
        </el-form-item>
        <el-row style="border-bottom: 0;">
          <el-form-item label="类型" prop="status" style="float: left;margin-right: 2px;">
            <el-select v-model="saveAuditOpinionForm.status" placeholder="请选择是入库或维修" @change="changeType" clearable filterable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="repairType" style="float: left;margin-right: 2px;"
                        v-show="saveAuditOpinionForm.status === 1">
            <el-select v-model="saveAuditOpinionForm.repairType" placeholder="请选择维修类型" clearable filterable>
              <el-option v-for="item in repairType"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 0;" v-show="saveAuditOpinionForm.status === 1">
          <el-form-item label="维修工人" prop="loginName" style="float: left;margin-right: 2px;">
            <el-select v-model="saveAuditOpinionForm.loginName" placeholder="请选择维修工人" clearable filterable>
              <el-option v-for="item in processOptions"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('saveAuditOpinionForm')">提交</el-button>
          <el-button @click="resetForm('saveAuditOpinionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加入库单"
      :visible.sync="inStorageDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="inStorageForm" :rules="rules" :model="inStorageForm" label-width="80px" v-loading="inStorageLoading" :element-loading-text="loadingText">
        <el-form-item label="产品编号" prop="productNumber">
          <el-input clearable v-model="inStorageForm.productNumber" style="width: 93%; float: left;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item  label="产品组合" prop="produceType">
          <el-select v-model="inStorageForm.produceType" placeholder="请选择产品组合" filterable>
            <el-option v-for="item in produceTypeOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位" prop="storageLocationCode">
          <el-input clearable v-model="inStorageForm.storageLocationCode" style="width: 93%; float: left;" :disabled="true">
            <el-button slot="append" code="add" @click="seeLocation">+</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="入库原因" prop="reason">
          <el-input clearable v-model="inStorageForm.reason" style="width: 93%; float: left;"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('inStorageForm')">提交</el-button>
          <el-button @click="resetForm('inStorageForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--添加库位管理时打开的对话框-->
    <el-dialog
      title="库位管理"
      :visible.sync="locationManageVisibleAdd"
      width="50%"
      height="80%"
      :before-close="handleClose">
      <storage-value :storage.sync="inStorageForm" :departmentId="inStorageForm.departmentId"
                     @closeSupplier="closeLocationAdd"></storage-value>
    </el-dialog>

    <el-table
      :data="returnRecordList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="淘宝订单编号" width="150px">
        <template slot-scope="scope">
          {{scope.row.taoBaoOrderNumber}}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="200px">
        <template slot-scope="scope">
          {{scope.row.orderNumber}}
        </template>
      </el-table-column>
      <el-table-column label="产品编号" width="200px">
        <template slot-scope="scope">
          {{scope.row.productNumber}}
        </template>
      </el-table-column>
      <el-table-column label="退货快递公司" width="120px">
        <template slot-scope="scope">
          {{scope.row.expressCompany}}
        </template>
      </el-table-column>
      <el-table-column label="退货快递单号" width="120px">
        <template slot-scope="scope">
          {{scope.row.expressNo}}
        </template>
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="scope">
          {{scope.row.brand}}
        </template>
      </el-table-column>
      <el-table-column label="买家信息">
        <template slot-scope="scope">
          {{scope.row.buyerName}}
        </template>
      </el-table-column>
      <el-table-column label="订单内容">
        <template slot-scope="scope">
          <!--{{scope.row.orderContent}}-->
          <el-popover v-if="!!scope.row.orderContent"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.orderContent"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="退换货原因" width="100px">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.returnReason"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.returnReason"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核意见">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.opinion"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.opinion"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="退货状态" width="150px">
        <template slot-scope="scope">
          {{scope.row.returnStatus}}
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
            content="修改退换货信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditReturn(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除信息">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeReturn(scope.row.id)"></el-button>
          </el-popover>
          <el-popover  v-if="scope.row.returnStatus === '主任已审核'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认可入库">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirmInStorage" icon="el-icons-jd-ruku" @click="confirmInStorage(scope.row)"></el-button>
          </el-popover>
          <!--<el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认维修">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirmRepair" icon="el-icons-jd-weixiu" @click="confirmRepair(scope.row.id)"></el-button>
          </el-popover>-->
          <el-popover v-if="scope.row.returnStatus === '客服已保存'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="确认收货">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="confirmReceive" icon="el-icons-jd-iconddsho" @click="confirmReceive(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.returnStatus === '库管已收货'"
            placement="top-start"
            width="100"
            trigger="hover"
            content="填写审核意见">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="auditOpinion" icon="el-icons-jd-shenheyijian" @click="auditOpinion(scope.row)"></el-button>
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
  import { getInfoById, update, saveAuditOpinion, save, remove, list, confirmRecive, confirmInStorage, listExpressCodes } from '@/api/returnRecord'
  import { listProcess } from '@/api/finishedProductOutStorage'
  import { authMenuButton } from '@/utils/authMenuButton'
  import StorageValue from './storage'
  import { getSelections } from '@/api/department'
  import { save as saveInStorage } from '@/api/finishedProductInStorage'
  export default {
    name: '退换货管理',
    components: {
      Tinymce, /* 文本编辑器组件 */
      StorageValue
    },
    data() {
      return {
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
          label: '产品已入库'
        }, {
          value: '5',
          label: '产品已报废'
        }],
        statusOptions: [{
          value: 1,
          name: '维修'
        }, {
          value: 2,
          name: '入库'
        }],
        orderStatusOptions: [{
          value: null,
          label: '全部'
        }, {
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
        produceTypeOptions: [{
          value: '11101',
          name: '4座整套双层'
        }, {
          value: '11011',
          name: '7座整套双层'
        }, {
          value: '11100',
          name: '4座整套单层'
        }, {
          value: '11010',
          name: '7座整套单层'
        }, {
          value: '10001',
          name: '主驾双层'
        }, {
          value: '10000',
          name: '主驾单层'
        }, {
          value: '00001',
          name: '上层'
        }, {
          value: '01100',
          name: '副驾、后排'
        }, {
          value: '01010',
          name: '副驾、7座后排'
        }, {
          value: '01101',
          name: '上层、副驾、后排'
        }, {
          value: '01011',
          name: '上层、副驾、7座后排'
        }],
        expressCompanyCodes: [],
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        editLoading: false, // 修改按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        removeLoading: false, // 删除按钮
        confirmInStorageLoading: false, // 确认可入库
        confirmReciveLoading: false, // 确认收货
        saveAuditOpinionLoading: false, // 填写审核意见
        saveAuditOpinionFormLoading: false, // 填写审核意见对话框
        locationManageVisibleAdd: false, // 添加入库信息
        inStorageLoading: false,
        inStorageDialogVisible: false,
        returnRecordList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        dialogVisible: false,
        editDialogVisible: false,
        saveAuditOpinionDialogVisible: false,
        multipleSelection: [],
        addForm: {
          expressCompanyCode: '',
          expressNo: '',
          productNumber: '',
          returnReason: ''
        },
        editForm: {
          id: '',
          expressCompanyCode: '',
          expressNo: '',
          productNumber: '',
          returnReason: ''
        },
        searchForm: {
          productNumber: '',
          orderTime: '',
          orderStatus: '',
          returnStatus: ''
        },
        productNumber: '',
        orderTime: '',
        orderStatus: '',
        returnStatus: '',
        processOptions: [],
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
        saveAuditOpinionForm: {
          id: null,
          status: null,
          auditOpinion: null,
          productNo: null,
          orderNo: null,
          loginName: null,
          repairType: null
        },
        inStorageForm: {
          id: null,
          productNumber: '',
          reason: '',
          storageLocationCode: '',
          produceType: '',
          departmentId: null
        },
        rules: {
          expressCompanyCode: [
            { required: true, message: '请选择快递公司', trigger: 'change' }
          ],
          expressNo: [
            { required: true, message: '请输入快递单号', trigger: 'blur' }
          ],
          productNumber: [
            { required: true, message: '请输入产品编号', trigger: 'blur' }
          ],
          returnReason: [
            { required: true, message: '请输入退货原因', trigger: 'blur' }
          ],
          produceType: [
            { required: true, message: '请选择产品产品组合', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请输入入库原因', trigger: 'blur' }
          ],
          storageLocationCode: [
            { required: true, message: '请输入库位', trigger: 'blur' }
          ]
        },
        auditRules: {
          auditOpinion: [
            { required: true, message: '请输入审核意见', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择入库或维修', trigger: 'change' }
          ],
          loginName: [],
          repairType: []
        }
      }
    },
    watch: {
      returnRecordList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, null, this.pageNum, this.pageSize)
      this.fetchSelectData()
      this.getDepartmentSelections()
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(productNumber, orderTime, orderStatus, returnStatus, pageNum, pageSize) {
        this.listLoading = true
        return list(
          productNumber,
          orderTime,
          orderStatus,
          returnStatus,
          pageNum,
          pageSize
        ).then(resp => {
          this.returnRecordList = resp.data.data.rows
          this.returnRecordList.forEach((e, i) => { e['idx'] = i })
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
      getDepartmentSelections(departmentType) {
        getSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          this.inStorageForm.departmentId = this.departmentSelections[0].code
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.listLoading = true
        this.productNumber = this.searchForm.productNumber
        this.orderTime = this.searchForm.orderTime
        this.orderStatus = this.searchForm.orderStatus
        this.returnStatus = this.searchForm.returnStatus
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(
            this.productNumber,
            this.orderTime,
            this.orderStatus,
            this.returnStatus,
            this.pageNum,
            this.pageSize
          ).then((resp) => {
            this.searchLoading = false
            this.listLoading = false
          })
        }
      },
      /* 打开添加退换货对话框 */
      saveReturnRecord() {
        this.dialogVisible = true
      },
      /* 打开修改单位对话框 */
      updateReturnRecord() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editFormLoading = true
        const complaint = this.multipleSelection[0]
        this.editForm.id = complaint.id
        getInfoById(this.editForm.id).then(resp => {
          this.editForm.expressCompanyCode = resp.data.data.expressCompanyCode
          this.editForm.expressNo = resp.data.data.expressNo
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.returnReason = resp.data.data.returnReason
          this.editLoading = false
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      goEditReturn(id) {
        this.editLoading = true
        this.editFormLoading = true
        this.editForm.id = id
        getInfoById(this.editForm.id).then(resp => {
          this.editForm.expressCompanyCode = resp.data.data.expressCompanyCode
          this.editForm.expressNo = resp.data.data.expressNo
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.returnReason = resp.data.data.returnReason
          this.editLoading = false
          this.editFormLoading = false
        }).catch(e => {
          this.editLoading = false
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      changeType(status) {
        if (status === 1) {
          // 维修
          this.auditRules.loginName = [
            { required: true, message: '请选择维修工人', trigger: 'change' }
          ]
          this.auditRules.repairType = [
            { required: true, message: '请选择维修类型', trigger: 'change' }
          ]
        } else {
          this.auditRules.loginName = []
          this.auditRules.repairType = []
        }
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
        const complaint = this.multipleSelection[0]
        if (complaint.returnStatus !== '库管已收货') {
          this.$message({
            type: 'warning',
            message: '请选择退货状态为【库管已收货】的再执行此操作!'
          })
          return
        }
        this.saveAuditOpinionLoading = true
        this.saveAuditOpinionFormLoading = true
        listProcess(complaint.productNumber).then(resp => {
          this.processOptions = resp.data.data
        }).catch(e => {
          this.saveAuditOpinionLoading = false
          this.saveAuditOpinionFormLoading = false
        })
        this.saveAuditOpinionForm.productNo = complaint.productNumber
        this.saveAuditOpinionForm.orderNo = complaint.orderNumber
        this.saveAuditOpinionForm.id = complaint.id
        this.saveAuditOpinionLoading = false
        this.saveAuditOpinionFormLoading = false
        this.saveAuditOpinionDialogVisible = true
      },
      auditOpinion(row) {
        if (row.returnStatus !== '库管已收货') {
          this.$message({
            type: 'warning',
            message: '请选择退货状态为【库管已收货】的再执行此操作!'
          })
          return
        }
        this.saveAuditOpinionForm.id = row.id
        listProcess(row.productNumber).then(resp => {
          this.processOptions = resp.data.data
        }).catch(e => {
          this.saveAuditOpinionLoading = false
          this.saveAuditOpinionFormLoading = false
        })
        this.saveAuditOpinionForm.productNo = row.productNumber
        this.saveAuditOpinionForm.orderNo = row.orderNumber
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
                this.addForm.expressCompanyCode,
                this.addForm.expressNo,
                this.addForm.productNumber,
                this.addForm.returnReason
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
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
                this.editForm.expressCompanyCode,
                this.editForm.expressNo,
                this.editForm.productNumber,
                this.editForm.returnReason
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.editFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.editFormLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'saveAuditOpinionForm') {
              this.submitLoading = true
              this.saveAuditOpinionFormLoading = true
              this.loadingText = '正在提交......'
              saveAuditOpinion(
                this.saveAuditOpinionForm.id,
                this.saveAuditOpinionForm.status,
                this.saveAuditOpinionForm.auditOpinion,
                this.saveAuditOpinionForm.productNo,
                this.saveAuditOpinionForm.orderNo,
                this.saveAuditOpinionForm.loginName,
                this.saveAuditOpinionForm.repairType
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '审核成功!',
                  duration: 1000,
                  onClose: () => {
                    this.saveAuditOpinionForm.auditOpinion = ''
                    this.saveAuditOpinionDialogVisible = false
                    this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
                      this.submitLoading = false
                      this.saveAuditOpinionFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.saveAuditOpinionFormLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'inStorageForm') {
              this.inStorageLoading = true
              saveInStorage(
                null,
                1,
                this.inStorageForm.productNumber,
                this.inStorageForm.produceType,
                this.inStorageForm.reason,
                this.inStorageForm.storageLocationCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.inStorageLoading = false
                    this.inStorageDialogVisible = false
                  }
                })
              }).catch(e => {
                this.inStorageLoading = false
                this.inStorageDialogVisible = false
                this.loadingText = '拼命加载中......'
              })
            } else {
              console.log('error submit!!')
              return false
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
        if (this.editFormLoading === true || this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.saveAuditOpinionDialogVisible = false
          this.saveAuditOpinionForm.auditOpinion = ''
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
          this.addFormLoading = false
          this.editFormLoading = false
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 删除信息 */
      deleteComplaint() {
        if (this.multipleSelection.length < 1) {
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
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
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
      removeReturn(id) {
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
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
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
      /* 确认可入库 */
      confirmInStorageOk() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        const rows = this.multipleSelection
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].returnStatus !== '主任已审核') {
            this.$message({
              type: 'warning',
              message: '请选择退货状态为【主任已审核】的再执行此操作!'
            })
            return
          }
        }
        this.$confirm('是否确认可入库', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmInStorageLoading = true
          this.listLoading = true
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          confirmInStorage(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '确认成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
                  this.confirmInStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmInStorageLoading = false
            this.listLoading = false
          })
        })
      },
      confirmInStorage(row) {
        if (row.returnStatus !== '主任已审核') {
          this.$message({
            type: 'warning',
            message: '请选择退货状态为【主任已审核】的再执行此操作!'
          })
          return
        }
        this.$confirm('是否确认可入库', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmInStorageLoading = true
          this.listLoading = true
          confirmInStorage(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '确认成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
                  this.confirmInStorageLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.confirmInStorageLoading = false
            this.listLoading = false
          })
        })
      },
      /* 确认收货 */
      confirmReciveOk() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        const rows = this.multipleSelection
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].returnStatus !== '客服已保存') {
            this.$message({
              type: 'warning',
              message: '请选择退货状态为【客服已保存】的再执行此操作!'
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
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
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
      confirmReceive(row) {
        if (row.returnStatus !== '客服已保存') {
          this.$message({
            type: 'warning',
            message: '请选择退货状态为【客服已保存】的再执行此操作!'
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
                this.fetchData(this.productNumber, this.orderTime, this.orderStatus, this.returnStatus, this.pageNum, this.pageSize).then((resp) => {
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
      finalInStorage() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!',
            duration: 1500
          })
          return
        }
        this.inStorageForm.productNumber = this.multipleSelection[0].productNumber
        this.inStorageDialogVisible = true
      },
      /* 添加时打开库位管理 */
      seeLocation() {
        this.locationManageVisibleAdd = true
      },
      /* 关闭库位管理 */
      closeLocationAdd() {
        this.locationManageVisibleAdd = false
      }
    }
  }
</script>

<style scoped>
</style>

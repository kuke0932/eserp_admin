<template>
  <el-dialog
    title="审核出库单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="getMatchProductForm" :rules="rules" :model="getMatchProductForm" label-width="150px">
      <el-form-item label="申请人" prop="applyName" >
        <el-input clearable v-model="getMatchProductForm.applyName" style="width: 93%; float: left;" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品编码（库存）" prop="matchProductNumber">
        <el-input clearable v-model="getMatchProductForm.matchProductNumber" style="width: 93%; float: left;" disabled></el-input>
      </el-form-item>
      <el-form-item label="出库原因" prop="reason">
        <el-tooltip effect="light" :content="getMatchProductForm.reason" placement="top">
          <el-input clearable v-model="getMatchProductForm.reason" style="width: 93%; float: left;" disabled></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="产品属性" prop="matchProductContent">
        <el-tooltip effect="light" :content="getMatchProductForm.matchProductContent" placement="top">
          <el-input clearable v-model="getMatchProductForm.matchProductContent" style="width: 93%; float: left;" disabled></el-input>
        </el-tooltip>
      </el-form-item>
      <el-row style="border-bottom: 0;">
        <el-form-item label="类型" prop="statusOptions" style="float: left;margin-right: 2px;">
          <el-select v-model="getMatchProductForm.statusOptions" placeholder="请选择是重组还是维修" @change="changeType" clearable filterable>
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0px" prop="statusDetail" style="float: left;margin-right: 2px;"
                      v-show="getMatchProductForm.statusOptions === 3">
          <el-select v-model="getMatchProductForm.statusDetail" placeholder="请选择维修类型" clearable filterable>
            <el-option v-for="item in repairTypeOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
       <!-- <el-form-item label-width="0px" prop="statusDetail" style="float: left;margin-right: 2px;"
                      v-show="getMatchProductForm.statusOptions === 3">
          <el-select v-model="getMatchProductForm.produceType" placeholder="请选择生产类型" clearable filterable>
            <el-option v-for="item in productTypeOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
      </el-row>
      <el-row style="border-bottom: 0;" v-if="getMatchProductForm.statusOptions === 3">
        <el-form-item label="维修工人" prop="loginName" style="float: left;margin-right: 2px;">
          <el-select v-model="getMatchProductForm.loginName" placeholder="请选择维修工人" clearable filterable>
            <el-option v-for="item in processOptions"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-form-item class="btn_box">
        <el-button type="primary" @click="submit('getMatchProductForm')">确认</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import { getMatchProduct, auditNormal, listProcess } from '@/api/finishedProductOutStorage'
  // import { listEnableWorker } from '@/api/worker'

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      applyFormId: {
        type: Number
      },
      productNo: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        matchCount: 1,
        statusDetail: [],
        statusOptions: [{
          value: 4,
          name: '重组'
        }, {
          value: 3,
          name: '维修'
        }],
        /* productTypeOptions: [{
          value: 0,
          name: '全部生产'
        }, {
          value: 1,
          name: '生产上层'
        }, {
          value: 2,
          name: '生产下层'
        }, {
          value: 4,
          name: '生产副驾驶生产后排'
        }, {
          value: 8,
          name: '生产上层生产副驾驶生产后排'
        }],*/
        repairTypeOptions: [{
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
        processOptions: [],
        getMatchProductForm: {
          applyFormId: '',
          applyName: '',
          matchProductNumber: '',
          reason: '',
          matchProductContent: '',
          productContent: '',
          statusOptions: '',
          statusDetail: '',
          produceType: '',
          productNumber: '',
          loginName: ''
        },
        applyNameList: null,
        storageVisible: false,
        rules: {
          applyName: [
            { required: true, message: '请选择申请人', trigger: 'change' }
          ],
          matchProductNumber: [
            { required: true, message: '请填写产品编号', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请填写出库原因', trigger: 'blur' }
          ],
          matchProductContent: [
            { required: true, message: '请填写产品属性', trigger: 'blur' }
          ],
          productContent: [
            { required: true, message: '请填写订单产品属性', trigger: 'blur' }
          ],
          statusOptions: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          statusDetail: [],
          produceType: [],
          loginName: []
        }
      }
    },
    computed: {
      _visible: {
        get: function() {
          return this.visible
        },
        set: function(val) {
        }
      }
    },
    mounted() {
      /* listEnableWorker().then(resp => {
        this.applyNameList = resp.data.data
      })*/
    },
    watch: {
      productNo(val) {
        getMatchProduct(val, this.applyFormId).then(resp => {
          this.getMatchProductForm.matchProductNumber = resp.data.data.matchProductNumber
          this.getMatchProductForm.matchProductContent = resp.data.data.matchProductContent
          this.getMatchProductForm.productContent = resp.data.data.productContent
          // 非库存编码
          this.getMatchProductForm.productNumber = resp.data.data.productNumber
          this.getMatchProductForm.reason = resp.data.data.cause
          this.getMatchProductForm.applyName = resp.data.data.name
        })
        listProcess(val).then(resp => {
          this.processOptions = resp.data.data
        })
      },
      applyFormId() {
        this.getMatchProductForm.applyFormId = this.applyFormId
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch((e) => {
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 选择是重组还是维修 */
      changeType(status) {
        if (status === 4) {
          // 重组
          this.rules.loginName = []
        } else if (status === 3) {
          // 维修
          this.rules.loginName = [
            { required: true, message: '请选择维修工人', trigger: 'change' }
          ]
          this.rules.statusDetail = [
            { required: true, message: '请选择维修类型', trigger: 'change' }
          ]
          this.rules.produceType = [
            { required: true, message: '请选择生产类型', trigger: 'change' }
          ]
        } else {
          this.rules.statusDetail = []
          this.rules.produceType = []
          this.rules.loginName = []
        }
      },
      /* 确认 */
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 调auditForm接口
            if (this.getMatchProductForm.statusOptions === 3) {
              auditNormal(
                this.getMatchProductForm.applyFormId,
                null,
                this.getMatchProductForm.matchProductNumber,
                null,
                this.getMatchProductForm.statusDetail,
                this.getMatchProductForm.statusOptions,
                this.getMatchProductForm.loginName
              ).then(resp => {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('fetchData')
                    this.$refs[formName].resetFields()
                    this.$emit('update:visible', false)
                  }
                })
              })
            } else {
              auditNormal(
                this.getMatchProductForm.applyFormId,
                null,
                this.getMatchProductForm.matchProductNumber,
                null,
                null,
                this.getMatchProductForm.statusOptions
              ).then(resp => {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('fetchData')
                    this.$refs[formName].resetFields()
                    this.$emit('update:visible', false)
                  }
                })
              })
            }
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
</style>

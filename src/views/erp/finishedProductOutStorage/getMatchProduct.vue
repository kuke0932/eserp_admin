<template>
  <el-dialog
    title="审核出库单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="getMatchProductForm" :rules="rules" :model="getMatchProductForm" label-width="150px">
      <el-form-item label="申请人" prop="applyName" >
        <!--<el-select v-model="getMatchProductForm.applyName" placeholder="请选择申请人" clearable>
          <el-option v-for="item in applyNameList" :key="item.id" :label="item.userName" :value="item.userName">
          </el-option>
        </el-select>-->
        <el-input clearable v-model="getMatchProductForm.applyName" style="width: 93%; float: left;" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品编码(库存)" prop="matchProductNumber">
        <el-input clearable v-model="getMatchProductForm.matchProductNumber" style="width: 93%; float: left;" disabled></el-input>
      </el-form-item>
      <el-form-item label="出库原因" prop="reason">
        <el-tooltip effect="light" :content="getMatchProductForm.reason" placement="top">
          <el-input clearable v-model="getMatchProductForm.reason" style="width: 93%; float: left;" disabled></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="产品属性(库存)" prop="matchProductContent">
        <el-tooltip effect="light" :content="getMatchProductForm.matchProductContent" placement="top">
          <el-input clearable v-model="getMatchProductForm.matchProductContent" style="width: 93%; float: left;" disabled></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="订单产品属性" prop="productContent">
        <el-tooltip effect="light" :content="getMatchProductForm.productContent" placement="top">
          <el-input clearable v-model="getMatchProductForm.productContent" style="width: 93%; float: left;" disabled></el-input>
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
            <el-option v-for="item in statusDetail"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- -->
       <el-form-item :label-width="getMatchProductForm.statusOptions === 3 ? '150px' : '0px'" prop="produceType" style="float: left;margin-right: 2px;margin-top: -2px;"
                     v-show="getMatchProductForm.statusOptions === 3 || getMatchProductForm.statusOptions === 4">
         <el-input clearable v-model="getMatchProductForm.produceType" placeholder="请选择生产类型">
         <el-button type="primary" slot="append" @mouseover.native="sketchMapVisible = true" @mouseleave.native="mouseleave" icon="el-icons-jd-wenhao"></el-button>
         </el-input>
         <div class="divSketchMap" v-if="sketchMapVisible" >
         <sketch-map :produce-type.sync="getMatchProductForm.produceType" @mouseover.native="enterSketchMap" @mouseleave.native="leaveSketchMap" :readonly="false"></sketch-map>
         </div>
       </el-form-item>
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
        <el-button type="primary" @click="useTheProduct('getMatchProductForm')">使用该产品</el-button>
        <el-button type="primary" @click="noUseTheProduct('getMatchProductForm')">不使用该产品</el-button>
        <el-button type="primary" @click="noMatch('getMatchProductForm')">不匹配库存</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import { getMatchProduct, audit, resetMatch, listProcess, giveUpMatch } from '@/api/finishedProductOutStorage'
  import SketchMap from '@/components/SketchMap'
  import _ from 'lodash'
  // import { listEnableWorker } from '@/api/worker'

  export default {
    components: {
      SketchMap
    },
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
        }, {
          value: 5,
          name: '不生产'
        }],
        produceTypeOptions: [{
          value: '11101',
          name: '5座整套双层'
        }, {
          value: '11100',
          name: '5座整套单层'
        }, {
          value: '11011',
          name: '7座整套双层'
        }, {
          value: '11010',
          name: '7座整套双层'
        }, {
          value: '10001',
          name: '主驾双层'
        }, {
          value: '11001',
          name: '主驾、副驾双层'
        }, {
          value: '10101',
          name: '5座主驾、后排双层'
        }, {
          value: '01001',
          name: '副驾双层'
        }, {
          value: '01101',
          name: '5座副驾、后排双层'
        }, {
          value: '00101',
          name: '5座后排双层'
        }, {
          value: '10001',
          name: '主驾单层'
        }, {
          value: '11000',
          name: '主驾、副驾单层'
        }, {
          value: '10100',
          name: '5座主驾、后排单层'
        }, {
          value: '01000',
          name: '副驾单层'
        }, {
          value: '01100',
          name: '5座副驾、后排单层'
        }, {
          value: '00100',
          name: '5座后排单层'
        }, {
          value: '10011',
          name: '7座主驾、后排双层'
        }, {
          value: '01011',
          name: '7座副驾、后排双层'
        }, {
          value: '00011',
          name: '7座后排双层'
        }, {
          value: '10010',
          name: '7座主驾、后排单层'
        }, {
          value: '01010',
          name: '7座副驾、后排单层'
        }, {
          value: '00010',
          name: '7座后排单层'
        }],
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
          productNumber: '',
          loginName: '',
          produceType: ''
        },
        applyNameList: null,
        storageVisible: false,
        sketchMapVisible: false,
        isEnterSketchMap: false,
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
      mouseleave: _.debounce(function() {
        if (!this.isEnterSketchMap) {
          this.sketchMapVisible = false
        }
      }, 500),
      enterSketchMap() {
        this.sketchMapVisible = true
        this.isEnterSketchMap = true
      },
      leaveSketchMap() {
        console.log('离开sketchMap了')
        this.sketchMapVisible = false
        this.isEnterSketchMap = false
      },
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
          this.statusDetail = this.produceTypeOptions
          this.rules.loginName = []
          this.rules.produceType = [
            { required: true, message: '请选择生产类型', trigger: 'change' }
          ]
        } else if (status === 3) {
          // 维修
          this.statusDetail = this.repairTypeOptions
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
      /* 使用该产品 */
      useTheProduct(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 调audit接口
            if (this.getMatchProductForm.statusOptions === 3) {
              audit(
                this.getMatchProductForm.applyFormId,
                null,
                this.getMatchProductForm.matchProductNumber,
                this.getMatchProductForm.produceType,
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
              audit(
                this.getMatchProductForm.applyFormId,
                null,
                this.getMatchProductForm.matchProductNumber,
                this.getMatchProductForm.statusDetail,
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
      /* 不使用该产品 */
      noUseTheProduct(formName) {
        this.matchCount = this.matchCount + 1
        this.$confirm('确认不使用该产品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调resetMatch接口
          resetMatch(
            this.getMatchProductForm.matchProductNumber,
            this.matchCount,
            this.applyFormId
          ).then(resp => {
            this.$message({
              type: 'success',
              message: '重新匹配成功!',
              duration: 1000,
              onClose: () => {
                this.$emit('fetchData')
                this.$refs[formName].resetFields()
                this.$emit('update:visible', false)
              }
            })
          })
        })
      },
      /* 不匹配库存 */
      noMatch(formName) {
        giveUpMatch(this.getMatchProductForm.productNumber, this.getMatchProductForm.matchProductNumber, this.applyFormId).then(res => {
          this.$message({
            type: 'success',
            message: '放弃使用库存匹配!',
            duration: 1000,
            onClose: () => {
              this.$emit('fetchData')
              this.$refs[formName].resetFields()
              this.$emit('update:visible', false)
            }
          })
        })
        // 接口没有呢
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
  .divSketchMap{
    display: block;
    position: absolute;
    right: -291px;
    top: -100px;
    background: rgb(255, 255, 255);
    z-index: 20000;
  }
</style>

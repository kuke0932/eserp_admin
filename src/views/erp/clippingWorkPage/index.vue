<template>
  <div class="container">
    <el-form ref="clipForm" class="clipForm" :inline="true" :model="clipForm">
      <el-row style="padding-top: 20px;border-bottom: none;">
          <el-form-item label-width="150px" prop="expressOrProductNo">
            <el-input clearable v-model="clipForm.expressOrProductNo" style="min-width: 70px;width: 300px;" placeholder="请扫描快递单号或者产品二维码" @keyup.enter.native="goScanFinish"></el-input>
          </el-form-item>
          <el-form-item label-width="100px" prop="rawMaterialNo">
            <el-input clearable v-model="clipForm.rawMaterialNo" style="min-width: 70px;width: 300px;"  placeholder="请扫描原材料二维码" @keyup.enter.native="goYCLFinish"></el-input>
          </el-form-item>
      </el-row>
    </el-form>

    <el-row :gutter="20" class="rowHide" v-bind:class="{ rowShow: isFinish, rowHide: !isFinish }"
            v-loading="scanOverLoading">
      <el-col style="width: 334px; float: left; margin-bottom: 10px;">
        <div class="btn_box">
          <el-button class="el-button--primary" code="" @click="goClipping">开始裁剪</el-button>
          <el-button class="el-button--primary" code="" @click="goEndClipping">确认完成</el-button>
        </div>

        <div class="grid-content bg-purple detail">
          <span>订单编号：</span>{{this.orderNo}}<br />
          <span>产品编号：</span>{{this.productNo}}<br />
          <span>快递订单号：</span>{{this.expressNo}}<br />
         <!-- <span>订单内容：</span>{{this.orderContent}}<br />-->
          <span>产品属性：</span>{{this.productContent}}<br />
          <span>库存产品属性：</span>{{this.storageProductContent}}<br />
          <span>备注：</span>{{this.remark}}<br />
        </div>

      </el-col>
      <el-col style="width: 200px; float: left;margin-bottom: 10px;">
        <SketchMap :produceType="produceType" :readonly="readonly" ></SketchMap>
      </el-col>
    </el-row>
    <!--<SketchMap :produceType.sync="produceType" :readonly="readonly" ></SketchMap>-->
    <!--<button @click="btnClick">提交</button>-->
  </div>
</template>

<script>
  import { getOrderByScan, getLayerByMaterialId, startTailor, endTailor } from '@/api/clippingWorkPage'
  import { getToken } from '@/utils/auth'
  import SketchMap from '@/components/SketchMap'
  export default {
    name: '',
    components: {
      SketchMap
    },
    data() {
      return {
        isFinish: false,
        errorDialog: false,
        ids: '',
        listLoading: false, // table
        btnScanOverLoading: false, // 扫码完成按钮
        scanOverLoading: false, // 扫码完成出来的
        orderList: null,
        clipForm: {
          expressOrProductNo: '',
          rawMaterialNo: ''
        },
        orderNo: '',
        productNo: '',
        expressNo: '',
        orderContent: '',
        productContent: '',
        layer: '',
        storageProductContent: '',
        remark: '',
        returnId: null,
        carModelUrl: null,
        produceType: '31111',
        readonly: false
      }
    },
    methods: {
      goScanFinish() {
        // 判断是否包含? ，取出productNo
        if (!/^\d+$/.test(this.clipForm.expressOrProductNo) && this.clipForm.expressOrProductNo.indexOf('?') < 0) {
          new Audio(
            'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=扫码失败，请重新扫码'
          ).play()
          this.$alert('请切换当前输入法为英文输入法！', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if (this.clipForm.expressOrProductNo.indexOf('?') >= 0) {
          this.clipForm.expressOrProductNo = this.getQueryVariable(this.clipForm.expressOrProductNo.split('?')[1], 'productNo')
        }
        this.btnScanOverLoading = true
        this.scanOverLoading = true
        getOrderByScan(this.clipForm.expressOrProductNo).then(resp => {
          console.log(resp)
          this.isFinish = true
          this.orderNo = resp.data.data.orderNo
          this.productNo = resp.data.data.productNo
          this.expressNo = resp.data.data.expressNo
          this.orderContent = resp.data.data.orderContent
          this.productContent = resp.data.data.productContent
          this.produceType = resp.data.data.produceType
          this.productContent = this.productContent.split('_')[0] + '_' + this.produceType + this.productContent.split('_')[1].substring(5)
          this.storageProductContent = resp.data.data.storageProductContent
          this.remark = resp.data.data.remark
          this.returnId = resp.data.data.productWorkerProcessId
          this.carModelUrl = resp.data.data.carModelUrl
          this.btnScanOverLoading = false
          this.scanOverLoading = false
          // this.produceType = resp.data.data.produceType
          new Audio(
            'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=扫码成功'
          ).play()
        }).catch(e => {
          this.isFinish = false
          new Audio(
            'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=扫码失败，请重新扫码！'
          ).play()
          this.btnScanOverLoading = false
          this.scanOverLoading = false
          this.$alert(e.response.data.message || e.message, '提示', {
            confirmButtonText: '确定'
          })
        })
      },
      goYCLFinish() {
        const mArray = this.clipForm.rawMaterialNo.replace('，', ',').split(',')
        getLayerByMaterialId(this.productNo, mArray[0]).then(resp => {
          this.carModelUrl = resp.data.data.carModelUrl
          this.layer = resp.data.data.carModelUrl
          new Audio(
            'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=扫码成功'
          ).play()
        }).catch(e => {
          new Audio(
            'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=扫码失败，请重新扫码！'
          ).play()
          this.$alert(e.response.data.message || e.message, '提示', {
            confirmButtonText: '确定'
          })
        })
      },
      goClipping() {
        if (this.clipForm.rawMaterialNo.length === 0) {
          this.$message({
            type: 'warning',
            message: '请扫描原材料二维码!'
          })
        } else {
          if (this.carModelUrl) {
            const mArray = this.clipForm.rawMaterialNo.replace('，', ',').split(',')
            startTailor(this.orderNo, this.productNo, mArray[0]).then(resp => {
              if (resp.data.status === 260) {
                this.$alert('订单已变更，请核对订单信息！', '警告！', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              } else {
                document.getElementById('iframe').src = process.env.BASE_FILE_SERVER + '/file/carModel/downloadCarModel?url=' + this.carModelUrl + '&x=' + getToken()
                this.returnId = resp.data.data
                this.$message({
                  type: 'success',
                  message: '开始成功!',
                  duration: 1000
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '尚无该车型的版型文件，请联系技术部门上传'
            })
          }
        }
      },
      goEndClipping() {
        if (!this.returnId) {
          this.$message({
            type: 'warning',
            message: '产品尚未裁剪，请先开始裁剪！',
            duration: 1500
          })
          return
        }
        endTailor(this.orderNo, this.productNo, this.returnId).then(resp => {
          this.$message({ type: 'success',
            message: '操作成功!',
            duration: 1000
          })
        })
      },
      btnClick() {
        console.log(this.produceType)
      }
    }
  }
</script>

<style scoped>
  .detail{
    font-size: 14px;
    line-height: 24px;
    color: #606266;
  }
  .detail span{
    font-weight: bold;
  }

  .rowHide{
    display: none;
  }
  .rowShow{
    display: block;
  }
</style>

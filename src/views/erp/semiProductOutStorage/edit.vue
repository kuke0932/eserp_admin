<template>
  <el-dialog
    title="修改出库单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
             v-loading="editFormLoading"
             :element-loading-text="loadingText">
      <el-form-item label="申请人" prop="applyName">
        <el-select v-model="editForm.applyName" placeholder="请选择申请人" clearable filterable>
          <el-option v-for="item in applyNameList" :key="item.id" :label="item.userName" :value="item.loginName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input clearable v-model="editForm.materialCode" style="width: 93%; float: left;" :disabled="true">
          <el-button slot="append" code="add" @click="seeMaterial">+</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName" >
        <el-input clearable v-model="editForm.materialName" style="width: 93%; float: left;" :disabled="true"> </el-input>
      </el-form-item>
      <el-form-item label="规格" prop="materialSpecification">
        <el-input clearable v-model="editForm.materialSpecification" style="width: 93%; float: left;" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unitName">
        <el-input clearable v-model="editForm.unitName" style="width: 93%; float: left;"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="materialAmount">
        <el-input clearable v-model="editForm.materialAmount" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item label="库位" prop="storageLocationCode">
        <el-input clearable v-model="editForm.storageLocationCode" style="width: 93%; float: left;"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="出库原因" prop="reason">
        <el-input clearable v-model="editForm.reason" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
      </el-form-item>
    </el-form>
    <!--物料组件-->
    <material-value :visible.sync="materialVisible" :department-id="departmentId" :areaType="areaType"
                    :materialType="materialType" @closeMaterial="closeMaterial"></material-value>

  </el-dialog>
</template>

<script>
  import { getInfoById, update } from '@/api/semiProductOutStorage'
  import { listEnableWorker } from '@/api/worker'
  import MaterialValue from './materialCode' /* 通过组件形式引出物料管理 */

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      id: {
        type: Number
      },
      materialType: {
        type: Number,
        required: true
      },
      areaType: {
        type: Number,
        required: true
      },
      departmentId: {
        type: String,
        required: true
      }
    },
    components: {
      MaterialValue
    },
    data() {
      return {
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        editForm: {
          applyName: '',
          materialId: '',
          materialCode: '',
          materialName: '',
          specificationValue: '',
          unitName: '',
          materialAmount: '',
          storageLocationCode: '',
          reason: '',
          id: ''
        },
        applyNameList: null,
        materialVisible: false,
        rules: {
          materialCode: [
            { required: true, message: '请填写物料编码', trigger: 'blur' }
          ],
          materialName: [
            { required: true, message: '请填写物料名称', trigger: 'blur' }
          ],
          materialSpecification: [
            { required: true, message: '请填写规格', trigger: 'blur' }
          ],
          unitName: [
            { required: true, message: '请填写单位', trigger: 'blur' }
          ],
          materialAmount: [
            { required: true, message: '请填写数量', trigger: 'blur' }
          ],
          storageLocationCode: [
            { required: true, message: '请选择库位', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请填写出库原因', trigger: 'blur' }
          ]
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
      listEnableWorker().then(resp => {
        this.applyNameList = resp.data.data
      })
    },
    watch: {
      id() {
        this.editFormLoading = true
        getInfoById(this.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.applyName = resp.data.data.applyName
          this.editForm.materialId = resp.data.data.materialId
          this.editForm.materialCode = resp.data.data.materialCode
          this.editForm.materialName = resp.data.data.materialName
          this.editForm.materialSpecification = resp.data.data.materialSpecification
          this.editForm.unitName = resp.data.data.unitName
          this.editForm.materialAmount = resp.data.data.materialAmount
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.reason = resp.data.data.reason
          this.editFormLoading = false
        })
        // this.init()
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
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
        }).catch((e) => {
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'editForm') {
              this.submitLoading = true
              this.editFormLoading = true
              this.loadingText = '正在提交......'
              update(
                this.editForm.applyName,
                this.editForm.id,
                this.editForm.materialAmount,
                this.editForm.materialId,
                this.editForm.reason,
                this.editForm.storageLocationCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('fetchData')
                    this.submitLoading = false
                    this.editFormLoading = false
                    this.loadingText = '拼命加载中......'
                    this.close()
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.editFormLoading = false
                this.loadingText = '拼命加载中......'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      seeMaterial() {
        this.materialVisible = true
      },
      closeMaterial(data) {
        this.materialVisible = false
        this.editForm.materialId = data.materialId
        this.editForm.materialCode = data.materialCode
        this.editForm.materialName = data.materialName
        this.editForm.materialSpecification = data.specificationValue
        this.editForm.unitName = data.unitName
        this.editForm.storageLocationCode = data.storageLocationCode
      }
    }
  }
</script>

<style scoped>
  img{
    width:20px;
    height: 20px;
  }
  .supplier{
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    text-align: center;
    font-size: 24px;
    border-radius: 50%;
    float: left;
    padding: 0;
    margin-left: 2%;
  }
</style>

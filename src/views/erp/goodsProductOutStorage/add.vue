<template>
  <el-dialog
    title="添加出库单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="addForm"
             :rules="rules"
             :model="addForm"
             label-width="80px"
             v-loading="addFormLoading"
             :element-loading-text="loadingText">
      <el-form-item label="申请人" prop="applyName">
        <el-select v-model="addForm.applyName" placeholder="请选择申请人" clearable filterable>
          <el-option v-for="item in applyNameList" :key="item.id" :label="item.userName" :value="item.loginName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input clearable v-model="addForm.materialCode" style="width: 93%; float: left;" :disabled="true">
          <el-button slot="append" code="add" @click="seeMaterial">+</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName" >
        <el-input clearable v-model="addForm.materialName" style="width: 93%; float: left;" :disabled="true"> </el-input>
      </el-form-item>
      <el-form-item label="规格" prop="specificationValue">
        <el-input clearable v-model="addForm.specificationValue" style="width: 93%; float: left;" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unitName">
        <el-input clearable v-model="addForm.unitName" style="width: 93%; float: left;"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="materialAmount">
        <el-input clearable v-model="addForm.materialAmount" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item label="库位" prop="storageLocationCode">
        <el-input clearable v-model="addForm.storageLocationCode" style="width: 93%; float: left;"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="出库原因" prop="reason">
        <el-input clearable v-model="addForm.reason" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
        <el-button @click="resetForm('addForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--物料组件-->
    <material-value :visible.sync="materialVisible" :departmentId="departmentId" :areaType="areaType"
                    :materialType="materialType" @closeMaterial="closeMaterial"></material-value>

  </el-dialog>
</template>

<script>
  import { save } from '@/api/semiProductOutStorage'
  import { listEnableWorker } from '@/api/worker'
  import MaterialValue from './materialCode' /* 通过组件形式引出物料管理 */
  import { setAreaType } from '@/utils/areaTypeManage'

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
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
        addForm: {
          applyName: '',
          supplierId: null,
          materialId: '',
          materialCode: '',
          materialName: '',
          specificationValue: '',
          unitName: '',
          materialAmount: '',
          storageLocationCode: '',
          reason: ''
        },
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        addFormLoading: false, // 添加对话框
        applyNameList: null,
        materialVisible: false,
        rules: {
          applyName: [
            { required: true, message: '请选择申请人' }
          ],
          materialCode: [
            { required: true, message: '请填写物料编码', trigger: 'blur' }
          ],
          materialName: [
            { required: true, message: '请填写物料名称', trigger: 'blur' }
          ],
          specificationValue: [
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
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
      handleClose(done) {
        if (this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['addForm'].resetFields()
          done()
        }).catch((e) => {
          // console.log(e)
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              setAreaType(this.$route.query.areaType)
              this.submitLoading = true
              this.addFormLoading = true
              this.loadingText = '正在提交......'
              save(
                this.addForm.applyName,
                this.addForm.materialAmount,
                this.addForm.materialId,
                this.addForm.reason,
                this.addForm.storageLocationCode,
                this.addForm.supplierId
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$refs[formName].resetFields()
                    this.close()
                    this.$emit('fetchData')
                    this.addFormLoading = false
                    this.submitLoading = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addFormLoading = false
                this.submitLoading = false
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
      seeMaterial() {
        this.materialVisible = true
      },
      closeMaterial(data) {
        this.materialVisible = false
        this.addForm.materialId = data.materialId
        this.addForm.materialCode = data.materialCode
        this.addForm.materialName = data.materialName
        this.addForm.specificationValue = data.specificationValue
        this.addForm.unitName = data.unitName
        this.addForm.storageLocationCode = data.storageLocationCode
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

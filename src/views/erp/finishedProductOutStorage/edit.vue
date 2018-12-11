<template>
  <el-dialog
    title="修改出库单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="editForm"
             :rules="rules"
             :model="editForm"
             label-width="80px"
             v-loading="editFormLoading"
             :element-loading-text="loadingText">
      <el-form-item label="产品编号" prop="productNumber">
        <el-input clearable v-model="editForm.productNumber" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item label="库位" prop="storageLocationCode">
        <el-input clearable v-model="editForm.storageLocationCode" style="width: 93%; float: left;" :disabled="true">
          <el-button slot="append" code="add" @click="seeStorage">+</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="出库原因" prop="reason">
        <el-input clearable v-model="editForm.reason" style="width: 93%; float: left;"></el-input>
      </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--库位组件-->
    <storage :visible.sync="storageVisible" :departmentId="departmentId" @closeStorage="closeStorage"></storage>

  </el-dialog>
</template>

<script>
  import { getInfoById, update } from '@/api/finishedProductOutStorage'
  import storage from './storage' /* 通过组件形式引出物料管理 */

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      id: {
        type: Number
      },
      departmentId: {
        type: String,
        required: true
      }
    },
    components: {
      storage
    },
    data() {
      return {
        editForm: {
          id: '',
          productNumber: '',
          storageLocationCode: '',
          reason: ''
        },
        storageVisible: false,
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        rules: {
          supplierName: [
            { required: true, message: '请选择申请人' }
          ],
          productNumber: [
            { required: true, message: '请填写产品编号', trigger: 'blur' }
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
    watch: {
      id() {
        this.editFormLoading = true
        getInfoById(this.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productNumber = resp.data.data.productNumber
          this.editForm.storageLocationCode = resp.data.data.storageLocationCode
          this.editForm.reason = resp.data.data.reason
          this.editFormLoading = false
        })
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
          this.$refs['editForm'].resetFields()
          this.editFormLoading = false
          this.listloading = false
          this.loadingText = '正在加载中'
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
            if (formName === 'editForm') {
              this.submitLoading = true
              this.editFormLoading = true
              this.listloading = true
              this.loadingText = '正在提交中'
              update(
                this.editForm.id,
                this.editForm.productNumber,
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
                    this.listLoading = false
                    this.close()
                  }
                })
              }).catch(e => {
                this.listLoading = false
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
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      seeStorage() {
        this.storageVisible = true
      },
      closeStorage(data) {
        this.storageVisible = false
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

<template>
  <el-dialog
    title="添加采购单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="addForm" :rules="rules"  :model="addForm">
      <el-form-item  v-for="(v, i) in addFormList" :key="i"
                     v-loading="addFormLoading"
                     :element-loading-text="loadingText">
        <el-input clearable prop="materialName" style="width: 200px;" v-model="addFormList[i].name" placeholder="点击选择物料" @focus="showDialogTxt(i)"></el-input>
        <el-input clearable prop="specificationValue" style="width: 100px;margin-left: 10px;margin-right: 10px;" v-model="addFormList[i].specificationValue" placeholder="规格型号" :disabled="true"></el-input>
        *
        <el-input clearable prop="amount" style="width: 80px;margin-left: 10px;" v-model="addFormList[i].amount"></el-input>
        <el-button class="el-button--primary" v-show="i===0" style="margin-left: 40px;" code="addMaterial" @click="dialogAddMaterial"><i class="el-icons-jd-xiugai1"></i>&nbsp;添加</el-button>
        <el-button class="el-button--primary" v-show="i!==0" style="margin-left: 40px;" code="remove" @click="dialogDeleteMaterial(i)"><i class="el-icons-jd-shanchu"></i>&nbsp;删除</el-button>
      </el-form-item>

      <el-form-item class="btn_box">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
        <el-button @click="resetForm('addForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!--物料组件-->
    <material :visible.sync="materialDialogVisible" :departmentId="departmentId" @closeMaterial="closeMaterial"></material>
  </el-dialog>
</template>

<script>
  import { save } from '@/api/materialApply'
  import Material from './materialManagement'

  export default {
    components: {
      Material
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      departmentId: {
        type: String,
        required: true
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
    data() {
      return {
        addFormLoading: false, // 添加对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        materialDialogVisible: false,
        dialogDeleteMaterialIndex: 0,
        addForm: {},
        addFormList: [
          { materialId: null, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 }
        ],
        materialList: [],
        rules: {
          materialName: [
            { required: true, message: '请选择物料', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ]
        }
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
          this.$refs['addForm'].resetFields()
          done()
        }).catch((e) => {
          // console.log(e)
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.addFormList = [
          { materialId: 0, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 }
        ]
        this.$refs[formName].resetFields()
      },
      /* 提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            this.addFormLoading = true
            this.loadingText = '正在提交......'
            if (formName === 'addForm') {
              this.addFormList.forEach(v => {
                const material = {
                  amount: v.amount,
                  materialId: v.materialId,
                  price: v.price,
                  unitCode: v.unitCode
                }
                this.materialList.push(material)
              })
              save(this.materialList).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('fetchData')
                    this.$refs[formName].resetFields()
                    this.$emit('update:visible', false)
                    this.submitLoading = false
                    this.addFormLoading = false
                    this.loadingText = '正在提交......'
                  }
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
        this.addFormList.name = ''
      },
      // 添加物料
      dialogAddMaterial() {
        this.addFormList.push({ materialId: 0, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 })
      },
      // 删除物料
      dialogDeleteMaterial(i) {
        this.dialogDeleteMaterialIndex = i
        this.addFormList.splice(this.dialogDeleteMaterialIndex, 1)
      },
      // 打开物料详情
      showDialogTxt(i) {
        this.addFormListIndex = i
        this.materialDialogVisible = true
      },
      closeMaterial(data) {
        this.materialDialogVisible = false
        this.addFormList[this.addFormListIndex].name = data.materialName
        this.addFormList[this.addFormListIndex].specificationValue = data.specificationValue
        this.addFormList[this.addFormListIndex].materialId = data.materialId
        this.addFormList[this.addFormListIndex].unitCode = data.unitCode
        this.addFormList[this.addFormListIndex].price = data.price
      }
    }
  }
</script>
<style scoped>
</style>

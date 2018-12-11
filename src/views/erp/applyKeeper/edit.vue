<template>
  <el-dialog
    title="修改采购单"
    :visible.sync="_visible"
    width="40%"
    @close="close"
    :before-close="handleClose">
    <el-form ref="editForm" :rules="rules" :model="editForm"
             v-loading="editFormLoading"
             :element-loading-text="loadingText">
      <el-form-item v-for="(v, i) in editFormList" :key="i">
        <el-input clearable style="width: 200px;" v-model="editFormList[i].materialName" placeholder="点击选择物料" @focus="showDialogTxt(i)"></el-input>
        <el-input clearable style="width: 100px;margin-left: 10px;margin-right: 10px;" v-model="editFormList[i].specificationValue" placeholder="规格型号"></el-input>
        *
        <el-input clearable style="width: 80px;margin-left: 10px;" v-model="editFormList[i].amount"></el-input>
        <el-button class="el-button--primary" v-show="i===0" style="margin-left: 40px;" code="addMaterial" @click="dialogAddMaterial"><i class="el-icons-jd-xiugai1"></i>&nbsp;添加</el-button>
        <el-button class="el-button--primary" v-show="i!==0" style="margin-left: 40px;" code="remove" @click="dialogDeleteMaterial(i)"><i class="el-icons-jd-shanchu"></i>&nbsp;删除</el-button>
      </el-form-item>

      <el-form-item class="btn_box">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!--物料组件-->
    <material :visible.sync="materialDialogVisible" :departmentId="departmentId" @closeMaterial="closeMaterial"></material>
  </el-dialog>
</template>

<script>
  import { update, getById } from '@/api/materialApply'
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
      selectedId: {
        type: Number
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
    watch: {
      selectedId() {
        getById(this.selectedId).then(resp => {
          this.editFormList = resp.data.data
        })
      }
    },
    data() {
      return {
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        materialDialogVisible: false,
        dialogDeleteMaterialIndex: 0,
        editForm: {},
        editFormList: [
          { materialId: 0, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 }
        ],
        materialList: [],
        rules: {
          applyName: [
            { required: true, message: '请输入工序名称', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请输入工序编码', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入工序内容', trigger: 'blur' }
          ],
          duration: [
            { required: true, message: '请输入操作时长', trigger: 'blur' }
          ],
          processSort: [
            { required: true, message: '请输入顺', trigger: 'blur' }
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
          this.$refs['editForm'].resetFields()
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
        this.editFormList = [
          { materialId: 0, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 }
        ]
        this.$refs[formName].resetFields()
      },
      /* 提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            this.editFormLoading = true
            this.loadingText = '正在提交......'
            if (formName === 'editForm') {
              this.editFormList.forEach(v => {
                const material = {
                  amount: v.amount,
                  materialId: v.materialId,
                  price: v.price,
                  unitCode: v.unitCode
                }
                this.materialList.push(material)
              })
              update(
                this.selectedId,
                this.materialList
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('fetchData')
                    // this.fetchData(this.searchForm.applyName, this.searchForm.departmentId, this.searchForm.status, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                    this.submitLoading = false
                    this.editFormLoading = false
                    this.loadingText = '拼命加载中......'
                  }
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 添加物料
      dialogAddMaterial() {
        this.editFormList.push({ materialId: 0, name: '', specificationValue: '', amount: 1, unitCode: '', price: 0 })
      },
      // 删除物料
      dialogDeleteMaterial(i) {
        this.dialogDeleteMaterialIndex = i
        this.editFormList.splice(this.dialogDeleteMaterialIndex, 1)
      },
      // 打开物料详情
      showDialogTxt(i) {
        this.editFormListIndex = i
        this.materialDialogVisible = true
      },
      closeMaterial(data) {
        this.materialDialogVisible = false
        this.editFormList[this.editFormListIndex].materialName = data.materialName
      }
    }
  }
</script>
<style scoped>
</style>

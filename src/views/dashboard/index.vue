<template>
  <div class="dashboard-container">
    <div class="bgIndex">
      <!--<h4 style="margin-left: 20px;">欢迎使用电商生产管理综合系统</h4>-->
      <img width="100%" :height = "imgHeight" src="/static/images/black.jpg" alt="">
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="needChangePwd"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <input type="text" name="name" value="" style="height: 0;visibility: hidden; position: absolute;"/>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input clearable type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input clearable type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPassword">
          <el-input clearable type="password" v-model="form.checkPassword"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import ThemePicker from '@/components/ThemePicker'
  import { changePassword } from '@/api/login'

  export default {
    name: 'dashboard',
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      ThemePicker
    },
    mounted() {
      const clientHeight = document.body.clientHeight - 88
      this.imgHeight = clientHeight + 'px'
      window.onresize = () => {
        const clientHeight = document.body.clientHeight - 88
        this.imgHeight = clientHeight + 'px'
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'))
        } else {
          if (this.form.checkPassword !== '') {
            this.$refs.form.validateField('checkPassword')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        imgHeight: 0,
        needChangePwd: false,
        form: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { pattern: /^(?![^a-zA-Z]+$)(?!\D+$).{10,15}$/, message: '10-15个字符长度，必须含有英文字母和数字', trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.needChangePwd = window.sessionStorage.getItem('needChangePwd') === 'true'
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            changePassword(
              this.form.oldPassword,
              this.form.newPassword
            ).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功，请重新登录！',
                duration: 1000,
                onClose: () => {
                  this.$store.dispatch('LogOut').then(() => {
                    location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                  })
                }
              })
            })
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
  .bgIndex{
    /*width: 100%;*/
    /*height: 50%;*/
    /*margin: 10% auto;*/
    /*background: url('/static/images/red.jpg') no-repeat center center;*/
    /*background: url('/static/images/black.jpg') no-repeat center center;*/
    /*background-size: 100% 100%;*/
  }
</style>

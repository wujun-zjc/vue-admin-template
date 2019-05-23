<template>
  <div class="login-container">
    <div class="img_pig">
      <img src="/static/images/header.png" alt>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="label-container">用 &nbsp;户 &nbsp;名</span>
        <span class="svg-container">
          <svg-icon icon-class="username"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="请输入账号"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="label-container">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</span>
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>

      <el-form-item prop="number">
        <span class="label-container">公司编号</span>
        <span class="svg-container">
          <svg-icon icon-class="companyNum"/>
        </span>
        <el-input
          v-model="loginForm.number"
          name="number"
          auto-complete="on"
          placeholder="请输入公司编号"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span>password: 123456</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的公司编号'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        number: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        number: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      // 登录逻辑:
      //   1. dispatch('Login') 请求su-id并缓存  跳转 this.redirect || '/'                         login/index.vue
      //   2. dispatch('GetInfo') 拦截 请求并缓存 menus 和 user                                    src/permission.js
      //   3. dispatch('GenerateRoutes') 将 [menus] 解析成{路由}                                   store/permission.js
      //   4. router.addRoutes() 动态生成路由并完成跳转                                             src/permission.js
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              // this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(res => {
              this.loading = false
              this.$message({
                type: 'error',
                message: res.msg
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #b9b9b9;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    background: rgba(254, 254, 254, 1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url('/static/images/backstage.png') no-repeat fixed center;
  .label-container {
    position: absolute;
    left: -85px;
    height: 50px;
    line-height: 50px;
    color: #3d3d3d;
    font-size: 18px;
  }

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    top: 20%;
    width: 565px;
    height: 332px;
    max-width: 100%;
    padding: 35px 50px 15px 130px;
    margin: 120px auto;
    background: #e4e4e4;
    border-radius: 5px;
  }

  .tips {
    font-size: 14px;
    color: #3d3d3d;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .el-button {
    height: 50px;
    background: rgba(4, 83, 150, 1);
    border-radius: 6px;
    border: none;
    font-size: 20px;
    font-family: HiraginoSansGB-W3;
    font-weight: normal;
    color: rgba(245, 244, 245, 1);
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.img_pig {
  text-align: center;
  position: absolute;
  top: 22%;
  left: 0;
  right: 0;
}
</style>

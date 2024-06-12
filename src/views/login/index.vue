<template>
  <div class="login-container">
    <!-- 登录界面容器 -->
    <div class="logo" />
    <!-- 登录表单容器 -->
    <div class="form">
      <h1>登录</h1>
      <!-- 登录卡片组件 -->
      <el-card class="login-card" shadow="never">
        <!-- 登录表单 -->
        <!-- el-form > el-form-item > el-input -->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <!-- 手机号输入框 -->
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <!-- 用户协议复选框 -->
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      /* 登录表单数据 */
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      /* 登录表单验证规则 */
      loginRules: {
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度应该为6-16位之间',
          trigger: 'blur'

        }],
        // required只能检测 null undefined ""
        isAgree: [{
          validator: (rule, value, callback) => {
            /* 校验用户是否同意协议 */
            // rule校验规则
            // value 校验的值
            // callback 函数 - promise resolve reject
            // callback() callback(new Error(错误信息))
            value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
          }
        }]
      }
    }
  },
  methods: {
    /**
     * 执行登录操作。
     * 此函数首先验证表单数据的有效性，如果表单数据验证通过，
     * 则使用 Vuex 的 dispatch 方法提交登录动作，登录成功后跳转到首页。
     *
     * 使用 async/await 语法结构以异步方式处理登录过程，
     * 以便于处理登录前后可能需要的异步逻辑。
     */
    /* 登录提交函数 */
    login() {
      this.$refs.form.validate(async(isOK) => {
        /* 当表单验证通过时，执行登录动作 */
        if (isOK) {
          await this.$store.dispatch('user/login', this.loginForm)
          /* 登录成功后跳转到首页 */
          this.$router.push('/')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }

    h1 {
      padding-left: 20px;
      font-size: 24px;
    }

    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
</style>

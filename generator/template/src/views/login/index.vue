<template>
  <div class="login">
    <transition name="form-fade" mode="in-out">
      <section class="form-contianer" v-show="showLogin" v-loading="loading">
        <div class="platform-title">登录</div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" @submit.native.prevent>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
              autocomplete="on">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm"
              class="submit-btn"
              native-type="submit">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { formValidate2Promise } from '@/utils/common.js';

export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      showLogin: false,
      loading: false
    }
  },
  mounted () {
    this.showLogin = true;
  },
  methods: {
    async login () {
      this.loading = true;
      const { username, password } = this.loginForm;
      await this.$_api.login({ username, password });
      this.$message.success('登录成功');
      this.$router.push({ name: 'breadcrumbDemo.index' });
    },
    async submitForm () {
      await formValidate2Promise(this.$refs.loginForm);
      this.login();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss';

.login{
  width: 100%;
  height: 100vh;
  background-color: $g-color-theme;

  .form-contianer{
    @include g-layout-center-margin(350px, 220px, 'both');
    width: 350px;
    height: 220px;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;

    .submit-btn{
      width: 100%;
      font-size: 16px;
    }

    .register-link {
      color: $g-color-theme;

      &:hover {
        text-decoration: underline;
      }
    }

    .forget-link {
      margin-left: 30px;
      color: #E6A23C;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.platform-title {
  position: absolute;
  width: 100%;
  top: -80px;
  left: 0;
  font-size: 34px;
  color: #fff;
}

.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
}
.form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
}
</style>

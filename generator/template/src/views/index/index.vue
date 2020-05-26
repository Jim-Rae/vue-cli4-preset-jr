<template>
  <div class="index">
    <el-container style="height: 100vh">
      <el-header height="60px">
        <img class="logo" src="@/assets/img/logo.png" alt="logo">
        <span class="title">基于vue-cli4的前端项目模板</span>
        <router-link
          v-if="!username"
          class="login-btn"
          :to="{ name: 'login' }">
          登录
        </router-link>
        <div v-else class="user-wrapper">
          <span class="user-info">{{ username }}</span>
          <span class="logout-btn" @click="logout">退出登录</span>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside>
          <el-menu :default-active="$route.path" class="menu" router>
            <el-submenu index="/breadcrumbDemo">
              <template slot="title">
                <i class="el-icon-grape"></i>
                <span>面包屑Demo</span>
              </template>
              <el-menu-item index="/breadcrumbDemo/first">第一个页面</el-menu-item>
              <el-menu-item index="/breadcrumbDemo/second">第二个页面</el-menu-item>
            </el-submenu>
            <el-menu-item index="/ajaxDemo/index">
              <i class="el-icon-cherry"></i>
              <span slot="title">异步数据请求Demo</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <breadcrumb/>
          <el-scrollbar class="calc-height">
            <router-view class="view"/>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'index',
  computed: {
    ...mapGetters({
      username: 'user/username'
    })
  },
  methods: {
    ...mapActions({
      logout: 'user/logout'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss';

.el-header {
  border-bottom: solid 1px $g-color-border;
  line-height: 60px;
  position: relative;

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
  }

  .title {
    font-size: $g-fs-lg;
    color: $g-color-theme;
  }

  .login-btn {
    @include g-layout-center-transform('y');
    font-size: $g-fs-lg;
    color: $g-color-font--normal;
    display: block;
    height: 60px;
    right: 40px;

    &:hover {
      color: $g-color-theme;
    }
  }

  .user-wrapper {
    @include g-layout-center-transform('y');
    display: block;
    height: 60px;
    right: 40px;

    .user-info {
      font-size: $g-fs-lg;
      color: $g-color-theme;
      margin-right: 20px;
    }

    .logout-btn {
      font-size: $g-fs-lg;
      color: $g-color-font--normal;

      &:hover {
        color: $g-color-theme;
        cursor: pointer;
      }
    }
  }
}

.container {
  height: calc(100vh - 60px);
  padding-top: 20px;

  .el-aside {
    @include g-media-attr(width, 200px !important, 220px !important, 250px !important);

    // 兼容ie 9
    float: left;

    .menu {
      height: calc(100vh - 80px);
    }
  }

  .el-main {
    padding: 0;
    overflow: hidden;
    color: $g-color-font--normal;
    height: 100%;
    display: flex;
    flex-direction: column;

    // 兼容ie 9-10
    @include g-media-attr(width, calc(100% - 150px) !important, calc(100% - 200px) !important, calc(100% - 250px) !important);
    float: left;

    .view {
      padding: 0 20px 20px 20px;
    }

    // 兼容ie 9-10
    .calc-height {
      height: calc(100% - 54px);
    }
  }
}
</style>

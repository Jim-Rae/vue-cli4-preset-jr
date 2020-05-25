// 不常用路由组件单独打包
const index = () => import(/* webpackChunkName: "index" */ './index.vue');

export default {
  path: '/index',
  name: 'index',
  component: index,

  // 路由独享守卫
  beforeEnter (to, from, next) {
    next();
  }
}

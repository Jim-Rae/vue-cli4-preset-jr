// 不常用路由组件单独打包
const index = () => import(/* webpackChunkName: "login" */ './index');

export default {
  path: '/login',
  name: 'login',
  component: index
}

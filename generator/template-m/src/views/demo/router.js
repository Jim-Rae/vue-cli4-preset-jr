// 同一功能页面的路由统一打包

const index = () => import(/* webpackChunkName: "demo" */ './index/index.vue');
const ajaxDemo = () => import(/* webpackChunkName: "demo" */ './ajaxDemo/index.vue');

export default [
  {
    path: '/demo',
    name: 'demo',
    component: index
  },
  {
    path: '/ajaxDemo',
    name: 'ajaxDemo',
    component: ajaxDemo
  }
]

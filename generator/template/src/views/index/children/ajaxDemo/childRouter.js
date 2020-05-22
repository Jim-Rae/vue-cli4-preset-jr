// 路由分组打包
const index = () => import(/* webpackChunkName: "ajaxDemo" */ './index')

export default [
  {
    path: '/ajaxDemo/index',
    name: 'ajaxDemo.index',
    component: index,
    meta: {
      breadcrumb: {
        title: '异步数据请求Demo',
        route: ['ajaxDemo.index']
      }
    }
  }
]

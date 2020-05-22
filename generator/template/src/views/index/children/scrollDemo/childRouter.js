// 路由分组打包
const index = () => import(/* webpackChunkName: "scrollDemo" */ './index');

export default [
  {
    path: '/scrollDemo/index',
    name: 'scrollDemo.index',
    component: index,
    meta: {
      breadcrumb: {
        title: '滚动条Demo',
        route: ['scrollDemo.index']
      }
    }
  }
]

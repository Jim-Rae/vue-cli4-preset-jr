// 路由分组打包
const index = () => import(/* webpackChunkName: "breadcrumbDemo" */ './index');
const first = () => import(/* webpackChunkName: "breadcrumbDemo" */ './first');
const second = () => import(/* webpackChunkName: "breadcrumbDemo" */ './second');

const rootRoute = ['breadcrumbDemo.index'];

export default [
  {
    path: '/breadcrumbDemo/index',
    name: 'breadcrumbDemo.index',
    component: index,
    meta: {
      breadcrumb: {
        title: '面包屑Demo',
        route: [...rootRoute]
      }
    }
  },
  {
    path: '/breadcrumbDemo/first',
    name: 'breadcrumbDemo.first',
    component: first,
    meta: {
      breadcrumb: {
        title: '第一个页面',
        route: [...rootRoute, 'breadcrumbDemo.first']
      }
    }
  },
  {
    path: '/breadcrumbDemo/second',
    name: 'breadcrumbDemo.second',
    component: second,
    meta: {
      breadcrumb: {
        title: '第二个页面',
        route: [...rootRoute, 'breadcrumbDemo.second']
      }
    }
  }
];

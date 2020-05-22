import { importAll } from '@/utils/routerHelper.js';
import index from './index';
import Store from '@/store';
import Router from '@/router';

// 加载子路由
const ctx = require.context('./children', true, /childRouter.js$/);
const childRoutes = importAll(ctx);

export default {
  path: '/index',
  redirect: '/breadcrumbDemo/index',
  component: index,
  children: childRoutes,
  // 路由独享守卫
  async beforeEnter (to, from, next) {
    if (await Store.dispatch('user/getUserInfo')) {
      next();
    } else {
      Router.push({ name: 'login' });
    }
  }
}

# 项目框架解读

在这里我将使用本脚手架预设的PC端模板 `generator/template` 来进行项目框架的解读，移动端模板 `generator/template-m` 大同小异。

:::tip
本文档框架解读无法兼顾部分细节内容，开发者可以参照源码进行理解
:::

## src/api

该文件夹用于放置 http 请求逻辑。

其目录结构为：

```bash
api
├── axios-config.json  # axios配置
├── index.js  # 请求逻辑
└── mock.js  # 模拟数据
```

本框架使用了http请求库 [axios](https://github.com/axios/axios)，所以在该文件夹会有一个 `axios-config.js` 的 js 文件对其进行全局配置。主要包括 axios 基本属性的配置以及请求拦截器与响应拦截器的配置。

在请求拦截器中对 http 请求加入时间戳，避免从缓存中拿数据。在响应拦截器中对 http 响应作出响应码处理，实现响应码的统一处理。

```javascript
import axios from 'axios';
import router from '@/router';

const http = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://jimrae.top' : '',
  timeout: 10000
});

// 请求拦截
http.interceptors.request.use(config => {
  const method = config.method.toLowerCase();
  // 加入请求时间戳，避免从缓存中拿数据
  if (method === 'get') {
    config.params || (config.params = {});
    config.params._t = Date.now();
  }
  return config;
}, error => {
  return Promise.reject(error);
})

// 返回拦截
http.interceptors.response.use((response) => {
  // 对接口返回做统一处理, 这里要跟后台约定好接口异常返回的数据格式
  /* 下面处理仅针对返回格式如下的后台接口
   * {
   *    code: 200 | 400 | 401 | ...,
   *    data: {},
   *    message: "信息说明
   * }
  */
  switch (response.data.code) {
    /* eslint-disable */
    case 200: return Promise.resolve(response.data.data);
    case 400: return Promise.reject({ message: response.data.message });
    case 401: router.push({ name: 'login' }); return Promise.reject();
    default: return Promise.reject({ message: '服务器失联了，请稍候再试' });
    /* eslint-enable */
  }
}, error => {
  return Promise.reject(error);
})

export default http;
```

与业务相关的请求逻辑放在该文件夹中的 `index.js` 文件，以一个 function 对应一个 url 请求的形式，将所有的 function 放在一个 `api` 对象中，通过 `Vue.mixin` 混入 vue 实例当中，即可通过 `this.$_api.getList(params)` 的方式进行请求。

其中定义请求 function 的格式预设了两种，分别为**简洁式**与**细颗粒式**：

```javascript
const api = {
  // GET方法示例（简洁配置）
  getList: () => http.get('/api/getList'),

  // GET方法示例（细粒度配置）
  getList2 () {
    // 是否使用模拟数据
    if (mockSwitch) {
      return Promise.resolve(mockData.news)
    } else {
      // 对返回数据进行过滤或操作
      return http.get('/api/getList')
        .then(res => {
          // 根据实际情况处理成功返回的数据
          // 如：
          // if (res.status) {
          //   return Promise.resolve(res.list)
          // } else {
          //   return Promise.resolve(res.list2)
          // }
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  },

};
```

同时在该文件夹中预留了一个 `mock.js` 文件存放模拟数据。

## src/assets

该文件夹用于放置**静态资源**、**静态样式**以及**静态代码**。

其目录结构为：

```bash
assets
├── img  # 静态图片资源
├── js
│   └── element.js  # element 分组件导入
└── scss
    ├── adaptive  # 自适应相关
    ├── global  # 全局样式
    ├── mixin  # mixin 样式
    ├── theme  # element 主题样式
    ├── index.scss
    └── var.scss  # 样式变量
```

本框架预设了 `assets/img` 文件夹用于存放图片资源，`assets/js` 文件夹用于存放静态代码，如 [element](https://github.com/ElemeFE/element)的 分组件导入的 js 代码。本框架使用的 css 预处理是 `scss` ，所以还预设了 `assets/scss` 文件夹用于放置 scss 样式文件。

+ `scss/global` 下的样式会被 `main.js` 导入到全局，作用到整个项目；
+ `scss/adaptive`、`scss/mixin`、`scss/var.scss` 则需要通过在业务组件的样式代码里引入 `scss/index.scss` 后才能使用，如 `@import '@/assets/scss';`
+ `scss/theme` 会自动作用于 `element` 组件样式。

## src/components

该文件夹用于放置**全局组件**。

其目录结构为：

```bash
components
├── Breadcrumb.vue  # 面包屑组件
├── ...  # 更多自定义组件
└── index.js  # 组件注册器
```

该文件夹下的组件将会全局注册到 vue 实例中，注册组件名称按优先级获取 vue 组件里的 **name 属性**或**组件文件名**。

注册器代码如下：

```javascript
import Vue from 'vue'

const components = require.context('./', true, /\.vue$/)

components.keys().forEach(key => {
  const component = components(key).default
  // 获取vue组件的name值或vue文件名作为注册组件名
  const name = component.name || key.replace(/.*\//g, '').replace(/\.vue/, '')
  Vue.component(name, component)
})
```

## src/filter

该文件夹用于放置 vue 的**过滤器**。

其目录结构为：

```bash
filter
├── filters.js  # 各种过滤器
└── index.js  # 注册器
```

在 `filters.js` 逐个定义并导出过滤器函数，即可通过 vue 的过滤器用法，如 `{{ updateTime | timeFormat } }`，当然也可以通过单独导入使用，如 `import { timeFormat } from '@/filter/filters.js'`。

下面展示其中的一个过滤器代码：

```javascript
/**
 * 时间格式化
 * @method timeFormat
 * @param {String | Number} val 时间数值
 * @param {String} replaceStr 如果val值为空，要显示的字符
 */
export function timeFormat (val, replaceStr = '') {
  if (typeof val === 'string') {
    val = +val;
  }
  const reg = /^\d+$/g;
  if (!reg.test(val)) {
    return replaceStr;
  }
  // 补零操作
  const pad = num => ('' + num).padStart(2, '0');
  const d = new Date(val);
  const yearMonthDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-');
  const hourMinSec = [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad).join(':');

  return `${yearMonthDate} ${hourMinSec}`;
};
```

## src/store

该文件夹用于放置 vuex 全局**状态管理**代码。

其目录结构为：

```bash
store
├── modules  # 分模块使用
|   ├── user.js
|   └── ...
└── index.js  # 注册器
```

本框架对 vuex 进行分模块使用，放在 `store/modules` 文件夹里，如 `store/modules/user.js`。同样的，`src/store` 文件有一个注册器，用于加载 `store/modules` 文件夹里的所有模块。

注册器代码如下：

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// 加载modules文件夹里的vuex模块
const modules = {};
const ctx = require.context('./modules', true, /\.js$/);
ctx.keys().forEach(key => {
  const name = key.replace('./', '').replace('.js', '');
  const module = ctx(key).default;
  modules[name] = module;
})

export default new Vuex.Store({
  modules,

  // 在非production模式中开启strict模式
  strict: debug,
  // 在非production模式中使用日志插件
  plugins: debug ? [createLogger()] : []
});
```

在注册器里除了有加载模块的逻辑外，也在开发环境中加入了 `vuex/dist/logger` 模块的使用。

## src/utils

## src/view

## src/router.js

## babel

## public

## vue.config.js

## 各种配置文件

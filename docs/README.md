# 介绍

本脚手架是基于 Vue-CLI4 工具实现的，属于 Vue-CLI 工具的一个插件，但与普通的插件又有些区别。一般 Vue-CLI 工具的插件开发，大多都是针对于某个模块的，如官方插件 `@vue/cli-plugin-babel` 、 `@vue/cli-plugin-eslint` 等，再如社区插件 `vue-cli-plugin-element` 等。而本脚手架则是集成了多个项目工程所需的模块，构成了一套完整的项目工程架构。

## 特点

+ 通过命令行交互式创建项目工程；
+ 可定制多个工程模板到模板库；
+ 可以根据用户的交互式输入生成对应的工程模板。

## 目录结构

```
.
├── generator
|   ├── template  # PC端工程模板
|   ├── template-m  # WAP端工程模板
|   ├── ...  # 可定制模板
│   └── index.js  # 生成器
│ 
├── preset.json
└── prompts.js
```

## 如何实现

本脚手架的开发遵循 Vue-CLI 插件开发规则

+ 在 `preset.json` 中添加必要的依赖和配置，如 `@vue/cli-plugin-babel`、 `@vue/cli-plugin-eslint` 等；
+ 在 `prompts.js` 中配置 [inquirer](https://github.com/SBoudrias/Inquirer.js) 对话以获取用户参数；
+ 在 `generator` 文件夹放入工程模板，模板会通过 [EJS](https://github.com/mde/ejs) 渲染，遵循 EJS 的编写规则；
+ 在 `generator` 文件夹加入生成器 `index.js` ,在生成器中可根据 `prompts.js` 获取回来的用户参数进行对应的逻辑处理，通过调用 Vue-CLI 的 [GeneratorAPI](https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli/lib/GeneratorAPI.js) 中的 `render` 函数对模板文件生成树进行操作，最终传到 EJS 中把模板渲染出来。

::: tip
本脚手架巧妙之处，通过 `render` 函数先把 Vue-CLI 默认的模板文件从文件生成树中删除，再根据用户参数渲染对应模板。
:::

```javascript
// generator/index.js

// 删除 vue-cli4 默认目录
api.render(files => {
  Object.keys(files)
    .filter(path => path.startsWith('src/') || path.startsWith('public/'))
    .forEach(path => delete files[path])
})

// 生成项目模板
api.render(options.type === 'pc' ? './template' : './template-m')

// 阻止默认README.md文件生成
api.onCreateComplete(() => {
  process.env.VUE_CLI_SKIP_WRITE = true
})
```

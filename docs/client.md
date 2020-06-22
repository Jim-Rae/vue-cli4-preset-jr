# PC端与移动端

本脚手架已内置两套工程模板，分别是 `generator/template` (PC端) 和 `generator/template-m` (移动端)，生成器会根据 `prompts` 模块获取用户提供的终端参数 `type` 来生成对应的模板。

同时在这两套模板中的 `public/index.html` 里加入了终端判断以及自动跳转逻辑，实现无感适配PC端与移动端：

```html
<script>
  function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      alert('检测到终端类型为移动端，即将跳转到移动端url');
      // 跳转到你的移动端url
      window.location.href = "https://baidu.com"
    }
  }
  browserRedirect()
</script>
```

:::tip
终端判断逻辑可自行优化
:::

当然，你也可以自定义属于自己的工程模板，模板编写遵循 [EJS](https://github.com/mde/ejs) 的规则。编写完成后把自定义的工程模板放在 `generator` 文件夹中，然后在生成器 `generator/index.js` 中加入对应的渲染逻辑即可。

可参照以下代码进行逻辑渲染：

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

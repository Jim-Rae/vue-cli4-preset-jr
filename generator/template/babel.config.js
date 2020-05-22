module.exports = {
  presets: [
    ['@vue/app', {
      exclude: ['transform-async-to-generator'], // 配合 babel-plugin-async-catch
    }],
    './babel/babel-preset-custom'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}

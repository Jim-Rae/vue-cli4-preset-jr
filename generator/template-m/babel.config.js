module.exports = {
  presets: [
    ['@vue/app', {
      exclude: ['transform-async-to-generator'] // 配合 babel-plugin-async-catch
    }],
    './babel/babel-preset-custom'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}

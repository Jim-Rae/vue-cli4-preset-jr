module.exports = [
  {
    name: 'type',
    type: 'list',
    message: '请选择模板类型',
    choices: [
      {
        name: 'PC端',
        value: 'pc'
      },
      {
        name: '移动端',
        value: 'm'
      }
    ],
    default: 'pc'
  }
]

const defaultCatchClause = identifier => `
  console.error(${identifier});
  const errMsg = ${identifier} && ${identifier}.data && ${identifier}.data.message || ${identifier}.message || ${identifier};
  if(this && this.$message && ${identifier} !== 'cancel' && typeof errMsg === 'string') {
    this.$message.error(errMsg);
  }
`;
const defaultFinallyClause = `
  if(this && this.hasOwnProperty('loading')) {
    this.loading = false;
  }
`;

module.exports = (context, options = {}) => {
  const presets = [];
  const plugins = [];

  // 解构配置参数
  const {
    asyncCatchClause: catchClause,
    asyncFinallyClause: finallyClause
  } = options;

  // 加入babel-plugin-async-catch插件
  plugins.push([require('./babel-plugin-async-catch'), {
    catchClause: catchClause || defaultCatchClause,
    finallyClause: finallyClause || defaultFinallyClause
  }]);

  return {
    presets,
    plugins
  }
}

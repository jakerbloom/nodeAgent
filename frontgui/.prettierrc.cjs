/**
 * Prettier 配置文件
 * 代码格式化规则
 */
module.exports = {
  // 不使用分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 尾随逗号(ES5兼容)
  trailingComma: 'es5',
  // 缩进宽度
  tabWidth: 2,
  // 每行最大长度
  printWidth: 100,
  // 自动换行
  endOfLine: 'auto',
  // 箭头函数参数括号(避免)
  arrowParens: 'avoid',
  // 对象字面量括号空格
  bracketSpacing: true,
  // HTML空白敏感度
  htmlWhitespaceSensitivity: 'css',
  // 插入格式化标记
  insertPragma: false,
  // JSX引号(单引号)
  jsxSingleQuote: true,
  // 对象属性引号(按需)
  quoteProps: 'as-needed',
  // 多行JSX标签闭合位置
  jsxBracketSameLine: false,
  // Vue文件脚本和样式标签缩进
  vueIndentScriptAndStyle: true,
}

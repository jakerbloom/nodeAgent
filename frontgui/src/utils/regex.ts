/**
 * 预编译的正则表达式常量
 * 避免在计算属性或函数中重复创建 RegExp 对象
 */

/** 匹配 <link>标签内容 */
export const LINK_REGEX = /<link>(.*?)<\/link>/g

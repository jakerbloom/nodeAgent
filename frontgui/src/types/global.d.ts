/**
 * 全局类型声明
 */

// Vue 组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

// Element Plus 中文语言包声明
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const zhCn: unknown
  export default zhCn
}

// 扩展 Window 接口
// TODO: 在此添加自定义 window 属性类型
declare global {
  // interface Window {
  //   yourCustomProp: string
  // }
}

// Vite 环境变量声明
// 可在此添加自定义环境变量类型
// 例如: readonly VITE_API_BASE_URL?: string

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv {}

export {}

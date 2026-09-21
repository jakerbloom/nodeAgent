/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_BASE_URL: string
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Language } from 'element-plus'
  const zhCn: Language
  export default zhCn
}

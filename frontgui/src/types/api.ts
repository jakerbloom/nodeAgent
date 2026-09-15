/**
 * API 相关类型定义
 */

/**
 * API 响应标准格式
 */
export interface ApiResponse<T = unknown> {
  data: T
  code: number
  message?: string
  success?: boolean
}

/**
 * API 错误格式
 */
export interface ApiError {
  message: string
  code: number
  details?: Record<string, string[]>
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * 分页响应数据
 */
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 请求配置选项
 */
export interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 是否显示错误消息 */
  showError?: boolean
}

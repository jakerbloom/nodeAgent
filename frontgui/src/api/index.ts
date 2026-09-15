/**
 * Axios 实例配置
 * 统一HTTP请求处理
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from '@/types/api'

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 确保请求头存在
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders()
    }

    // 添加 Content-Type 头（如果未设置）
    if (!config.headers.get('Content-Type')) {
      config.headers.set('Content-Type', 'application/json; charset=utf-8')
    }

    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown> | unknown>) => {
    const data = response.data

    // 判断是否为标准 API 格式 {code, message, data}
    if (
      data &&
      typeof data === 'object' &&
      'code' in data &&
      'data' in data &&
      data.code !== undefined
    ) {
      const apiData = data as ApiResponse<unknown>
      // 业务状态码判断：code 为 200 表示成功
      if (apiData.code === 200 || apiData.code === 1) {
        // 标准格式成功：提取 data 字段
        response.data = apiData.data
      } else {
        // 业务错误：抛出错误，使用后端返回的 message
        const errorMessage = apiData.message || `业务错误 (code: ${apiData.code})`
        return Promise.reject(new Error(errorMessage)) as unknown as AxiosResponse
      }
    }
    // 否则保持原样（后端直接返回数据的旧格式）

    return response
  },
  (error: AxiosError<ApiError>) => {
    // 统一错误处理
    let errorMessage = '请求失败'

    if (error.response) {
      // 服务器返回错误响应
      const { status, data } = error.response
      errorMessage = data?.message || `HTTP错误! 状态码: ${status}`

      // 根据状态码处理不同错误
      switch (status) {
        case 400:
          errorMessage = `请求参数错误: ${errorMessage}`
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 可以在这里处理登录跳转
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = `服务器内部错误: ${errorMessage}`
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = `请求失败: ${errorMessage}`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络错误，请检查网络连接'
    } else {
      // 请求配置出错
      errorMessage = `请求配置错误: ${error.message}`
    }

    console.error('API错误:', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
)

export default request

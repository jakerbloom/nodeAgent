import { http, HttpResponse } from 'msw'

const baseURL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export const handlers = [
  http.get(`${baseURL}/example`, () =>
    HttpResponse.json({ code: 200, data: { message: 'Mock 接口已就绪，可替换此示例。' } })
  ),
]

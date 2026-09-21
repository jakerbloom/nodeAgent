import { describe, expect, it, vi } from 'vitest'
import type { AxiosAdapter } from 'axios'

async function createRequest(baseURL?: string) {
  vi.resetModules()
  vi.stubEnv('VITE_API_BASE_URL', baseURL)
  return (await import('../api')).default
}

function responseAdapter(data: unknown): AxiosAdapter {
  return async config => ({ data, status: 200, statusText: 'OK', headers: {}, config })
}

describe('请求约定', () => {
  it('未配置时请求 /api', async () => {
    const request = await createRequest()
    const response = await request.get('/users', { adapter: responseAdapter([]) })
    expect(request.getUri(response.config)).toBe('/api/users')
  })

  it('允许通过环境变量配置请求前缀', async () => {
    const request = await createRequest('/backend')
    const response = await request.get('/users', { adapter: responseAdapter([]) })
    expect(request.getUri(response.config)).toBe('/backend/users')
  })

  it.each([200, 1])('业务码 %i 成功时提取 data', async code => {
    const request = await createRequest()
    const response = await request.get('/users', {
      adapter: responseAdapter({ code, data: [{ id: 7 }], message: '成功' }),
    })
    expect(response.data).toEqual([{ id: 7 }])
  })

  it('其他业务码拒绝并保留后端错误说明', async () => {
    const request = await createRequest()
    await expect(
      request.get('/users', {
        adapter: responseAdapter({ code: 403, data: null, message: '没有访问权限' }),
      })
    ).rejects.toThrow('没有访问权限')
  })

  it('直接返回的数据不被误解包', async () => {
    const request = await createRequest()
    const response = await request.get('/users', { adapter: responseAdapter([{ id: 7 }]) })
    expect(response.data).toEqual([{ id: 7 }])
  })
})

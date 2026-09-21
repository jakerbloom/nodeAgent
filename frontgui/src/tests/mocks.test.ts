import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'
import request from '../api'

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('示例 Mock 经实际请求拦截器解包后返回数据', async () => {
  const response = await request.get('/example')
  expect(response.data).toEqual({ message: 'Mock 接口已就绪，可替换此示例。' })
})

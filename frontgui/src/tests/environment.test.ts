import { describe, expect, it } from 'vitest'
import { getEnvironmentConfig } from '../../config/environment'

describe('开发环境配置', () => {
  it('采用生成时的端口，默认同源且不启用代理', () => {
    const config = getEnvironmentConfig({ DEV_PORT: '3001' })
    expect(config.base).toBe('/')
    expect(config.server.port).toBe(3001)
    expect(config.server.proxy).toBeUndefined()
  })

  it('允许覆盖端口和部署路径', () => {
    const config = getEnvironmentConfig({ DEV_PORT: '4200', VITE_BASE_URL: '/example/' })
    expect(config.server.port).toBe(4200)
    expect(config.base).toBe('/example/')
  })

  it.each(['0', '80', '65536', '3001oops', '3.5'])('拒绝无效端口 %s', DEV_PORT => {
    expect(() => getEnvironmentConfig({ DEV_PORT })).toThrow('DEV_PORT')
  })

  it('代理保留 /api 前缀，不设置路径重写', () => {
    const config = getEnvironmentConfig({ API_PROXY_TARGET: 'http://localhost:8080' })
    expect(config.server.proxy?.['/api']).toEqual({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  })
})

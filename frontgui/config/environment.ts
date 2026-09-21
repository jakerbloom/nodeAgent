export function getEnvironmentConfig(env: Record<string, string>) {
  const rawPort = env.DEV_PORT || '3001'
  const port = Number(rawPort)
  if (!/^\d+$/.test(rawPort) || port < 1024 || port > 65535) {
    throw new Error('DEV_PORT 必须为 1024-65535 之间的整数')
  }
  const target = env.API_PROXY_TARGET?.trim()
  if (target && !/^https?:\/\//.test(target)) {
    throw new Error('API_PROXY_TARGET 必须以 http:// 或 https:// 开头')
  }
  return {
    base: env.VITE_BASE_URL || '/',
    server: {
      port,
      proxy: target ? { '/api': { target, changeOrigin: true } } : undefined,
    },
  }
}

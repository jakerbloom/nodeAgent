import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '../stores/modules/toast'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
})

describe('Toast', () => {
  it.each(['success', 'error', 'info'] as const)('创建 %s 消息', type => {
    const store = useToastStore()
    store[type]('示例消息')
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]).toMatchObject({ type, message: '示例消息' })
  })

  it('在指定时间后移除消息', () => {
    const store = useToastStore()
    store.showToast('短消息', 'info', 1000)
    vi.advanceTimersByTime(999)
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(store.toasts).toHaveLength(0)
  })

  it('超过三个消息时移除最早的消息', () => {
    const store = useToastStore()
    for (const message of ['第一条', '第二条', '第三条', '第四条']) store.info(message)
    expect(store.toasts.map(toast => toast.message)).toEqual(['第二条', '第三条', '第四条'])
  })

  it('按 id 手动移除且不影响其他消息', () => {
    const store = useToastStore()
    store.info('移除我')
    store.success('保留我')
    store.removeToast(store.toasts[0].id)
    expect(store.toasts.map(toast => toast.message)).toEqual(['保留我'])
  })
})

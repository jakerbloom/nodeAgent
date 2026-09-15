import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  icon: string
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let toastId = 0

  /** 最大同时显示的 Toast 数量 */
  const MAX_TOASTS = 3

  /** 存储所有定时器ID用于清理 */
  const timers = new Set<ReturnType<typeof setTimeout>>()

  const icons: Record<Toast['type'], string> = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    info: 'fas fa-info-circle',
  }

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 2000) => {
    const id = ++toastId

    // 如果超过最大数量，移除最早的 toast
    if (toasts.value.length >= MAX_TOASTS) {
      toasts.value.shift()
    }

    toasts.value.push({ id, message, type, icon: icons[type] })

    const timer = setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
      timers.delete(timer)
    }, duration)
    timers.add(timer)
  }

  /** 清理所有定时器 */
  const clearAllTimers = () => {
    timers.forEach(timer => clearTimeout(timer))
    timers.clear()
  }

  const success = (message: string) => showToast(message, 'success')
  const error = (message: string) => showToast(message, 'error')
  const info = (message: string) => showToast(message, 'info')

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    success,
    error,
    info,
    removeToast,
    clearAllTimers,
  }
})

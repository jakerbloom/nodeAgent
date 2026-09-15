/**
 * 防抖工具函数
 */
export function debounce<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay: number
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: TArgs) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流工具函数
 */
export function throttle<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay: number
): (...args: TArgs) => void {
  let lastCall = 0
  return (...args: TArgs) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

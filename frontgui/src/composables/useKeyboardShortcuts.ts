import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 快捷键配置项
 */
export interface ShortcutConfig {
  /** 按键名称 */
  key: string
  /** 是否需要 Ctrl/Cmd 键 */
  ctrl?: boolean
  /** 是否需要 Shift 键 */
  shift?: boolean
  /** 是否需要 Alt 键 */
  alt?: boolean
  /** 是否在输入框聚焦时仍然触发 */
  allowInInput?: boolean
  /** 快捷键描述（用于文档） */
  description?: string
  /** 回调函数 */
  handler: (event: KeyboardEvent) => void
}

/**
 * 常用快捷键预设
 */
export const SHORTCUT_PRESETS = {
  /** 搜索聚焦: Ctrl/Cmd + K */
  search: (callback: () => void): ShortcutConfig => ({
    key: 'k',
    ctrl: true,
    description: '聚焦搜索框',
    handler: (e: KeyboardEvent) => {
      e.preventDefault()
      callback()
    },
  }),

  /** 关闭弹窗: Escape */
  escape: (callback: () => void): ShortcutConfig => ({
    key: 'Escape',
    description: '关闭弹窗/取消',
    handler: () => callback(),
  }),

  /** 重置流程: R */
  reset: (callback: () => void): ShortcutConfig => ({
    key: 'r',
    description: '重置流程',
    allowInInput: false,
    handler: () => callback(),
  }),

  /** 新建: Ctrl/Cmd + N */
  newTab: (callback: () => void): ShortcutConfig => ({
    key: 'n',
    ctrl: true,
    description: '新建标签页',
    handler: (e: KeyboardEvent) => {
      e.preventDefault()
      callback()
    },
  }),

  /** 保存: Ctrl/Cmd + S */
  save: (callback: () => void): ShortcutConfig => ({
    key: 's',
    ctrl: true,
    description: '保存',
    handler: (e: KeyboardEvent) => {
      e.preventDefault()
      callback()
    },
  }),
} as const

/**
 * 检测输入元素是否处于焦点状态
 */
const isInputFocused = (): boolean => {
  const activeElement = document.activeElement
  if (!activeElement) return false

  const tagName = activeElement.tagName.toLowerCase()
  const isInputElement = tagName === 'input' || tagName === 'textarea' || tagName === 'select'
  const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'

  return isInputElement || isContentEditable
}

/**
 * 匹配快捷键配置
 */
const matchShortcut = (event: KeyboardEvent, config: ShortcutConfig): boolean => {
  // 检查主键
  if (event.key !== config.key) return false

  // 检查修饰键
  const ctrlOrMeta = event.ctrlKey || event.metaKey
  if (config.ctrl && !ctrlOrMeta) return false
  if (!config.ctrl && ctrlOrMeta) return false

  if (config.shift !== undefined && event.shiftKey !== config.shift) return false
  if (config.alt !== undefined && event.altKey !== config.alt) return false

  return true
}

/**
 * 快捷键管理 Composable
 *
 * @example
 * ```typescript
 * const { registerShortcut, unregisterShortcut, registerPresets } = useKeyboardShortcuts()
 *
 * // 注册单个快捷键
 * registerShortcut({
 *   key: 'k',
 *   ctrl: true,
 *   handler: (e) => {
 *     e.preventDefault()
 *     focusSearch()
 *   }
 * })
 *
 * // 使用预设注册
 * registerPresets([
 *     SHORTCUT_PRESETS.search(() => focusSearchInput()),
 *     SHORTCUT_PRESETS.escape(() => closeModals()),
 *     SHORTCUT_PRESETS.reset(() => resetFlow()),
 * ])
 * ```
 */
export function useKeyboardShortcuts() {
  // ==================== 状态 ====================
  const shortcuts = ref<ShortcutConfig[]>([])
  const enabled = ref(true)

  // ==================== 私有方法 ====================
  const handleKeydown = (event: KeyboardEvent) => {
    if (!enabled.value) return

    for (const config of shortcuts.value) {
      if (!matchShortcut(event, config)) continue

      // 检查是否在输入框中
      if (!config.allowInInput && isInputFocused()) continue

      // 执行处理器
      config.handler(event)
      break
    }
  }

  // ==================== 公共方法 ====================

  /**
   * 注册单个快捷键
   */
  const registerShortcut = (config: ShortcutConfig): void => {
    // 检查是否已存在相同快捷键
    const existingIndex = shortcuts.value.findIndex(
      s => s.key === config.key && s.ctrl === config.ctrl && s.shift === config.shift
    )

    if (existingIndex !== -1) {
      // 替换已存在的快捷键
      shortcuts.value[existingIndex] = config
    } else {
      shortcuts.value.push(config)
    }
  }

  /**
   * 取消注册快捷键
   */
  const unregisterShortcut = (key: string, ctrl = false, shift = false): void => {
    const index = shortcuts.value.findIndex(
      s => s.key === key && s.ctrl === ctrl && s.shift === shift
    )
    if (index !== -1) {
      shortcuts.value.splice(index, 1)
    }
  }

  /**
   * 批量注册快捷键（通常用于预设）
   */
  const registerPresets = (configs: ShortcutConfig[]): void => {
    configs.forEach(config => registerShortcut(config))
  }

  /**
   * 清空所有快捷键
   */
  const clearShortcuts = (): void => {
    shortcuts.value = []
  }

  /**
   * 启用/禁用快捷键
   */
  const setEnabled = (value: boolean): void => {
    enabled.value = value
  }

  /**
   * 获取当前已注册的快捷键列表
   */
  const getRegisteredShortcuts = (): ShortcutConfig[] => {
    return [...shortcuts.value]
  }

  // ==================== 生命周期 ====================
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    // 状态
    shortcuts,
    enabled,
    // 方法
    registerShortcut,
    unregisterShortcut,
    registerPresets,
    clearShortcuts,
    setEnabled,
    getRegisteredShortcuts,
  }
}

/**
 * 便捷钩子：使用预设快捷键
 *
 * @example
 * ```typescript
 * useShortcutPresets({
 *   search: () => focusSearch(),
 *   escape: () => closeModal(),
 *   reset: () => resetFlow(),
 * })
 * ```
 */
export function useShortcutPresets(handlers: {
  search?: () => void
  escape?: () => void
  reset?: () => void
  newTab?: () => void
  save?: () => void
}) {
  const { registerShortcut } = useKeyboardShortcuts()

  if (handlers.search) {
    registerShortcut(SHORTCUT_PRESETS.search(handlers.search))
  }

  if (handlers.escape) {
    registerShortcut(SHORTCUT_PRESETS.escape(handlers.escape))
  }

  if (handlers.reset) {
    registerShortcut(SHORTCUT_PRESETS.reset(handlers.reset))
  }

  if (handlers.newTab) {
    registerShortcut(SHORTCUT_PRESETS.newTab(handlers.newTab))
  }

  if (handlers.save) {
    registerShortcut(SHORTCUT_PRESETS.save(handlers.save))
  }
}

export default useKeyboardShortcuts

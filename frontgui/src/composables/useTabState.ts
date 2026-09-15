import { reactive } from 'vue'

export interface TabState {
  currentNode: string
  currentScenario: string
  userChoices: Record<string, string[]>
  pathHistory: string[]
  scenarios: Record<string, string[]>
}

export interface UseTabStateOptions {
  onSave?: (tabId: string, state: TabState) => void
  onRestore?: (tabId: string, state: TabState) => void
}

/**
 * Tab 状态管理 Composable
 * 负责保存和恢复不同 Tab 的流程状态
 */
export function useTabState(options: UseTabStateOptions = {}) {
  // ==================== 状态 ====================
  const tabsState = reactive<Map<string, TabState>>(new Map())

  /**
   * 安全地重置并恢复响应式对象
   * @param target 目标响应式对象
   * @param source 源数据对象
   */
  const resetAndRestoreReactive = <T extends Record<string, unknown>>(
    target: T,
    source: T
  ): void => {
    // 如果源对象是空的，直接清空目标对象
    const sourceKeys = Object.keys(source)
    if (sourceKeys.length === 0) {
      Object.keys(target).forEach(key => {
        delete target[key]
      })
      return
    }

    // 使用 Vue 响应式友好的方式：只删除源对象中不存在的键
    Object.keys(target).forEach(key => {
      if (!sourceKeys.includes(key)) {
        delete target[key]
      }
    })
    Object.assign(target, source)
  }

  /**
   * 安全地重置并恢复响应式数组
   * @param target 目标响应式数组
   * @param source 源数组
   */
  const resetAndRestoreArray = <T>(target: T[], source: T[]): void => {
    // 使用 length = 0 清空数组，然后 push 新元素
    target.length = 0
    target.push(...source)
  }

  /**
   * 保存指定 Tab 的状态
   * @param tabId - Tab ID
   * @param state - 要保存的状态
   */
  const saveTabState = (tabId: string, state: TabState): void => {
    // 深拷贝 userChoices 中的数组
    const clonedUserChoices: Record<string, string[]> = {}
    Object.entries(state.userChoices).forEach(([key, value]) => {
      clonedUserChoices[key] = [...value]
    })

    tabsState.set(tabId, {
      currentNode: state.currentNode,
      currentScenario: state.currentScenario,
      userChoices: clonedUserChoices,
      pathHistory: [...state.pathHistory],
      scenarios: { ...state.scenarios },
    })

    options.onSave?.(tabId, state)
  }

  /**
   * 获取指定 Tab 的状态
   * @param tabId - Tab ID
   * @returns Tab 状态，如果不存在返回 undefined
   */
  const getTabState = (tabId: string): TabState | undefined => {
    return tabsState.get(tabId)
  }

  /**
   * 恢复指定 Tab 的状态
   * @param tabId - Tab ID
   * @param currentScenarios - 当前可用场景（用于验证）
   * @returns 恢复的状态，如果无法恢复返回 undefined
   */
  const restoreTabState = (
    tabId: string,
    currentScenarios: Record<string, string[]>
  ): Partial<TabState> | undefined => {
    const state = tabsState.get(tabId)
    if (!state) return undefined

    const restored: Partial<TabState> = {}

    // 恢复当前节点（如果在当前场景中有效）
    if (state.currentNode && currentScenarios[state.currentScenario]?.includes(state.currentNode)) {
      restored.currentNode = state.currentNode
      restored.currentScenario = state.currentScenario
    }

    // 恢复用户选择
    restored.userChoices = { ...state.userChoices }

    // 恢复路径历史
    restored.pathHistory = [...state.pathHistory]

    options.onRestore?.(tabId, state)
    return restored
  }

  /**
   * 删除指定 Tab 的状态
   * @param tabId - Tab ID
   */
  const removeTabState = (tabId: string): void => {
    tabsState.delete(tabId)
  }

  /**
   * 清空所有 Tab 状态
   */
  const clearAllTabStates = (): void => {
    tabsState.clear()
  }

  /**
   * 获取所有保存的 Tab ID
   * @returns Tab ID 数组
   */
  const getAllTabIds = (): string[] => {
    return Array.from(tabsState.keys())
  }

  return {
    // 状态
    tabsState,
    // 方法
    saveTabState,
    getTabState,
    restoreTabState,
    removeTabState,
    clearAllTabStates,
    getAllTabIds,
    // 工具方法
    resetAndRestoreReactive,
    resetAndRestoreArray,
  }
}

export default useTabState

/**
 * Tab Store - 多标签页状态管理
 *
 * 管理打开的标签页，支持状态保存与恢复。
 * 自动持久化到 localforage。
 *
 * 使用示例:
 *   const tabStore = useTabStore()
 *   const tab = tabStore.createTab({ title: '新页面', data: { ... } })
 *   tabStore.switchTab(tab.id)
 *   tabStore.closeTab(tab.id)
 *
 * TODO: 根据你的业务需求，扩展 TabState 类型和 createTab 参数
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TabItem } from '../types'

export const useTabStore = defineStore(
  'tab',
  () => {
    // ==================== State ====================
    /** 所有标签页 */
    const tabs = ref<TabItem[]>([])
    /** 当前激活的标签页ID */
    const activeTabId = ref('')
    /** Tab ID 计数器 */
    const _tabIdCounter = ref(0)

    // ==================== Getters ====================
    /** 当前激活的标签页 */
    const activeTab = computed(() => {
      return tabs.value.find((tab) => tab.id === activeTabId.value) || null
    })

    /** Tab数量 */
    const tabCount = computed(() => tabs.value.length)

    /** 是否有Tab */
    const hasTabs = computed(() => tabs.value.length > 0)

    /** 当前Tab的标题 */
    const currentTitle = computed(() => {
      return activeTab.value?.title || ''
    })

    // ==================== Actions ====================

    /**
     * 生成新的Tab ID
     */
    const generateTabId = (): string => {
      return `tab-${++_tabIdCounter.value}`
    }

    /**
     * 创建新Tab
     * @param params.title - 标签标题
     * @param params.data - 关联的自定义数据
     */
    const createTab = (params: { title: string; data?: Record<string, unknown> }): TabItem => {
      const id = generateTabId()
      const newTab: TabItem = {
        id,
        title: params.title,
        data: params.data || {},
        state: {},
      }

      tabs.value.push(newTab)
      activeTabId.value = id

      return newTab
    }

    /**
     * 切换Tab
     */
    const switchTab = (tabId: string): boolean => {
      if (tabId === activeTabId.value) return true

      const tab = tabs.value.find((t) => t.id === tabId)
      if (!tab) return false

      activeTabId.value = tabId
      return true
    }

    /**
     * 关闭Tab
     */
    const closeTab = (tabId: string): boolean => {
      const tabIndex = tabs.value.findIndex((t) => t.id === tabId)
      if (tabIndex === -1) return false

      // 删除Tab
      tabs.value.splice(tabIndex, 1)

      // 如果关闭的是当前Tab
      if (activeTabId.value === tabId) {
        if (tabs.value.length > 0) {
          // 切换到前一个Tab
          const newActiveIndex = Math.min(tabIndex, tabs.value.length - 1)
          const newActiveTab = tabs.value[newActiveIndex]
          activeTabId.value = newActiveTab.id
        } else {
          // 没有Tab了
          activeTabId.value = ''
        }
      }

      return true
    }

    /**
     * 关闭所有Tab
     */
    const closeAllTabs = () => {
      tabs.value = []
      activeTabId.value = ''
    }

    /**
     * 更新Tab信息
     */
    const updateTab = (tabId: string, updates: Partial<TabItem>): boolean => {
      const tab = tabs.value.find((t) => t.id === tabId)
      if (!tab) return false

      Object.assign(tab, updates)
      return true
    }

    /**
     * 设置Tab状态
     */
    const setTabState = (tabId: string, state: Record<string, unknown>): boolean => {
      const tab = tabs.value.find((t) => t.id === tabId)
      if (!tab) return false

      tab.state = state
      return true
    }

    /**
     * 获取Tab状态
     */
    const getTabState = (tabId: string): Record<string, unknown> | null => {
      const tab = tabs.value.find((t) => t.id === tabId)
      return tab ? tab.state : null
    }

    /**
     * 根据标题查找Tab
     */
    const findTabByTitle = (title: string): TabItem | undefined => {
      return tabs.value.find((tab) => tab.title === title)
    }

    /**
     * 检查标题是否已打开
     */
    const isTitleOpen = (title: string): boolean => {
      return tabs.value.some((tab) => tab.title === title)
    }

    /**
     * 重新排序Tabs
     */
    const reorderTabs = (newOrder: string[]) => {
      const orderedTabs: TabItem[] = []
      newOrder.forEach((id) => {
        const tab = tabs.value.find((t) => t.id === id)
        if (tab) orderedTabs.push(tab)
      })
      tabs.value = orderedTabs
    }

    return {
      // State
      tabs,
      activeTabId,

      // Getters
      activeTab,
      tabCount,
      hasTabs,
      currentTitle,

      // Actions
      generateTabId,
      createTab,
      switchTab,
      closeTab,
      closeAllTabs,
      updateTab,
      setTabState,
      getTabState,
      findTabByTitle,
      isTitleOpen,
      reorderTabs,
    }
  },
  {
    persist: {
      key: 'tabs',
      paths: ['tabs', 'activeTabId', '_tabIdCounter'],
    },
  }
)

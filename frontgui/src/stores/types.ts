/**
 * Stores 类型定义统一导出
 *
 * TODO: 根据你的业务需求扩展这些类型
 */

// ==================== Tab Store 类型 ====================

/** Tab 项 */
export interface TabItem {
  id: string
  title: string
  /** 关联的自定义数据 */
  data: Record<string, unknown>
  /** 标签页的运行时状态 */
  state: Record<string, unknown>
}

/** Tab 状态（已废弃，保留用于兼容） */
export type TabState = Record<string, unknown>

// ==================== 通用 Store 类型 ====================

/** 加载状态 */
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

/** Store 操作结果 */
export interface StoreResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ==================== 扩展示例 ====================

/**
 * 你可以在此添加自己的业务类型，例如：
 *
 * export interface UserInfo {
 *   id: string
 *   name: string
 *   role: string
 * }
 *
 * export interface ProjectData {
 *   projectId: string
 *   projectName: string
 *   status: 'draft' | 'active' | 'archived'
 * }
 */

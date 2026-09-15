/**
 * Pinia Localforage 持久化插件
 * 将指定的 store 状态持久化到 localforage
 */

import type { PiniaPluginContext, StateTree } from 'pinia'
import localforage from 'localforage'

export interface PersistOptions {
  /** 存储的 key 名 */
  key?: string
  /** 指定要持久化的 state 属性 */
  paths?: string[]
  /** 存储引擎 */
  storage?: LocalForage
  /** 序列化函数 */
  serializer?: {
    serialize: (value: unknown) => string
    deserialize: (value: string) => unknown
  }
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: boolean | PersistOptions | PersistOptions[]
    /** @internal */
    _unused?: S & Store
  }
}

// 默认序列化器
const defaultSerializer = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
}

/**
 * 创建 localforage 存储实例
 */
function createStorage(storeName: string): LocalForage {
  return localforage.createInstance({
    name: 'AppDB',
    storeName,
  })
}

/**
 * 获取需要持久化的数据
 */
function pickPaths<T extends StateTree>(state: T, paths?: string[]): Partial<T> {
  if (!paths || paths.length === 0) return state

  return paths.reduce((acc, path) => {
    const keys = path.split('.')
    let value: unknown = state

    for (const key of keys) {
      if (value === null || typeof value !== 'object') {
        value = undefined
        break
      }
      value = (value as Record<string, unknown>)[key]
    }

    if (value !== undefined) {
      keys.reduce(
        (acc, key, index) => {
          if (index === keys.length - 1) {
            acc[key] = value
          } else {
            acc[key] = acc[key] || {}
          }
          return acc[key] as Record<string, unknown>
        },
        acc as Record<string, unknown>
      )
    }

    return acc
  }, {} as Partial<T>)
}

/**
 * Pinia Localforage 持久化插件
 */
export function piniaLocalforagePlugin({ store, options }: PiniaPluginContext): void {
  if (!options.persist) return

  const persistOptions: PersistOptions[] = Array.isArray(options.persist)
    ? options.persist
    : [options.persist === true ? {} : options.persist]

  persistOptions.forEach(async persistOption => {
    const {
      key = store.$id,
      paths,
      storage: customStorage,
      serializer = defaultSerializer,
    } = persistOption

    // 创建或复用 storage 实例
    const storage = customStorage || createStorage(key)

    // 恢复状态
    try {
      const stored = await storage.getItem<string>(key)
      if (stored) {
        const deserialized = serializer.deserialize(stored) as StateTree
        store.$patch(deserialized)
      }
    } catch (error) {
      console.warn(`[pinia-localforage] 恢复 ${key} 失败:`, error)
    }

    // 订阅状态变化并保存
    store.$subscribe(
      async (_mutation, state) => {
        try {
          const dataToPersist = pickPaths(state, paths)
          await storage.setItem(key, serializer.serialize(dataToPersist))
        } catch (error) {
          console.warn(`[pinia-localforage] 保存 ${key} 失败:`, error)
        }
      },
      { flush: 'sync' }
    )
  })
}

export default piniaLocalforagePlugin

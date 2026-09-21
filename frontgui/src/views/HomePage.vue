<script setup lang="ts">
  import { ref } from 'vue'
  import SkeletonCard from '@components/ui/SkeletonCard.vue'
  import SkeletonLine from '@components/ui/SkeletonLine.vue'
  import { useToastStore } from '@stores/modules/toast'
  import request from '@api/index'

  const title = import.meta.env.VITE_APP_TITLE
  const isMock = import.meta.env.DEV && import.meta.env.MODE === 'development'
  const message = ref('你好，新项目')
  const loading = ref(false)
  const result = ref('')
  const toast = useToastStore()

  async function loadExample() {
    loading.value = true
    try {
      const response = await request.get<unknown>('/example')
      result.value = JSON.stringify(response.data, null, 2)
    } catch (error) {
      result.value = error instanceof Error ? error.message : '请求失败'
      toast.error(result.value)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <main class="mx-auto max-w-4xl px-6 py-12 md:py-20">
    <header class="mb-10 space-y-4">
      <p class="text-sm font-medium text-primary">Vue 3 · Tailwind CSS · Element Plus</p>
      <h1 class="text-3xl font-bold tracking-tight text-foreground">{{ title }}</h1>
      <p class="max-w-2xl leading-7 text-muted">
        项目已就绪。先填写 DESIGN.md，再替换 token，开始你的页面开发。
        此页和全部设计值仅供演示，可直接删除或替换。
      </p>
    </header>
    <div class="grid gap-6 md:grid-cols-2">
      <section
        class="min-w-0 rounded-card border border-border bg-surface p-6 shadow-card"
        aria-labelledby="controls-title"
      >
        <h2 id="controls-title" class="mb-2 text-lg font-semibold">控件与反馈</h2>
        <p class="mb-6 text-sm leading-6 text-muted">Element Plus 与自定义组件共享示例 token。</p>
        <label for="example-message" class="mb-2 block text-sm font-medium">提示内容</label>
        <el-input
          id="example-message"
          v-model="message"
          maxlength="100"
          placeholder="输入一条提示"
        />
        <div class="mt-4 flex flex-wrap gap-3">
          <el-button type="primary" :disabled="!message.trim()" @click="toast.success(message)"
            >显示成功提示</el-button
          >
          <el-button @click="toast.info('这是一条示例提示。')">普通提示</el-button>
        </div>
        <button
          class="mt-5 rounded-control bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
          type="button"
          @click="toast.error('这是一条示例错误。')"
        >
          Tailwind 按钮示例
        </button>
      </section>
      <section
        class="min-w-0 rounded-card border border-border bg-surface p-6 shadow-card"
        aria-labelledby="loading-title"
      >
        <h2 id="loading-title" class="mb-2 text-lg font-semibold">加载状态</h2>
        <p class="mb-6 text-sm leading-6 text-muted">仅演示加载外观，不会发起请求。</p>
        <SkeletonCard :lines="2" />
        <div class="mt-4"><SkeletonLine width="70%" /></div>
      </section>
      <section
        class="min-w-0 rounded-card border border-border bg-surface p-6 shadow-card md:col-span-2"
        aria-labelledby="request-title"
      >
        <h2 id="request-title" class="mb-2 text-lg font-semibold">接口示例</h2>
        <p class="mb-4 text-sm leading-6 text-muted">
          {{
            isMock
              ? '当前为 Mock 模式，可直接请求示例接口。'
              : '当前为真实接口模式，请将示例地址替换为后端已有接口。'
          }}
          请求遵循 /api 前缀与业务码 200 或 1 成功的约定。
        </p>
        <el-button :loading="loading" @click="loadExample">请求 /example</el-button>
        <pre
          v-if="result"
          class="mt-4 overflow-auto rounded-control bg-page p-4 text-sm"
          role="status"
          >{{ result }}</pre>
      </section>
    </div>
    <footer class="mt-8 text-sm leading-6 text-muted">
      设计入口：DESIGN.md · 样式入口：src/styles/tokens.css
    </footer>
  </main>
</template>

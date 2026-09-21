<script setup lang="ts">
  interface Props {
    lines?: number
    showHeader?: boolean
    showSubtitle?: boolean
    avatarSize?: string
    titleWidth?: string
    subtitleWidth?: string
    animated?: boolean
  }

  withDefaults(defineProps<Props>(), {
    lines: 3,
    showHeader: true,
    showSubtitle: true,
    avatarSize: '48px',
    titleWidth: '60%',
    subtitleWidth: '40%',
    animated: true,
  })
</script>

<template>
  <div class="rounded-card border border-border bg-surface p-5" role="status" aria-label="加载中">
    <div aria-hidden="true">
      <div v-if="showHeader" class="mb-5 flex items-center gap-4">
        <div
          class="skeleton-fill shrink-0 rounded-full"
          :class="{ 'skeleton-animated': animated }"
          :style="{ width: avatarSize, height: avatarSize }"
        />
        <div class="min-w-0 flex-1 space-y-2">
          <div
            class="skeleton-fill h-4 rounded-control"
            :class="{ 'skeleton-animated': animated }"
            :style="{ width: titleWidth }"
          />
          <div
            v-if="showSubtitle"
            class="skeleton-fill h-3 rounded-control"
            :class="{ 'skeleton-animated': animated }"
            :style="{ width: subtitleWidth }"
          />
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="i in lines"
          :key="i"
          class="skeleton-fill h-3 rounded-control"
          :class="{ 'skeleton-animated': animated }"
          :style="{ width: i === lines ? '70%' : '100%', animationDelay: `${i * 0.1}s` }"
        />
      </div>
    </div>
  </div>
</template>

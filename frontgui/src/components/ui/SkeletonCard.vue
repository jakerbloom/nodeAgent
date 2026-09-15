<template>
  <div class="skeleton-card" :class="{ 'has-animation': animated }">
    <div v-if="showHeader" class="skeleton-header">
      <div class="skeleton-avatar" :style="{ width: avatarSize, height: avatarSize }" />
      <div class="skeleton-lines">
        <div class="skeleton-line title" :style="{ width: titleWidth }" />
        <div v-if="showSubtitle" class="skeleton-line subtitle" :style="{ width: subtitleWidth }" />
      </div>
    </div>
    <div class="skeleton-content">
      <div
        v-for="i in lines"
        :key="i"
        class="skeleton-line"
        :class="{ short: i === lines }"
        :style="{ animationDelay: `${i * 0.1}s` }"
      />
    </div>
  </div>
</template>

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

<style scoped lang="scss">
.skeleton-card {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.skeleton-avatar {
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  flex-shrink: 0;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 7px;
  width: 100%;

  &.title {
    height: 18px;
    border-radius: 9px;
  }

  &.subtitle {
    height: 12px;
    border-radius: 6px;
  }

  &.short {
    width: 70%;
  }
}

// 动画效果
.has-animation {
  .skeleton-avatar,
  .skeleton-line {
    animation: shimmer 1.5s ease-in-out infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// 暗色模式适配
@media (prefers-color-scheme: dark) {
  .skeleton-card {
    background: #1f1f1f;
    border-color: #333;
  }

  .skeleton-avatar,
  .skeleton-line {
    background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
    background-size: 200% 100%;
  }
}
</style>

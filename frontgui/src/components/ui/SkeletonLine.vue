<template>
  <div class="skeleton-line" :class="{ animated }" :style="lineStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string | number
  height?: string | number
  animated?: boolean
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px',
  animated: true,
  delay: 0,
})

const lineStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  animationDelay: `${props.delay}s`,
}))
</script>

<style scoped lang="scss">
.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;

  &.animated {
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

@media (prefers-color-scheme: dark) {
  .skeleton-line {
    background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
    background-size: 200% 100%;
  }
}
</style>

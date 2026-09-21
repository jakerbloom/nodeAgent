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

<template>
  <div
    class="skeleton-fill rounded-control"
    :class="{ 'skeleton-animated': animated }"
    :style="lineStyle"
    role="status"
    aria-label="加载中"
  />
</template>

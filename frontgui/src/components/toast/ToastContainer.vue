<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useToastStore } from '@/stores'

  const { toasts } = storeToRefs(useToastStore())
  const tones = {
    success: 'border-success text-success',
    error: 'border-error text-error',
    info: 'border-info text-info',
  }
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-4 top-6 z-[9999] flex flex-col gap-3 sm:left-auto sm:right-6 sm:w-80"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 rounded-card border-l-4 bg-surface px-6 py-4 text-sm shadow-card"
          :class="tones[toast.type]"
        >
          <i :class="toast.icon" aria-hidden="true"></i>
          <span class="min-w-0 break-words text-foreground">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition:
      opacity 200ms ease,
      transform 200ms ease;
  }
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateX(1rem);
  }
  @media (prefers-reduced-motion: reduce) {
    .toast-enter-active,
    .toast-leave-active {
      transition: none;
    }
  }
</style>

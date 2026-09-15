<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
          <i :class="toast.icon"></i>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores'

const store = useToastStore()
const { toasts } = storeToRefs(store)
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  border-left: 4px solid;
  pointer-events: auto;
  min-width: 280px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateX(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  i {
    font-size: 20px;
  }

  &.success {
    border-left-color: #52c41a;
    background: #f6ffed;

    i {
      color: #52c41a;
    }
  }

  &.error {
    border-left-color: #ff4d4f;
    background: #fff2f0;

    i {
      color: #ff4d4f;
    }
  }

  &.info {
    border-left-color: #1890ff;
    background: #e6f7ff;

    i {
      color: #1890ff;
    }
  }
}

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 1, 0.45);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

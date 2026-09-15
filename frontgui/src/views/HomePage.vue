<template>
  <div class="home-page">
    <h1>欢迎使用 Frontgui</h1>
    <p>项目初始化成功，请开始你的开发工作。</p>
  </div>
</template>

<script setup lang="ts">
// TODO: 在此添加你的业务逻辑
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-4, 16px);
}

.home-page h1 {
  font-size: var(--font-size-2xl, 24px);
  font-weight: var(--font-weight-bold, 700);
  color: var(--primary-color, #3b82f6);
  margin-bottom: var(--spacing-4, 16px);
}

.home-page p {
  color: var(--text-secondary, #495057);
  font-size: var(--font-size-base, 16px);
}
</style>

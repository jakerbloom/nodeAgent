<template>
  <el-config-provider :locale="zhCn">
    <div id="app">
      <router-view />
      <ToastContainer />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import ToastContainer from '@components/toast/ToastContainer.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}
</style>

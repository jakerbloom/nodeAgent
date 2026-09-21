<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <ToastContainer />
  </el-config-provider>
</template>

<script setup lang="ts">
  import ToastContainer from '@components/toast/ToastContainer.vue'
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

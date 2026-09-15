import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  root: '.',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@api': resolve(__dirname, 'src/api'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@router': resolve(__dirname, 'src/router'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@views': resolve(__dirname, 'src/views'),
    },
  },
  server: {
    port: 18888,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: `js/[name].[hash].js`,
        chunkFileNames: `js/[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return `img/[name].[hash][extname]`
          }
          if (/\.(css)$/i.test(name)) {
            return `css/[name].[hash][extname]`
          }
          return `assets/[name].[hash][extname]`
        },
        manualChunks: {
          // Element Plus
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          // ECharts
          'echarts': ['echarts', 'vue-echarts'],
          // Vue
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Utils
          'utils': ['axios', 'dayjs', 'localforage', 'gsap'],
        },
      },
    },
  },
  publicDir: 'public',
})

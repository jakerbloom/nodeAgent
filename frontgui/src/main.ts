import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { piniaLocalforagePlugin } from './stores/plugins/localforage'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Noto Sans SC
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/noto-sans-sc/700.css'

import './styles/index.css'

// ==================== ECharts ====================
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
])

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaLocalforagePlugin)

app.use(pinia)
app.use(router)
// Element Plus

async function bootstrap() {
  if (import.meta.env.DEV && import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledRequest: 'bypass',
    })
  }
  app.mount('#app')
}

void bootstrap().catch(error => {
  console.error('应用启动失败:', error)
})

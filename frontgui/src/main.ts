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

import './styles/index.scss'

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

app.mount('#app')

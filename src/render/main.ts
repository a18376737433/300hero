import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElIconModules from '@element-plus/icons-vue'

const app = createApp(App as any)
Object.entries(ElIconModules).forEach(([name, module]) => {
  app.component(name, module)
})
app.use(ElementPlus, { size: 'default', zIndex: 3000 })
app.mount('#app')

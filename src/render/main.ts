import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './index.scss'

import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

const app = createApp(App as any)
Object.entries(ElIconModules).forEach(([name, module]) => {
  app.component(name, module)
})

app.mount('#app')

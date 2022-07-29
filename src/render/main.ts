import { createApp } from 'vue'
import App from './App.vue'
import 'tailwindcss/tailwind.css'
import './index.scss'
import * as ElIconModules from '@element-plus/icons-vue'

const app = createApp(App as any)
Object.entries(ElIconModules).forEach(([name, module]) => {
  app.component(name, module)
})

app.mount('#app')

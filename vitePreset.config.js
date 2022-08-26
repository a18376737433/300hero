import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Vue from '@vitejs/plugin-vue'
export default () => [
  AutoImport({ imports: ['vue'] }),
  Components({
    resolvers: [ElementPlusResolver()],
    dirs: ['src/render/components']
  }),
  ElementPlus(),
  Vue()
]

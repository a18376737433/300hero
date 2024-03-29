/**
 * 参考链接: https://vitejs.dev/config/
 */
import { join } from 'path'
import { UserConfig } from 'vite'
import dotenv from 'dotenv'
import vitePreset from './vitePreset.config'
dotenv.config({ path: join(__dirname, '.env') })
const root = join(__dirname, 'src/render')

const config: UserConfig = {
  root,
  resolve: {
    alias: {
      '@': root,
      '@@': __dirname
    }
  },
  base: './',
  build: {
    outDir: join('../../dist/render'),
    emptyOutDir: true
  },
  server: {
    port: +process.env.PORT!
  },
  plugins: [vitePreset()],
  optimizeDeps: {
    exclude: ['electron-is-dev', 'electron-store']
  }
}

export default config

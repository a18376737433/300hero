import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, resolve } from 'path'
import is_dev from 'electron-is-dev'
import schedule from 'node-schedule'
import dotenv from 'dotenv'
import Store from 'electron-store'
import { useMenu } from './modules/menu'
import { useTray } from './modules/tray'
import AutoUpdate from './modules/autoUpdate'
import { useGlobalShortcut } from './modules/globalShortcut'
import game from './modules/auto-game'
import { getcounts, isExpire } from './modules/auto-game/utlis'

if (!is_dev) {
  new AutoUpdate()
}
const job = schedule.scheduleJob('9 * * * *', function (firDate) {
  console.log('The answer to life, the universe, and everything!' + firDate)
})
const getPublicFile = (is_dev: boolean, file: string): string => {
  return is_dev ? resolve(__dirname, `../../src/render/public/${file}`) : resolve(__dirname, `../render/public/${file}`)
}
export const icoPath = getPublicFile(is_dev, '1.ico')
dotenv.config({ path: join(__dirname, '../../.env') })
ipcMain.on('onWindow', (e, state) => {
  switch (state) {
    case 'start':
      game.start()
      break
    case 'stop':
      game.stop()
      break
    default:
      game.test()
      break
  }
})
const store = new Store()
ipcMain.on('store:set', async (e, { key, value }) => {
  store.set(key, value)
})
ipcMain.on('store:get', (e, name) => {
  if (name == 'counts') {
    e.returnValue = getcounts(game.currentAccoutn.name)
    return
  }
  if (name == 'config') {
    const config: any = store.get(name)
    config.accounts.forEach((account) => {
      if (isExpire(account.expire)) {
        account.current_count = 0
      }
    })
    e.returnValue = config
    return
  }
  e.returnValue = store.get(name)
})
// ipcMain.handle('store:get', (e, args) => {
//   return store.get(args)
// })
ipcMain.on('store:delete', async (e, args) => {
  store.delete(args)
})
let win: BrowserWindow
function createWindow() {
  win = new BrowserWindow({
    width: is_dev ? 1440 : 1280,
    height: 900,
    icon: icoPath,
    title: `${app.getName()} v${app.getVersion()}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: getPublicFile(is_dev, 'preload.js')
    }
  })
  const URL = is_dev
    ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
    : `file://${join(__dirname, '../../dist/render/index.html')}` // vite 构建后的静态文件地址
  win.loadURL(URL)
  is_dev && win.webContents.openDevTools()
  useTray(win)
  useGlobalShortcut(win)
  !is_dev && useMenu()
  // win.on('minimize', () => {
  //   win.hide()
  // })
}

app.whenReady().then(() => {
  createWindow()
  global.win = win
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.setAppUserModelId(app.getName() || '300hero')

import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, resolve } from 'path'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import { useTray } from '@/core/Tray'
import { useMenu } from '@/core/Menu'
import store from '@/core/Store'
import { useAppUpdater } from '@/core/AutoUpdate'
import { useGlobalShortcut } from '@/core/GlobalShortcut'
import { Schedule } from '@/core/Schedule'
import game from '@/modules/auto-game'
import { getcounts, isExpire, log, msg } from '@/modules/auto-game/utlis'
import { getConfig, formatJobTime } from '@/utils'
import { Config } from '../../config'

const job = new Schedule() //定时任务

const getPublicFile = (is_dev: boolean, file: string): string => {
  const path = is_dev ? `../../src/render/public/${file}` : `../render/${file}`
  return resolve(__dirname, path)
}
export const icoPath = getPublicFile(is_dev, 'trayIcon.ico')
dotenv.config({ path: join(__dirname, '../../.env') })

ipcMain.on('saveConfig', async (_, config) => {
  const { jobTime: oldJobTime, shutdown: oldShutdown } = getConfig()
  store.set('config', config)
  //更新定时任务
  job.update([oldJobTime, oldShutdown])
})
ipcMain.on('onWindow', (e, state) => {
  game[state] && game[state]()
})
ipcMain.on('getConfig', (e) => {
  const config = store.get('config') as Config
  config?.accounts.forEach((item) => {
    if (isExpire(item.expire!)) {
      item.current_count = 0
    }
  })
  e.returnValue = config
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
  useAppUpdater()
  useTray(win)
  useGlobalShortcut(win)
  useMenu()
}

app.whenReady().then(() => {
  //禁止重复运行
  if (!app.requestSingleInstanceLock()) {
    msg('已经打开过一个了', '重复运行')
    app.quit()
  }

  createWindow()
  global.win = win
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.setAppUserModelId(app.getName() || '300英雄助手')

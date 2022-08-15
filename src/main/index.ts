import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, resolve } from 'path'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import Store from 'electron-store'
import { useMenu } from '@/core/Menu'
import { useTray } from '@/core/Tray'
import { useAppUpdater } from '@/core/AutoUpdate'
import { useGlobalShortcut } from '@/core/GlobalShortcut'
import { Schedule } from '@/core/Schedule'
import game from '@/modules/auto-game'
import { getcounts, isExpire, log } from '@/modules/auto-game/utlis'
import { getConfig, formatJobTime } from '@/utils'
import { exec } from 'child_process'
import schedule from 'node-schedule'
const store = new Store()
// const job = schedule.scheduleJob('0 0 * * *', function (firDate) {
//   console.log('The answer to life, the universe, and everything!' + firDate)
// })

const getPublicFile = (is_dev: boolean, file: string): string => {
  return is_dev ? resolve(__dirname, `../../src/render/public/${file}`) : resolve(__dirname, `../render/${file}`)
}
export const icoPath = getPublicFile(is_dev, '1.ico')
dotenv.config({ path: join(__dirname, '../../.env') })

const createJob = (time, cb) => {
  if (!time) return null
  return schedule.scheduleJob(formatJobTime(time), cb)
}
const createRunJob = (time) =>
  createJob(time, () => {
    game.test()
  })
const createShutdownJob = (time) =>
  createJob(time, () => {
    console.log('????????????')
  })
const { jobTime, shutdown } = getConfig()
const runJob = createRunJob(jobTime)
const shutdownJob = createShutdownJob(shutdown)

console.log('jobTime, shutdown :>> ', jobTime, shutdown)

ipcMain.on('updateConfig', async (_, config) => {
  const { jobTime: oldJobTime, shutdown: oldShutdown } = getConfig()
  const { jobTime, shutdown } = config
  store.set('config', config)
  //更新定时任务
  if (oldJobTime != jobTime) {
    await Schedule.reset()
    if (!jobTime) return
    new Schedule(jobTime, () => {
      game.test()
    })
  }
  if (oldShutdown != shutdown) {
    await Schedule.reset()
    if (!shutdown) return
    new Schedule(shutdown, () => {
      console.log('???????22?????')
    })
  }
})
ipcMain.on('onWindow', (e, state) => {
  game[state] && game[state]()
})

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
    config.accounts?.forEach((account) => {
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
  useAppUpdater()
  useTray(win)
  useGlobalShortcut(win)
  useMenu()
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

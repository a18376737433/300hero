import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, resolve } from 'path'
import is_dev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'
const log = require('electron-log')

import dotenv from 'dotenv'
import Store from 'electron-store'
import { useMenu } from './modules/menu'
import { useTray } from './modules/tray'
import AutoUpdate from './modules/autoUpdate'
import { useGlobalShortcut } from './modules/globalShortcut'
import game from './modules/auto-game'
import { getGameCount } from './modules/auto-game/utlis'

new AutoUpdate()
console.log('this is todo branch version ', app.getVersion())
export const icoPath = is_dev ? join(__dirname, '../../src/render/public/1.ico') : join(__dirname, '../render/1.ico')
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
  if (name == 'gameCount') {
    e.returnValue = getGameCount()
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
let win
function createWindow() {
  win = new BrowserWindow({
    width: is_dev ? 1280 : 900,
    height: 700,
    icon: icoPath,
    title: `${app.getName()} v${app.getVersion()}`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  const URL = is_dev
    ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
    : `file://${join(__dirname, '../../dist/render/index.html')}` // vite 构建后的静态文件地址
  win.loadURL(URL)
  is_dev && win.webContents.openDevTools()
  useTray(win)
  useGlobalShortcut(win)
  useMenu(win)
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

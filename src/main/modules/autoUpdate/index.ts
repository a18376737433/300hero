import { autoUpdater } from 'electron-updater'
const log = require('electron-log')
const sendStatusToWindow = (text) => {
  log.info(text)
}
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.on('checking-for-update', () => {
      sendStatusToWindow('Checking for update...')
    })
    autoUpdater.on('update-available', (info) => {
      sendStatusToWindow('Update available.')
    })
    autoUpdater.on('update-not-available', (info) => {
      sendStatusToWindow('Update not available.')
    })
    autoUpdater.on('error', (err) => {
      sendStatusToWindow('Error in auto-updater. ' + err)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = 'Download speed: ' + progressObj.bytesPerSecond
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
      log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      sendStatusToWindow(log_message)
    })
    autoUpdater.on('update-downloaded', (info) => {
      sendStatusToWindow('Update downloaded')
    })
    autoUpdater.checkForUpdatesAndNotify({ title: '更新提示', body: '{appName}版本{version}已下载，将在退出时自动安装' })
  }
}

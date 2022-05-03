import { autoUpdater } from 'electron-updater'
const log = require('electron-log')

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify({ title: '更新提示', body: '{appName}版本{version}已下载，将在退出时自动安装' })
  }
}

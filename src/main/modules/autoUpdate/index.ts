import { autoUpdater } from 'electron-updater'
const log = require('electron-log')
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

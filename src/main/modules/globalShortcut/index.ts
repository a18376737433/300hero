import { globalShortcut, Notification, ipcMain } from 'electron'
import { msg } from '../auto-game/utlis'
import { resolve } from 'path'
export const useGlobalShortcut = (win) => {
  const result1 = globalShortcut.register('f1', () => {
    win.webContents.send('shortcut_key', { key: 'f1' })
  })
  const result2 = globalShortcut.register('f2', () => {
    win.webContents.send('shortcut_key', { key: 'f2' })
  })
  if (!result2) {
    msg('快捷键被占用')
  }
}

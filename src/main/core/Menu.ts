import { Menu } from 'electron'
import is_dev from 'electron-is-dev'
export const useMenu = (): void => {
  if (is_dev) return
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)
}

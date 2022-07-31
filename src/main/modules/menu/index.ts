import { Menu } from 'electron'
export const useMenu = (): void => {
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)
}

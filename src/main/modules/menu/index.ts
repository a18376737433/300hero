import { Menu } from 'electron'
export const useMenu = (win) => {
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)
}

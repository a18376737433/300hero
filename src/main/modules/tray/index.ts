import { Tray, Menu } from 'electron'
import { resolve, join } from 'path'
let appIcon: any
export const useTray = (win: any): void => {
  appIcon = new Tray(join(__dirname, '../render/1.ico'))
  appIcon.on('click', () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  appIcon.popUpContextMenu()
  appIcon.setToolTip('tysb!!!')
  const contextMenu = Menu.buildFromTemplate([{ label: '退出', click: () => win.close() }])
  appIcon.setContextMenu(contextMenu)
}

import { Tray, Menu } from 'electron'
import { icoPath } from '../../index'
let appIcon: any
export const useTray = (win: any): void => {
  appIcon = new Tray(icoPath)
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

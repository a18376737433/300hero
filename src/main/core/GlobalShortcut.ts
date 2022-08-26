import { globalShortcut, BrowserWindow } from 'electron'
import game from '@/modules/auto-game'
export const useGlobalShortcut = (win: BrowserWindow): void => {
  globalShortcut.register('f1', () => {
    game.start()
  })
  globalShortcut.register('f2', () => {
    game.stop()
  })
}

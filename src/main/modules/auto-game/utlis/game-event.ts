import { isInHall, isInLogin, isGameing, msg, libDir, getGameCount, setGameCount } from './index'
import * as dm from '../../dm'
import Store from 'electron-store'
class GameEvent {
  _callbacks = {}
  _timeId
  _state

  hwnd
  config
  matchInfo = {}
  constructor() {}
  findGameWindow() {
    const hwnd = dm.findWindow('WWW_JUMPW_COM', '')
    if (!hwnd) {
      msg('游戏窗口未找到')
      return
    }

    dm.dll.BindWindowEx(hwnd, 'gdi', 'normal', 'windows', 'dx.public.disable.window.position', 0)
    this.hwnd = hwnd
  }
  get gameCount() {
    return getGameCount()
  }
  set gameCount(val) {
    setGameCount(val)
    global.win.webContents.send('match:update', {
      match: this.matchInfo,
      count: this.gameCount
    })
  }
  async start() {
    if (this._timeId) return
    this.findGameWindow()

    if (!this.hwnd) return
    dm.dll.Beep(800, 800)
    console.log('脚本开始')
    dm.dll.SetWindowText(this.hwnd, 'tysb')
    dm.setWindowState(this.hwnd, 1)
    this.config = new Store().get('config') || {}
    dm.setPath(libDir)
    global.win.webContents.send('match:update', {
      match: this.matchInfo,
      count: this.gameCount
    })
    //ToDo  大厅背景可能导致不正常
    this._timeId = setInterval(() => {
      if (isGameing()) {
        this.state = 'zc'
        return
      }
      if (isInLogin()) {
        this.state = 'dl'
        return
      }
      if (isInHall()) {
        this.state = 'dt'
        return
      }
    }, 1000)
  }
  stop() {
    if (!this._timeId) return
    dm.dll.Beep(500, 500)

    console.log(`[${new Date().toLocaleString()}]`, '脚本停止')
    // dm.unBindWindow()
    clearInterval(this._timeId)
    this._timeId = null
    this.state = null
  }
  async test() {
    this.gameCount += 1
    // this.findGameWindow()
    // dm.setWindowState(this.hwnd, 1)
  }
  on(eventName: string, cb: any) {
    this._callbacks[eventName] = (this._callbacks[eventName] || []).concat(cb)
  }
  async emit(eventName: string, ...args: any[]) {
    if (this.gameCount > this.config.qs.gameCount) {
      this.stop()
    }
    if (!this._callbacks[eventName]) return
    for (const cb of this._callbacks[eventName]) {
      await cb.call(this, ...args)
    }
  }
  get state() {
    return this._state
  }
  set state(val) {
    if (this._state != val) {
      this._state = val
      this.emit(val, this.hwnd)
    }
  }
}
export default GameEvent

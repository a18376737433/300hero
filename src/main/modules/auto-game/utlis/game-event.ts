import { isInHall, isInLogin, isGameing, msg, libDir, getcounts, setcounts, useEsc, log, isExpire } from '@/modules/auto-game/utlis'
import * as dm from '@/core/Dm'
import { Task } from '@/core/Task'
import Store from 'electron-store'
import { machineIdSync } from 'node-machine-id'
import { fetch } from '@/utils/fetch'
import { getConfig } from '@/utils'

const getAccoutn = () => {
  const { accounts = [] } = getConfig()
  for (const item of accounts) {
    if (getcounts(item.name) < item.counts) {
      log(item.name)
      return item
    }
  }
  log('获取到账号为空')
  return {} as any
}
class GameEvent extends Task {
  _callbacks = {}
  _timeId
  _state

  hwnd
  config = getConfig()
  currentAccoutn = getAccoutn()
  matchInfo = {}

  constructor() {
    super()
  }
  findGameWindow() {
    const hwnd = dm.findWindow('WWW_JUMPW_COM', '')
    if (!hwnd) {
      msg('游戏窗口未找到')
      return
    }

    dm.dll.BindWindowEx(hwnd, 'gdi', 'normal', 'windows', 'dx.public.disable.window.position', 0)
    this.hwnd = hwnd
  }
  get current_count() {
    return getcounts(this.currentAccoutn?.name)
  }
  set current_count(val) {
    console.log('val :>> ', val, this.currentAccoutn?.name)
    setcounts(val, this.currentAccoutn?.name)
    global.win.webContents.send('match:update', this.currentAccoutn)
  }
  async start() {
    const NOW = await fetch('http://quan.suning.com/getSysTime.do').then(({ sysTime2 }) => new Date(sysTime2).getTime())
    if (NOW > new Date('2022/8/30').getTime()) {
      msg('验证失败')
      return
    }
    if (this._timeId) return
    this.findGameWindow()

    if (!this.hwnd) return
    dm.dll.Beep(800, 800)
    log('脚本开始')
    dm.dll.SetWindowText(this.hwnd, 'tysb')
    dm.setWindowState(this.hwnd, 1)
    this.config = getConfig()
    this.currentAccoutn = getAccoutn()
    dm.setPath(libDir)
    global.win.webContents.send('match:update', this.currentAccoutn)
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
  async test() {
    console.log(machineIdSync())
    // this.findGameWindow()
    // dm.setWindowState(this.hwnd, 1)
    this.openGame()
  }
  stop() {
    if (!this._timeId) return
    dm.dll.Beep(500, 500)
    log('脚本停止')
    // dm.unBindWindow()
    clearInterval(this._timeId)
    this._timeId = null
    this.state = null
  }
  gb() {
    this.kill()
  }
  jc() {
    console.log(this.isRunning())
  }
  on(eventName: string, cb: any) {
    this._callbacks[eventName] = (this._callbacks[eventName] || []).concat(cb)
  }

  async emit(eventName: string, ...args: any[]) {
    let { counts, name } = this.currentAccoutn || this.config?.accounts[0]

    if (this.current_count >= counts && this.state == 'dt') {
      log(`${name}这个账号打完了`)
      await useEsc()
      //this.stop()
      return
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
      val && this.emit(val, this.hwnd)
    }
  }
}
export default GameEvent

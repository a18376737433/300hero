import * as dm from '@/core/Dm'
import XY from '@/modules/auto-game/utlis/xy'
import KEY from '@/modules/auto-game/utlis/key'
import { resolve, join } from 'path'
import { Notification } from 'electron'
import isDevelop from 'electron-is-dev'
import store from '@/core/Store'
import { icoPath } from '@/index'
import { getConfig } from '@/utils'
type Xy = [number, number]
export const isExpire = (expire: number): boolean => expire != new Date().setHours(0, 0, 0, 0)
export const setcounts = (count: number, account: string): void => {
  const config = store.get('config') as any
  config.accounts.forEach((item) => {
    if (item.name === account) {
      item.expire = new Date().setHours(0, 0, 0, 0)
      item.current_count = count
      console.log(item.current_count + '/' + item.counts)
    }
  })
  store.set('config', config)
  global.win.webContents.send('updateConfig', getConfig())
}
export const getcounts = (account: string) => {
  const { accounts } = store.get('config') as any
  const current_account = accounts.find((item) => item.name === account)
  if (isExpire(current_account.expire)) {
    setcounts(0, account)
    return 0
  }
  return current_account.current_count
}
/**
 *
 * @param {number} time 延时时间 毫秒
 * @returns
 */
export const libDir = join(__dirname, isDevelop ? '../../src/main/library' : '../../../library')
export const random = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min)
}
export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
export const leftClick = (x: number, y: number) => {
  dm.moveTo(x, y)
  dm.leftClick()
}
export const rightClick = (x: number, y: number) => {
  dm.moveTo(x, y)
  dm.rightClick()
}
export const leftDoubleClick = (x: number, y: number) => {
  dm.moveTo(x, y)
  dm.leftDoubleClick()
}
/**
 *
 * @returns {boolean} 是否选中角色
 */
export const isCheckedRole = () => {
  return !dm.findPic(495, 7, 590, 67, './img/xr.bmp', '000000', 0.9, 0)
}
export const checkedRole = (name, hwnd) => {
  leftDoubleClick(...XY['xzjs_srk'].xy)
  dm.sendString(hwnd, name)
  dm.keyPress(KEY['enter'])
  leftClick(...XY['xzdyg'].xy)
  return name
}
/**
 *
 * @returns {boolean} 是否在红色方
 */
export const isRed = () => {
  return !!dm.findColor(543, 2, 614, 28, 'fb6e75', 0.9, 0)
}
/**
 *
 * @param {string} skill 技能名称 Q W E R
 * @returns {boolean}
 */
export const isCdOk = (skill) => {
  const skillXY = {
    q: [557, 721, 607, 771, 2],
    w: [610, 721, 660, 771, 2],
    e: [666, 721, 716, 771, 2],
    r: [719, 721, 769, 771, 2]
  }
  return !!dm.dll.IsDisplayDead(...skillXY[skill])
}

export const useSkill = async ({ skill, equip, jd, lt, sq_index, zb_index, isSpring, name, color }, isDebug) => {
  type XyMap = {
    [name: string]: [number, number]
  }
  const camp: XyMap = {
    RED: [1261, 560], //在左边时对面水晶的位置
    BLUE: [1042, 787] //在右边时对面水晶的位置
  }
  const offset: XyMap = {
    RED: [1003, 65], //在左边时的偏移量
    // BLUE: [330, 720] //在右边时的偏移量
    BLUE: [336, 742]
  }
  //雷霆 r 战法
  //975,78
  isDebug && leftClick(...([28, 337] as Xy)) //刷新冷却
  if (isSpring) {
    dm.keyPress(KEY['y'])
    leftClick(...camp[color]) //点水晶
  }

  //y 点水晶 移动鼠标  放r y0
  if (jd || lt) {
    dm.keyPress(KEY['t'])
    await sleep(1000)
    leftClick(...XY['qbzb'].xy)
    await sleep(300)
    unEquip(zb_index)
    await sleep(300)
    lt && clickPack(lt)
  }
  if (isSpring) {
    await sleep(300)
    dm.moveTo(...offset[color]) //基于水晶的偏移量
    await sleep(300)
  }

  dm.keyPress(KEY[skill]) //释放挂机技能

  //黑羽快斗 要多次点击r下车 防止飞出泉水
  if (name == '黑羽快斗') {
    await sleep(1100)
    dm.keyPress(KEY[skill])
    await sleep(100)
    dm.keyPress(KEY[skill])
  }

  if (lt) {
    await sleep(400)
    unEquip(zb_index)
  }
  if (jd) {
    await sleep(500)
    clickPack(jd) //装备 鸡刀
  }
  if (equip.length && !isSpring) {
    await sleep(100)
    for (const e of equip) {
      await useProp(e)
    }
    await sleep(3300)
  }

  if (jd || lt) {
    await sleep(300)
    unEquip(zb_index)
    await sleep(300)
    clickPack(sq_index)
    await sleep(300)
    dm.keyPress(KEY['t'])
  }

  if (isSpring) {
    dm.keyPress(KEY['y'])
  }
  if (equip.length && isSpring) {
    await sleep(300)
    for (const e of equip) {
      await useProp(e)
    }
    await sleep(3500)
  }
}
export const isDie = () => {
  return !!dm.findColor(400, 786, 413, 797, '272734', 0.8, 0)
}

export const isEmptyMP = (mp = 40) => {
  //ToDo 添加血量检测
  let l = 644 + (240 * mp) / 100
  return !!dm.findColor(645, 785, l, 798, '272734', 0.8, 0)
}
export const useSmallScreen = async (hwnd) => {
  let { width, height } = dm.getClientSize(hwnd) || {}

  if (width != 1280 || height != 800) {
    let offsetX = (width! - 1280) / 2
    let offsetY = (height! - 800) / 2
    dm.keyPress(KEY['esc'])
    await sleep(500)
    leftClick(XY['ymsz'].xy[0] + offsetX, XY['ymsz'].xy[1] + offsetY)
    await sleep(500)
    leftClick(XY['ckms'].xy[0] + offsetX, XY['ckms'].xy[1] + offsetY)
    await sleep(500)
    leftClick(XY['fbl'].xy[0] + offsetX, XY['fbl'].xy[1] + offsetY)
    await sleep(500)
    leftClick(XY['fbl_xz'].xy[0] + offsetX, XY['fbl_xz'].xy[1] + offsetY)
    await sleep(500)
    leftClick(XY['yy'].xy[0] + offsetX, XY['yy'].xy[1] + offsetY)
    await sleep(500)
    dm.keyPress(KEY['esc'])
    await sleep(5000)
  }
}
export const isGameEnd = () => {
  return !!dm.findPic(1003, 682, 1197, 761, './img/game_end.bmp', '000000', 0.8, 0)
}
export const isBan = (sim: number = 0.9): boolean => {
  return !!dm.findColor(1217, 40, 1253, 79, '800408', sim, 0)
}
export const log = (msg: any, ...args: any): void => {
  console.log(`[${new Date().toLocaleString()}] [300 hero]  ${msg}`, ...args)
}

export const useProp = async (n) => {
  dm.moveTo(...XY['zddj'].xy)
  await sleep(200)

  dm.keyPress(KEY[n])
}
const _t = (n = 1) => {
  //n  第几个
  //计算背包格子的坐标
  let initX = 760
  let initY = 160
  let r, c
  r = Math.ceil(n / 6)
  c = n % 6 ? n % 6 : 6
  return [initX + c * 70, initY + r * 70] as Xy
}
export const clickPack = async (...args) => {
  for (const i of args) {
    rightClick(..._t(i))
    await sleep(300)
  }
}
export const unEquip = (...args) => {
  for (const i of args) {
    rightClick(...XY[`equip${i}`].xy)
  }
}

export const useLock = async () => {
  leftClick(...XY['xdt_zsj'].xy)
  await sleep(300)
  if (dm.getColor(1036, 552) === 'ffffff') {
    console.log('解锁视角！')
    dm.keyPress(KEY['y'])
    await sleep(2000)
  }
}
export const isInHall = () => {
  let result1 = !!dm.findPic(579, 0, 709, 80, './img/hall1.bmp', '000000', 0.7, 0)
  let result2 = !!dm.findPic(579, 0, 709, 80, './img/hall2.bmp', '000000', 0.7, 0)
  return result1 || result2
}
export const isInLogin = () => {
  return !!dm.findPic(1157, 210, 1238, 281, './img/login.bmp', '000000', 0.8, 0)
}
export const isGameing = () => {
  //return !!dm.findColor(400, 786, 413, 797, '209c31', 0.8, 0) || !!dm.findColor(400, 786, 413, 797, '184B0F', 0.8, 0)
  return !!dm.findColor(400, 786, 413, 797, '209c31', 0.8, 0)
}
export const useClickLike = async () => {
  dm.keyDown(KEY['tab'])
  await sleep(500)
  leftClick(...XY['dz'].xy)
  await sleep(300)
  dm.keyUp(KEY['tab'])
}
export const useEye = async () => {
  dm.keyPress(KEY['z'])
  leftClick(...XY['zddj'].xy)
}
export const useEsc = async () => {
  dm.keyPress(KEY['esc'])
  await sleep(1000)
  leftClick(...([898, 483] as Xy)) //点击离开
  dm.keyPress(KEY['enter'])
  await sleep(500)
  dm.keyPress(KEY['enter'])
}
export const findStr = () => {
  console.log(dm.ocr(47, 363, 82, 391, '000000', 1))
}
export const msg = (body, title = '提示') => {
  new Notification({
    title,
    body,
    icon: icoPath
  }).show()
}

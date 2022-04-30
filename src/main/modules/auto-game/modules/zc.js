import * as dm from '../../dm'
import XY from '../utlis/xy'
import KEY from '../utlis/key'
import { setGameCount, isBan, sleep, leftClick, checkedRole, isCheckedRole, isGameing, useSmallScreen, useLock, rightClick, isRed, isCdOk, useSkill, KN_R, useProp, isGameEnd, isEmptyMP, isDie, useClickLike, useEye, useEsc } from '../utlis'
//Match
const transformState = (state) => {
  const stateMap = {
    T: true,
    F: false,
    R: Math.random() > 0.5
  }
  return stateMap[state]
}
export async function useZc(hwnd) {
  const qsOption = this.config.qs
  const isZC = () => {
    return this.state == 'zc'
  }
  console.log('zc界面')

  if (!isGameing()) {
    console.log('游戏没有加载完成！')
    this.state = null
    return
  }
  await sleep(2000)
  this.matchInfo.isRed = isRed()
  this.matchInfo.dieQuitCount = 0

  //初始化走位 防止进来就被杀
  rightClick(...XY[this.matchInfo.isRed ? 'qs_red' : 'qs_blue'].xy)
  //初始化屏幕大小
  await useSmallScreen(hwnd)

  //初始化视角 ToDo 可能每局都要调用一次
  await useLock()
  await sleep(3000)
  rightClick(...XY[this.matchInfo.isRed ? 'qs_red' : 'qs_blue'].xy)
  //**开始泉水挂机 */
  if (transformState(qsOption.clickLike)) {
    await useClickLike()
  }
  if (transformState(qsOption.insertEye)) {
    await useEye()
  }

  if (!isZC()) {
    //提前退出  防止状态异常
    this.state = null
    return
  }
  // this.matchInfo.role = '康娜'
  // this.matchInfo.isRed = true

  const { name, skill, equip, hou = [], isSpring = false } = qsOption.role.find((e) => e.name == this.matchInfo.role) || {}

  const { zb_index, sq_index, lt_index, jd_index, interval = 1 } = qsOption

  const jd = hou.includes('鸡刀') && jd_index,
    lt = hou.includes('雷霆') && lt_index
  console.log(`[${new Date().toLocaleString()}]`, `${name}的配置`, `${interval}秒检测一次`, `${isSpring ? '对泉水' : ''}`, `使用${skill}技能`, `使用${equip}装备`, `${jd ? '使用鸡刀' : ''}`, `${lt ? '使用雷霆' : ''}`)
  console.log('循坏条件', isGameing(), isZC())
  while (isGameing() && isZC()) {
    const xy = isRed() ? [727, 666] : [615, 412],
      color = isRed() ? 'RED' : 'BLUE'

    if (qsOption.stateDefend && isEmptyMP(qsOption.lower)) {
      for (const equipIndex of qsOption.equip) {
        await useProp(equipIndex)
      }
    }

    if (skill && isCdOk(skill)) {
      rightClick(...xy)
      await sleep(1000)
      await useSkill({ skill, equip, jd, lt, sq_index, zb_index, isSpring, name, color })
    }
    if (!skill) {
      Math.random() < 0.05 && rightClick(...xy)
    }
    await sleep(interval * 1000)
    rightClick(...XY[this.matchInfo.isRed ? 'qs_red' : 'qs_blue'].xy)

    if (isGameEnd() && isZC()) {
      console.log('结束退出')
      dm.keyPress(KEY['enter'])
      this.gameCount += 1
      return
    }

    if (qsOption.dieQuit && isDie() && isZC()) {
      console.log('死亡退出')
      await useEsc()
      this.gameCount += 1
      return
    }
  }
}

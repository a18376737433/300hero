import XY from '@/modules/auto-game/utlis/xy'
import KEY from '@/modules/auto-game/utlis/key'
import * as dm from '@/modules/dm'
import { isBan, sleep, leftClick, checkedRole, isCheckedRole, isInHall } from '@/modules/auto-game/utlis'
const _entry = [
  XY.play,
  XY.zc,
  XY.zc_dryx
  // XY.del,
  // XY.del_dryx
  // XY.xlc,
  // XY.xlc_dryx
]
export async function useHall(hwnd) {
  const { role: _role, randomRole } = Object.assign(this?.config?.qs, this.currentAccoutn)
  const { mode = 'zc' } = this.config
  console.log('大厅界面')
  await sleep(2000)
  //关闭更新公告
  dm.keyPress(KEY['enter'])
  leftClick(...XY['gxgg_gb'].xy)

  //禁赛处理  ToDo jjc禁赛可能会影响到判断
  while (isBan() && this.state == 'dt') {
    console.log('禁赛中')
    await sleep(60 * 1000)
  }
  //进入选人界面
  if (mode == 'zc') {
    dm.moveTo(645, 39)
    await sleep(2000)
    dm.moveTo(646, 40)
    dm.moveTo(707, 77)
    dm.leftClick()
  }
  if (mode == 'dds') {
    leftClick(...XY['play'].xy)
    leftClick(184, 498)
    leftClick(645, 674)
  }
  if (mode == 'sz') {
    leftClick(...XY['play'].xy)
    leftClick(...XY['zc'].xy)
    leftClick(566, 647) //神战 zc  世界战场
  }
  // for (const { xy, desc, delay = 100 } of _entry) {
  //   leftClick(...xy)
  //   //console.log(desc)
  //   await sleep(delay)
  // }
  //选择角色
  await sleep(5000)
  if (randomRole) {
    leftClick(...XY['cj'].xy)
    await sleep(500)
    dm.keyPress(KEY['enter'])
    await sleep(500)
    leftClick(...XY['cj'].xy)
    this.matchInfo.role = '随机'
  } else {
    for (const { name } of _role) {
      await sleep(500)
      checkedRole(name, hwnd)
      await sleep(1000)
      if (isCheckedRole()) {
        leftClick(...XY['cj'].xy)
        this.matchInfo.role = name
        break
      }
    }
  }

  isInHall() && this.state && useHall.call(this, hwnd)
}

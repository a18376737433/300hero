import * as dm from '../../dm'
import XY from '../utlis/xy'
import { sleep, msg, getGameCount } from '../utlis'
export async function useLogin(hwnd) {
  console.log('登陆界面', hwnd)
  // if (!this.config.qs.reconnect) {
  //   return
  // }

  const { accountList } = this.config

  for (const i in accountList) {
    let account = accountList[i]
    let { gameCount = 0, name, password } = account
    if (getGameCount(name) < gameCount) {
      console.log(`登陆账号---> ${name}`)
      this.currentAccoutn = account
      //输入账号
      if (name) {
        dm.moveTo(...XY['zh'].xy)
        dm.leftDoubleClick()
        dm.sendString(hwnd, name)
        await sleep(500)
      }
      if (password) {
        //输入密码
        dm.moveTo(...XY['mm'].xy)
        dm.leftDoubleClick()
        dm.sendString(hwnd, password)
        await sleep(500)
      }
      //点击登录
      dm.moveTo(...XY['jryx'].xy)
      dm.leftClick()

      return
    }
    if (i == accountList.length - 1) {
      msg('今日游戏次数已用完')
      this.stop()
    }
  }
}

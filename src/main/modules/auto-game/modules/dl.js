import * as dm from '@/core/Dm'
import XY from '@/modules/auto-game/utlis/xy'
import { sleep, msg, getcounts } from '@/modules/auto-game/utlis'
export async function useLogin(hwnd) {
  console.log('登陆界面', hwnd)
  // if (!this.config.qs.reconnect) {
  //   return
  // }

  const { accounts } = this.config

  for (const i in accounts) {
    let account = accounts[i]
    let { counts = 0, name, password } = account
    if (getcounts(name) < counts) {
      console.log(`登陆账号---> ${name}`)
      this.currentAccoutn = account
      //输入账号
      if (name) {
        dm.moveTo(...XY['zh'].xy)
        dm.leftDoubleClick()
        await sleep(1000)
        dm.sendString(hwnd, name)
      }
      await sleep(1000)
      if (password) {
        //输入密码
        dm.moveTo(...XY['mm'].xy)
        dm.leftDoubleClick()
        await sleep(1000)
        dm.sendString(hwnd, password)
      }
      //点击登录
      dm.moveTo(...XY['jryx'].xy)
      dm.leftClick()

      return
    }
    if (i == accounts.length - 1) {
      msg('打完收工')
      this.stop()
    }
  }
}

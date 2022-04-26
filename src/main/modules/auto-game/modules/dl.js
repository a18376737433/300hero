import * as dm from '../../dm'
import XY from '../utlis/xy'
import { sleep } from '../utlis'
export async function useLogin(hwnd) {
  console.log('登陆界面', hwnd)
  if (!this.config.qs.reconnect) {
    return
  }
  //await sleep(1000);
  const { name, password } = this.config.user
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
}

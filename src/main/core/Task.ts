import { execSync, exec } from 'child_process'
import { log } from '../modules/auto-game/utlis/index'
import url from 'url'
import Store from 'electron-store'
const getConfig = (): any => new Store().get('config') || {}
export class Task {
  constructor() {}
  
  getGameName(path: string): string {
    return url.parse(path).path!.split('/').pop() as string
  }

  //获取进程Pid
  getPid(): number | null {
    const name = this.getGameName(getConfig().path)
    const task = execSync('tasklist')
      .toString()
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((line) => line[0] === name)[0]
    console.log(name, task?.[1])
    if (!task) return null

    return +task[1]
  }

  openGame(): void {
    if (this.getPid()) {
      log('游戏已经运行 启动失败')
      return
    }
    exec(getConfig().path)
    log('运行游戏')
  }

  //结束游戏
  kill(): void {
    const pid: number | null = this.getPid()
    if (!pid) {
      log('游戏没有运行 结束失败')
      return
    }
    process.kill(pid)
    log('结束游戏')
  }

  // 判断游戏是否在运行
  isRunning(): boolean {
    return !!this.getPid()
  }
}

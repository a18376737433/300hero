import { execSync, exec } from 'child_process'
import { log, msg } from '../modules/auto-game/utlis/index'
import url from 'url'
import { getConfig } from '@/utils'
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
    if (!task) return null

    return +task[1]
  }

  openGame(): void {
    const path = getConfig().path
    const hasPath = path && !!path.length

    if (!hasPath) {
      msg('请配置启动路径')
      return
    }
    
    if (this.getPid()) {
      log('游戏已经运行 启动失败')
      return
    }

    exec(path)
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

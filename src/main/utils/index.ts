import { execSync, exec } from 'child_process'
import { log } from '../modules/auto-game/utlis/index'
//src\main\modules\auto-game\utlis\index.ts
export class Task {
  #PID: number | null
  #name: string = '300.exe'

  constructor() {
    this.#PID = this.getPid()
  }

  //获取进程Pid
  getPid(taskName: string = this.#name): number | null {
    const name = taskName.endsWith('.exe') ? taskName : `${taskName}.exe`
    const task = execSync('tasklist')
      .toString()
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((line) => line[0] === name)[0]
    if (!task) return null

    return +task[1]
  }

  /**
   *
   * @param path 游戏路径
   */
  openGame(path: string): void {
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

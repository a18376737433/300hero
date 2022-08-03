const { execSync, exec } = require('child_process')
export class Task {
  #PID: string | null
  #name: string = '300.exe'

  constructor() {
    this.#PID = this.getPid('cloudmusic')
  }

  //获取进程Pid
  getPid(taskName: string): string | null {
    const name = taskName.endsWith('.exe') ? taskName : `${taskName}.exe`
    const task = execSync('tasklist')
      .toString()
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((line) => line[0] === name)[0]
    if (!task) return null

    return task[1]
  }

  /**
   * 
   * @param path 游戏路径 
   */
  openGame(path: string): void {
    exec(path)
  }

  //结束游戏
  kill(): void {
    process.kill(this.#PID as unknown as number)
  }

  // 判断游戏是否在运行
  isRunning(): boolean {
    return !!this.#PID
  }
}

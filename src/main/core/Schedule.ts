import schedule from 'node-schedule'
import { log } from '@/modules/auto-game/utlis'
import { getConfig, formatJobTime } from '@/utils'
import game from '@/modules/auto-game'
import _ from 'lodash'
import { exec } from 'child_process'
const createJob = (time, cb) => {
  if (!time) return null
  return schedule.scheduleJob(formatJobTime(time), cb)
}
const createRunJob = (time) =>
  createJob(time, () => {
    game.start()
  })
const createShutdownJob = (time) =>
  createJob(time, () => {
    exec('shutdown -s -t 0')
  })
export class Schedule {
  runJob: any
  shutdownJob: any
  constructor() {
    this.init()
  }
  private init() {
    const { jobTime, shutdown } = getConfig()
    if (jobTime) {
      this.runJob = createRunJob(jobTime)
    }
    if (shutdown) {
      this.shutdownJob = createShutdownJob(shutdown)
    }
  }
  update([oldJobTime, oldShutdown]) {
    const { jobTime, shutdown } = getConfig()
    if (oldJobTime !== jobTime) {
      this.log('启动', jobTime)
      this.runJob?.cancel()
      this.runJob = createRunJob(jobTime)
    }

    if (oldShutdown !== shutdown) {
      this.log('关机', shutdown)
      this.shutdownJob?.cancel()
      this.shutdownJob = createShutdownJob(shutdown)
    }
  }
  private log(msg: string, time: any) {
    log(`[更新定时任务] ${msg}`, new Date(time).toLocaleTimeString().slice(0, 5))
  }
}

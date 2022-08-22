import schedule from 'node-schedule'
import { log } from '@/modules/auto-game/utlis'
import { getConfig, formatJobTime } from '@/utils'
import game from '@/modules/auto-game'

const createJob = (time, cb) => {
  if (!time) return null
  return schedule.scheduleJob(formatJobTime(time), cb)
}
const createRunJob = (time) =>
  createJob(time, () => {
    game.test()
  })
const createShutdownJob = (time) =>
  createJob(time, () => {
    console.log('????????????')
  })
export class Schedule {
  runJob: any
  shutdownJob: any
  obj: any = {}
  constructor() {
    this.init()
  }
  init() {
    const { jobTime, shutdown } = getConfig()
    if (jobTime) {
      this.runJob = createRunJob(jobTime)
    }
    if (shutdown) {
      this.shutdownJob = createShutdownJob(shutdown)
    }
    console.log(jobTime, shutdown)
  }
  update([oldJobTime, oldShutdown]) {
    const { jobTime, shutdown } = getConfig()
    if (oldJobTime !== jobTime) {
      log('更新定时任务 定时启动',)
      this.runJob.cancel()
      this.runJob = createRunJob(jobTime)
    }

    if (oldShutdown !== shutdown) {
      log('更新定时任务 自动关机',)
      this.shutdownJob.cancel()
      this.shutdownJob = createShutdownJob(shutdown)
    }
  }
}

import schedule from 'node-schedule'
import { log } from '@/modules/auto-game/utlis'
export class Schedule {
  constructor(time: any, cb: Function) {
    schedule.scheduleJob(this.formatTime(time), cb)
  }
  formatTime(time: any) {
    log('开启定时任务', new Date(time).toLocaleTimeString().slice(0, 5))
    const [minute, hour] = new Date(time).toLocaleTimeString().slice(0, 5).split(':').map(Number).reverse()
    return `${minute} ${hour} * * *`
  }
  static async reset() {
    await schedule.gracefulShutdown()
  }
}

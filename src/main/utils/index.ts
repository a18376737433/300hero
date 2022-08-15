import Store from 'electron-store'
import type { Config } from 'config'
export const getConfig = (): Config => new Store().get('config') as any
export const formatJobTime = (time: any) => {
  const [minute, hour] = new Date(time).toLocaleTimeString().slice(0, 5).split(':').map(Number).reverse()
  return `${minute} ${hour} * * *`
}

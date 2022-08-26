import store from '@/core/Store'
import type { Config } from 'config'

export const getConfig = (): Config => store.get('config')

export const formatJobTime = (time: any) => {
  const [minute, hour] = new Date(time).toLocaleTimeString().slice(0, 5).split(':').map(Number).reverse()
  return `${minute} ${hour} * * *`
}

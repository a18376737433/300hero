import { net, ClientRequestConstructorOptions } from 'electron'
export const fetch = (options: ClientRequestConstructorOptions | string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = net.request(options)
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        try {
          resolve(JSON.parse(chunk.toString()))
        } catch (error) {
          reject('服务器异常,请稍后重试')
        }
      })
      request.on('error', (error) => {
        reject(error)
      })
    })
    request.end()
  })
}

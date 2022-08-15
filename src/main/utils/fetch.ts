import { net, ClientRequestConstructorOptions } from 'electron'
export const fetch = (options: ClientRequestConstructorOptions | string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = net.request(options)
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        resolve(JSON.parse(chunk.toString()))
      })
      request.on('error', (error) => {
        reject(error)
      })
    })
    request.end()
  })
}

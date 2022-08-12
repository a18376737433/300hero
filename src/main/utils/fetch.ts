import { net, ClientRequestConstructorOptions } from 'electron'
export const fetch = (options: ClientRequestConstructorOptions | string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = net.request(options)
    request.end()

    request.on('response', (response) => {
     
      response.on('data', (chunk) => {
        let data = JSON.parse(chunk.toString())
        console.log(data)
        resolve(data)
      })
      request.on('error', (error) => {
        reject(error)
      })
    })
  })
}

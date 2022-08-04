const EventEmitter = require('events')
const events = new EventEmitter()
function task1(v) {
  setTimeout(() => {
    console.log(v)
  }, 10000)
}
events.once('a', task1)
let num = 0
setInterval(
  () => {
    num++
    events.emit('a', num)
  },
  1000,
  num
)

setTimeout(() => {
  events.removeListener('a', task1)
}, 3500)

let num = 0
setInterval(
  () => {
    num++
    console.log('hello test2!' + num)
    if (num > 10) {
      process.exit(0)
    }
  },
  1000,
  num
)

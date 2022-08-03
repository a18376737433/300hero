const { exec,execSync,fork} = require('child_process')
const { join } = require('path')
console.log('this is a test')

const worker=fork('./test2.js', { stdio: 'inherit' })
setTimeout(() => {
  console.log(5555555555);
}, 3000);
//console.log(worker);

const ts = new Date().getTime()
console.log('ts: ', ts);
const d = new Date(ts)
console.log(d.toString())

console.log(d.toUTCString())
console.log(d.toISOString())
console.log(d.toTimeString())
console.log(d.toLocaleTimeString())
// const d = new Date("August 19, 1975 23:15:30 GMT-3:00")

// console.log(d.getUTCDate())
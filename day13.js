'use strict'
// --- Day 13: Distress Signal ---

const {loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {floor, min} = Math

const parse = (dsn) => {
  let data = rawInput[dsn], result = []

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(line => eval(line))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const compare = (a, b) => {
  let mode = (typeof a) + (typeof b), res = 0

  if (mode === 'numbernumber') return b - a
  if (mode === 'undefinedundefined') return 0
  if (mode.startsWith('undefined')) return 1
  if (mode.endsWith('undefined')) return -1
  if (mode === 'numberobject') a = [a]
  else if (mode === 'objectnumber') b = [b]

  for (let i = 0, m = min(a.length, b.length); (res = compare(a[i], b[i])) === 0; ++i) {
    if (i === m) break
  }
  return res
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  let sum = 0

  for (let i = 0; i < input.length; i += 2) {
    if (compare(input[i], input[i + 1]) >= 0) {
      sum += floor(i / 2) + 1
    }
  }
  return sum
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  const a = [[2]], b = [[6]], ordered = input.slice()

  ordered.push(a, b)
  ordered.sort((a, b) => compare(b, a))

  return (ordered.indexOf(a) + 1) * (ordered.indexOf(b) + 1)
}

//  Example (demo) data.
rawInput[1] = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

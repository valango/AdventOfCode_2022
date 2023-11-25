'use strict'
// --- Day 13: Distress Signal ---

const {assert, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {min} = Math

const parse = (dsn) => {
  let data = rawInput[dsn], pairs = []

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    for (let line, i, lineIndex = 0, pair = [0, 0]; (line = data[lineIndex]); ++lineIndex) {
      pair[i = lineIndex % 2] = eval(line)
      if (i) pairs.push([...pair])
    }
    data = pairs
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

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (pairs) => {
  let sum = 0

  for (let i = 0, pair; (pair = pairs[i++]);) {
    if (compare(pair[0], pair[1]) >= 0) {
      sum += i
    }
  }
  return sum
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
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
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

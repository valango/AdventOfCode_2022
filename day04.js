'use strict'

const {assert, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {*} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(line => line.split(/[,-]/).map(s => parseInt(s)))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const doesContain = (a, b, c, d) => a <= c && b >= d

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  let n = 0
  for (const [a, b, c, d] of input) {
    if (doesContain(a, b, c, d) || doesContain(c, d, a, b)) n += 1
  }
  return n
}

const doesOverlap = (a, b, c, d) => a <= d && b >= c

/** @param {TData[]} input */
const puzzle2 = (input) => {
  let n = 0
  for (const [a, b, c, d] of input) {
    if (doesOverlap(a, b, c, d) || doesOverlap(c, d, a, b)) n += 1
  }
  return n
}

//  Example (demo) data.
rawInput[1] = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

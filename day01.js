'use strict'

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

const parse = (dsn) => {
  if (rawInput[dsn] === undefined) return

  let data = rawInput[dsn], n = 0, results = [{sum: 0}]

  for (const row of data.split('\n')) {
    if (row) results[n].sum += parseInt(row)
    else n = results.push({sum: 0}) - 1
  }
  return results   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @typedef {{sum: number}} TData */

/**
 * @param {TData[]} input
 */
const puzzle1 = (input) => {
  input.sort((a, b) => b.sum - a.sum)
  return input[0].sum
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return input.slice(0, 3).reduce((s, r) => s + r.sum, 0)
}

//  Example (demo) data.
rawInput[1] = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

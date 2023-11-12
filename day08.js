'use strict'

const {assert, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {number[]} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(line => Array.from(line).map(parseInt))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

let debug = false

const dump = (visibles) => {
  if (!debug) return
  console.log('')
  for (const row of visibles) console.log('', row)
}

const markVisibles = (trees) => {
  const visibles = []
  let tallest = 0, iRow = 0, iCol = 0, len = 0

  const check = () => {
    if (trees[iRow][iCol] > tallest) {
      tallest = trees[iRow][iCol]
      visibles[iRow][iCol] = 1
    }
  }

  for (len = trees[0].length; iRow < trees.length; ++iRow) {
    tallest = -1
    visibles.push(new Array(len).fill(0))
    for (iCol = 0; iCol < len; ++iCol) check()
  }
  dump(visibles)
  while (--iRow >= 0) {
    tallest = -1
    for (iCol = len; --iCol >= 0;) check()
  }
  dump(visibles)
  for (iCol = 0; iCol < len; ++iCol) {
    tallest = -1
    for (iRow = 0; iRow < trees.length; ++iRow) check()
  }
  dump(visibles)
  while (--iCol >= 0) {
    tallest = -1
    for (iRow = trees.length; --iRow >= 0;) check()
  }
  dump(visibles)
  return visibles
}

const countVisibles = (trees) => {
  const visibles = markVisibles(trees)
  let count = 0

  for (const row of visibles) {
    for (const v of row) count += v
  }
  return count
}

const puzzle1 = (input) => {
  return countVisibles(input)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
30373
25512
65332
33549
35390`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

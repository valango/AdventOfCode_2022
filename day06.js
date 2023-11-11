'use strict'

const {loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {string} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return Array.from(data[0])
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** {string[]} data */
const startOfMarker = (data, size = 4) => {
  for (let end = size; end <= data.length; ++end) {
    let quad = data.slice(end - size, end)
    for (let i = 0; i < size - 1; ++i) {
      if (quad.indexOf(quad[i], i + 1) !== -1) {
        quad = undefined
        break
      }
    }
    if (quad) {
      return end
    }
  }
  return -1
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  return startOfMarker(input)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return startOfMarker(input, 14)
}

//  Example (demo) data.
rawInput[1] = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

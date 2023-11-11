'use strict'

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{moves:number[], stacks: string[][]}} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const afterStacks = data.findIndex(line => line.startsWith(' 1'))
    const stacksCount = data[afterStacks].trim().split(/\s+/).length
    const stacks = new Array(stacksCount).fill(undefined).map(() => [])
    const moves = []

    for (let i = afterStacks; --i >= 0;) {
      for (let stackIndex = 0; stackIndex < stacksCount; ++stackIndex) {
        const item = (data[i][4 * stackIndex + 1] || '').trim()
        if (item) stacks[stackIndex].push(item)
      }
    }
    for (let i = afterStacks + 1, line = ''; (line = data[i]); ++i) {
      const r = /(\d+).+(\d+).+(\d+)/.exec(line)
      moves.push([parseInt(r[1]), parseInt(r[2]) - 1, parseInt(r[3]) - 1])
    }
    return {moves, stacks}
  }
  return data
}

/**
 * @returns {string[][]}
 * @param {number[]} moves
 * @param {string[][]} stacks
 */
const execute = (moves, stacks, byBunch = false) => {
  const result = stacks.map(s => s.slice())

  for (let [n, src, dst] of moves) {
    if (byBunch) result[dst].push(...result[src].splice(-n, n))
    else while (--n >= 0) {
      result[dst].push(result[src].pop())
    }
  }

  return result
}

const last = (array) => array[array.length - 1]

/**
 * @returns {string}
 * @param {string[][]} stacks
 */
const tops = (stacks) => {
  return stacks.map(stack => last(stack)).join('')
}

/** @param {TData} input */
const puzzle1 = (input) => {
  return tops(execute(input.moves, input.stacks))
}

/** @param {TData} input */
const puzzle2 = (input) => {
  return tops(execute(input.moves, input.stacks, true))
}

//  Example (demo) data.
rawInput[1] = `
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

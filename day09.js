'use strict'
//  --- Day 9: Rope Bridge ---

const {assert, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {abs, sign} = Math

/** @typedef {[number,number]} TData */

const directions = {U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0]}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(s => {
      const dir = directions[s[0]].slice(), v = parseInt(s.slice(2))
      dir[0] *= v
      dir[1] *= v
      return dir
    })
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @param {[number, number][]} commands */
const computeTailTraceLength = (commands) => {
  const trace = new Set()
  let x = 0, y = 0, tailX = 0, tailY = 0, last = [0, 0]

  trace.add('0 0')
  for (const [dx, dy] of commands) {
    const count = Math.abs(dx + dy), sx = sign(dx), sy = sign(dy)

    for (let i = 0; i < count; ++i) {
      x += sx
      y += sy
      if ((abs(tailX - x) + abs(tailY - y)) === 3) {
        if (abs(tailX - x) === 1) tailX = x
        else tailY = y
      }
      if (abs(tailY - y) === 2) tailY += sy
      else if (abs(tailX - x) === 2) tailX += sx
      trace.add(tailX + ' ' + tailY)
    }
  }
  return trace.size
}

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  return computeTailTraceLength(input)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

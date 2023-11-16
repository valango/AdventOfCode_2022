'use strict'
// --- Day 10: Cathode-Ray Tube ---

const {readFileSync} = require('fs')
const {assert, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {*} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(line => /\d$/.test(line) ? parseInt(line.slice(5)) : undefined)
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const compute = (program, cb) => {
  let cycle = 0, register = 1

  for (const value of program) {
    cb(register, ++cycle)

    if (value !== undefined) {
      cb(register, ++cycle)
      register += value
    }
  }
}

/** @param {TData[]} program */
const puzzle1 = (program) => {
  const cycles = [20, 60, 100, 140, 180, 220]
  let sum = 0

  compute(program, (register, cycle) => cycles.includes(cycle) && (sum += register * cycle))
  return sum
}

/** @param {TData[]} program */
const puzzle2 = (program) => {
  const screen = new Array(6 * 40).fill(' ')

  compute(program, (register, cycle) => {
    const n = cycle - 1, x = (n) % 40
    const c = (x >= (register - 1) && x <= (register + 1)) ? '#' : '.'
    screen[n] = c
  })
  log(' SCREEN:')
  for (let start = 0; start < (6 * 40); start += 40) {
    log(screen.slice(start, start + 40).join(''))
  }
  return true
}

//  Example (demo) data.
rawInput[1] = readFileSync('data/day10demo.txt').toString()
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

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

const compute = (program, cycleNumbers, initialValue = 1) => {
  let register = initialValue, cycle = 0
  const values = []

  for (const value of program) {
    if (cycleNumbers.includes(++cycle)) values.push(register)
    if (value !== undefined) {
      if (cycleNumbers.includes(++cycle)) values.push(register)
      register += value
    }
  }
  return values
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  const cycles = [20, 60, 100, 140, 180, 220]
  const values = compute(input, cycles)
  const strengths = values.map((v, i) => v * cycles[i])
  return strengths.reduce((sum, v) => sum + v, 0)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = readFileSync('data/day10demo.txt').toString()
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

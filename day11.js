'use strict'
// --- Day 11: Monkey in the Middle ---

const {readFileSync} = require('fs')
const {cloneDeep} = require('lodash')
const {assert, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{items:number[],op:string, divisor:number, dst:number[]}}} TData */

const parse = (dsn) => {
  const monkeys = []
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    for (let n = 0; n < data.length; ++n) {
      assert(data[n] === `Monkey ${monkeys.length}:`, n, data[n])
      const items = data[++n].slice(data[n].indexOf(': ') + 2).split(', ').map(parseInt)
      const op = data[++n].slice(data[n].indexOf('= ') + 2)
      const divisor = parseInt(data[++n].slice(data[n].indexOf('by ') + 3))
      const dst = [parseInt(data[++n].slice(data[n].indexOf('ey ') + 3))]
      dst.push(parseInt(data[++n].slice(data[n].indexOf('ey ') + 3)))
      monkeys.push({items, op, divisor, dst, count: 0})
    }
    return monkeys
  }
  return data
}

const compute1 = (iMonkey, monkeys) => {
  const {items, op, divisor, dst} = monkeys[iMonkey]
  assert(dst[0] !== iMonkey && dst[1] !== iMonkey, 'Loop', iMonkey)

  for (let level of items) {
    level = eval(op.replaceAll('old', level.toString()))
    level = Math.floor(level / 3)
    const next = dst[level % divisor === 0 ? 0 : 1]
    monkeys[next].items.push(level)
  }
  monkeys[iMonkey].count += items.length
  monkeys[iMonkey].items = []
}

const puzzle1 = (input) => {
  let data = cloneDeep(input)

  for (let rounds = 20; --rounds >= 0;) {
    for (let i = 0; i < data.length; ++i) compute1(i, data)
  }
  const scores = data.map(r => r.count).sort((a, b) => b - a)
  return scores[0] * scores[1]
}

const factorize = (value, divisors) => {
  assert(value >= divisors[0], 'too small', value)
  const shifts = new Map()
  for (const f of divisors) {
    shifts.set(f, value % f)
  }
  return shifts
}

const compute2 = (iMonkey, monkeys) => {
  const {items, op, divisor, dst} = monkeys[iMonkey]
  assert(dst[0] !== iMonkey && dst[1] !== iMonkey, 'Loop', iMonkey)
  let val = parseInt(op.slice(6)), cmd = op[4]

  for (let level of items) {
    for (let [factor, shift] of level.entries()) {
      if (cmd === '*') {
        if (Number.isNaN(val)) shift *= shift
        else shift *= val
      } else if (cmd === '+') {
        shift += val
      } else assert(false, 'Unknown command', iMonkey, op)
      level.set(factor, shift % factor)
    }
    const next = dst[level.get(divisor) === 0 ? 0 : 1]

    monkeys[next].items.push(level)
  }
  monkeys[iMonkey].count += items.length
  monkeys[iMonkey].items = []
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  const divisors = Array.from(new Set(input.map(r => r.divisor))).sort((a, b) => a - b)

  const data = cloneDeep(input)
  data.forEach(r => r.items = r.items.map(v => typeof v === 'number' ? factorize(v, divisors) : v))

  for (let rounds = 10000; --rounds >= 0;) {
    for (let i = 0; i < data.length; ++i) compute2(i, data)
  }

  const scores = data.map(r => r.count).sort((a, b) => b - a)
  return scores[0] * scores[1]
}

rawInput[1] = readFileSync('data/day11demo.txt').toString()

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

//  Used different compute() routines, because I could not figure out what to do when value falls below divisors.

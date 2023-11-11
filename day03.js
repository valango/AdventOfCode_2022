'use strict'

const {assert, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @typedef {*} TData */

const cA = 'A'.charCodeAt(0), ca = 'a'.charCodeAt(0)

const priorityOfChar = (str, index = 0) => {
  let v = str.charCodeAt(index)

  return (v >= ca ? v - ca : v - cA + 26) + 1
}

const split = (str) => {
  const {length} = str
  assert(length && !(length & 1), 'Bad length %d', length)
  return [str.slice(0, length / 2), str.slice(length / 2)]
}

const score = (line) => {
  const [a, b] = split(line), repeating = []
  for (const ch of a) {
    if (!repeating.includes(ch) && b.includes(ch)) repeating.push(ch)
  }
  return repeating.reduce((s, ch) => s + priorityOfChar(ch), 0)
}

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input) => {
  return input.reduce((s, d) => s + score(d), 0)
}

const charFromPriority = (v) => {
  return String.fromCharCode(--v < 26 ? v + ca : v + cA - 26)
}

const valueOfTriplet = (lines, offset) => {
  const limit = offset + 3, results = []

  for (let priority = 1; priority <= 52; ++priority) {
    let ch = charFromPriority(priority), i = offset

    do {
      if (!lines[i].includes(ch)) break
    } while (++i < limit)

    if (i === limit) results.push(ch)
  }
  if (results.length !== 1) throw new Error(`Bad at ${offset}: [${results}]`)

  return priorityOfChar(results[0])
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  let sum = 0

  for (let offset = 0; offset < input.length; offset += 3) {
    sum += valueOfTriplet(input, offset)
  }
  return sum
}

//  Example (demo) data.
rawInput[1] = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

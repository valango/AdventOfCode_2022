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

const priorityOf = (str, index = 0) => {
  let v = str.charCodeAt(index)

  return v > 96 ? v - 96 : v - 38
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
  return repeating.reduce((s, ch) => s + priorityOf(ch), 0)
}

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input) => {
  return input.reduce((s, d) => s + score(d), 0)
}

const count = rows => {
  const map = new Map()

  for (let i = rows.length, row; --i >= 0 && (row = rows[i]);) {
    for (let j = row.length; --j >= 0;) {
      const indexes = map.get(row[j])
      if (!indexes) map.set(row[j], [i])
      else if (!indexes.includes(i)) indexes.push(i)
    }
  }
  return map
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  const map = count(input)
  const labelCandidates = [], exactOnes = []

  map.forEach((indexes, key) => {
    if (indexes.length >= 3) (indexes.length === 3 ? exactOnes : labelCandidates).push(key)
  })
  return undefined
}

//  Example (demo) data.
rawInput[1] = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

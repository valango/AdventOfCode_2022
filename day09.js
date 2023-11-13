'use strict'
//  --- Day 9: Rope Bridge ---

const {assert, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {abs, max, min, sign} = Math

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

/**
 * Dedicated debugging utility.
 * @param {[number, number][]} positions
 * @param {number} length
 */
const render = (positions, length) => {
  let xMin = 0, xMax = 0, yMin = xMin, yMax = xMax, i = length
  const field = []

  for (const [x, y] of positions) {
    xMin = min(xMin, x), xMax = max(xMax, x), yMin = min(yMin, y), yMax = max(yMax, y)
  }
  for (let y = yMin; y <= yMax; ++y) field.push(new Array(xMax - xMin + 1).fill('.'))
  log('')
  for (const [x, y] of positions) {
    field[yMax - y][x - xMin] = '' + i--
  }
  for (const row of field) log(row.join(''))
}

/**
 * @returns {number}
 * @param {[number, number][]} commands
 * @param {number} length -- NB: number of knots is length + 1 !
 * @param {number} renderFirst
 */
const computeTailTraceLength = (commands, length, renderFirst = 0) => {
  const trace = new Set()
  const positions = new Array(length + 1).fill(0).map(() => [0, 0])

  for (const [shiftX, shiftY] of commands) {
    let distance = abs(shiftX + shiftY), dx = sign(shiftX), dy = sign(shiftY)

    while (--distance >= 0) {
      let level = 0, x = 0, y = 0
      positions[0][0] += dx
      positions[0][1] += dy

      while (level < length) {
        let [xHead, yHead] = positions[level]
        ;[x, y] = positions[++level]
        const [dx, dy] = [xHead - x, yHead - y]
        if (dx === 0 && dy === 0) {
          break
        }
        if ((abs(dx) + abs(dy)) === 3) {
          if (abs(dx) === 1) x = xHead
          else y = yHead
        }
        if (abs(dx) === 2) x += sign(dx)
        if (abs(dy) === 2) y += sign(dy)

        positions[level] = [x, y]
      }
      if (level === length) {
        trace.add(x + ' ' + y)
      }
    }
    if (--renderFirst >= 0) render(positions, length)
  }
  return trace.add('0 0').size
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  return computeTailTraceLength(input, 1, 5)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return computeTailTraceLength(input, 9, 3)
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
R 2` /* */
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
rawInput[2] = `
R 5
U 8
L 8
`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

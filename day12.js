'use strict'
// --- Day 12: Hill Climbing Algorithm ---

const {assert, getOptions, log, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

const {abs} = Math
const ca = 'a'.charCodeAt(0)

const parse = (dsn) => {
  let data = rawInput[dsn], map, start, goal

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    map = data.map((line, y) => Array.from(line).map((ch, x) => {
      if (ch === 'S') ch = 'a', goal = [x, y]
      else if (ch === 'E') ch = 'z', start = [x, y]
      return ch.charCodeAt(0) - ca
    }))
    data = {map, start, goal, width: map[0].length}
  }
  return data
}

const dump = (map, comment, other) => {
  log(comment || '')
  map.forEach((line, y) => {
    if (other) {
      line = line.map((ch, x) => ch === '#' ? String.fromCharCode(other[y][x] + ca) : ch)
    }
    log('|' + line.join('') + '|')
  })
}

const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const glyphs = '><v^'
/**
 *
 * @param {number[][]} map
 * @param {[number,number]} start
 * @param {[number,number]}goal
 */
const walk = (map, start, goal) => {
  const width = map[0].length, height = map.length
  const [xG, yG] = goal
  const route = new Array(height).fill(undefined).map(() => new Array(width).fill(' '))
  const path = [], {isWarmUp, isDemo} = getOptions()
  let [x0, y0] = start, x, y

  const canTry = (x, y) => {
    // const sp = path.length - 1
    // return !(sp >= 0 && x === path[sp][0] && y === path[sp][1]) &&
    return x >= 0 && x < width && y >= 0 && y < height && abs(map[y0][x0] - map[y][x]) <= 1 && route[y][x] === ' '
  }

  while (!(x0 === xG && y0 === yG)) {
    let ch
    for (let i = 0; i < 4; ++i) {
      if (canTry(x = x0 + dirs[i][0], y = y0 + dirs[i][1])) {
        ch = glyphs[i]
        break
      }
    }
    if (ch) {
      route[y0][x0] = ch
      path.push([x0, y0])
      ;[x0, y0] = [x, y]
    } else {
      route[y0][x0] = '#'
      if (path.length === 0) {
        dump(route, 'FAILED', map)
        return undefined
      }
      [x0, y0] = path.pop()
    }
    if (!isWarmUp) {
      // dump(route)
    }
  }
  route[y0][x0] = 'E'
  log('PATH', path)
  dump(route, '', map)
  return path.length
}

const puzzle1 = (input) => {
  const steps = walk(input.map, input.start, input.goal)
  return steps
}

const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

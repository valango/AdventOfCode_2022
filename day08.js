'use strict'

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{trees:number[][], visible:number[][], maxX:number, maxY:number }} TData */

let doDebug = false

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const trees = data.map(line => Array.from(line).map(parseInt))
    const maxX = trees[0].length - 1, maxY = trees.length - 1
    const visible = []
    return {maxX, maxY, trees, visible}
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const dump = (visible) => {
  if (!doDebug) return
  console.log('')
  for (const row of visible) {
    console.log(row.map(v => v >= 0 ? '*' : ' ').join(''))
  }
}

/** @param {TData} data */
const markVisible = (data) => {
  const {trees, visible, maxX, maxY} = data
  let tallest = 0, y = 0, x = 0

  const check = () => {
    if (trees[y][x] > tallest) {
      tallest = visible[y][x] = trees[y][x]
    }
  }

  for (; y <= maxY; ++y) {
    visible.push(new Array(maxX + 1).fill(tallest = -1))
    for (x = 0; x <= maxX; ++x) check()
  }
  dump(visible)
  while (--y >= 0) {
    tallest = -1
    for (x = maxX; x >= 0; --x) check()
  }
  dump(visible)
  for (x = 0; x <= maxX; ++x) {
    tallest = -1
    for (y = 0; y <= maxY; ++y) check()
  }
  dump(visible)
  while (--x >= 0) {
    tallest = -1
    for (y = maxY; y >= 0; --y) check()
  }
  dump(visible)
  return visible
}

const countVisible = (trees) => {
  const visible = markVisible(trees)
  let count = 0

  for (const row of visible) {
    for (const v of row) if (v >= 0) ++count
  }
  return count
}

const puzzle1 = (input) => {
  return countVisible(input)
}

const findNextCandidate = ({visible, maxX, maxY}, previousPoint) => {
  let y = previousPoint ? previousPoint[0] : 1, x = previousPoint ? previousPoint[1] : 0

  do {
    if (++x === maxX) {
      if (++y === maxY) return null
      x = 1
    }
  } while (!(visible[y][x] >= 0))

  return [y, x]
}

const clamp = (value, maxvalue) => value < 0 ? 0 : (value > maxvalue ? maxvalue : value)

const computeDist = ({trees, maxX, maxY}, x0, y0, dx, dy) => {
  let x = x0, y = y0, maxHeight = trees[x][y]

  while ((x += dx) >= 0 && x <= maxX && (y += dy) >= 0 && y <= maxY) {
    if (trees[x][y] >= maxHeight) break
  }
  x = clamp(x, maxX)
  y = clamp(y, maxY)

  return Math.abs(x - x0) + Math.abs(y - y0)
}

const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

const computeScore = (data, x, y) => {
  let total = 1, recent = 0

  for (const [dx, dy] of directions) {
    if ((recent = computeDist(data, x, y, dx, dy)) === 0) {
      return 0
    }
    total *= recent
  }
  return total
}

/** @param {TData} input */
const puzzle2 = (input) => {
  let maxScore = 0

  for (let point = undefined, score = 0; (point = findNextCandidate(input, point));) {
    if ((score = computeScore(input, point[0], point[1])) > maxScore) maxScore = score
  }
  return maxScore
}

//  Example (demo) data.
rawInput[1] = `
30373
25512
65332
33549
35390`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

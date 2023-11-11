'use strict'

const {assert, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {[a:number, b:number]} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const moves = data.map((row, n) => {
      const a = 'ABC'.indexOf(row[0]), b = 'XYZ'.indexOf(row[2])
      assert(a >= 0 && b >= 0, 'Bad row #%d: "%s"', n, row)
      return [a + 1, b + 1]
    })
    return moves
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const score = ([hisMove, myMove]) => {
  if (hisMove === myMove) return myMove + 3
  if (myMove === (hisMove + 1) || (myMove === 1 && hisMove === 3)) return myMove + 6
  return myMove
}

/**
 * @param {TData[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input) => {
  return input.reduce((s, d) => s + score(d), 0)
}

const DRAW = 2, WIN = 3

const chooseMove = ([hisMove, myGoal]) => {
  if (myGoal === DRAW) return [hisMove, hisMove]
  if (myGoal === WIN) {
    return [hisMove, hisMove === 3 ? 1 : hisMove + 1]
  }
  return [hisMove, hisMove === 1 ? 3 : hisMove - 1]
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return input.reduce((s, d) => s + score(chooseMove(d)), 0)
}

//  Example (demo) data.
rawInput[1] = `A Y
B X
C Z`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

'use strict'

const {assert, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {string} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const parentDir = (path) => {
  assert(path && path !== '/', 'shit')
  const parts = path.split('/'), n = path.endsWith('/') ? 2 : 1
  parts.splice(-n, n)
  return parts.join('/') + '/'
}

const addSize = (tree, key, size) => {
  while (key !== '/') {
    key = parentDir(key)
    tree.set(key, tree.get(key) + size)
  }
}

/** @param {Map<string,number>} tree */
const sumUp = (tree) => {
  tree.forEach((value, key) => {
    if (value > 0 && !key.endsWith('/')) {
      addSize(tree, key, value)
    }
  })
  return tree
}

/** @param {TData[]} log */
const createTree = (log) => {
  const tree = new Map()
  let cwd = '', listing = false

  tree.set('/', 0)

  for (let lineNum = 0, line = ''; (line = log[lineNum]); ++lineNum) {
    if (line[0] === '$') {
      const [cmd, arg] = line.slice(2).split(' ')

      listing = false

      if (cmd === 'cd') {
        if (arg === '/') cwd = arg
        else {
          assert(cwd, `dir not set at ${lineNum}: `, line)
          if (arg === '.') continue
          if (arg === '..') cwd = parentDir(cwd)
          else cwd = cwd + arg + '/'
          assert(tree.has(cwd), `unknown dir at ${lineNum}: `, line)
        }
      } else if (cmd === 'ls') {
        assert(cwd, `dir not set at ${lineNum}: `, line)
        listing = true
      } else assert(false, `unknown command at ${lineNum}: `, line)
    } else {
      assert(listing, `unexpected data at ${lineNum}: `, line)
      let [value, name] = line.split(' '), key = cwd + name

      if (value === 'dir') {
        if (!tree.has(key += '/')) tree.set(key, 0)
      } else {
        value = parseInt(value)
        assert(!(tree.has(key) && tree.get(key) !== value), `re-definition at ${lineNum}: `, line)
        tree.set(key, value)
      }
    }
  }
  sumUp(tree)

  return tree
}

const sumOfDirsUpTo = (tree, maxSize) => {
  let sum = 0

  tree.forEach((value, key) => {
    if (value <= maxSize && key.endsWith('/')) {
      sum += value
    }
  })
  return sum
}

let globalTree

/** @param {TData[]} input */
const puzzle1 = (input) => {
  globalTree = createTree(input)
  return sumOfDirsUpTo(globalTree, 100000)
}

const puzzle2 = () => {
  const totalSize = 70000000, requiredSpace = 30000000
  const toFreeMin = requiredSpace - (totalSize - globalTree.get('/'))
  let dirSize = Number.POSITIVE_INFINITY
  if (toFreeMin > 0) {
    globalTree.forEach((value, key) => {
      if (key.endsWith('/') && value >= toFreeMin && value < dirSize) {
        dirSize = value
      }
    })
  }
  return dirSize
}

//  Example (demo) data.
rawInput[1] = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}

/*
 */

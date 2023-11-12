//  core/dumper.js
'use strict'

const {assert} = require('.')

module.exports = ({useBoth, useDemo}, print) => {
  const showDemo = useBoth || useDemo, showMain = !useDemo, headings = [' day', 'lines', 'secs1', 'secs2']
  let lastColumn, widths, hasNotes = false
  let commentX = 4, demoX = 4, mainX = 4

  const prepare = (records) => {
    if (showMain) {
      headings.push('Main1', 'Main2', 'M1_µs', 'M2_µs')
      demoX += 4
      commentX += 4
    }
    if (showDemo) {
      headings.push('Demo1', 'Demo2', 'D1_µs', 'D2_µs')
      commentX += 4
    }

    if ((hasNotes = records.some(({comment}) => Boolean(comment)))) headings.push('Notes')

    widths = headings.map(s => s.length), lastColumn = headings.length - 1
  }

  const checkRow = (row) => {
    for (let i = 0; i <= lastColumn; ++i) widths[i] = Math.max(widths[i], row[i].length)
  }

  const toJSON = (record) => {
    try {
      record = JSON.stringify(record)
    } catch (err) {
      assert(err === null, 'dumper.toJSON')
    }
    record = record.replaceAll('{', '{ ')
    record = record.replaceAll('}', ' }')
    record = record.replaceAll(',"', ', "')
    record = record.replaceAll('":', '": ')
    return record
  }

  const dumpMd = (rows) => {
    print('|' + headings.join('|') + '|\n|')
    widths.forEach((w, i) => print((hasNotes && i === lastColumn) ? ':---|' : '---:|'))
    print('\n')

    for (const row of rows) {
      print('|' + row.join('|') + '|\n')
    }
  }

  const dumpTable = (rows) => {
    rows.forEach(checkRow)

    const horLine = widths.map((w, i) => '-'.padEnd(w + (i ? 2 : 1), '-')).join('+') + '\n'
    print(horLine)
    print(headings.map((s, i) => (hasNotes && i === lastColumn)
      ? s : s.padStart(widths[i])).join(' | ') + '\n')
    print(horLine)

    for (const row of rows) {
      for (let i = 0; i <= lastColumn; ++i) {
        print((i ? ' | ' : '') + ((hasNotes && i === lastColumn)
          ? row[i] : row[i].padStart(widths[i])))
      }
      print('\n')
    }
  }

  const dump = (records, {makeJSON, makeMd}) => {
    const {length} = records

    if (length === 1 && !makeJSON && !makeMd) makeJSON = true

    if (makeJSON) {
      for (let n = 0; n < length;) {
        print(toJSON(records[n++]) + (n < length ? ',\n' : '\n'))
      }
    } else {
      const rows = []

      prepare(records)

      for (const record of records) {
        const row = headings.reduce((acc, txt, i) =>
          acc.push(i ? ' ' : record.day, record.lines + '', ' ', ' ') && acc, [])
        let res, r

        if (showMain && (res = record['main'])) {
          if ((r = res['1'])) row[mainX] = r.value + '', row[mainX + 2] = r.time + ''
          if ((r = res['2'])) row[mainX + 1] = r.value + '', row[mainX + 3] = r.time + ''
        }
        if (showDemo && (res = record['demo'])) {
          if ((r = res['1'])) row[demoX] = r.value + '', row[demoX + 2] = r.time + ''
          if ((r = res['2'])) row[demoX + 1] = r.value + '', row[demoX + 3] = r.time + ''
        }
        if (record.comment) {
          row[commentX] = record.comment
        }
        rows.push(row)
      }
      makeMd ? dumpMd(rows) : dumpTable(rows)
    }

    print('\n')
  }

  return dump
}

//  core/dumper.js
'use strict'

const {assert} = require('.')

module.exports = ({useBoth, useDemo}, print) => {
  const showDemo = useBoth || useDemo, showMain = !useDemo, headings = [' day', 'lines']
  let lastColumn, widths, hasNotes = false
  let commentX = 6, demoResX = 2, demoTimeX = 4, mainTimeX = 4

  const prepare = (records) => {
    if (showMain) {
      headings.push('Main1') && headings.push('Main2')
      demoResX = 4, demoTimeX = 8
    }
    if (showDemo) {
      headings.push('Demo1') && headings.push('Demo2')
      mainTimeX = 6
      if (showMain) commentX += 4
    }
    if (showMain) headings.push('M1_µs') && headings.push('M2_µs')
    if (showDemo) headings.push('D1_µs') && headings.push('D2_µs')

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
        const row = headings.reduce((acc, txt, i) => acc.push(i ? ' ' : record.day, record.lines + '') && acc, [])
        let res, r

        if (showMain && (res = record['main'])) {
          if ((r = res['1'])) row[2] = r.value + '', row[mainTimeX] = r.time + ''
          if ((r = res['2'])) row[3] = r.value + '', row[mainTimeX + 1] = r.time + ''
        }
        if (showDemo && (res = record['demo'])) {
          if ((r = res['1'])) row[demoResX] = r.value + '', row[demoTimeX] = r.time + ''
          if ((r = res['2'])) row[demoResX + 1] = r.value + '', row[demoTimeX + 1] = r.time + ''
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

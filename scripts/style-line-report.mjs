#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { walk } from './lib/walk.mjs'
import { parseArgs } from './lib/args.mjs'
import { EXCLUDED_DIRS } from './lib/constants.mjs'

const rawArgs = process.argv.slice(2)
if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
  console.error('Usage: node scripts/style-line-report.mjs <deck-root> [--limit=<n>] [--warn=<n>]')
  process.exit(0)
}

const { root, options } = parseArgs(rawArgs)
const limit = options.limit !== undefined ? Number(options.limit) : 40
const warnAt = options.warn !== undefined ? Number(options.warn) : 400

function lineCount(text) {
  if (!text) return 0
  return text.split(/\r\n|\r|\n/).length
}

function vueStyleBlocks(file, text) {
  const blocks = []
  const pattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
  let match
  let index = 0
  while ((match = pattern.exec(text))) {
    index += 1
    blocks.push({
      file: `${path.relative(root, file)}#style${index}`,
      lines: lineCount(match[1].trim()),
      kind: 'vue-style',
    })
  }
  return blocks
}

const rows = []
for (const file of walk(root, EXCLUDED_DIRS, /\.(css|vue)$/)) {
  const text = readFileSync(file, 'utf8')
  if (file.endsWith('.css')) {
    rows.push({
      file: path.relative(root, file),
      lines: lineCount(text.trim()),
      kind: 'css',
    })
  } else {
    rows.push(...vueStyleBlocks(file, text))
  }
}

rows.sort((a, b) => b.lines - a.lines || a.file.localeCompare(b.file))

const total = rows.reduce((sum, row) => sum + row.lines, 0)
const cssCount = rows.filter((row) => row.kind === 'css').length
const vueCount = rows.filter((row) => row.kind === 'vue-style').length

console.log(`Style line report for ${root}`)
console.log(`Sources: ${cssCount} CSS files, ${vueCount} Vue style blocks`)
console.log(`Total style lines: ${total}`)
console.log(`Warning threshold: ${warnAt} lines\n`)

for (const row of rows.slice(0, limit)) {
  const marker = row.lines >= warnAt ? ' !' : '  '
  console.log(`${marker} ${String(row.lines).padStart(5)}  ${row.file}`)
}

const hidden = rows.length - Math.min(rows.length, limit)
if (hidden > 0) {
  console.log(`\n${hidden} additional style sources hidden by --limit=${limit}`)
}

const oversized = rows.filter((row) => row.lines >= warnAt)
if (oversized.length) {
  console.log('\nReview large style owners:')
  for (const row of oversized) {
    console.log(`- ${row.file} (${row.lines} lines)`)
  }
}

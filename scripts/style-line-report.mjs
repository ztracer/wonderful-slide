#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const rootArg = args.find((arg) => !arg.startsWith('--')) || '.'
const root = path.resolve(rootArg)
const limitArg = args.find((arg) => arg.startsWith('--limit='))
const warnArg = args.find((arg) => arg.startsWith('--warn='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : 40
const warnAt = warnArg ? Number(warnArg.split('=')[1]) : 400

const excludedDirs = new Set([
  '.agents',
  '.git',
  '.output',
  '.slidev',
  '.vite',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
])

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, files)
    } else if (entry.endsWith('.css') || entry.endsWith('.vue')) {
      files.push(full)
    }
  }
  return files
}

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
for (const file of walk(root)) {
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

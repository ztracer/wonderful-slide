#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const root = path.resolve(args.find((arg) => !arg.startsWith('--')) || '.')
const fail = args.includes('--fail-on-findings')

const excludedDirs = new Set(['.agents', '.cache', '.git', 'dist', 'node_modules', 'slides-export'])
const patterns = [
  /这套\s*slides/i,
  /目标是让听众/,
  /这里要/,
  /避免.+(泛泛|防止|出现|使用|讲成)?/,
  /入门时先/,
  /计划(里|中|会|要)?/,
  /我们需要/,
  /audience-facing/i,
  /speaker notes should/i,
  /TODO/i,
]

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else if (/\.(md|vue)$/.test(entry)) files.push(full)
  }
  return files
}

const findings = []
for (const file of walk(root)) {
  const rel = path.relative(root, file)
  if (rel === 'index.md') continue
  const lines = readFileSync(file, 'utf8').split(/\r\n|\r|\n/)
  lines.forEach((line, index) => {
    if (patterns.some((pattern) => pattern.test(line))) {
      findings.push({ file: rel, line: index + 1, text: line.trim().slice(0, 220) })
    }
  })
}

console.log(`Prompt artifact scan for ${root}`)
console.log(`Findings: ${findings.length}`)

for (const finding of findings.slice(0, 80)) {
  console.log(`${finding.file}:${finding.line}: ${finding.text}`)
}

if (findings.length > 80) {
  console.log(`... ${findings.length - 80} more`)
}

if (findings.length && fail) process.exit(1)

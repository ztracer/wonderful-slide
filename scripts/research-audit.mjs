#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(process.argv.find((arg, index) => index > 1 && !arg.startsWith('--')) || '.')
const indexPath = path.join(root, 'index.md')

const required = [
  '## Sources',
  '## Glossary',
  '## Claim Map',
  '## Example Inventory',
  '## Tool Notes',
  '## Slide Question Sequence',
]

console.log(`Research audit for ${root}`)

if (!existsSync(indexPath)) {
  console.log('Missing index.md')
  process.exit(1)
}

const text = readFileSync(indexPath, 'utf8')
const missing = required.filter((heading) => !text.includes(heading))
const linkCount = (text.match(/https?:\/\//g) || []).length
const claimCount = (text.match(/^- \[/gm) || []).length

console.log(`index.md: ${indexPath}`)
console.log(`Links: ${linkCount}`)
console.log(`Claim/example bullets: ${claimCount}`)

if (missing.length) {
  console.log('Missing sections:')
  for (const heading of missing) console.log(`- ${heading}`)
}

if (linkCount < 3) {
  console.log('Expected at least 3 source links in index.md')
}

if (missing.length || linkCount < 3) {
  process.exit(1)
}

console.log('Research dossier shape looks usable.')

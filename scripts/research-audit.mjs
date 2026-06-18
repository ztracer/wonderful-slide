#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from './lib/args.mjs'

const rawArgs = process.argv.slice(2)
if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
  console.error('Usage: node scripts/research-audit.mjs <deck-root> [--strict]')
  process.exit(0)
}

const { root, options } = parseArgs(rawArgs)
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

// --- Strict mode checks ---

if (options.strict) {
  let strictFailed = false

  // 1. Claim-source mapping: each bullet in Claim Map should have a [source-X] reference
  const claimMapMatch = text.match(/## Claim Map\n([\s\S]*?)(?=\n## |$)/)
  if (claimMapMatch) {
    const claimMapSection = claimMapMatch[1]
    const bullets = claimMapSection.split('\n').filter((line) => /^\s*- /.test(line))
    if (bullets.length === 0) {
      console.log('STRICT: Claim Map has no bullet entries')
      strictFailed = true
    } else {
      const withoutSource = bullets.filter((bullet) => !/\[source-\d+\]/.test(bullet))
      if (withoutSource.length > 0) {
        console.log(`STRICT: Claim Map has ${withoutSource.length} bullet(s) without [source-X] reference:`)
        for (const bullet of withoutSource.slice(0, 5)) {
          console.log(`  ${bullet.trim().slice(0, 120)}`)
        }
        if (withoutSource.length > 5) console.log(`  ... ${withoutSource.length - 5} more`)
        strictFailed = true
      } else {
        console.log(`STRICT: Claim Map OK — ${bullets.length} bullet(s) all have source references`)
      }
    }
  } else {
    console.log('STRICT: Could not extract Claim Map section')
    strictFailed = true
  }

  // 2. Question type coverage: at least 2 different question types in Slide Question Sequence
  const questionTypes = ['Foundational', 'Mechanism', 'Evidence', 'Contrast', 'Takeaway']
  const sqsMatch = text.match(/## Slide Question Sequence\n([\s\S]*?)(?=\n## |$)/)
  if (sqsMatch) {
    const sqsSection = sqsMatch[1]
    const foundTypes = questionTypes.filter((t) => sqsSection.includes(t))
    if (foundTypes.length < 2) {
      console.log(`STRICT: Slide Question Sequence has only ${foundTypes.length} question type(s), expected at least 2 (found: ${foundTypes.join(', ') || 'none'})`)
      strictFailed = true
    } else {
      console.log(`STRICT: Slide Question Sequence OK — ${foundTypes.length} question types found (${foundTypes.join(', ')})`)
    }
  } else {
    console.log('STRICT: Could not extract Slide Question Sequence section')
    strictFailed = true
  }

  // 3. Example completeness: at least one example with an expected result mentioned
  const eiMatch = text.match(/## Example Inventory\n([\s\S]*?)(?=\n## |$)/)
  if (eiMatch) {
    const eiSection = eiMatch[1]
    // Look for expected result indicators: "expected", "result", "output", "should", "will"
    const hasExpected = /(?:expected|result|output|should\s+see|will\s+show|→|->|=>|产出|预期|结果)/i.test(eiSection)
    if (!hasExpected) {
      console.log('STRICT: Example Inventory has no example with an expected result mentioned')
      strictFailed = true
    } else {
      console.log('STRICT: Example Inventory OK — at least one example mentions an expected result')
    }
  } else {
    console.log('STRICT: Could not extract Example Inventory section')
    strictFailed = true
  }

  if (strictFailed) {
    console.log('\nStrict audit FAILED')
    process.exit(1)
  }

  console.log('\nStrict audit PASSED')
}

// --- Base audit exit ---

if (missing.length || linkCount < 3) {
  process.exit(1)
}

console.log('Research dossier shape looks usable.')

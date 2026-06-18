#!/usr/bin/env node
import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { parseArgs, usage } from './lib/args.mjs'

const TEMPLATE = `# Research Dossier

> Working research file — not audience-facing. Bind claims, sources, and examples here before writing slides.

## Sources

| ID | Source | What it supports |
|----|--------|-----------------|
|    |        |                 |

## Glossary

| Term | Plain meaning | Formal / technical meaning |
|------|--------------|---------------------------|
|      |              |                           |

## Claim Map

| Claim | Source ID | Status |
|-------|-----------|--------|
|       |           |        |

## Example Inventory

| Example | Expected result | What it teaches |
|---------|----------------|-----------------|
|         |                |                 |

## Tool Notes

| Tool | Version | Install notes | Caveats |
|------|---------|--------------|---------|
|      |         |              |         |

## Slide Question Sequence

| # | Question | Type | Source | Visual | Takeaway |
|---|----------|------|--------|--------|----------|
| 1 |          |      |        |        |          |
`

const { root, options } = parseArgs(process.argv.slice(2))

if (options.help || options.h) {
  console.log(usage('node scripts/init-research.mjs <deck-root>', ['[--force]']))
  process.exit(0)
}

if (!existsSync(root)) {
  console.error(`Deck root does not exist: ${root}`)
  process.exit(2)
}

const indexPath = path.join(root, 'index.md')

if (existsSync(indexPath) && !options.force) {
  console.log('index.md already exists. Use --force to overwrite.')
  process.exit(0)
}

writeFileSync(indexPath, TEMPLATE, 'utf8')
console.log(`Created index.md at ${indexPath}`)

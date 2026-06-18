#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { parseArgs, usage } from './lib/args.mjs'

const { root, options } = parseArgs(process.argv.slice(2))

if (options.help || options.h) {
  console.log(usage('node scripts/notes-check.mjs <deck-root>', [
    '[--max-lines <n>]',
    '[--range <pages>]',
    '[--fail-on-findings]',
  ]))
  process.exit(0)
}

if (!existsSync(root)) {
  console.error(`Deck root does not exist: ${root}`)
  process.exit(2)
}

const slidesPath = path.join(root, 'slides.md')
if (!existsSync(slidesPath)) {
  console.error(`No slides.md found at ${slidesPath}`)
  process.exit(2)
}

const maxLines = Number(options['max-lines']) || 100

// --- Range parsing ---
function parseRange(range) {
  const selected = new Set()
  for (const part of String(range).split(',')) {
    const value = part.trim()
    if (!value) continue

    const span = value.match(/^(\d+)\s*-\s*(\d+)$/)
    if (span) {
      const start = Number(span[1])
      const end = Number(span[2])
      const low = Math.min(start, end)
      const high = Math.max(start, end)
      for (let slide = low; slide <= high; slide += 1) {
        selected.add(slide)
      }
      continue
    }

    if (/^\d+$/.test(value)) {
      selected.add(Number(value))
    }
  }
  return selected
}

// --- Slide parsing (same approach as language-check.mjs) ---
function isSeparator(line) {
  return /^---\s*$/.test(line)
}

function findFrontmatterClose(lines, start) {
  if (!isSeparator(lines[start])) return -1
  for (let index = start + 1; index < lines.length; index += 1) {
    if (isSeparator(lines[index])) return index
  }
  return -1
}

function slideFrontmatterClose(lines, start) {
  let sawYamlKey = false
  for (let index = start; index < Math.min(lines.length, start + 30); index += 1) {
    const line = lines[index]
    if (isSeparator(line)) {
      return sawYamlKey ? index : -1
    }
    if (!line.trim()) continue
    if (/^[A-Za-z0-9_-]+\s*:/.test(line)) {
      sawYamlKey = true
      continue
    }
    if (/^\s+/.test(line)) continue
    return -1
  }
  return -1
}

function nextSlideSeparator(lines, start) {
  let inFence = false
  for (let index = start; index < lines.length; index += 1) {
    if (/^\s*(```|~~~)/.test(lines[index])) {
      inFence = !inFence
      continue
    }
    if (!inFence && isSeparator(lines[index])) return index
  }
  return -1
}

function parseSlides(lines) {
  let start = 0
  const deckFrontmatterClose = findFrontmatterClose(lines, 0)
  if (deckFrontmatterClose >= 0) {
    start = deckFrontmatterClose + 1
  }

  const slides = []
  let slideNumber = 1
  while (start < lines.length) {
    let contentStart = start
    const frontmatterClose = slideFrontmatterClose(lines, start)
    if (frontmatterClose >= 0) {
      contentStart = frontmatterClose + 1
    }

    const separator = nextSlideSeparator(lines, contentStart)
    const end = separator >= 0 ? separator - 1 : lines.length - 1
    slides.push({ number: slideNumber, start, end })
    if (separator < 0) break
    start = separator + 1
    slideNumber += 1
  }

  return slides
}

// --- Note extraction ---
/**
 * Count total lines within all <!-- ... --> comment blocks in the given text.
 * Returns total line count across all note blocks.
 */
function countNoteLines(text) {
  let total = 0
  let idx = 0

  while (idx < text.length) {
    const openIdx = text.indexOf('<!--', idx)
    if (openIdx === -1) break

    const closeIdx = text.indexOf('-->', openIdx)
    if (closeIdx === -1) break

    // Extract content between <!-- and -->
    const inner = text.slice(openIdx + 4, closeIdx)
    // Count lines (a completely empty note counts as 0 lines)
    const lines = inner.split('\n')
    // Filter: only count non-empty lines
    const nonEmpty = lines.filter((l) => l.trim().length > 0).length
    total += nonEmpty

    idx = closeIdx + 3
  }

  return total
}

// --- Main ---
const lines = readFileSync(slidesPath, 'utf8').split(/\r\n|\r|\n/)
const allSlides = parseSlides(lines)

let slides = allSlides
if (options.range) {
  const selected = parseRange(options.range)
  if (!selected.size) {
    console.error(`Invalid --range value: ${options.range}`)
    process.exit(2)
  }
  slides = allSlides.filter((s) => selected.has(s.number))
}

const longNotes = []
const emptyNotes = []

for (const slide of slides) {
  const text = lines.slice(slide.start, slide.end + 1).join('\n')
  const noteLines = countNoteLines(text)

  if (noteLines === 0) {
    emptyNotes.push(slide.number)
  } else if (noteLines > maxLines) {
    longNotes.push({ number: slide.number, lines: noteLines })
  }
}

console.log(`Speaker notes check for ${root}`)
if (options.range) {
  console.log(`Range: ${options.range}`)
}
console.log(`Slides: ${slides.length} checked`)
console.log(`Long notes (>${maxLines} lines): ${longNotes.length}`)
console.log(`Empty notes: ${emptyNotes.length}`)

if (longNotes.length > 0) {
  console.log('')
  console.log('Long notes:')
  for (const entry of longNotes) {
    console.log(`  Slide ${entry.number}: ${entry.lines} lines`)
  }
}

if (emptyNotes.length > 0) {
  console.log('')
  console.log('Empty/missing notes:')
  for (const num of emptyNotes) {
    console.log(`  Slide ${num}`)
  }
}

if (options['fail-on-findings'] && (longNotes.length > 0 || emptyNotes.length > 0)) {
  process.exit(1)
}

process.exit(0)

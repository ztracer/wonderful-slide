#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { walk } from './lib/walk.mjs'
import { parseArgs } from './lib/args.mjs'
import { EXCLUDED_DIRS } from './lib/constants.mjs'

const rawArgs = process.argv.slice(2)
if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
  console.error('Usage: node scripts/artifact-scan.mjs <deck-root> [--range <pages>] [--fail-on-findings]')
  process.exit(0)
}

const { root, options } = parseArgs(rawArgs)
const fail = options['fail-on-findings']

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

// --- Slide parsing helpers (adapted from language-check.mjs) ---

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

// --- Scanning ---

const findings = []

if (options.range) {
  const slidesPath = path.join(root, 'slides.md')
  if (!existsSync(slidesPath)) {
    console.error(`No slides.md found at ${slidesPath}`)
    process.exit(2)
  }

  const selected = parseRange(options.range)
  if (!selected.size) {
    console.error(`Invalid --range value: ${options.range}`)
    process.exit(2)
  }

  const lines = readFileSync(slidesPath, 'utf8').split(/\r\n|\r|\n/)
  const slides = parseSlides(lines)
  for (const slide of slides) {
    if (!selected.has(slide.number)) continue
    const slideLines = lines.slice(slide.start, slide.end + 1)
    slideLines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) {
        findings.push({
          file: 'slides.md',
          line: slide.start + index + 1,
          text: line.trim().slice(0, 220),
        })
      }
    })
  }
} else {
  const files = walk(root, EXCLUDED_DIRS, /\.(md|vue)$/)
  for (const file of files) {
    const rel = path.relative(root, file)
    if (rel === 'index.md') continue
    const lines = readFileSync(file, 'utf8').split(/\r\n|\r|\n/)
    lines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) {
        findings.push({ file: rel, line: index + 1, text: line.trim().slice(0, 220) })
      }
    })
  }
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

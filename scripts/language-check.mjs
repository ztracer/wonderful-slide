#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { walk } from './lib/walk.mjs'
import { parseArgs, usage } from './lib/args.mjs'
import { EXCLUDED_DIRS, EXCLUDED_FILES } from './lib/constants.mjs'

const rawArgs = process.argv.slice(2)
if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
  console.error(usage('node scripts/language-check.mjs <deck-root>', ['[--range <pages>]', '[--fail-on-findings]']))
  process.exit(0)
}

const { root, options } = parseArgs(rawArgs)

const lineRules = [
  {
    category: 'defensive-english',
    pattern: /\bnot\s+only\b.{0,180}?\bbut\s+also\b/i,
    suggestion: 'Prefer the main outcome plus one supporting detail.',
  },
  {
    category: 'defensive-english',
    pattern: /\bnot\b.{0,140}?\bbut\b/i,
    skipIf: /\bnot\s+only\b/i,
    suggestion: 'Rewrite as a positive claim; keep contrast only if it changes the argument.',
  },
  {
    category: 'defensive-english',
    pattern: /\brather\s+than\b/i,
    suggestion: 'State the selected route and its reason directly.',
  },
  {
    category: 'defensive-english',
    pattern: /\bsince\b/i,
    suggestion: 'Use a direct causal phrase only when the causal relation matters.',
  },
  {
    category: 'defensive-english',
    pattern: /\bhowever\b/i,
    suggestion: 'Replace with the actual contrast or remove the detour.',
  },
  {
    category: 'defensive-english',
    pattern: /\btherefore\b/i,
    suggestion: 'State the conclusion directly, or make the cause explicit.',
  },
  {
    category: 'defensive-chinese',
    pattern: /不仅[^。！？；\n]{0,90}而且/,
    suggestion: 'Prefer one main outcome and one concrete support point.',
  },
  {
    category: 'defensive-chinese',
    pattern: /不是[^。！？；\n]{0,90}而是/,
    suggestion: 'Rewrite as a direct positive claim; keep contrast only if needed.',
  },
  {
    category: 'defensive-chinese',
    pattern: /并不是/,
    suggestion: 'Remove the defensive setup unless it prevents a likely misconception.',
  },
  {
    category: 'defensive-chinese',
    pattern: /与其[^。！？；\n]{0,90}不如/,
    suggestion: 'State the chosen route and why it fits.',
  },
  {
    category: 'defensive-chinese',
    pattern: /然而/,
    suggestion: 'Replace with a concrete contrast or remove the transition.',
  },
  {
    category: 'defensive-chinese',
    pattern: /因此/,
    suggestion: 'State the conclusion directly, or name the cause in plain language.',
  },
  {
    category: 'defensive-chinese',
    pattern: /所以说/,
    suggestion: 'Use a direct conclusion sentence.',
  },
  {
    category: 'defensive-chinese',
    pattern: /换句话说/,
    suggestion: 'Remove repeated explanation unless the first version is unclear.',
  },
  {
    category: 'defensive-chinese',
    pattern: /需要注意的是/,
    suggestion: 'Turn the warning into the actual claim or move nuance to speaker notes.',
  },
  {
    category: 'defensive-chinese',
    pattern: /这里不是/,
    suggestion: 'State what this slide is doing, not what it is avoiding.',
  },
]

const possibilityTerms = ['可能', '可以', '适合', '理论上']
const choiceTerms = ['当前', '本工作', '我们实现', '这里选择']

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

function stripVueStylesPreserveLines(text) {
  const lines = text.split(/\r\n|\r|\n/)
  let inStyle = false
  return lines.map((line) => {
    if (/<style\b/i.test(line)) {
      inStyle = true
    }
    const output = inStyle ? '' : line
    if (inStyle && /<\/style>/i.test(line)) {
      inStyle = false
    }
    return output
  }).join('\n')
}

function stripFencedCodePreserveLines(text) {
  const lines = text.split(/\r\n|\r|\n/)
  let inFence = false
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return ''
    }
    return inFence ? '' : line
  }).join('\n')
}

function prepareText(file, text) {
  const withoutStyles = file.endsWith('.vue') ? stripVueStylesPreserveLines(text) : text
  return stripFencedCodePreserveLines(withoutStyles)
}

function clip(value, max = 90) {
  const normalized = String(value).replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1)}...`
}

function addFinding(findings, seen, finding) {
  const key = `${finding.file}:${finding.line}:${finding.category}:${finding.match}`
  if (seen.has(key)) return
  seen.add(key)
  findings.push(finding)
}

function scanLineRules(source, lines, findings, seen) {
  lines.forEach((line, index) => {
    for (const rule of lineRules) {
      if (rule.skipIf && rule.skipIf.test(line)) continue
      const match = line.match(rule.pattern)
      if (!match) continue
      addFinding(findings, seen, {
        file: source.file,
        line: source.lineOffset + index + 1,
        category: rule.category,
        match: clip(match[0]),
        suggestion: rule.suggestion,
      })
    }
  })
}

function paragraphs(lines) {
  const blocks = []
  let current = []
  let startLine = 0

  lines.forEach((line, index) => {
    if (!line.trim()) {
      if (current.length) {
        blocks.push({ startLine, text: current.join('\n') })
        current = []
      }
      return
    }
    if (!current.length) startLine = index
    current.push(line)
  })

  if (current.length) {
    blocks.push({ startLine, text: current.join('\n') })
  }
  return blocks
}

function scanMethodTransitions(source, lines, findings, seen) {
  for (const block of paragraphs(lines)) {
    const text = block.text.replace(/\s+/g, '')
    const hasPossibility = possibilityTerms.some((term) => text.includes(term))
    const hasChoice = choiceTerms.some((term) => text.includes(term))
    if (!hasPossibility || !hasChoice) continue

    addFinding(findings, seen, {
      file: source.file,
      line: source.lineOffset + block.startLine + 1,
      category: 'method-transition',
      match: '可能/可以/适合/理论上 -> 当前/本工作/我们实现/这里选择',
      suggestion: 'Check that the paragraph bridges problem constraint -> chosen route -> evidence.',
    })
  }
}

function sentenceLineStart(lines, sentenceIndex) {
  let line = 0
  let consumed = 0
  for (const current of lines) {
    const nextConsumed = consumed + current.length + 1
    if (sentenceIndex < nextConsumed) return line
    consumed = nextConsumed
    line += 1
  }
  return Math.max(0, lines.length - 1)
}

function splitSentencesWithIndexes(text) {
  const sentences = []
  const pattern = /[^。！？!?;\n]+[。！？!?;]?/g
  let match
  while ((match = pattern.exec(text))) {
    const value = match[0].trim()
    if (value) {
      sentences.push({ text: value, index: match.index })
    }
  }
  return sentences
}

function technicalTokens(sentence) {
  const tokens = sentence.match(/\b[A-Za-z][A-Za-z0-9_.-]*\b/g) || []
  return tokens.filter((token) => {
    if (token.length < 2) return false
    return (
      /[A-Z]{2,}/.test(token) ||
      /[a-z][A-Z]/.test(token) ||
      /[A-Z][a-z]+[A-Z]/.test(token) ||
      /[._-]/.test(token)
    )
  })
}

function scanTechnicalPileup(source, lines, findings, seen) {
  const text = lines.join('\n')
  for (const sentence of splitSentencesWithIndexes(text)) {
    const sentenceOffset = sentenceLineStart(lines, sentence.index)
    const line = source.lineOffset + sentenceOffset + 1
    const slashChain = sentence.text.match(/[A-Za-z0-9_.-]+\s*\/\s*[A-Za-z0-9_.-]+(?:\s*\/\s*[A-Za-z0-9_.-]+)+/)
    if (slashChain) {
      addFinding(findings, seen, {
        file: source.file,
        line,
        category: 'technical-pileup',
        match: clip(slashChain[0]),
        suggestion: 'Replace long slash chains with one Chinese category plus precise examples.',
      })
    }

    const tokens = technicalTokens(sentence.text)
    if (tokens.length >= 7) {
      addFinding(findings, seen, {
        file: source.file,
        line,
        category: 'technical-pileup',
        match: clip(tokens.slice(0, 9).join(', ')),
        suggestion: 'Split dense technical detail into object, operation, and evidence, or move it to notes.',
      })
    }
  }
}

function scanSource(source, findings, seen) {
  const prepared = prepareText(source.file, source.text)
  const lines = prepared.split(/\r\n|\r|\n/)
  scanLineRules(source, lines, findings, seen)
  scanMethodTransitions(source, lines, findings, seen)
  scanTechnicalPileup(source, lines, findings, seen)
}

function allSources(root) {
  return walk(root, EXCLUDED_DIRS, /\.(md|mdx|vue)$/)
    .filter((file) => !EXCLUDED_FILES.has(path.basename(file)))
    .map((file) => ({
      file: path.relative(root, file),
      text: readFileSync(file, 'utf8'),
      lineOffset: 0,
    }))
}

function rangeSources(root, range) {
  const slidesPath = path.join(root, 'slides.md')
  if (!existsSync(slidesPath)) {
    console.error(`No slides.md found at ${slidesPath}`)
    process.exit(2)
  }

  const selected = parseRange(range)
  if (!selected.size) {
    console.error(`Invalid --range value: ${range}`)
    process.exit(2)
  }

  const lines = readFileSync(slidesPath, 'utf8').split(/\r\n|\r|\n/)
  const slides = parseSlides(lines)
  return slides
    .filter((slide) => selected.has(slide.number))
    .map((slide) => ({
      file: 'slides.md',
      text: lines.slice(slide.start, slide.end + 1).join('\n'),
      lineOffset: slide.start,
    }))
}

if (!existsSync(root)) {
  console.error(`Deck root does not exist: ${root}`)
  process.exit(2)
}

const sources = options.range ? rangeSources(root, options.range) : allSources(root)
const findings = []
const seen = new Set()

for (const source of sources) {
  scanSource(source, findings, seen)
}

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.category.localeCompare(b.category))

console.log(`Language check for ${root}`)
if (options.range) {
  console.log(`Range: ${options.range}`)
}
console.log(`Sources: ${sources.length}`)
console.log(`Findings: ${findings.length}`)

if (!findings.length) {
  console.log('No language candidates found.')
  process.exit(0)
}

let currentFile = ''
for (const finding of findings) {
  if (finding.file !== currentFile) {
    currentFile = finding.file
    console.log(`\n${currentFile}`)
  }
  console.log(`  ${String(finding.line).padStart(4)}  ${finding.category}  "${finding.match}"`)
  console.log(`        ${finding.suggestion}`)
}

if (options['fail-on-findings']) {
  process.exitCode = 1
}

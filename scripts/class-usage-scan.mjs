#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const rootArg = args.find((arg) => !arg.startsWith('--')) || '.'
const root = path.resolve(rootArg)
const failOnUnused = args.includes('--fail-on-unused')

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

const ignoredClassNames = new Set([
  'dark',
  'light',
  'print',
  'slidev-code',
  'slidev-content',
  'slidev-drawing',
  'slidev-layout',
  'slidev-note',
  'slidev-page',
  'slidev-presenter',
  'slidev-route',
  'slidev-slide-container',
  'slidev-vclick-target',
  'v-after',
  'v-click',
  'v-click-hidden',
  'v-clicks',
])

const ignoredPrefixes = [
  'cm-',
  'hljs',
  'iconify',
  'katex',
  'language-',
  'mermaid',
  'monaco',
  'router-',
  'shiki',
  'slidev-',
]

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, files)
    } else if (/\.(css|vue|md|mdx)$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}

function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '')
}

function stripVueStyles(text) {
  return text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
}

function vueStyleBlocks(text) {
  const blocks = []
  const pattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
  let match
  while ((match = pattern.exec(text))) {
    blocks.push(match[1])
  }
  return blocks
}

function cssClassNames(css) {
  const classes = new Set()
  const text = stripCssComments(css)
  const pattern = /(^|[^A-Za-z0-9_-])\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g
  let match
  while ((match = pattern.exec(text))) {
    classes.add(match[2])
  }
  return classes
}

function isIgnoredClass(name) {
  if (ignoredClassNames.has(name)) return true
  return ignoredPrefixes.some((prefix) => name.startsWith(prefix))
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function collectDynamicPrefixes(text) {
  const prefixes = new Set()
  const templatePattern = /[`"']([^`"']*\$\{[^`"']*)[`"']/g
  let match
  while ((match = templatePattern.exec(text))) {
    const beforeInterpolation = match[1].split('${')[0]
    const tail = beforeInterpolation.match(/([A-Za-z][A-Za-z0-9_-]*-)$/)
    if (tail && tail[1].length >= 3) {
      prefixes.add(tail[1])
    }
  }

  const transitionPattern = /<Transition\b[^>]*\bname\s*=\s*["']([A-Za-z][A-Za-z0-9_-]*)["'][^>]*>/g
  while ((match = transitionPattern.exec(text))) {
    prefixes.add(`${match[1]}-`)
  }

  return prefixes
}

function isUsed(name, usageText, dynamicPrefixes) {
  if (dynamicPrefixes.has(name)) return true
  for (const prefix of dynamicPrefixes) {
    if (name.startsWith(prefix)) return true
  }
  const token = new RegExp(`(^|[^A-Za-z0-9_-])${escapeRegExp(name)}($|[^A-Za-z0-9_-])`)
  return token.test(usageText)
}

const files = walk(root)
const styleSources = []
const usageTexts = []

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const rel = path.relative(root, file)
  if (file.endsWith('.css')) {
    styleSources.push({ file: rel, css: text })
  } else if (file.endsWith('.vue')) {
    const blocks = vueStyleBlocks(text)
    blocks.forEach((css, index) => {
      styleSources.push({ file: `${rel}#style${index + 1}`, css })
    })
    usageTexts.push(stripVueStyles(text))
  } else {
    usageTexts.push(text)
  }
}

const usageText = usageTexts.join('\n')
const dynamicPrefixes = collectDynamicPrefixes(usageText)
const unusedByFile = new Map()
let definedCount = 0
let ignoredCount = 0

for (const source of styleSources) {
  const unused = []
  for (const name of cssClassNames(source.css)) {
    if (isIgnoredClass(name)) {
      ignoredCount += 1
      continue
    }
    definedCount += 1
    if (!isUsed(name, usageText, dynamicPrefixes)) {
      unused.push(name)
    }
  }
  if (unused.length) {
    unusedByFile.set(source.file, [...new Set(unused)].sort())
  }
}

const unusedCount = [...unusedByFile.values()].reduce((sum, names) => sum + names.length, 0)

console.log(`Class usage scan for ${root}`)
console.log(`Style sources: ${styleSources.length}`)
console.log(`Content sources: ${usageTexts.length}`)
console.log(`Defined classes checked: ${definedCount}`)
console.log(`Ignored runtime/vendor classes: ${ignoredCount}`)

if (!unusedCount) {
  console.log('No unused CSS classes found.')
  process.exit(0)
}

console.log(`Unused CSS classes: ${unusedCount}\n`)
for (const [file, names] of unusedByFile) {
  console.log(file)
  for (const name of names) {
    console.log(`  .${name}`)
  }
}

if (failOnUnused) {
  process.exitCode = 1
}

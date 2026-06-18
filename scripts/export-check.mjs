#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs, usage } from './lib/args.mjs'

const rawArgs = process.argv.slice(2)
if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
  console.error(usage('node scripts/export-check.mjs <deck-root>', [
    '--range <pages>',
    '[--output <dir>]',
    '[--expect <n>]',
    '[--entry <slides.md>]',
    '[--log <path>]',
    '[--wait <ms>]',
    '[--timeout <ms>]',
  ]))
  process.exit(0)
}

function packageRunner(root) {
  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) {
    return { command: 'pnpm', args: ['exec', 'slidev', 'export'] }
  }
  if (existsSync(path.join(root, 'bun.lockb')) || existsSync(path.join(root, 'bun.lock'))) {
    return { command: 'bunx', args: ['slidev', 'export'] }
  }
  if (existsSync(path.join(root, 'yarn.lock'))) {
    return { command: 'yarn', args: ['slidev', 'export'] }
  }
  return { command: 'npx', args: ['slidev', 'export'] }
}

function expectedFromRange(range) {
  const seen = new Set()
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
        seen.add(slide)
      }
      continue
    }

    if (/^\d+$/.test(value)) {
      seen.add(Number(value))
    }
  }

  return seen.size || undefined
}

function listPngs(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((entry) => entry.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function logFindings(logText) {
  const patterns = [
    /\[Vue warn\]/i,
    /Unhandled (?:error|rejection)/i,
    /TypeError:/i,
    /ReferenceError:/i,
    /Cannot read properties of undefined/i,
    /Failed to resolve component/i,
    /page\.evaluate:/i,
  ]

  const findings = []
  const lines = logText.split(/\r\n|\r|\n/)
  lines.forEach((line, index) => {
    if (patterns.some((pattern) => pattern.test(line))) {
      findings.push({ line: index + 1, text: line.slice(0, 500) })
    }
  })
  return findings
}

const { root, options } = parseArgs(rawArgs)
const range = options.range

if (!range) {
  console.error(usage('node scripts/export-check.mjs <deck-root>', [
    '--range <pages>',
    '[--output <dir>]',
    '[--expect <n>]',
    '[--entry <slides.md>]',
    '[--log <path>]',
    '[--wait <ms>]',
    '[--timeout <ms>]',
  ]))
  process.exit(2)
}

const output = path.resolve(
  root,
  options.output || path.join('/tmp', `wonderful-slide-export-${path.basename(root)}-${Date.now()}`),
)
const logPath = path.resolve(root, options.log || path.join(output, 'slidev-export.log'))
const wait = Number(options.wait) || 1000
const timeout = Number(options.timeout) || 120000
const expected = options.expect ? Number(options.expect) : expectedFromRange(range)

mkdirSync(output, { recursive: true })
mkdirSync(path.dirname(logPath), { recursive: true })

const runner = packageRunner(root)
const slidevArgs = [...runner.args]
if (options.entry) {
  slidevArgs.push(options.entry)
}
slidevArgs.push(
  '--format',
  'png',
  '--range',
  String(range),
  '--output',
  output,
  '--timeout',
  timeout,
  '--wait',
  wait,
)

const result = spawnSync(runner.command, slidevArgs, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 100 * 1024 * 1024,
})

const logText = `${result.stdout || ''}${result.stderr || ''}`
writeFileSync(logPath, logText)

const pngs = listPngs(output)
const findings = logFindings(logText)
const failures = []

if (result.error) {
  failures.push(`Failed to run ${runner.command}: ${result.error.message}`)
}
if (result.status !== 0) {
  failures.push(`slidev export exited with status ${result.status}`)
}
if (expected !== undefined && pngs.length < expected) {
  failures.push(`expected at least ${expected} PNG file(s), found ${pngs.length}`)
}
if (findings.length) {
  failures.push(`export log contains ${findings.length} runtime warning/error line(s)`)
}

console.log('Slidev export check')
console.log(`Root: ${root}`)
console.log(`Range: ${range}`)
console.log(`Command: ${runner.command} ${slidevArgs.join(' ')}`)
console.log(`Output: ${output}`)
console.log(`Log: ${logPath}`)
console.log(`PNG files: ${pngs.length}${expected !== undefined ? ` / expected ${expected}` : ''}`)

if (pngs.length) {
  console.log(`Generated: ${pngs.join(', ')}`)
}

if (findings.length) {
  console.log('\nRuntime log findings:')
  for (const finding of findings.slice(0, 20)) {
    console.log(`- ${finding.line}: ${finding.text}`)
  }
  if (findings.length > 20) {
    console.log(`- ... ${findings.length - 20} more finding(s), see log`)
  }
}

if (failures.length) {
  console.log('\nFailures:')
  for (const failure of failures) {
    console.log(`- ${failure}`)
  }
  process.exit(1)
}

console.log('No export log errors found.')

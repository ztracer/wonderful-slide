#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'

import { parseArgs, usage } from './lib/args.mjs'

const { root, options } = parseArgs(process.argv.slice(2))

if (options.help || options.h) {
  console.log(usage('node scripts/env-check.mjs <deck-root>', ['[--fail-on-warnings]']))
  process.exit(0)
}

if (!existsSync(root)) {
  console.error(`Deck root does not exist: ${root}`)
  process.exit(2)
}

const warnings = []
let errors = 0
let checks = 0

function ok(label) {
  checks += 1
  console.log(`\u2713 ${label}`)
}

function warn(label) {
  checks += 1
  warnings.push(label)
  console.log(`\u26a0 ${label}`)
}

function fail(label) {
  checks += 1
  errors += 1
  console.log(`\u2717 ${label}`)
}

console.log(`Environment check for ${root}`)

// 1. package.json exists + build script
const pkgPath = path.join(root, 'package.json')
if (!existsSync(pkgPath)) {
  fail('package.json: not found')
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  if (pkg.scripts && pkg.scripts.build && /slidev(?:-cli)?\s+(?:build|export)/i.test(pkg.scripts.build)) {
    ok(`package.json: build script found`)
  } else {
    fail('package.json: missing or invalid scripts.build (expected a slidev build command)')
  }
}

// 2. slidev available
let slidevVersion = null
try {
  const slidevBin = path.join(root, 'node_modules', '.bin', 'slidev')
  if (existsSync(slidevBin)) {
    const out = execSync(`"${slidevBin}" --version`, { cwd: root, encoding: 'utf8' }).trim()
    slidevVersion = out
    ok(`slidev CLI: available (v${slidevVersion})`)
  } else {
    // Try npx as fallback
    try {
      const out = execSync('npx slidev --version', { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim()
      slidevVersion = out
      ok(`slidev CLI: available (v${slidevVersion})`)
    } catch {
      warn('slidev CLI: not found (slidev must be installed for build/export)')
    }
  }
} catch {
  warn('slidev CLI: not found (slidev must be installed for build/export)')
}

// 3. slides.md exists
const slidesPath = path.join(root, 'slides.md')
if (existsSync(slidesPath)) {
  ok('slides.md: exists')
} else {
  fail('slides.md: not found')
}

// 4. Theme dependency
if (existsSync(pkgPath) && existsSync(slidesPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }

  const installedThemes = Object.keys(deps).filter((d) => d.startsWith('@slidev/theme-'))

  const slidesContent = readFileSync(slidesPath, 'utf8')
  const themeMatch = slidesContent.match(/^theme:\s*(.+)$/m)
  if (themeMatch) {
    const usedTheme = themeMatch[1].trim().replace(/^['"]|['"]$/g, '')
    const expectedPkg = `@slidev/theme-${usedTheme}`
    if (installedThemes.includes(expectedPkg)) {
      ok(`theme: "slides.md uses "${usedTheme}" and ${expectedPkg} is installed`)
    } else {
      warn(`theme: slides.md uses "${usedTheme}" but no ${expectedPkg} found in dependencies`)
    }
  }
}

// 5. playwright installed
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if (deps['playwright-chromium'] || deps['playwright']) {
    if (deps['playwright-chromium']) {
      ok('playwright: playwright-chromium installed')
    } else {
      ok('playwright: installed')
    }
  } else {
    warn('playwright: playwright-chromium not installed (needed for PNG export)')
  }
}

console.log('')
if (warnings.length) {
  console.log(`${warnings.length} warning(s)${options['fail-on-warnings'] ? ' (treated as errors)' : ''}`)
}

if (errors > 0) {
  process.exit(1)
}

if (options['fail-on-warnings'] && warnings.length > 0) {
  process.exit(1)
}

process.exit(0)

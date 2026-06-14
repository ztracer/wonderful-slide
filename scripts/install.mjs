#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get package root directory
const packageRoot = join(__dirname, '..')

// User's Claude skills directory
const skillsDir = join(process.env.HOME || process.env.USERPROFILE, '.claude', 'skills')
const targetDir = join(skillsDir, 'wonderful-slide')

function copyRecursiveSync(src, dest) {
  const exists = existsSync(src)
  const stats = exists && statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true })
    }
    readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName))
    })
  } else {
    copyFileSync(src, dest)
  }
}

console.log('🚀 Installing wonderful-slide skill for Claude Code...')
console.log()

// Check if skills directory exists
if (!existsSync(skillsDir)) {
  mkdirSync(skillsDir, { recursive: true })
  console.log('✓ Created skills directory:', skillsDir)
}

// Check if already installed
if (existsSync(targetDir)) {
  console.log('⚠️  wonderful-slide skill already installed at:', targetDir)
  console.log()
  console.log('To reinstall, remove it first:')
  console.log('  rm -rf ' + targetDir)
  process.exit(1)
}

// Copy skill files
console.log('📦 Copying skill files...')
copyRecursiveSync(packageRoot, targetDir)

// Create bin directory (if not in files list, create minimal)
const binDir = join(targetDir, 'bin')
if (!existsSync(binDir)) {
  mkdirSync(binDir, { recursive: true })
  console.log('✓ Created bin directory')
}

console.log()
console.log('✅ Installation complete!')
console.log()
console.log('📍 Skill installed at:', targetDir)
console.log()
console.log('🎯 Next steps:')
console.log('   1. Restart Claude Code')
console.log('   2. Use the skill: "Create a new technical presentation using wonderful-slide"')
console.log()
console.log('📖 Documentation:')
console.log('   https://github.com/ztracer/wonderful-slide')
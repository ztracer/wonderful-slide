import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

/**
 * Recursively walk a directory, collecting files matching optional extensions.
 * @param {string} dir - starting directory
 * @param {Set<string>} excludedDirs - dir names to skip
 * @param {RegExp} [extRe] - optional file extension filter
 * @param {string[]} [files=[]] - accumulator
 * @returns {string[]}
 */
export function walk(dir, excludedDirs, extRe, files = []) {
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, excludedDirs, extRe, files)
    } else if (!extRe || extRe.test(entry)) {
      files.push(full)
    }
  }
  return files
}

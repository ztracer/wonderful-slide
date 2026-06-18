import path from 'node:path'

/**
 * Parse CLI args into `{ root, options }`.
 * Positional arg 0 → root. Everything else → options map.
 * Supports --flag, --flag=value, --flag value.
 * @param {string[]} rawArgs - process.argv.slice(2)
 * @returns {{ root: string, options: Record<string, string|boolean> }}
 */
export function parseArgs(rawArgs) {
  const options = {}
  let root = '.'
  let rootSet = false

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index]
    if (arg.startsWith('--')) {
      const [name, inlineValue] = arg.slice(2).split('=', 2)
      if (inlineValue !== undefined) {
        options[name] = inlineValue
      } else {
        const next = rawArgs[index + 1]
        if (next && !next.startsWith('--')) {
          options[name] = next
          index += 1
        } else {
          options[name] = true
        }
      }
      continue
    }

    if (!rootSet) {
      root = arg
      rootSet = true
    }
  }

  return { root: path.resolve(root), options }
}

/**
 * Print a standard usage line.
 * @param {string} cmd - e.g. 'node scripts/foo.mjs <deck-root>'
 * @param {string[]} flags - e.g. ['--range <pages>', '--fail-on-findings']
 */
export function usage(cmd, flags = []) {
  const parts = [cmd, ...flags]
  return `Usage: ${parts.join(' ')}`
}

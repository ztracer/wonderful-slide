/** Standard directories to exclude from project walks. */
export const EXCLUDED_DIRS = new Set([
  '.agents',
  '.cache',
  '.git',
  '.output',
  '.slidev',
  '.slidev-export-check',
  '.vite',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
  'slides-export',
])

/** Files that should not be scanned as deck content. */
export const EXCLUDED_FILES = new Set([
  'index.md',
  'README.md',
])

/** Slidev/vendor class names that are not user-defined. */
export const IGNORED_CLASS_NAMES = new Set([
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

/** Vendor prefixes for CSS classes to ignore. */
export const IGNORED_CLASS_PREFIXES = [
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

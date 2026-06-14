# Architecture Patterns

Use these patterns to keep a Slidev deck understandable after several rounds of AI-assisted editing.

## Recommended Structure

```text
.
├── PRODUCT.md
├── DESIGN.md
├── slides.md
├── pages/
│   ├── <secondary-deck>.md
│   └── styles/
│       ├── index.css
│       └── <secondary-deck>.css
├── components/
│   ├── StageSlide.vue
│   └── <DomainDiagram>.vue
└── styles/
    ├── index.css
    ├── tokens.css
    ├── base.css
    ├── utilities.css
    └── <chapter>.css
```

Adapt names to the project. The important rule is ownership, not exact filenames.

## File Responsibilities

- `PRODUCT.md`: audience, talk purpose, success criteria, brand personality, anti-references, accessibility.
- `DESIGN.md`: visual direction, color, typography, layout, component rules, motion, anti-patterns.
- `slides.md`: primary deck flow, frontmatter, visible copy, notes, and simple one-off markup.
- `pages/*.md`: secondary decks or focused talks with their own frontmatter and imports.
- `components/*.vue`: reusable or complex visual units.
- `styles/index.css`: import hub plus small cross-cutting rules.
- `styles/tokens.css`: reusable design variables.
- `styles/base.css`: global baseline for Slidev pages.
- `styles/utilities.css`: generic helpers that are not domain-specific.
- `styles/<chapter>.css`: topic-specific classes used by Markdown.
- `pages/styles/*.css`: secondary deck styles kept out of the primary deck's global CSS.

## Component Patterns

Use props for content that changes across slides:

- `title`, `section`, `index`, `variant`, `items`, `stages`, `metrics`.

Use slots when the caller needs rich text or a custom title. Keep component internals responsible for geometry and stable visual rhythm.

Avoid components that only wrap one `div` for styling. Prefer a CSS class until repetition or layout complexity appears.

For animated or stateful components:

- Read `vue-dynamic-visuals.md` before creating or substantially revising the visual.
- Render a complete static frame before `onMounted`; the deck must make sense in print/export mode.
- Clamp or normalize computed indexes before reading arrays.
- Provide deterministic fallbacks for active item, color, and style variables.
- Cancel timers and animation frames in `onBeforeUnmount`.
- Do not depend on animation progress for layout size; set stable dimensions first.

## CSS Patterns

Prefer:

- Token variables over repeated raw color values.
- Semantic color variables and class names when a hue represents a concept across slides.
- Chapter variables for section color shifts.
- `box-sizing: border-box` for complex component roots and descendants.
- Explicit dimensions, `minmax(0, 1fr)`, and `aspect-ratio` for diagrams.
- Scoped styles for component internals.

Avoid:

- One giant global CSS file.
- Many nearly identical classes whose names differ only by topic.
- CSS selectors that depend on incidental generated Slidev DOM.
- Styling generated output in `dist/`.

## Verification Commands

Use the package manager already present in the repo. Common examples:

```bash
pnpm run build
pnpm exec slidev build pages/<secondary-deck>.md --out /tmp/<deck-name>
node .agents/skills/wonderful-slide/scripts/export-check.mjs . --range 1,3
node .agents/skills/wonderful-slide/scripts/style-line-report.mjs .
node .agents/skills/wonderful-slide/scripts/class-usage-scan.mjs .
node .agents/skills/wonderful-slide/scripts/language-check.mjs .
```

If the skill was copied elsewhere, adjust the script path to the copied skill location.

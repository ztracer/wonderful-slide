# @traz1r/wonderful-slide

[![npm version](https://badge.fury.io/js/%40traz1r%2Fwonderful-slide.svg)](https://www.npmjs.com/package/@traz1r/wonderful-slide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI Native Slidev deck workflow for technical presentations. Includes from-zero deck creation, research-backed narrative shaping, slide drafting, visual quality review, and build verification tools.

## Features

- **AI-Native Workflow**: Comprehensive workflow for creating, redesigning, polishing, and verifying Slidev decks
- **Quality Gates**: Multiple validation tools for language, CSS usage, research integrity, and artifact quality
- **Visual System Support**: Componentized diagrams, Vue dynamic/interactive visuals, and split CSS ownership
- **Build Verification**: Export checking, error scanning, and presentation-size inspection

## Quick Start

### For Claude Code Users (Recommended)

Install the skill for Claude Code:

```bash
npm install -D @traz1r/wonderful-slide
npx wonderful-slide
```

Restart Claude Code, then you can use the skill:

> "Create a technical presentation about [topic] using wonderful-slide"

### For Tool Users

Install as a dev dependency:

```bash
npm install -D @traz1r/wonderful-slide
```

Then run quality checks using `npx`:

```bash
npx wfslide-language <deck-root>
npx wfslide-style <deck-root>
npx wfslide-class <deck-root>
```

Or if you want to run with `--fail-on-unused` options, use the full command:

```bash
node node_modules/@traz1r/wonderful-slide/scripts/class-usage-scan.mjs <deck-root> --fail-on-unused
```

## CLI Tools

This package includes several CLI tools for Slidev deck quality checks:

### Language Check

Scan for defensive phrasing, abrupt method transitions, and dense technical copy:

```bash
npx wfslide-language <deck-root> [--range <pages>] [--fail-on-findings]
```

### Style Line Report

Report global CSS and Vue scoped-style line counts:

```bash
npx wfslide-style <deck-root>
```

### Class Usage Scan

Report CSS classes defined in CSS/Vue styles that are not referenced:

```bash
npx wfslide-class <deck-root> [--fail-on-unused]
```

### Research Audit

Verify that `index.md` exists with proper sections:

```bash
npx wfslide-research <deck-root>
```

### Artifact Scan

Report prompt artifacts and planning language in visible content:

```bash
npx wfslide-artifact <deck-root> [--fail-on-findings]
```

### Export Check

Export slides to PNG and check for errors:

```bash
npx wfslide-export <deck-root> --range <pages> [--output <dir>] [--expect <n>]
```

## Usage with Claude Code

This package is designed as a [Claude Code](https://claude.ai/code) skill. To use it:

1. Install and run the installer:

```bash
npm install -D @traz1r/wonderful-slide
npx wonderful-slide
```

2. Restart Claude Code

3. The skill will be available for use in Claude Code sessions

## Workflow Overview

1. **Intake And Branch**: Classify the request (from-zero deck, existing-deck rewrite, narrow edit, audit/verification)
2. **Source/Facts Gate**: Verify technical claims with primary sources
3. **Context Notes**: Create or refresh constraints in `PRODUCT.md` and `DESIGN.md`
4. **Research Dossier**: Bind core claims to sources in `index.md`
5. **Narrative Map**: Shape talk as a sequence of audience questions
6. **Two-Slide Showcase**: Draft cover and key mechanism slides first
7. **Slide Draft**: Write Markdown for sequence, titles, and notes
8. **Language Pass**: Check for natural flow and technical-talk quality
9. **Visual System**: Map concepts to named tokens consistently
10. **Componentize**: Move repeated visuals into Vue components
11. **Style Ownership**: Organize CSS with proper scoping
12. **Verify By Scope**: Build and export with comprehensive checks

## Requirements

- Node.js >= 18.0.0
- Slidev (for deck creation/editing)

## License

MIT © traz1r

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/ztracer/wonderful-slide

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.
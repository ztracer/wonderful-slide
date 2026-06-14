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
npm run install-skill
```

Restart Claude Code, then you can use the skill:

> "Create a technical presentation about [topic] using wonderful-slide"

### For Tool Users

Install as a dev dependency:

```bash
npm install -D @traz1r/wonderful-slide
```

Then run quality checks:

```bash
npm run language-check <deck-root>
npm run style-report <deck-root>
npm run class-scan <deck-root> --fail-on-unused
```

## CLI Tools

This package includes several CLI tools for Slidev deck quality checks:

### Language Check

Scan for defensive phrasing, abrupt method transitions, and dense technical copy:

```bash
npm run language-check <deck-root> [--range <pages>] [--fail-on-findings]
```

### Style Line Report

Report global CSS and Vue scoped-style line counts:

```bash
npm run style-report <deck-root>
```

### Class Usage Scan

Report CSS classes defined in CSS/Vue styles that are not referenced:

```bash
npm run class-scan <deck-root> [--fail-on-unused]
```

### Research Audit

Verify that `index.md` exists with proper sections:

```bash
npm run research-audit <deck-root>
```

### Artifact Scan

Report prompt artifacts and planning language in visible content:

```bash
npm run artifact-scan <deck-root> [--fail-on-findings]
```

### Export Check

Export slides to PNG and check for errors:

```bash
npm run export-check <deck-root> --range <pages> [--output <dir>] [--expect <n>]
```

## Usage with Claude Code

This package is designed as a [Claude Code](https://claude.ai/code) skill. To use it:

1. Copy the skill directory structure:
```bash
cp -r node_modules/@traz1r/wonderful-slide ~/.claude/skills/wonderful-slide
```

2. The skill will be available for use in Claude Code sessions

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
# @ztracer/wonderful-slide

[![npm version](https://badge.fury.io/js/%40ztracer%2Fwonderful-slide.svg)](https://www.npmjs.com/package/@ztracer/wonderful-slide)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI Native Slidev deck workflow for technical presentations. Includes from-zero deck creation, research-backed narrative shaping, slide drafting, visual quality review, and build verification tools.

## Features

- **AI-Native Workflow**: Comprehensive workflow for creating, redesigning, polishing, and verifying Slidev decks
- **Quality Gates**: Multiple validation tools for language, CSS usage, research integrity, and artifact quality
- **Visual System Support**: Componentized diagrams, Vue dynamic/interactive visuals, and split CSS ownership
- **Build Verification**: Export checking, error scanning, and presentation-size inspection

## Installation

```bash
npm install @ztracer/wonderful-slide --save-dev
```

Or globally for CLI access:

```bash
npm install -g @ztracer/wonderful-slide
```

## CLI Tools

This package includes several CLI tools for Slidev deck quality checks:

### Language Check

Scan for defensive phrasing, abrupt method transitions, and dense technical copy:

```bash
# npm script
npm run language-check <deck-root> [--range <pages>] [--fail-on-findings]

# global CLI
wonderful-slide-language-check <deck-root> [--range <pages>] [--fail-on-findings]
```

### Style Line Report

Report global CSS and Vue scoped-style line counts:

```bash
npm run style-report <deck-root>
wonderful-slide-style-report <deck-root>
```

### Class Usage Scan

Report CSS classes defined in CSS/Vue styles that are not referenced:

```bash
npm run class-scan <deck-root> [--fail-on-unused]
wonderful-slide-class-scan <deck-root> [--fail-on-unused]
```

### Research Audit

Verify that `index.md` exists with proper sections:

```bash
npm run research-audit <deck-root>
wonderful-slide-research-audit <deck-root>
```

### Artifact Scan

Report prompt artifacts and planning language in visible content:

```bash
npm run artifact-scan <deck-root> [--fail-on-findings]
wonderful-slide-artifact-scan <deck-root> [--fail-on-findings]
```

### Export Check

Export slides to PNG and check for errors:

```bash
npm run export-check <deck-root> --range <pages> [--output <dir>] [--expect <n>]
wonderful-slide-export-check <deck-root> --range <pages> [--output <dir>] [--expect <n>]
```

## Usage with Claude Code

This package is designed as a [Claude Code](https://claude.ai/code) skill. To use it:

1. Copy the skill directory structure:
```bash
cp -r node_modules/@ztracer/wonderful-slide ~/.claude/skills/wonderful-slide
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

MIT © ztracer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/ztracer/wonderful-slide
---
name: wonderful-slide
description: AI Native Slidev deck workflow for technical presentations, including from-zero deck creation, branched intake, research-backed narrative shaping, slide drafting, two-slide showcases, componentized diagrams, Vue dynamic/interactive visuals, split CSS ownership, visual quality review, and build verification. Use when Codex needs to create, redesign, polish, audit, or verify a Slidev deck or technical talk that should feel like a designed presentation rather than a README rendered as slides, especially when technical accuracy, sourced claims, Chinese presentation quality, or animated mechanism visuals matter.
---

# Wonderful Slide

Turn technical material into a polished Slidev deck: clear story, readable projected slides, componentized visuals, verifiable build output.

## When to Use

- Creating a new technical talk or Slidev deck from scratch
- Rewriting or deepening an existing deck that feels like a README broken into pages
- Auditing a deck for projection readiness, research quality, or visual consistency
- Adding animated diagrams, state machines, or interactive Vue visuals to slides
- Porting a talk between languages (especially CN↔EN) with quality gates

Do not use for: simple Markdown-to-slide conversion without design needs, one-off copy-only slide fixes, or non-Slidev presentation tools.

## Quick Route

| You want to | Start here |
|---|---|
| Create a new deck from scratch | `references/structured-intake.md` → then Branch A below |
| Rewrite/redesign existing deck | `references/structured-intake.md` → then Branch B below |
| Fix a specific slide or style bug | Branch C — read only the relevant files |
| Audit/review a deck | Branch D — inspect, don't edit unless asked |
| No visual direction given | Branch E — produce 3 visual briefs first |
| Understand the full methodology | `references/ai-native-slidev-workflow.md` |
| Write/revise copy or speaker notes | `references/language-quality-gates.md` |
| Build animated Vue diagrams | `references/vue-dynamic-visuals.md` |
| Set up file structure and CSS | `references/architecture-patterns.md` |
| See concrete patterns from a real deck | `references/current-deck-case-study.md` |

## Branch & Tier Selection

Choose the smallest branch that satisfies the request. Upgrade only when a defect can't be fixed locally.

| Branch | Trigger | First action |
|---|---|---|
| A. From-zero deck | New talk, no usable slides.md | Structured intake → confirm → scaffold PRODUCT.md / DESIGN.md / index.md |
| B. Existing-deck rewrite | Redesign, restructure, deepen | Structured intake (focus: what's wrong) → inventory → diagnose root problem |
| C. Narrow edit | Named slide range, copy fix, style bug | Read only the relevant Markdown, component, style |
| D. Audit/verification | Review, readiness, build check | Inspect, do not edit unless asked |
| E. Unclear visual direction | No style reference or visual constraints | Produce 3 concise visual/narrative briefs, user chooses |

**Tiers** — not every deck needs the full 12-step workflow:

| Tier | When | Mandatory |
|---|---|---|
| **Light** | Internal 5–10 slide share, team update | Intake summary (oral), outline as questions, slide draft, build check |
| **Standard** | 15–25 slide talk, conference submission | Full intake, index.md, question sequence + types, two-slide showcase, language pass, visual system, verify |
| **Conference** | 30+ slide keynote, invited/recorded talk | Everything: full workflow + CSS ownership audit + PNG export + live check |

When in doubt, start Light and upgrade when the deck deserves it.

## Core Workflow (summary)

The full methodology is in `references/ai-native-slidev-workflow.md`. Key principles:

**Phase A — Setup**: Structured intake → choose branch & tier → scaffold PRODUCT.md / DESIGN.md → create research dossier (`index.md`, see `references/research-first.md`). For each core concept, verify four layers: intuition → formal shape → tool consequence → example anchor.

**Phase B — Build**: Map audience questions (Foundational / Mechanism / Evidence / Contrast / Takeaway) → check narrative tension between adjacent slides → two-slide showcase (cover + hardest mechanism slide) → draft slides → language pass → visual system with named tokens → componentize repeated visuals → split CSS by ownership.

**Phase C — Verify**: Build the deck → run relevant scripts (see below) → export touched slides to PNG → scan export logs for Vue/runtime errors.

## Orchestrator Integration

| Task | Agent | When |
|---|---|---|
| Verify tool versions, API claims, paper details | @librarian | Source/facts gate |
| Find existing deck files, search codebase for examples | @explorer | Context notes, existing deck inventory |
| Visual system design, component styling, layout polish | @designer | Visual system, componentize |
| Bounded mechanical edits (CSS renames, bulk copy fixes) | @fixer | Narrow edits that don't change design intent |
| Architecture review, narrative review, quality gate review | @oracle | After narrative map, before claiming completion |

Do not delegate narrative shaping or intake to specialists — the orchestrator owns the story and user relationship.

## Key Anti-Patterns

- **README-as-slides**: bullet lists enlarged, paper outlines without audience stakes, dashboards of equal cards
- **Gray card hell**: same-size pale rounded rectangles on every slide, decorative shadows, low-contrast text
- **Color drift**: one slide's "Intent blue" ≠ another slide's — fix with named tokens
- **Silent assumptions**: building 20 slides on guessed audience/duration the user could have corrected in intake
- **One giant CSS file**: every AI edit appends to `styles/index.css` — split by chapter from the start
- **Export blindness**: checking the live deck but not the exported PNGs — Vue errors in print mode are real defects
- **Prompt artifacts in speaker notes**: "这套 slides 的目标是..." belongs in planning, not the presenter view

## Reference Index

| Reference | Read when |
|---|---|
| `references/structured-intake.md` | Any from-zero deck or major rewrite — question templates, confirmation gate |
| `references/intake-and-branching.md` | Choosing branch, tier, or running visual direction consultant mode |
| `references/research-first.md` | Creating index.md, building question taxonomy, checking narrative tension |
| `references/ai-native-slidev-workflow.md` | Understanding the full methodology, Markdown/Vue/CSS decision table |
| `references/language-quality-gates.md` | Writing/revising copy, speaker notes, Chinese technical-talk checks |
| `references/vue-dynamic-visuals.md` | Building animated diagrams, interactive demos, stateful visuals |
| `references/deck-quality-gates.md` | Polishing or claiming completion — projection, anti-README, color, export gates |
| `references/architecture-patterns.md` | Creating or reorganizing files, component/CSS patterns |
| `references/current-deck-case-study.md` | Example patterns from a real deck — use as illustration, not as rule |

## Scripts

All use only Node standard library. Run from the deck root.

| Script | Purpose |
|---|---|
| `node scripts/init-research.mjs <deck-root> [--force]` | Generate index.md skeleton |
| `node scripts/env-check.mjs <deck-root> [--fail-on-warnings]` | Verify slidev, theme, playwright setup |
| `node scripts/research-audit.mjs <deck-root> [--strict]` | Check index.md exists with required sections; `--strict` validates claim-source mapping, question types, examples |
| `node scripts/artifact-scan.mjs <deck-root> [--range <pages>] [--fail-on-findings]` | Detect prompt artifacts and planning language |
| `node scripts/language-check.mjs <deck-root> [--range <pages>] [--fail-on-findings]` | Defensive phrasing, abrupt transitions, dense copy |
| `node scripts/notes-check.mjs <deck-root> [--max-lines <n>] [--range <pages>] [--fail-on-findings]` | Report overly long or empty speaker notes |
| `node scripts/style-line-report.mjs <deck-root> [--limit=<n>] [--warn=<n>]` | CSS and Vue scoped-style line counts |
| `node scripts/class-usage-scan.mjs <deck-root> [--fail-on-unused]` | CSS classes defined but not referenced |
| `node scripts/export-check.mjs <deck-root> --range <pages> [--output <dir>] [--expect <n>]` | Export slides to PNG, scan logs for Vue/runtime errors |

If the skill was copied to a non-standard location, adjust script paths accordingly.

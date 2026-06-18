# Intake And Branching

Use this guide before creating, rewriting, polishing, or auditing a Slidev technical deck when the scope is not already narrow and obvious. The goal is to choose the right path before reading too much or editing too much.

## Pre-Step: Structured Intake

For new decks (Branch A) and major rewrites (Branch B), run `references/structured-intake.md` **before** choosing a branch. The intake collects user material, audience parameters, visual preferences, and produces a confirmed intake summary. This prevents building on silent assumptions.

Skip the structured intake for narrow edits (Branch C), audits (Branch D), or when the user has already provided a detailed brief that answers the intake questions.

## Tier Selection

Not every deck needs the full workflow. Choose a tier based on stakes, audience, and format. The tier determines which steps are mandatory vs optional.

| Tier | When | Mandatory | Optional |
|------|------|-----------|----------|
| **Light** | Internal 5-10 slide quick share, team update, informal walkthrough | Intake summary (oral, not written), outline as questions, slide draft, build check | index.md, two-slide showcase, full language pass, CSS ownership audit, PNG export |
| **Standard** | 15-25 slide technical talk, conference submission, public sharing | Full intake, index.md, question sequence with types, two-slide showcase, language pass, visual system, verify by scope | Vue components (only if diagrams need them), export check (recommended) |
| **Conference** | 30+ slide keynote, invited talk, recorded/archived talk, multi-speaker deck | Everything: full intake, index.md, question taxonomy + tension check, two-slide showcase, language + artifact scan, visual system + componentize, CSS ownership audit, PNG export + live check | — |

When in doubt, start at Light and upgrade when the deck deserves it. A Light deck that turns into a conference talk should re-run intake and index.md before expanding.

## Branch Table

| Branch | Trigger | Tier | First action | Skip |
| --- | --- | --- | --- | --- |
| A. From-zero deck | User asks to create a new talk/deck, no usable `slides.md` exists, or the repo has no deck structure | Any | Run structured intake → confirm → scaffold PRODUCT.md, DESIGN.md, index.md → outline + two-slide showcase | Broad inventory of nonexistent files |
| B. Existing-deck major rewrite | User asks to redesign, restructure, deepen, polish, or rewrite an existing deck | Standard+ | Run structured intake (focus on what's wrong with current deck) → inventory existing files → diagnose root problem | From-zero scaffold |
| C. Narrow edit | User names a slide range, component, copy issue, style bug, or small fix | Any | Read only the relevant Markdown, component, style, and nearby context | Full intake, index.md rebuild, broad visual exploration |
| D. Audit/verification | User asks for review, audit, readiness, build/export check, or issue list | Any | Do not edit by default; inspect and report findings by category | Drafting new slides unless explicitly asked |
| E. Unclear visual direction | User wants a deck but gives no style, audience energy, reference, or visual constraints | Standard+ | Produce three concise visual/narrative direction briefs, then let the chosen or mixed direction feed the two-slide showcase | Blindly choosing one generic style |

If several branches apply, choose the smallest branch that can satisfy the user. Upgrade scope only when a defect cannot be fixed locally.

## From-Zero Sequence

For Branch A, `references/structured-intake.md` handles the full intake flow (batch questions with options → materials upload → confirmation gate). After confirmation:

1. Write `PRODUCT.md` (audience, purpose, success criteria, constraints, accessibility).
2. Write `DESIGN.md` (tone, typography, color, layout, motion, anti-patterns).
3. Create `index.md` using `references/research-first.md` (sources, glossary, claim map, examples, tool notes, typed question sequence).
4. Draft the outline as typed audience questions with tension check.
5. Build a two-slide showcase (cover + hardest mechanism/claim slide).
6. Verify the showcase visually before expanding to the full deck.

The two-slide showcase is mandatory for from-zero decks and major decks with 5+ planned slides. It prevents a full-deck rewrite.

## Existing Deck Inventory

Only inventory existing deck files when Branch B, C, or D applies, or when the repo actually contains deck files.

Read the smallest useful set:

- `slides.md` and `pages/*.md` for flow, copy, notes, and frontmatter.
- `PRODUCT.md`, `DESIGN.md`, and `index.md` for existing constraints and research state.
- `components/*.vue` for repeated visuals, stateful diagrams, and layout contracts.
- `styles/*.css` and `pages/styles/*.css` for token ownership, global debt, and chapter styling.
- Package scripts and config only when build, export, or Slidev behavior matters.

For major rewrites, run the structured intake first (focusing on what the user wants to change), then refresh `index.md` and the slide-question sequence before changing many slides. For narrow edits, keep inventory local to the touched range.

## Visual Direction Consultant Mode

Use Branch E when the user asks for a new deck or large redesign but does not provide style references, design context, or a clear visual attitude.

Do not ask the user to choose from abstract style labels alone. Produce three short direction briefs first:

- Direction name and thesis.
- Cover style: typography, composition, image/diagram role, and first impression.
- Chapter rhythm: how section openers, overview maps, and content slides differ.
- Core visual grammar: route maps, mechanism diagrams, evidence cards, code traces, timelines, or state machines.
- Why this direction fits the audience and talk goal.
- One risk or tradeoff.

After the user chooses or mixes directions, apply it to the two-slide showcase. Do not create three complete Slidev decks unless the user explicitly asks for full alternatives.

## Audit Categories

For Branch D, report findings before summaries:

- Research: unsupported claims, stale sources, missing caveats, weak examples.
- Narrative: missing audience questions, weak tension between slides (same-type adjacency), repeated slide jobs.
- Language: defensive phrasing, abrupt method choices, dense visible copy, prompt artifacts.
- Visual system: inconsistent semantic colors, repeated gray cards, weak hierarchy.
- Vue/components: brittle props, blank export frames, unsafe indexes, timer cleanup.
- CSS ownership: catch-all global files, unused classes, token drift.
- Export/build: Slidev errors, print-mode warnings, glyph problems, PNG/PDF failures.

Recommend edits only after the issue list is clear.

# Intake And Branching

Use this guide before creating, rewriting, polishing, or auditing a Slidev technical deck when the scope is not already narrow and obvious. The goal is to choose the right path before reading too much or editing too much.

## Branch Table

| Branch | Trigger | First action | Skip |
| --- | --- | --- | --- |
| A. From-zero deck | User asks to create a new talk/deck, no usable `slides.md` exists, or the repo has no deck structure | Clarify intent, write short assumptions, create lightweight `PRODUCT.md`, `DESIGN.md`, and `index.md`, then outline and make a two-slide showcase | Broad inventory of nonexistent `slides.md`, `pages/`, `components/`, `styles/` |
| B. Existing-deck major rewrite | User asks to redesign, restructure, deepen, polish, or rewrite an existing deck | Inventory existing deck files and diagnose whether the main problem is narrative, research, language, visual system, Vue, CSS, or export | From-zero scaffold |
| C. Narrow edit | User names a slide range, component, copy issue, style bug, or small fix | Read only the relevant Markdown, component, style, and nearby context | Long intake, full `index.md` rebuild, broad visual exploration |
| D. Audit/verification | User asks for review, audit, readiness, build/export check, or issue list | Do not edit by default; inspect and report findings by category | Drafting new slides unless explicitly asked |
| E. Unclear visual direction | User wants a deck but gives no style, audience energy, reference, or visual constraints | Produce three concise visual/narrative direction briefs, then let the chosen or mixed direction feed the two-slide showcase | Blindly choosing one generic style |

If several branches apply, choose the smallest branch that can satisfy the user. Upgrade scope only when a defect cannot be fixed locally.

## From-Zero Deck Intake

For a new deck, learn or infer these before drafting many slides:

- Topic and exact title if known.
- Audience, prior knowledge, and setting.
- Talk duration and expected slide count.
- Language for visible copy and speaker notes.
- Source material: papers, docs, code, experiment logs, notes, links, or user-provided outline.
- Required points, taboo points, and expected takeaway.
- Final delivery expectation: local Slidev deck, exportable PNG/PDF, live talk rehearsal, or editable source for later work.

Ask a concise batch of questions when these are missing and the user is available. If the user says to proceed or does not answer, continue with explicit assumptions in `PRODUCT.md`, `DESIGN.md`, and `index.md`; do not keep asking instead of producing a visible path.

## From-Zero Sequence

Use this order for Branch A:

1. Write short assumptions in `PRODUCT.md`: audience, purpose, success criteria, constraints, and accessibility baseline.
2. Write short design intent in `DESIGN.md`: tone, typography direction, color semantics, layout rhythm, motion expectations, and anti-patterns.
3. Create `index.md` using `research-first.md`: sources, glossary, claim map, example inventory, tool notes, and slide-question sequence.
4. Draft an outline as audience questions before slide copy.
5. Build a two-slide showcase: cover plus the slide that carries the hardest mechanism, example, or core claim.
6. Verify the showcase visually before expanding to the full deck.

The two-slide showcase is mandatory for from-zero decks and for any major deck expected to have 5 or more slides. It prevents a full-deck rewrite when the narrative or visual grammar is wrong.

## Existing Deck Inventory

Only inventory existing deck files when Branch B, C, or D applies, or when the repo actually contains deck files.

Read the smallest useful set:

- `slides.md` and `pages/*.md` for flow, copy, notes, and frontmatter.
- `PRODUCT.md`, `DESIGN.md`, and `index.md` for existing constraints and research state.
- `components/*.vue` for repeated visuals, stateful diagrams, and layout contracts.
- `styles/*.css` and `pages/styles/*.css` for token ownership, global debt, and chapter styling.
- Package scripts and config only when build, export, or Slidev behavior matters.

For major rewrites, refresh `index.md` and the slide-question sequence before changing many slides. For narrow edits, keep inventory local to the touched range.

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
- Narrative: missing audience questions, weak transitions, repeated slide jobs.
- Language: defensive phrasing, abrupt method choices, dense visible copy, prompt artifacts.
- Visual system: inconsistent semantic colors, repeated gray cards, weak hierarchy.
- Vue/components: brittle props, blank export frames, unsafe indexes, timer cleanup.
- CSS ownership: catch-all global files, unused classes, token drift.
- Export/build: Slidev errors, print-mode warnings, glyph problems, PNG/PDF failures.

Recommend edits only after the issue list is clear.

---
name: wonderful-slide
description: AI Native Slidev deck workflow for technical presentations, including from-zero deck creation, branched intake, research-backed narrative shaping, slide drafting, two-slide showcases, componentized diagrams, Vue dynamic/interactive visuals, split CSS ownership, visual quality review, and build verification. Use when Codex needs to create, redesign, polish, audit, or verify a Slidev deck or technical talk that should feel like a designed presentation rather than a README rendered as slides, especially when technical accuracy, sourced claims, Chinese presentation quality, or animated mechanism visuals matter.
---

# Wonderful Slide

Use this skill to turn technical material into a polished Slidev deck with a clear story, readable projected slides, componentized visuals, and verifiable build output.

## Workflow

1. **Intake And Branch**: Classify the request before reading or editing broadly: from-zero deck, existing-deck rewrite, narrow edit, audit/verification, or unclear visual direction. Use `references/intake-and-branching.md`.
2. **Source/Facts Gate**: For current tools, versions, papers, product claims, schedules, or release-sensitive facts, verify with primary sources or local executable evidence before drafting claims.
3. **Context Notes**: For new or major work, create or refresh short `PRODUCT.md` and `DESIGN.md` constraints. For existing decks, inventory `slides.md`, `pages/`, `components/`, `styles/`, and existing notes only after the branch says a deck already exists.
4. **Research Dossier**: Before major drafting or rewrites, create or refresh root `index.md` using `references/research-first.md`. Bind core claims, glossary terms, source notes, examples, and the slide-question sequence to sources.
5. **Narrative Map**: Shape the talk as a sequence of audience questions. Each slide should answer one question or move one transition, and the question sequence must be present in `index.md`.
6. **Two-Slide Showcase**: For from-zero decks and major decks with 5 or more planned slides, draft the outline plus two representative slides first: the cover and the most important mechanism/content slide. Use them to lock narrative and visual grammar before expanding the full deck.
7. **Slide Draft**: Write Markdown for sequence, titles, speaker notes, and small visible copy. Avoid dense README-like summaries and do not expose agent prompts, production notes, or planning language to the audience.
8. **Language Pass**: Before visual polish, check visible copy and speaker notes for direct argument flow, natural method-selection transitions, needless defensive phrasing, Chinese technical-talk quality, and prompt-artifact wording.
9. **Visual System**: When colors, stages, legends, chips, or route diagrams change, map concepts to named tokens and keep that mapping consistent across the cover, overview, chapter slides, and Vue components.
10. **Componentize**: Move repeated diagrams, stateful visuals, simulations, and complex layout into Vue components. For animated or interactive visuals, design the static frame, state model, and export safety before styling motion.
11. **Style Ownership**: Put reusable tokens/base/utilities in shared CSS, chapter/page-specific styles in narrow files, and component-only styles in scoped Vue blocks. For Chinese decks, explicitly set a Simplified Chinese font stack and verify export glyphs.
12. **Verify By Scope**: Build the deck, run research/artifact/language/CSS usage/line reports when relevant, export PNGs for touched slides, scan export logs for Vue/runtime errors, and inspect representative images at presentation size.

## References

- Read `references/ai-native-slidev-workflow.md` when planning or making a deck-level change.
- Read `references/intake-and-branching.md` before from-zero deck creation, major rewrites, vague requests, unclear visual direction, audits, or any task where the correct branch is not obvious.
- Read `references/research-first.md` before creating or substantially rewriting a technical deck, and whenever the user says the deck is vague, shallow, unsupported, or missing first principles.
- Read `references/language-quality-gates.md` when writing or revising visible copy, speaker notes, Chinese technical-talk prose, method-choice slides, Survey/Related Work slides, or contribution slides.
- Read `references/vue-dynamic-visuals.md` when creating or revising animated diagrams, interactive demos, stateful visuals, simulations, or generated visual systems in Vue.
- Read `references/deck-quality-gates.md` before claiming a deck is polished or presentation-ready.
- Read `references/architecture-patterns.md` when creating or reorganizing files.
- Read `references/current-deck-case-study.md` only as an example of the workflow applied to one Android fuzzing deck; do not treat its domain content as a default rule.

## Scripts

- `node scripts/style-line-report.mjs <deck-root>` reports global CSS and Vue scoped-style line counts, highlighting files likely to become style catch-alls.
- `node scripts/class-usage-scan.mjs <deck-root>` reports CSS classes defined in CSS/Vue styles that are not referenced in Markdown/Vue content. Add `--fail-on-unused` when using it in CI.
- `node scripts/language-check.mjs <deck-root> [--range <pages>] [--fail-on-findings]` reports defensive phrasing, abrupt method transitions, and dense technical-copy candidates for human review.
- `node scripts/research-audit.mjs <deck-root>` verifies that `index.md` exists and that the deck has source, glossary, claim, example, and slide-question sections.
- `node scripts/artifact-scan.mjs <deck-root> [--fail-on-findings]` reports prompt artifacts, planning language, and agent-facing wording in visible copy and speaker notes.
- `node scripts/export-check.mjs <deck-root> --range <pages> [--output <dir>] [--expect <n>]` exports touched slides to PNG, saves an export log, and fails on common Slidev/Vue print-mode errors.

These scripts are self-contained and use only Node standard library APIs.

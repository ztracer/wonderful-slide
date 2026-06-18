# AI Native Slidev Workflow

Use this guide when a Slidev deck needs more than small copy edits. The goal is a technical presentation that is shaped for a live audience, not a document broken into pages.

## 1. Intake Before Branch

Before reading or editing broadly, collect what the user wants and has. Use `references/structured-intake.md` for new decks and major rewrites: a batch of structured questions with pre-written options, a materials upload invitation, and a confirmation gate.

Then choose the work branch using `references/intake-and-branching.md`: from-zero deck, existing-deck rewrite, narrow edit, audit, or unclear visual direction. Pick the smallest branch that satisfies the request.

Also choose a tier (Light / Standard / Conference) based on stakes, audience, and format. This determines which workflow steps are mandatory.

Do not begin a from-zero deck by trying to read nonexistent `slides.md`, `pages/`, `components/`, or `styles/`. Create the minimum working context first, then expand.

## 2. Context Before Slides

For from-zero decks, scaffold lightweight working notes before writing many slides:

- `PRODUCT.md`: audience, purpose, success criteria, anti-references, accessibility baseline.
- `DESIGN.md`: visual direction, color, typography, layout rules, component expectations, anti-patterns.
- `index.md`: sources, glossary, claim map, example inventory, tool notes, and the typed slide-question sequence.

For existing decks, inventory only after the branch says a deck exists:

- Existing `slides.md` and `pages/*.md`.
- Existing `PRODUCT.md`, `DESIGN.md`, and `index.md`.
- Existing `components/`, `styles/`, and `pages/styles/`.

Write or revise these notes before large slide edits when the audience, tone, or visual direction is unclear. Keep them short. They are working constraints for the deck, not a strategy memo.

## 3. Research Before Narrative

For new decks, major rewrites, and any deck criticized as vague or shallow, create or refresh `index.md` before writing slides. Use `references/research-first.md`.

`index.md` must capture sources, glossary, claim map, example inventory, tool notes, and the slide-question sequence with question types. It is the place for exact links, caveats, source-to-claim mapping, and local verification output. The slide deck should read like a talk; `index.md` should preserve the evidence behind it.

Do not draft a language/tool deck from memory when primary sources or local executable examples are available.

## 4. Narrative Before Layout

Turn source material into a question sequence using the question taxonomy from `references/research-first.md`:

| Type | Job | Example |
|------|-----|---------|
| Foundational | Define an object or boundary | "What is Binder?" |
| Mechanism | Explain how something works | "How does a Binder transaction cross processes?" |
| Evidence | Show what was found | "What crash patterns did NASS uncover?" |
| Contrast | Compare two approaches | "Atlas vs POIROT: what changed?" |
| Takeaway | State conclusion or open problem | "What does our work add?" |

Prefer a route like `Foundational → Mechanism → Evidence → Contrast → Takeaway`. Adjust to the talk, but keep cause and transition explicit. Check that adjacent slides create narrative tension: if slide N+1 doesn't depend on slide N, the tension is weak.

For first-principles technical talks, require the route `intuition → formal object → tool behavior → example → limitation → practice`.

The question sequence should contain more Mechanism and Evidence questions than Foundational ones. A deck that only defines terms is a glossary, not a talk.

## 5. Two-Slide Showcase Before Full Expansion

For from-zero decks and major decks with 5 or more planned slides, build an outline plus two representative slides before producing the full deck:

- Cover slide: locks title promise, tone, typography, and first visual impression.
- Core slide: locks the hardest mechanism, example, result, or argument pattern.

Use the showcase to test both narrative grammar and visual grammar. If it fails, revise two slides and the outline, not a full deck.

When visual direction is unclear, produce three concise visual/narrative direction briefs first using `references/intake-and-branching.md`, then apply the selected or mixed direction to the showcase.

## 6. Markdown Owns Flow

Use Markdown for:

- Slide ordering and section breaks.
- Titles and short visible copy.
- Speaker notes.
- Small HTML structures that are unique to one slide and easy to scan.

Keep Markdown readable enough that another agent can understand the talk without opening every CSS file. If a slide requires deeply nested layout or repeated visual grammar, extract it.

Remove prompt artifacts before verification. Presenter notes should sound like what the speaker can say, not instructions to the deck author.

## 7. Vue Owns Complex Visuals

Create Vue components for:

- Repeated section/chapter slides.
- Diagrams with many nodes, arrows, lanes, or state transitions.
- Animated or interactive explanations.
- Visuals whose layout should be stable across copy changes.
- Reusable cards, metrics, flow nodes, timelines, maps, or demos.

Do not componentize every small text block. A component should reduce real complexity, protect layout, or express a repeated pattern.

For animated or interactive visuals, read `vue-dynamic-visuals.md` before implementation. Decide the static export frame first, then model state, then add motion. The slide must still communicate if timers never run.

If the talk explains a mechanism such as a protocol, scheduler, parser, runtime, or IPC path, include at least one stateful Vue visual that animates the mechanism. Static cards are insufficient for mechanism-first teaching.

## 8. CSS Owns Presentation Boundaries

Split styles by ownership:

- `styles/tokens.css`: color ramps, semantic concept colors, spacing, shadow, radius, and shared visual tokens.
- `styles/base.css`: Slidev layout defaults, body, typography baseline, projection-safe defaults.
- `styles/utilities.css`: small generic helpers used across chapters.
- `styles/<chapter>.css`: chapter or topic-specific global classes used by Markdown.
- `pages/styles/<page>.css`: CSS for a secondary deck or imported page.
- Vue `<style scoped>`: component-only geometry, animation, and visual internals.

Keep `styles/index.css` as imports plus small shared rules. When it grows into a catch-all, split it.

For semantic color changes, write down the mapping in code through token names and class names. A stage color used in a cover diagram should match the same stage in overview maps, chapter slides, repeated chips, and component states.

For Chinese decks, set an explicit Simplified Chinese font stack in base CSS and inspect exported glyphs. Do not rely on browser default CJK fallback.

## 9. Iterate With Evidence

For visual work, verify with the actual deck:

- Build with the project's package manager.
- Run `research-audit.mjs` when `index.md` is part of the workflow.
- Run `artifact-scan.mjs` after rewriting visible copy or speaker notes.
- Run CSS class and style line reports after major style edits.
- Export touched slides to PNG when layout, typography, color, responsive behavior, or animation changed.
- Scan export logs for Vue warnings, unhandled rejections, undefined property reads, and failed component resolution.
- Use browser screenshots and, when possible, short live checks for animated or interactive Vue visuals. Confirm the canvas/SVG/DOM scene is nonblank, correctly framed, and not dependent on a hidden-tab timer for its only meaningful state.
- Check both static export safety and live presentation safety. PNG/PDF export failures are defects, even when the live deck looks fine.

Do not claim visual polish from code inspection alone when the change touches layout or viewport behavior.

## When To Draft, Componentize, Or Split

Use this decision table:

| Situation | Prefer |
| --- | --- |
| One-off title/copy/note edit | Markdown |
| One slide with simple layout | Markdown + existing classes |
| Repeated slide pattern | Vue component |
| Diagram with many aligned parts | Vue component |
| Animated/stateful explanation | Vue component + `vue-dynamic-visuals.md` |
| Interactive demo or generated visual system | Vue component + browser/export verification |
| Chapter-specific repeated visual language | Chapter CSS |
| Component internal geometry | Scoped Vue CSS |
| Token or theme change | Shared CSS token/base file |
| CSS file exceeds a few hundred lines and covers multiple topics | Split by chapter/page/component |

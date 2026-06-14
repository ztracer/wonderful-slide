# Current Deck Case Study

This case study summarizes reusable lessons from one Android fuzzing Slidev deck. Use it as an example of process and judgment, not as domain-specific rules for every deck.

## Context

The deck is a Chinese live technical presentation for an audience that may not have done Android fuzzing. Its success criteria are audience comprehension and memory: understand Android input boundaries, recognize representative work, and see where the presenter's own work fits.

The deck avoids README summaries, paper-table pages, generic flowcharts, and internal validation language. It favors concrete routes through a system boundary.

## What Generalizes

- Start from a familiar example before naming the mechanism.
- Use a route map to connect terms that would otherwise feel separate.
- Give each chapter a visual identity while preserving one deck-wide rhythm.
- Keep visible copy short and move nuance into speaker notes.
- Extract repeated or complex visuals into Vue components.
- Split CSS by chapter and page so AI edits do not keep inflating one global file.

## Concrete Patterns

- `PRODUCT.md` defines audience, purpose, anti-references, and accessibility expectations.
- `DESIGN.md` turns those goals into color, typography, layout, component, and motion rules.
- `slides.md` owns the main story and notes.
- `components/StageSlide.vue` provides a reusable chapter opener with variant styling.
- Diagram components such as boundary maps and transaction demos protect alignment and reduce Markdown nesting.
- `styles/index.css` imports token/base/utility/chapter files instead of absorbing all rules.
- `pages/binder.md` and `pages/styles/binder.css` show how a focused secondary deck can live beside the main deck without merging all CSS.

## Pitfalls Caught By The Workflow

- Long source material naturally becomes dense summary slides unless the narrative is rewritten as audience questions.
- Technical terms become clearer when they appear after a visual object or example path.
- Repeated card grids make different ideas feel equal, even when the talk needs hierarchy.
- Local color fixes can make one slide prettier while breaking the deck legend. Stage colors should map consistently across cover chips, overview architecture, chapter openers, and component states.
- CSS debt grows quickly when every slide-level class goes into one file.
- A build can pass while a slide still fails projection readability; visual inspection remains necessary for layout-heavy changes.
- PNG export can produce files while Vue still reports print-mode runtime errors. Treat export logs as part of visual verification, especially for animated components.

## Transfer Rule

When applying this to another deck, copy the workflow shape:

`context notes -> audience question sequence -> Markdown draft -> componentized diagrams -> owned CSS split -> build and visual verification`

Do not copy the Android boundary taxonomy unless the new talk is actually about Android.

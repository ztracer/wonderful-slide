# Deck Quality Gates

Use this checklist before calling a Slidev deck polished, presentation-ready, or visually improved.

## Projection Readability

- Titles are readable in two seconds from the back of a room.
- Body copy is short, high-contrast, and not smaller than the deck's established baseline.
- Diagrams have stable dimensions; labels do not wrap unpredictably or overlap arrows.
- No page relies on tiny file paths, long command chips, or dense tables unless the point is to inspect that exact artifact.
- Static export still communicates the idea if animation fails or is skipped.

## One Slide, One Question

Each slide should have a clear job:

- Define one object.
- Explain one mechanism.
- Compare one tradeoff.
- Show one result.
- Bridge one section.

If a slide answers several unrelated questions, split it. If consecutive slides repeat the same structure without adding pressure or contrast, merge or redesign one of them.

## Research And Depth Gate

For a new deck or major rewrite:

- Root `index.md` exists and contains sources, glossary, claim map, examples, tool notes, and slide-question sequence.
- Each core concept slide is backed by `index.md`, a local checked artifact, or both.
- Language/tool decks explain intuition, formal shape, tool behavior, and a concrete example for each core concept.
- Caveats from sources are preserved, especially tool boundedness, finiteness assumptions, experimental status, and version requirements.

## Anti-README Gate

Reject slides that look like:

- A section of a README with bullets enlarged.
- A paper outline without a reason to care.
- A dashboard of equal-weight cards.
- A pile of implementation paths, JSON names, or internal validation labels.
- Generic process arrows with no concrete object, state, or consequence.

Replace with an example path, a boundary map, a before/after contrast, a staged reveal, or a conclusion line tied to evidence.

## Anti-Gray-Card Gate

Gray cards are not a design system. Avoid:

- Multiple slides in a row built from same-size pale cards.
- Heavy rounded rectangles around every idea.
- Decorative shadows that do not clarify hierarchy.
- Low-contrast gray text on light panels.

Use contrast, scale, spacing, alignment, and diagrams first. Use cards only when they frame repeated comparable items.

## Semantic Color Gate

When color carries meaning, it must behave like a legend across the deck:

- Name the concept before tuning the color: stage, layer, source, risk, outcome, persona, or status.
- Put reusable ramps and semantic roles in tokens or a narrow shared style file, not scattered hex values.
- Keep the same concept-color mapping across cover chips, overview maps, stage slides, diagrams, and repeated components.
- Do not let adjacent concepts differ only by tiny intra-hue shifts. If the audience must distinguish them quickly, use distinct hue families plus contrast, labels, or position.
- When recoloring one slide, search for related terms and classes in the deck so the change does not create a local-only legend.

## Static Export And Print-Mode Gate

Slidev decks often look fine live while failing in PNG/PDF export. Treat export as a first-class render target:

- Animated components must have a meaningful static frame before `onMounted` runs.
- Computed active states must clamp or wrap indices so progress values never read outside arrays.
- Avoid relying on timers, browser-only measurements, random values, or visibility-triggered animation for the only visible state.
- Replace deprecated or ambiguous HTML such as `<center>` with styled semantic elements.
- Scan export logs for Vue warnings, unhandled rejections, failed component resolution, and undefined property reads.
- For animated or interactive Vue visuals, inspect both exported PNGs and the live deck. The static frame must explain the idea, and the live version must move or respond without losing layout.

## Prompt Artifact Gate

- No visible slide text or speaker note reads like a prompt, checklist, or agent instruction.
- Ban meta-production phrases such as "这套 slides", "目标是让听众", "这里要", "避免", "计划", and "我们需要" unless the slide is explicitly about the production process.
- Notes should be presenter narration: what to say, why it matters, and how to transition.

## Chinese Technical Talk Checklist

- Put the plain-language intuition before the English term when the audience may be new to the topic.
- Keep Chinese visible copy to one or two lines where possible.
- Use Simplified Chinese copy and an explicit Simplified Chinese font stack.
- Inspect exported glyphs for Simplified Chinese rendering before claiming visual quality.
- Preserve necessary English names for tools, papers, APIs, and protocols; avoid long mixed-language slash chains.
- Do not put internal project management words on audience-facing slides.
- Speaker notes may carry nuance; visible slides should carry the point.
- Run the language check when copy changes, resolve high-risk candidates, and confirm method-choice slides move naturally from problem to chosen route to evidence.

## Build And Visual Verification

Minimum checks:

- Run the project build command.
- If the deck uses source-backed claims, run `node .agents/skills/wonderful-slide/scripts/research-audit.mjs .`.
- If copy changed, run `node .agents/skills/wonderful-slide/scripts/artifact-scan.mjs .` and resolve findings.
- If copy changed, run `node .agents/skills/wonderful-slide/scripts/language-check.mjs . [--range <pages>]` and review the candidates.
- If CSS changed, run the class usage scan and style line report.
- If layout, color, animation, or component logic changed, export touched slides to PNG and inspect them at presentation size.
- If animated or interactive Vue visuals changed, read `references/vue-dynamic-visuals.md`, verify the exported static frame, and check the live deck for motion, interaction, framing, and cleanup issues.
- Use `node .agents/skills/wonderful-slide/scripts/export-check.mjs . --range <pages>` when the skill scripts are available. Treat runtime findings in the export log as real defects even if PNG files were produced.
- If a secondary page/deck changed, build it separately with its own output directory.

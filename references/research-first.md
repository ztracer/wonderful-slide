# Research First

Use this guide before creating or substantially rewriting a technical Slidev deck. The goal is to prevent generic, shallow, or source-free slides.

## Required `index.md`

Create or refresh `index.md` at the deck root before writing many slides. It is a working research dossier, not audience-facing copy.

Minimum sections:

- `## Sources`: authoritative links or local files with one or two lines on what each source supports.
- `## Glossary`: key terms with plain-language meaning and formal/useful meaning.
- `## Claim Map`: deck claims with source ids or checked local artifacts.
- `## Example Inventory`: runnable examples, expected tool result, and what concept each example teaches.
- `## Tool Notes`: tool versions, install assumptions, and workflow caveats.
- `## Slide Question Sequence`: one question per planned slide or slide group.

For technical claims, prefer primary sources: official docs, papers, standards, source repositories, checked examples, or local test output. If only secondary sources exist, mark the claim as secondary.

## Depth Gate

For every core concept, include four layers before turning it into slides:

- Intuition: what problem this concept solves.
- Formal shape: the notation or structure the audience must recognize.
- Tool consequence: what TLC, Apalache, a compiler, or another tool does with it.
- Example anchor: a tiny concrete model, trace, or failure.

Reject concept slides that only name terms. A deck teaching a language or tool should not be a vocabulary list.

## Slide Mapping

Before drafting slides, map each slide to:

- Question answered.
- Source or checked artifact.
- Example or visual.
- Intended memory: the one sentence the audience should keep.

This mapping may live in `index.md`. Do not over-document every sentence, but every major explanation should be traceable.

## Source Hygiene

- Use current official docs when tool behavior, versions, commands, or releases matter.
- Keep citations and raw URLs out of main slide bodies unless the slide is a resources page.
- Put exact links in `index.md`, `README.md`, or speaker notes.
- When a source says a tool is experimental, unmaintained, bounded, finite, or version-dependent, preserve that caveat.

## Chinese Technical Decks

- Visible text should be Simplified Chinese unless the term is a proper English name or syntax.
- Add a Simplified Chinese font stack in CSS, such as `Noto Sans CJK SC`, `Source Han Sans SC`, `Microsoft YaHei`, and `PingFang SC`.
- Inspect exported PNG/PDF glyphs. If glyphs look Japanese or Traditional, fix fonts before claiming visual quality.

## Prompt Artifact Ban

Audience-facing slides and presenter notes must not contain agent instructions or planning phrases, including:

- "这套 slides"
- "目标是让听众"
- "这里要"
- "避免..."
- "入门时先..."
- "计划"
- "我们需要"

Rewrite them as presenter narration or remove them.

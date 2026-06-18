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
- `## Slide Question Sequence`: one question per planned slide, labeled by question type (see below).

For technical claims, prefer primary sources: official docs, papers, standards, source repositories, checked examples, or local test output. If only secondary sources exist, mark the claim as secondary.

## Depth Gate

For every core concept, include four layers before turning it into slides:

- **Intuition**: what problem this concept solves.
- **Formal shape**: the notation or structure the audience must recognize.
- **Tool consequence**: what a tool (compiler, checker, fuzzer, runtime) does with it.
- **Example anchor**: a tiny concrete model, trace, or failure.

Reject concept slides that only name terms. A deck teaching a language or tool should not be a vocabulary list.

## Question Taxonomy

Before drafting slides, classify each planned slide's question into one of five types. The type determines the slide's structure, not just its title.

| Question type | Job | Structure hint | Example |
|--------------|-----|----------------|---------|
| **Foundational** | Define an object, boundary, or term the audience needs before they can go deeper | Visual object → plain definition → formal name → where it sits in the system | "What is Intent, and where does it live in the Android component model?" |
| **Mechanism** | Explain how something works, step by step | Starting state → step-by-step animation or staged reveal → ending state | "How does a Binder transaction cross from an app process to system_server?" |
| **Evidence** | Show what a paper, experiment, or benchmark found | Claim → method (compressed) → result numbers → caveat | "What crash patterns did NASS uncover that FANS could not reach?" |
| **Contrast** | Compare two approaches, results, or tradeoffs | Left/right or before/after comparison → what changed → why it matters | "Atlas vs POIROT: what changes when you restore real call sequences instead of generic harnesses?" |
| **Takeaway** | State a conclusion, limitation, open problem, or next step | Recap the path → name the gap → point forward | "What does IntentScope produce that raw code coverage cannot?" |

A deck that uses only Foundational questions becomes a glossary—the audience learns terms but no story. A healthy deck mixes types, typically with Mechanism and Evidence as the backbone.

## Narrative Tension

Narrative tension is the relationship between consecutive slides. Two adjacent slides have weak tension when:

- They answer the same question type without adding depth (e.g., two Foundational slides defining adjacent terms).
- The second slide could be deleted without changing what the audience understands.
- The transition feels like "also" rather than "therefore" or "but."

Strong tension comes from question-type transitions that create forward pressure:

| From | To | Creates |
|------|----|---------|
| Foundational | Mechanism | "Now that you know what it is, here's how it works." |
| Mechanism | Evidence | "Here's how it works in theory. Here's what actually happens." |
| Evidence | Contrast | "That was approach A. Here's what changed in approach B." |
| Contrast | Takeaway | "Given the differences, here's what we built and what's still open." |

**Example: weak vs strong sequence** (from an Android fuzzing deck):

Weak (all Foundational, no pressure):
1. "What is Intent?" → 2. "What is Binder?" → 3. "What is JNI?" → 4. "What is TEE?"

Strong (type variation, each slide pushes forward):
1. Foundational: "Where does input enter Android, and what are the four boundary types?" (audience sees the map)
2. Mechanism: "How does a single user tap cross Intent, Binder, JNI, and driver boundaries?" (audience follows one concrete path)
3. Evidence: "What did AHA-Fuzz and MALintent find at the Intent boundary?" (audience sees what's broken)
4. Contrast: "MALintent found crashes. What's still missing for a reviewer to trust the result?" (audience sees the gap)
5. Takeaway: "What does IntentScope add: evidence chains instead of isolated crash files." (audience sees the contribution)

The weak sequence names four concepts. The strong sequence tells one story across four boundaries, with each slide earning the next.

## Deriving Questions From Material

When starting from papers, notes, or source code, don't convert material 1:1 into slides. Instead:

1. **Extract claims** from the material into the Claim Map in `index.md`.
2. **Group claims** by the boundary or concept they belong to.
3. **Find the tension**: what's surprising, what changed between papers, what's still unsolved.
4. **Choose question types** based on what each group of claims needs:
   - If the audience needs to understand a term before the claim makes sense → Foundational.
   - If the claim describes a process or flow → Mechanism.
   - If the claim reports results → Evidence.
   - If two claims disagree or one supersedes another → Contrast.
   - If the claim points to future work or unresolved gaps → Takeaway.
5. **Order for pressure**: Foundational → Mechanism (or Evidence) → Contrast → Takeaway is a reliable spine. Adjust to your material.
6. **Check tension**: for each adjacent pair, ask "does slide N+1 depend on slide N, or could they swap?" If they could swap, the tension is weak.

## Slide Mapping

Before drafting slides, map each slide to:

- Question answered (with type).
- Source or checked artifact.
- Example or visual.
- Intended memory: the one sentence the audience should keep.

This mapping lives in `index.md` under `## Slide Question Sequence`. Format:

```
| # | Question | Type | Source | Visual | Takeaway |
|---|----------|------|--------|--------|----------|
| 1 | Where does input enter Android? | Foundational | AOSP arch docs | Boundary map diagram | Four boundaries: Intent, Binder, JNI, TEE |
| 2 | How does a tap cross all four? | Mechanism | WeChat→Maps trace | Animated route diagram | One input crosses many boundaries |
| 3 | What did AHA-Fuzz find? | Evidence | CCS'25 paper | Result card + method strip | 47 unknown issues, 3.45x faster trigger |
```

Do not over-document every sentence, but every major explanation should be traceable.

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

# Structured Intake

Use this guide before any slide creation or major rewrite—even before choosing a work branch. The goal is to confirm what the user wants and collect their material before you start building, so you don't build the wrong deck or fill gaps with guesses the user could have filled.

## Principle

**Ask with options, not open-ended questions.** When the user says "make a slide about X," they often have implicit constraints, reference material, and visual preferences they haven't stated—not because they're hiding them, but because they don't know what information a slide builder needs. Give them concrete choices to react to.

**Confirm before building.** Produce a short intake summary and ask the user to confirm or revise it. This is cheaper than rewriting slides.

## Intake Flow

Run this flow before Branch A (from-zero) or Branch B (major rewrite). For Branch C (narrow edit) or Branch D (audit), skip to the relevant branch.

### Step 1: Collect Material

Start by asking what the user already has. People often bring reference decks, notes, papers, or outlines before they think to mention them.

Ask one batch:

> Before I start, could you share any of these?
> - Reference slides, PDFs, or decks you like the style of
> - Notes, outlines, or mind-maps you've already written
> - Papers, docs, repos, or blog posts you want me to draw from
> - A recording or transcript of a previous version of this talk
> - Any specific slides or sections you know you want (or don't want)
>
> If you have none of these, that's fine—just say "none" and I'll work from what you tell me next.

Do not proceed to Step 2 until the user responds. If the user says "none," note it and move on.

### Step 2: Core Parameters

Ask a structured batch. Every question includes pre-written options the user can pick or mix.

**Talk identity:**

> - **Topic and exact title** (if you have one):
> - **One-sentence pitch**: what should someone who misses the talk still remember?
> - **Language**: Visible slides in ___ ; Speaker notes in ___  
>   Options: 简体中文 / English / 混合（中文 slide + 英文术语）

**Audience and setting:**

> - **Audience**:  
>   A. General developers, no domain knowledge  
>   B. Domain-aware but not deep (e.g., Android devs who haven't done fuzzing)  
>   C. Domain practitioners (e.g., security researchers who fuzz)  
>   D. Mixed (describe the split)
> - **Setting**:  
>   A. Live conference talk (projector, can't pause)  
>   B. Live internal sharing (can pause for questions)  
>   C. Recorded / async (viewers can rewind)  
>   D. Written-only (exported PDF, no speaker)
> - **Duration**: ___ minutes; roughly ___ slides expected

**Scope and boundaries:**

> - **Required points** (must include):
> - **Taboo points** (must avoid):
> - **Tone guardrails**:  
>   A. Neutral survey / academic  
>   B. Opinionated, take a position  
>   C. Hands-on tutorial  
>   D. Project report / status update

**Visual direction preferences** (give concrete categories, not abstract labels):

> - **Visual density**:  
>   A. Sparse, one idea per slide, big type  
>   B. Medium, diagrams + short copy  
>   C. Dense, data-heavy, reference slides
> - **Color personality** (pick one or mix):  
>   A. Dark + neon (conference energy)  
>   B. Light + restrained (academic)  
>   C. Brand colors of a specific project/company  
>   D. High contrast, accessible-first
> - **Diagram style** if your talk includes mechanisms or architecture:  
>   A. Clean boxes-and-arrows  
>   B. Staged reveals (clicks build the diagram)  
>   C. Animated state machines  
>   D. Code-trace style (left: code, right: state)
> - **Any decks or designers whose visual style you want me to reference?** (links or names)

If the user leaves any question unanswered, do not guess silently. Mark it as "assumed: [reasonable default]" in the intake summary and flag it for confirmation.

### Step 3: Intake Summary

After the user responds, produce a short summary. This is a gate—the user must confirm before you build anything.

The summary should look like:

```
## Intake Summary

**Talk**: [title or working title]
**One-line**: [pitch]
**Audience**: [choice + your interpretation]
**Setting**: [choice], [duration], ~[N] slides
**Language**: [visible] / [notes]
**Material provided**: [list or "none"]

**Must include**: [list]
**Must avoid**: [list]
**Tone**: [choice]

**Visual direction**: [density] / [color personality] / [diagram style]
**Style references**: [list or "none provided"]

**Working assumptions** (things I filled in because you didn't specify):
- [assumption 1]
- [assumption 2]

Does this look right? You can say "confirm" to proceed, or tell me what to change.
```

Wait for the user to respond. If they say "confirm," "yes," "go ahead," or similar, proceed to Branch selection (`references/intake-and-branching.md`). If they revise, update the summary and re-confirm.

If the user does not respond after one follow-up, proceed with the assumptions clearly stated in PRODUCT.md—but do not skip the summary step.

### Step 4: Branch

After confirmation, apply `references/intake-and-branching.md` to choose Branch A/B/C/D/E. The intake summary feeds directly into PRODUCT.md and DESIGN.md.

## Why This Order Matters

Many slide-building failures come from one of these:

- Building before knowing the audience (wrong depth)
- Guessing visual preferences silently (wrong style, full rewrite)
- Assuming "none" for reference material when the user had a PDF on their desktop
- Skipping confirmation and discovering the mismatch after 20 slides

A 2-minute intake summary prevents these. The cost of asking is a fraction of the cost of rewriting.

# Language Quality Gates

Use this gate when writing or revising slide titles, visible copy, speaker notes, Survey/Related Work slides, contribution slides, and method-choice slides.

## Core Standard

- State the claim directly. Do not spend the first sentence defending why the claim is allowed.
- Give each paragraph one job: define the object, explain the mechanism, justify a method choice, report evidence, or name a limitation.
- Put intuition before terminology when the audience may be new to the topic.
- Let method choices flow from the problem: first name the constraint or gap, then name the chosen route, then state what the route produces.
- Keep visible copy clean. Move detailed APIs, file names, implementation internals, and long evidence chains into speaker notes unless the slide is about that artifact.

## Rewrite Triggers

Revise copy when it uses these patterns without a real need:

- Detour claims: a sentence explains what the point is not before saying what the point is.
- Defensive transitions: "not X but Y", "rather than", "however", "therefore", "since", "not only ... but also", "不是...而是...", "并不是...", "与其...不如...", "然而", "因此", "所以说", "换句话说", "需要注意的是", "这里不是", "不仅...而且...".
- Evasive rewrites: extra explanation added only to avoid a banned sentence shape.
- Abrupt method selection: one sentence discusses what is possible, suitable, or theoretical, and the next suddenly jumps to the current implementation.
- Early technical pileup: visible copy lists many APIs, file names, tools, acronyms, or slash chains before the audience knows why they matter.
- Repeated paragraph jobs: two adjacent paragraphs both summarize the same contrast, limitation, or contribution.

## Rewrite Moves

- Replace "not X but Y" with a positive claim about Y, then mention X only if the contrast matters.
- Replace "rather than / however / therefore / since" with the actual causal or selection relationship.
- Replace "not only ... but also" with the main outcome and one supporting detail.
- If a method slide jumps from possibility to implementation, add the missing bridge: problem constraint -> why the chosen route fits -> what the route leaves behind as evidence.
- If a sentence carries too many technical nouns, split it into "object", "operation", and "evidence" sentences, or move details into notes.
- If a sentence begins with a caveat, ask whether the caveat helps a first-time listener. If not, remove it.

## Chinese Technical Talk Checks

- Prefer Chinese wording in visible copy: "应用", "登记表", "意图消息", "证据链", "复查材料".
- Preserve English names for papers, projects, APIs, protocols, and exact input types when precision matters.
- Avoid long mixed chains such as `App / ICC / Registry / runtime / however`. Use one Chinese category and keep English as the specific example.
- Speaker notes may carry exact implementation vocabulary. Visible slides should carry the listener-facing point.

## Script Use

Run `node .agents/skills/wonderful-slide/scripts/language-check.mjs <deck-root> [--range <pages>]` after copy edits. Treat findings as review prompts, not automatic failures. Use `--fail-on-findings` only when a workflow wants unresolved candidates to fail a check.

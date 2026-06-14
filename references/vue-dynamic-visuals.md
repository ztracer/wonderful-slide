# Vue Dynamic Visuals

Use this guide when a Slidev deck needs animated diagrams, interactive demos, state machines, simulations, data-driven visuals, or generated visual systems built with Vue.

## When To Use Vue

Use a Vue component when the visual has:

- Multiple aligned nodes, arrows, lanes, layers, or repeated units.
- State that changes over time, through clicks, or from props.
- Motion that explains a mechanism, transition, queue, loop, boundary crossing, or feedback cycle.
- Geometry that must remain stable when text or data changes.
- A visual grammar reused across slides.

Keep simple static text layouts in Markdown and chapter CSS. Vue earns its place when it protects the explanation from becoming brittle markup.

## Component Contract

Before writing styles, define:

- The slide question the visual answers.
- The static frame that communicates the idea in PNG/PDF export.
- Props for content that changes: `title`, `items`, `stages`, `metrics`, `variant`, `activeIndex`.
- Slots only when the caller needs rich text.
- Semantic state names, not animation names: `queued`, `executing`, `blocked`, `evidence`, `resolved`.
- Stable dimensions using `width`, `height`, `aspect-ratio`, `minmax(0, 1fr)`, or fixed diagram tracks.

Keep Markdown readable. A slide should call the component with clear props and a short note, not a dense nest of visual internals.

## Motion And Interaction

- Render a meaningful default state before `onMounted`.
- Clamp indexes before reading arrays.
- Use deterministic data. Do not depend on random values for final layout.
- Use `requestAnimationFrame` or controlled timers for loops, and cancel them in `onBeforeUnmount`.
- Let motion clarify sequence, state, or causality. Avoid decorative motion that competes with the presenter.
- Respect `prefers-reduced-motion` with a static or low-motion state.
- Do not animate layout-critical dimensions. Animate transforms, opacity, masks, clips, or CSS variables after stable geometry is set.
- Keep active states readable without motion. A paused screenshot should still show the current object, path, or result.

## Styling Ownership

- Component geometry and animation live in scoped Vue styles.
- Shared colors and semantic concept mappings live in tokens or chapter CSS.
- Use CSS custom properties for per-item colors, progress, active state, and variants.
- Avoid styling incidental Slidev wrapper DOM from inside the component.
- Avoid raw color drift. If a color means a concept across slides, give it a token or named class.

## Export And Live Safety

Slidev export often captures a static or early frame. Treat that frame as a first-class output.

Before calling the visual finished:

- Build the deck.
- Export the touched slide range to PNG with `export-check.mjs`.
- Inspect representative PNGs at presentation size.
- If the visual depends on motion or interaction, open the live deck and confirm it moves, responds, and remains framed.
- Check export logs for Vue warnings, undefined reads, failed components, and timer-related errors.

## Common Failures

- Blank export because the only visible state appears after `onMounted`.
- Overlapping labels because diagram geometry is driven by text width.
- Array out-of-bounds reads from active indexes during print/export.
- Timers or animation frames left running after slide navigation.
- A beautiful live animation whose PNG frame does not communicate the idea.
- Reused colors that mean different concepts on adjacent slides.
- Component props that expose implementation details instead of presentation concepts.

## Implementation Sketch

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  activeIndex?: number
  stages: Array<{ key: string; label: string; detail: string }>
}>(), {
  activeIndex: 0,
})

const liveIndex = ref(props.activeIndex)
let frame: number | undefined

const safeIndex = computed(() => {
  if (!props.stages.length) return 0
  return Math.max(0, Math.min(liveIndex.value, props.stages.length - 1))
})

const active = computed(() => props.stages[safeIndex.value])

onMounted(() => {
  const tick = () => {
    if (props.stages.length) {
      liveIndex.value = (liveIndex.value + 1) % props.stages.length
    }
    frame = window.requestAnimationFrame(tick)
  }
  frame = window.requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (frame !== undefined) window.cancelAnimationFrame(frame)
})
</script>
```

Use this as a pattern, not a template to copy blindly. The visual's first static frame and semantic state model matter more than the exact timer code.

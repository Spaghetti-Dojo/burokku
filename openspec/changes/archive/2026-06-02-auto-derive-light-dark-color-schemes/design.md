## Context

`theme.json` is the single source of truth for color (palette, gradients, duotones, and `custom.color`). The base values describe the **dark** look (page background `--wp--custom--color--gray-950` at HSL L 3.9%, text white). Client SCSS consumes these directly as `var(--wp--preset--color--*)` / `var(--wp--custom--color--*)` in ~dozens of places.

The prior `feat/light-dark-themes` branch introduced a small set of semantic tokens (`surface`, `on-surface`, …) in a `dark.json` variation. That flattens every curated hue into a handful of tokens and requires editing each SCSS rule to consume them — manual, lossy, and not scalable. This change keeps the existing variable vocabulary and instead **derives** the opposite scheme automatically.

The header toggle (Interactivity store) already sets `data-theme="light|dark"` on `<html>`, with a no-flash inline head script. That mechanism is kept as-is.

## Goals / Non-Goals

**Goals:**
- Derive the light scheme from `theme.json` with zero hand-maintained duplication.
- Preserve hue + saturation + alpha of every token; vary only lightness.
- Maximize reuse of curated palette values (prefer existing `-300`/`-700` stops over computed colors).
- Produce a PR-reviewable intermediate (`styles/light.json`) that allows per-token hand overrides.
- Keep both schemes loaded at once so toggling is instant (attribute flip only).
- Run generation in CI so committed output never drifts from `theme.json`.

**Non-Goals:**
- No new toggle UI or storage logic (reuse existing block + store).
- No change to client SCSS authoring or the variable names it consumes.
- No runtime/PHP color computation — derivation is build-time only.
- No new semantic token layer (`surface`, `on-surface`, etc.).

## Decisions

### D1 — Base scheme stays `:root`; derived scheme is light, scoped to `[data-theme="light"]`
`theme.json` already encodes dark, and WordPress emits its tokens under `:root`. So the generator only needs to emit the **delta** for light under `[data-theme="light"]`. Dark needs no generated block.
- *Alternative:* emit both `[data-theme="dark"]` and `[data-theme="light"]` explicitly. Rejected — duplicates the values WordPress already prints under `:root` and risks divergence from core's serialization.

### D2 — Transform lightness only; keep H, S, alpha
Identity of a color lives in hue/saturation; the scheme axis is lightness. Mirroring L flips dark↔light while every hue used across SCSS survives.
- *Alternative:* OKLCH perceptual mirroring. Deferred — more correct perceptually but heavier and harder to hand-tune; HSL matches how the palette is already authored (Tailwind-style HSL stops).

### D3 — Derivation precedence: expression → curated step-swap → formula mirror
Per literal token, the generator resolves in order:
1. **Expression** (`var(...)` / `color-mix(...)`): emit unchanged → inherits its flipped referent.
2. **Chromatic ramp** with a sibling `-700`/`-300` in the palette: swap step (`-700`↔`-300`, `-500` self), using the sibling's **curated** HSL value.
3. **Fallback formula**: `L' = 100 − L`, keep H/S/alpha.
This yields curated values wherever a partner exists, and a deterministic mirror for orphans (`gray-950`, `gray-900`, `theme-accent`, alpha tints).
- *Alternative A:* pure step-swap everywhere — breaks on orphan tokens with no partner.
- *Alternative B:* pure `L'=100−L` everywhere — simplest, one formula, but produces non-curated chromatic values the designer didn't vet. The user chose "more curated", hence the hybrid.

### D4 — Token-class coverage by namespace
The generator walks four token classes, applying D3 per literal:
| Class | CSS var namespace | Handling |
|-------|-------------------|----------|
| palette | `--wp--preset--color--*` | per-token (D3) |
| gradient | `--wp--preset--gradient--*` | transform each literal HSL stop in the `linear-gradient(...)` |
| duotone | `--wp--preset--duotone--*` | transform each color in the array, keep pairing |
| custom | `--wp--custom--color--*` | per-token (D3); expressions pass through |

### D5 — Intermediate `styles/light.json` is canonical + override-friendly
Generator writes derived values into `styles/light.json` (mirrors `theme.json` color shape). A small override map lets a human pin specific tokens; the generator merges overrides over computed values, so hand-tuned colors survive regeneration. The CSS flattener consumes `light.json`, not `theme.json` directly.

### D6 — GitHub Actions generation step
A Node script (run via `pnpm`) regenerates `styles/light.json` + `dist/styles/color-scheme.css`. CI runs it and fails if the committed output is stale (diff check), guaranteeing sync. Slots alongside existing `.github/workflows/deploy-docs.yml`. `Styles.php` already enqueues `dist/styles/color-scheme.css`, so no PHP change.

## Risks / Trade-offs

- **Pure L-mirror can over/under-shoot contrast on some hues** → curated step-swap (D3.2) covers chromatic ramps; remaining orphans are few and overridable via `light.json` (D5).
- **`theme-accent` (white literal, no `-700/-300` partner) mirrors to near-black** → correct for contrast, but the one token where "curated" can't apply; pin by hand in overrides if undesired.
- **Generated output drift if someone edits `theme.json` without rerunning** → CI staleness check (D6) fails the build.
- **Alpha tints (`*-500-50`)** → transform the base channel by its class, keep the `/ alpha`; verify WordPress serializes these as expected before locking.
- **WordPress var serialization changes across versions** → emitting only the light delta (D1) limits blast radius, but the flattener must match core's `--wp--preset--color--{slug}` naming; pin/verify against the WP version in use.

## Open Questions

- Does the flattener read WordPress's serialized CSS var names from a build of `theme.json`, or reproduce the naming convention itself? (Leaning: reproduce the documented `--wp--preset--*` convention to avoid a WP bootstrap in CI.)
- Should the CI step auto-commit regenerated output on `theme.json` change, or only fail on drift and require the author to commit? (Leaning: fail-on-drift to keep diffs intentional.)

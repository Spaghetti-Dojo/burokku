## Why

The theme ships a single (dark) color set defined in `theme.json`. The earlier `feat/light-dark-themes` attempt added a handful of semantic variables (`surface`, `on-surface`, `surface-elevated`, `border-muted`) to a `dark.json` variation, which collapses the 50+ curated hues used across client SCSS into a few flat tokens and forces manual remapping. We need a light/dark solution that preserves every curated hue, requires zero manual duplication, and stays in sync with `theme.json` as the single source of truth.

## What Changes

- Add a build-time generator that reads every color token from `theme.json` (palette, gradients, duotones, and `custom.color` literals) and derives the opposite color scheme by transforming **lightness only** (keeping hue + saturation + alpha).
- Derivation rule: chromatic ramp tokens with a `-700`/`-300` partner swap step to reuse curated palette values; all other literals mirror via `L' = 100 − L`; `var()`/`color-mix()` expressions are emitted unchanged so they inherit their flipped referents.
- Emit an intermediate, human-reviewable `styles/light.json` (PR-diffable; hand overrides are respected by the generator).
- Flatten both schemes into one stylesheet `dist/styles/color-scheme.css`: `:root` keeps the untouched base (dark), `[data-theme="light"] { … }` carries the derived light values. Both schemes are always loaded; the existing header toggle (sets `data-theme` on `<html>`) flips between them with no extra fetch or reflow.
- Run the generator in a GitHub Actions step so the committed `light.json` and built CSS never drift from `theme.json`.
- Keep the existing `theme-toggle` block / Interactivity store from the prior work unchanged.

## Capabilities

### New Capabilities
- `color-scheme-generation`: build-time derivation of the opposite color scheme from `theme.json` tokens (transform rules, token-class coverage, intermediate `light.json`, CSS output contract).
- `color-scheme-delivery`: runtime delivery of both schemes — scoped CSS structure (`:root` vs `[data-theme="light"]`), enqueueing of the generated stylesheet, and the toggle integration that selects the active scheme.

### Modified Capabilities
<!-- None. No existing main specs on this branch. -->

## Impact

- **New build asset**: a Node generator script + a CI step that writes `styles/light.json` and `dist/styles/color-scheme.css`.
- **Source of truth**: `theme.json` color tokens (palette / gradient / duotone / `custom.color`).
- **Server**: `sources/server/Theme/Styles.php` already enqueues `dist/styles/color-scheme.css` — generated output slots in with no PHP change.
- **Client**: existing `--wp--preset--color--*` / `--wp--custom--color--*` usages across SCSS keep working untouched.
- **Toggle**: reuses existing `blocks/theme-toggle` + Interactivity store (`data-theme` on `<html>`).
- **CI**: `.github/workflows` gains a generation step (alongside `deploy-docs.yml`).

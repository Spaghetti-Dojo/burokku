## Why

The current light scheme is *derived* by flipping the palette's lightness at build time and scoping
the flipped preset variables under `[data-theme="light"]`. Because the palette itself changes per
scheme, swatches stop meaning what they say (a "white" swatch resolves near-black in light), and
brand/accent pairings break: with `theme-accent` frozen while its paired text flips, the Default
button and the `color-mix()` link hover become unreadable in light. The toggle is also coupled to the
entire palette. We want the palette to be a stable, globally selectable set of colors, with only the
*role-to-color assignments* changing between schemes.

## What Changes

- **BREAKING**: Stop deriving/flipping the palette. `theme.json` `settings` (`color.palette`,
  `custom.color`, `gradients`, `duotone`) become **scheme-invariant** — the global, editor-selectable
  colors, identical regardless of active style.
- Introduce a semantic token layer prefixed `--brk-color-*` (`surface`, `on-surface`, `accent`,
  `on-accent`, `link`, `link-hover`, `border`, …). Each token maps a **role to a palette variable**
  (`var(--wp--preset--color--*)` / `var(--wp--custom--color--*)`), never to a literal.
- Author the two scheme mappings in **SCSS** (`:root` for dark base, `[data-theme="light"]` for the
  counterpart), compiled by the existing webpack pipeline into `dist/styles/color-scheme.css`.
- Rewire `theme.json` `styles` (background/text, button color + `:hover`, link + `:hover`, headings,
  `core/quote` and `core/accordion` borders) to reference **only** `var(--brk-color-*)`.
- Toggle mechanism is unchanged: the head script sets `html[data-theme]` before paint; only the
  ~10 `--brk-color-*` variables swap. `localStorage['burokku-theme']`, `prefers-color-scheme`
  fallback, and the dark base default all remain.
- Editor scheme-preview keeps its behavior, but since the swapped variables are now ours
  (`--brk-color-*`, which WordPress never re-emits on `.editor-styles-wrapper`), the dual-target
  wrapper workaround in `applyScheme` is removed (single target).
- **Removals**: `tools/color-scheme/*` (the flip generator + tests), `styles/light.json`,
  `package.json` scripts `color-scheme:flatten` / `test:color-scheme` (and from `build`), and
  `.github/workflows/color-scheme.yml`.

## Capabilities

### New Capabilities
- `semantic-color-tokens`: The `--brk-color-*` role layer — the token vocabulary, the rule that each
  maps to a palette variable (not a literal), that `theme.json` `styles` reference only these tokens,
  and that the palette stays scheme-invariant.

### Removed Capabilities
- `color-scheme-generation`: Retired entirely (capability spec deleted). The build-time palette
  derivation/flip is gone; the opposite scheme is now an authored SCSS mapping, not generated output.

### Modified Capabilities
- `color-scheme-delivery`: The scoped stylesheet now carries **semantic `--brk-color-*` overrides**
  under `[data-theme="light"]` (not flipped `--wp--preset--*`/`--wp--custom--*`), and the palette is
  not redeclared per scheme.
- `editor-scheme-preview`: Canvas scheme application targets a single element; the
  `.editor-styles-wrapper` preset-shadowing workaround is no longer required.

## Impact

- `theme.json` (`styles` rewired to `--brk-color-*`; `settings` unchanged).
- New `sources/client/styles/.../_color-scheme.scss` (token layer + scheme maps) → `dist/styles/color-scheme.css`.
- `sources/editor/scheme-preview/index.tsx` (`applyScheme` simplified).
- Removed: `tools/color-scheme/*`, `styles/light.json`, related `package.json` scripts, color-scheme CI workflow.
- Unchanged: `theme-state`, `theme-toggle-block`, `HeadScript`, `Styles.php` enqueue (source of the
  CSS changes from JS-flatten to SCSS, the enqueued path stays `dist/styles/color-scheme.css`).
- Follow-up (out of scope): an `.claude/skills` AI agent that authors the light mapping from the dark
  one and audits WCAG contrast across element pairings, plus a deterministic contrast-audit CI gate.

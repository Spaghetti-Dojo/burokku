## Context

The theme ships a dark base (`theme.json` at `:root`) and a visitor light/dark toggle that swaps
`html[data-theme]`. The light scheme is currently *derived*: a Node tool (`tools/color-scheme/*`)
flips the palette's lightness and flattens the result to `dist/styles/color-scheme.css`, scoped under
`[data-theme="light"]`, redeclaring `--wp--preset--color--*` / `--wp--custom--color--*`.

Flipping the palette makes swatches change meaning per scheme and breaks brand/accent contrast
(frozen `theme-accent` + flipped on-accent text → unreadable Default button and `color-mix()` link
hover in light). The palette should be a stable, globally selectable set; only the *role→color
assignment* should differ between schemes.

## Goals / Non-Goals

**Goals:**
- Keep `theme.json` `settings` (palette/custom/gradients/duotone) scheme-invariant.
- Add a `--brk-color-*` semantic layer mapping roles → palette variables, authored in SCSS, swapped
  per `[data-theme]`.
- Route all `theme.json` `styles` color assignments through `--brk-color-*`.
- Preserve the existing toggle, persistence, head script, and editor preview behavior.
- Remove the palette-flip generator, `styles/light.json`, related scripts, and the CI workflow.

**Non-Goals:**
- The AI skill that auto-authors the light mapping and audits WCAG contrast (separate follow-up).
- Changing the toggle UX, persistence key, or the `theme-state` / `theme-toggle-block` contracts.
- Per-variation toggle wiring beyond the default dark↔light pair.

## Decisions

**Semantic layer is ours (`--brk-color-*`), not WordPress `custom`.**
Tokens defined via `theme.json` `settings.custom` would be forced into the `--wp--custom--*`
namespace and re-emitted by WordPress on `.editor-styles-wrapper`. Defining `--brk-color-*` in our own
SCSS keeps the prefix clean, avoids collisions, and — crucially — they are NOT shadowed by WP's preset
re-emission, which is what lets the editor preview target a single element. Alternative considered:
WP `custom` tokens (Browse-Styles-native) — rejected for the prefix/shadowing cost.

**Each `--brk-color-*` maps to a palette `var()`, never a literal.**
Keeps the palette the single source of color values; a palette/variation change flows through
automatically. Element styles never see a raw palette var, so polarity is fully determined by the
~10-line mapping.

**Mapping authored in SCSS, compiled by the existing pipeline.**
The two maps (`:root` dark, `[data-theme="light"]` light) are small and human-owned. The webpack SCSS
build already emits to `dist/styles/`, so no bespoke generator/flatten step is needed. Alternative:
keep a JSON→CSS emit script — rejected as unnecessary indirection for ~10 declarations.

**Prefix shape `--brk-color-<role>` (grouped).**
Leaves room for future `--brk-space-*` / `--brk-radius-*` without a second migration.

**Toggle mechanism unchanged.**
Only the bytes behind `[data-theme]` change (semantic vars vs preset vars). Head script, `view.js`,
`scheme-preview`, `document.scss`, and `style.scss` stay attribute-driven; `Styles.php` still enqueues
`dist/styles/color-scheme.css` (now SCSS-produced).

## Risks / Trade-offs

- [Unmapped element pairing slips through] → The audit step (manual now, skill later) enumerates
  `theme.json` element color pairings; start with the headline set (background/text, button +hover,
  link +hover, headings, quote/accordion borders) and grow `--brk-color-*` as gaps appear.
- [Light mapping picks low-contrast palette entries] → Verify in-browser (front-end + editor) during
  migration; a deterministic contrast gate lands with the follow-up skill.
- [`color-mix()` link-hover loses its dynamic referent] → Replace the expression with an explicit
  `--brk-color-link-hover` mapped token, removing the fragile frozen-var behavior.
- [Editor preview regression from dropping the wrapper target] → Justified because only `--brk-*`
  (not re-emitted by WP) are swapped; validate light tokens resolve inside `.editor-styles-wrapper`
  with the single `<html>` target before removing the wrapper code.

## Migration Plan

1. Add `_color-scheme.scss` defining `--brk-color-*` and the `:root` (dark) + `[data-theme="light"]`
   (light) mappings, wired into the styles build so it lands in `dist/styles/color-scheme.css`.
2. Rewire `theme.json` `styles` (background/text, button color +hover, link +hover, headings,
   `core/quote` and `core/accordion` borders) to `var(--brk-color-*)`. `settings` untouched.
3. Verify dark + light on the front end and in the editor preview (parity, no FOUC).
4. Remove `tools/color-scheme/*`, `styles/light.json`, `package.json` scripts
   (`color-scheme:flatten`, `test:color-scheme`, the `build` chain), and
   `.github/workflows/color-scheme.yml`; simplify `scheme-preview` `applyScheme` to a single target.

Rollback: revert the `theme.json` `styles` rewire and restore the JS flatten step; the removed files
are recoverable from git history.

## Open Questions

- Final `--brk-color-*` vocabulary: is `surface / on-surface / accent / on-accent / link / link-hover
  / border` sufficient, or are `muted/on-muted` (secondary/ghost buttons), `surface-elevated`
  (cards), or a focus `ring` token needed? Resolve as the pairing audit finds unmapped roles.

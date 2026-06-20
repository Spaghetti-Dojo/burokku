---
slug: /color-schemes
title: Color Schemes & Style Variations
sidebar_position: 3
---

# Color Schemes & Style Variations

How light/dark works in Burokku, how to add a new style, and how to use the `color-scheme` skill and
audit tool to keep both schemes readable.

## Mental model

Three layers, kept strictly separate:

1. **Palette** — `theme.json` `settings` (`color.palette`, `custom.color`, `gradients`, `duotone`).
   The global, editor-selectable colors. **Scheme-invariant**: a swatch means the same color in
   light and dark.
2. **Semantic roles** — `--brk-color-*` custom properties in
   `sources/client/styles/color-scheme.scss`. The only thing that flips. Each role maps to a palette
   `var()` (never a literal), with a `:root` block (dark, the base) and a `[data-theme="light"]`
   block (the light counterpart).
3. **Element styles** — `theme.json` `styles` and the client SCSS reference **only** `--brk-color-*`
   roles, so an element's color is decided entirely by the active scheme's mapping.

The toggle (theme-toggle block) sets `html[data-theme]`; a synchronous head script applies the
visitor's stored preference (`localStorage['burokku-theme']`) before first paint, so there is no
flash. Selecting a scheme is a pure attribute swap — both schemes are always loaded.

### The roles

| `--brk-color-*`          | used for                                                     |
|--------------------------|--------------------------------------------------------------|
| `surface` / `on-surface` | page background / body text                                  |
| `on-surface-muted`       | secondary & placeholder text                                 |
| `accent` / `on-accent`   | primary button background & its text, focus ring             |
| `accent-hover`           | primary button hover background                              |
| `muted`                  | secondary surfaces (secondary button, inline code, nav pill) |
| `field`                  | inputs, preformatted blocks, striped rows                    |
| `border`                 | hairline borders                                             |
| `link-hover`             | link hover text                                              |

Add a role when an element pairing has no fitting one. The full mapping lives in
`sources/client/styles/color-scheme.scss`; the reviewable record is
`tools/color-scheme-audit/color-scheme.policy.json`.

## Creating a new style

There are two distinct things you might want.

### Case A — a new selectable palette (most common)

You want a different **look** (e.g. a "Canary" style) but the same role structure. Light and dark
come along for free.

1. Create a Browse-Styles variation, e.g. `styles/canary.json`, overriding only the palette —
   `settings.color.palette` and/or `settings.custom.color` — using the **same slugs**
   (`white`, `gray-950`, `theme-accent`, …):

   ```json
   {
     "$schema": "https://schemas.wp.org/trunk/theme.json",
     "version": 3,
     "title": "Canary",
     "settings": {
       "color": {
         "palette": [
           { "slug": "theme-accent", "color": "hsl(47 95% 55%)", "name": "Theme Accent" }
         ]
       }
     }
   }
   ```

2. Do **not** touch `styles` or `color-scheme.scss`. Element styles use `--brk-` roles, which point
   at palette slugs, so the new palette flows through **both** schemes automatically.

3. Activate it (Site Editor → Browse Styles → Canary), then audit:

   ```bash
   pnpm build
   pnpm audit:color-scheme --pages /,/blocks/
   ```

That gives you Canary in both light and dark with no extra files.

### Case B — a new scheme mapping (different role → color, or a new base polarity)

You want to change *how* light/dark themselves behave (which palette entry each role uses, or to
make Light the base). This edits the **global** `--brk-` mapping in `color-scheme.scss`. Use the
skill (below) — or edit the two blocks by hand, then:

```bash
pnpm build
pnpm audit:color-scheme
node tools/color-scheme-audit/build-policy.mjs   # refresh tools/color-scheme-audit/color-scheme.policy.json
```

## Using the `color-scheme` skill

The skill authors and audits a scheme so you don't pick colors blind. Invoke it from the assistant:

```
/color-scheme
```

It will:

1. Read the palette, the current `--brk-` mapping, and
   `tools/color-scheme-audit/color-scheme.policy.json`.
2. Derive the counterpart mapping — a palette entry per role at the opposite lightness pole, never a
   literal; `accent` and `on-accent` flip together so buttons stay readable.
3. Run the audit tool, treating sub-threshold **and** non-flipping pairings as defects, and auto-fix
   by re-mapping, re-auditing (capped iterations).
4. Apply **source-aware** fixes: theme code → rewrite to a `--brk-` role; theme markup → bridge
   token (below); user content → flag only.
5. Write the SCSS blocks, refresh `tools/color-scheme-audit/color-scheme.policy.json`, and leave a
   reviewable diff plus a contrast report. It never commits; you ratify the diff.

Accessibility claims always cite the audit tool's measured contrast — the skill never guesses, and
it only ever chooses among palette entries.

Use it whenever colors look wrong in a scheme, a readability issue is reported, or you're adding a
new scheme mapping (Case B).

## The audit tool

A deterministic, headless WCAG audit of the rendered page in **both** schemes. Catches colors that
don't flip and contrast failures — including colors baked into block markup, which scanning
`theme.json`/SCSS alone would miss.

```bash
pnpm build                                   # produce dist/styles/color-scheme.css
pnpm audit:color-scheme                       # default: /blocks/, AA 4.5:1
pnpm audit:color-scheme --pages /,/blocks/ --threshold 4.5 --json
```

It loads each page in dark and light (seeding the preference before paint, so reads are never
stale),
resolves `var()` / `color-mix()` / `oklab(from …)` via computed style, and reports per pairing:

- **contrast** in each scheme (exits non-zero if any pairing is below the threshold — CI-gateable),
- **non-flip** — the same color in both schemes (a frozen value where a scheme-relative one is
  expected),
- **unresolved** — text over media (cover blocks, images), which is not deterministically gateable.

Requires the wp-env site running and a one-time browser install:

```bash
pnpm env start
pnpm exec playwright install chromium-headless-shell
```

The deterministic unit tests run without a site: `pnpm test:color-scheme-audit`.

## Coloring elements correctly

- **In theme code** (`theme.json` `styles`, SCSS): reference a `--brk-color-*` role — never a raw
  palette `var()` and never a literal. That's what makes it flip.
- **In block markup** (template parts, patterns): the block color picker only emits *frozen* palette
  references that do **not** flip. To make a markup color flip, add a **bridge token** whose value
  aliases a role, then reference it from markup:

  ```jsonc
  // theme.json → settings.custom.color
  "footer": { "copyright": "var(--brk-color-on-surface-muted)" }
  ```
  ```html
  <!-- in the template part -->
  "color":{"text":"var:custom|color|footer|copyright"}
  ```

  > **Gotcha:** the bridge token's value must be `var(--brk-color-*)`, never a literal, or it won't
  > flip. And `elements.link` color does **not** apply to links inside static template parts — style
  > those links in SCSS via the bridge token instead.

## Limitation

The `--brk-` mapping is **global**, not per-variation. A palette swap (Case A) gives any variation
both polarities for free, but two variations cannot have *different* role→color logic toggling
independently — that would need per-variation scoped CSS, intentionally out of scope. For nearly all
"new style" needs, Case A is the right tool.

## Reference

- `COLOR_SCHEME_AUDIT.md` (repo root) — the full playbook: role vocabulary, element→role map, the
  three color sources, and every gotcha discovered while building this.
- `.claude/skills/color-scheme/SKILL.md` — the skill procedure.
- `tools/color-scheme-audit/` — the audit tool and its tests.

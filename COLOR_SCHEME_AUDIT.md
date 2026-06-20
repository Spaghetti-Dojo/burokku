# Color-scheme audit — real-scenario report

Captured while implementing `semantic-color-scheme-tokens` (Plan B) and hand-auditing the result in
Chrome. Intended as feedback for the `color-scheme-skill` implementation: a record of the roles, the
element→role map, the contrast measurements, and the gotchas a tool/agent must handle.

## Semantic token vocabulary that emerged

10 roles were enough to cover every colored element on the front end. Each maps to a palette
variable (never a literal); only the mapping flips between schemes.

| `--brk-color-*`    | dark (`:root`)       | light (`[data-theme="light"]`) | role                                                      |
|--------------------|----------------------|--------------------------------|-----------------------------------------------------------|
| `surface`          | `gray-950` (3.9%)    | `white` (98%)                  | page background                                           |
| `on-surface`       | `white`              | `gray-950`                     | body text                                                 |
| `on-surface-muted` | `gray-400` (63.9%)   | `gray-600` (32.2%)             | secondary/placeholder text                                |
| `accent`           | `theme-accent` (98%) | `gray-950` (3.9%)              | primary button bg, focus ring                             |
| `on-accent`        | `gray-900` (9%)      | `white`                        | text on accent                                            |
| `accent-hover`     | `gray-200` (89.8%)   | `gray-700` (25.1%)             | primary button hover bg                                   |
| `muted`            | `gray-800` (14.9%)   | `gray-200` (89.8%)             | secondary surfaces (secondary btn, inline code, nav pill) |
| `field`            | `gray-900` (9%)      | `gray-100` (96.1%)             | input / preformatted / striped-row surfaces               |
| `border`           | `gray-800`           | `gray-200`                     | hairline borders                                          |
| `link-hover`       | `gray-400`           | `gray-600`                     | link hover text                                           |

Notes:

- `on-surface-muted` and `link-hover` happen to share the same palette entries here; kept separate
  for semantic clarity. A skill could collapse coincident roles or keep them distinct.
- `selection` reuses `surface`/`on-surface` swapped (inverts correctly in both schemes).
- The earlier brand-accent bug is gone: `accent` flips lightness with its `on-accent`, so contrast
  holds for any accent hue (verified separately with red).

## Element → role map (what the audit must enumerate)

Two distinct sources of color assignment — the skill must cover **both**:

### 1. `theme.json` `styles` (global styles)

- `color.background` → `surface`; `color.text` → `on-surface`
- `elements.button` bg → `accent`, text → `on-accent`; `:hover` bg → `accent-hover`
- `elements.link` text → `currentColor` (inherits `on-surface`); `:hover` → `link-hover`
- `elements.heading` → inherits `on-surface`
- `blocks/core/quote`, `blocks/core/accordion-item` border → `border`

### 2. Client SCSS components (NOT in theme.json — easy to miss)

- `mixins/_buttons.scss`: outline/ghost/secondary (border/text/bg/hover) → `border`/`on-surface`/
  `muted`
- `molecules/_search.scss`: input text/bg/border/placeholder/icon → `on-surface`/`field`/`border`/
  `on-surface-muted`
- `molecules/_table.scss`: cell borders → `border`; striped rows → `field`
- `atoms/_pre.scss` bg → `field`; `atoms/_code.scss` bg → `muted`
- `atoms/_selection.scss` → `surface`/`on-surface` (swapped)
- `atoms/_outline.scss` focus ring (incl. relative `oklab(from …)`) → `accent`
- `organisms/_footer.scss` link hover → `link-hover`
- `organisms/_header.scss`: translucent scrim `oklab(from … / alpha)` → `surface`; border →
  `border`;
  nav pill bg → `muted`; nav text → `on-surface`
- `wp-class-utils.scss` `.has-lead-font-size` → `on-surface-muted`

## Contrast results (fresh load, WCAG AA = 4.5:1)

All pairings pass in **both** schemes. Sample:

| element          | dark  | light |
|------------------|-------|-------|
| body text        | 18.97 | 18.97 |
| Default button   | 17.18 | 17.18 |
| Outlined button  | 18.97 | 18.97 |
| Ghost button     | 18.97 | 18.97 |
| Secondary button | 14.50 | 15.72 |
| Link button      | 18.97 | 18.97 |
| inline code      | 17.18 | 18.16 |
| search input     | 17.18 | 18.16 |
| h2               | 18.97 | 18.97 |

No failures (`fails: []`) in either scheme.

## Gotchas the skill/tool MUST handle

1. **Two assignment sources.** Enumerating only `theme.json` misses the entire component SCSS layer
   (buttons, search, table, code, header, footer…). The audit tool must scan both theme.json styles
   and the compiled/source CSS for color pairings, or it will report a false all-clear.
2. **Separately-enqueued block styles.** `dist/styles/@block-styles/button.css` is registered per
   block and enqueued on render (`render_block_core/button`), not via the main style list. The agent
   must know these exist and rewire/audit them too.
3. **Dev cache hides changes.** Non-prod enqueues with `version=null` → no cache-bust → the browser
   serves stale CSS. When verifying in a browser, force-refetch stylesheets (append a query) or the
   audit reads old colors. (Real cause of several false "white-on-white" readings during this run.)
4. **Live `data-theme` toggling gives stale `getComputedStyle`.** Flipping the attribute via JS and
   reading immediately returns pre-reflow values for var-derived colors (custom props update, but
   the
   derived `color`/`background` lag). **Verify by setting `localStorage['burokku-theme']` and
   loading
   fresh** (head script applies it pre-paint) — one scheme per page load — not by toggling in place.
5. **`color-mix()` / relative `oklab(from …)`.** Several values use `color-mix(in oklab, …)` and
   `oklab(from var(--x) l a b / alpha)`. The resolver must compute these, not skip them.
6. **`light-dark()` co-exists with `--brk-`.** `mixins/_colors.scss state-layer()` and the header
   scrim use `light-dark()`, which resolves via the `color-scheme` property (set per `[data-theme]`
   in
   `document.scss`). It adapts per scheme independently of `--brk-`; the audit must resolve it using
   the active `color-scheme`.
7. **`currentColor` chains.** Links/headings/code use `currentColor`; the resolver must walk
   inherited
   `color` to the nearest explicit value (usually `on-surface`).

## Suggested skill behavior (confirmed useful here)

- Start from the role vocabulary above as a default ontology; extend when a pairing has no fitting
  role.
- Derive light mapping by picking a palette entry per role at the opposite lightness pole.
- Audit every enumerated pairing in both schemes; auto-fix sub-threshold by re-mapping the role.
- Record the role→palette decisions + measured contrast (the scheme-policy file).
- Verify visually via fresh loads (localStorage preset), never live toggling.

## Three color sources (the audit must cover all)

Color assignments enter the page from three places, not one:

1. **Theme code** — `theme.json` `styles` and client SCSS. Fully rewritable to `--brk-color-*`.
2. **Block markup attributes** — colors baked into template parts, patterns, and user posts (e.g.
   `parts/footer.html` had `"color":{"text":"var:preset|color|gray-400"}` → inline
   `style="color:var(--wp--preset--color--gray-400)"`). These are **frozen palette refs**; with a
   constant palette they do not flip → unreadable in the opposite scheme.
3. **The `var:custom|…` bridge** — the only way to make a *markup-set* color flip. `--brk-color-*` is
   not referenceable from block markup (no `var:brk|…` notation). Wrapping a role as a custom token
   exposes it as `var:custom|color|…`.

Only a **rendered-page audit** (computed colors in both schemes) catches source #2 — scanning
`theme.json` + SCSS alone reports a false all-clear.

## The `var:custom` bridge — flippable, markup-referenceable colors

To make a markup-colored element flip, define a custom token whose **value aliases a `--brk-` role**
(never a literal), then reference it from markup. Worked example (footer copyright):

```jsonc
// theme.json → settings.custom.color
"footer": {
  "copyright": "var(--brk-color-on-surface-muted)",
  "border":    "var(--brk-color-border)"
}
```
emits `--wp--custom--color--footer--copyright: var(--brk-color-on-surface-muted)` at `:root`, which
flips because the value indirects to a `--brk-` role (settings text stays scheme-invariant).

```html
<!-- parts/footer.html: var:preset|… → var:custom|… -->
"color":{"text":"var:custom|color|footer|copyright"}
style="color:var(--wp--custom--color--footer--copyright)"
```
Verified light: copyright/links resolve to `gray-600` (7.49:1) instead of frozen `gray-400` (2.42:1).

**Trap:** if the custom token's value is a literal (`hsl(...)`) instead of a `var(--brk-…)` alias, it
will NOT flip. Detecting that is the skill's job (see below).

**Gotcha — `elements.link` doesn't apply to links in static template parts.** Setting a link color via
a paragraph block's `elements.link.color.text` in a template-part `.html` file does **not** color the
links: the `wp-elements`/`has-link-color` machinery is absent in the saved static markup, so the
global reset `:where(p.has-text-color:not(.has-link-color)) a { color: inherit }` wins and links
inherit the paragraph text color. Style such links in **SCSS** instead, referencing the bridge token
(e.g. `.burokku-footer-copyright a { color: var(--wp--custom--color--footer--link) }`). Example: the
footer gives copyright text a muted token and its links an explicit `on-surface` token, so links read
brighter than the surrounding text and both still flip.

## Why color *flipping* was rejected (for context)

The earlier "flip palette lightness" model fails for any real palette:
1. Semantic drift — a "white"/"red-500" swatch stops meaning that.
2. Chromatic distortion — flipping `L` of a saturated color yields a different shade (red-500 60%→40%).
3. Broken pairings — independently flipped tokens lose designed contrast relationships.
4. Brand inconsistency — a brand color should be identical in both schemes.
5. Wrong for semantic colors — success-green / error-red shouldn't invert on a whim.
6. No generalization — coherent only for a pure neutral ramp.
7. UX — editor swatches visibly shift mid-preview.

Hence: keep the palette fixed, flip **roles** (the `--brk-` model), expose to markup via `var:custom`.

## The "non-flip detector" heuristic (key skill mechanism)

Render both schemes and flag any element whose **fg or bg resolves to the same color in dark and
light**. One check catches the whole family: literal-in-a-custom-token (the trap), frozen
`var:preset|…` picks in markup (the footer), and anything else that should flip but doesn't.
"Constant across schemes + failing/low contrast in one" = strong candidate for "make this a `--brk-`
role / `var:custom` alias."

## Source-aware triage (what the skill may auto-do vs flag)

- **Theme code** (`theme.json`/SCSS) → rewrite the literal/frozen ref to a `--brk-` alias.
- **Theme markup** (templates/parts/patterns) → propose `var:preset|… → var:custom|…` (the bridge)
  or strip the color; reviewer ratifies.
- **User content** (posts/pages) → **flag only** — the author chose that color on purpose.

Loop: **detect non-flip → propose semantic fix + contrast evidence → reviewer ratifies** (recorded in
the scheme-policy). No live agent on the production instance — this is a developer-time helper that
hands over a reviewed diff.

## Model boundary (stated plainly)

- **Code-controlled color** → flippable via `--brk-` (and exposable to markup via `var:custom`).
- **Editor/markup color picks** → frozen by nature (the picker serializes constant palette refs).
  Theme-owned markup should express intent via `var:custom` tokens or classes, not raw color picks;
  user content stays as authored.
- WordPress has **one active global-styles state**; "edit a second scheme and store it without
  activating it in production" is not native (would need custom Gutenberg data/save interception —
  deferred, likely a separate plugin/custom page).

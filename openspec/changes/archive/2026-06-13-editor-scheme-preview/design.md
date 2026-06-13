## Context

Front-end scheme switching is driven by the `theme-toggle` block's `viewScriptModule`
(`sources/blocks/theme-toggle/view.js`), which sets `data-theme` on `<html>` and persists the
choice in `localStorage["burokku-theme"]` per the `theme-state` contract. The flattened scheme
stylesheet (`dist/styles/color-scheme.css`) carries the base dark values on `:root` and the derived
light values under `[data-theme="light"]`; it is added to the editor canvas via `add_editor_style`
in `sources/server/Theme/Styles.php` (it must therefore be built — `pnpm build:color-scheme`
produces `dist/styles/color-scheme.css`; a missing file silently disables the preview). Nothing sets
the `data-theme` attribute in the editor, because the block renders via `ServerSideRender` (inert
button, no interactivity directives) and the view module never loads in the editor.

Unlike the front end, the editor canvas is **not** styled off `<html>` alone: WordPress re-emits the
theme.json preset custom properties (`--wp--preset--color--*`) on the `.editor-styles-wrapper`
element (the canvas `<body>`). A `[data-theme="light"]` override placed on the ancestor `<html>` is
shadowed by those wrapper-scoped declarations for everything inside, so the light values do not
resolve unless the attribute is also present on `.editor-styles-wrapper`. (Verified empirically:
`data-theme="light"` on `<html>` → no color change; on `.editor-styles-wrapper` → light tokens
resolve.)

The block editor renders content in an iframe (`iframe[name="editor-canvas"]`) in both the post and
site editors on current WordPress; the iframe can remount on device-preview/zoom/resize changes.
Some contexts (e.g. legacy/non-iframed canvas) render in the main document instead.

## Goals / Non-Goals

**Goals:**
- Let an editor flip the canvas color scheme in the post and site editors via a More-menu item and
  a keyboard shortcut.
- Reuse the existing `theme-state` (`data-theme`, `burokku-theme`) and `color-scheme-delivery`
  contracts without modifying them.
- Keep the feature strictly editor-only.

**Non-Goals:**
- No change to front-end rendering, the `theme-toggle` block, or `theme.json`.
- No new no-flash guarantee or server-side scheme logic.
- No per-block or per-template persistence of the previewed scheme (it is a transient editor
  preference, persisted only via the shared `burokku-theme` key).

## Decisions

### Single editor plugin via `registerPlugin`, More-menu only
Register one plugin (`burokku/scheme-preview`) with `registerPlugin` from `@wordpress/plugins`,
rendering a `PluginMoreMenuItem` from `@wordpress/editor` (the unified package that mounts in both
post and site editors on supported WP versions). No `PluginSidebar`, no
`PluginDocumentSettingPanel`. **Why `@wordpress/editor` over `@wordpress/edit-post`:** the unified
`@wordpress/editor` slots render in both editors, avoiding two separate registrations.

### Apply scheme by writing `data-theme` to both the canvas root and the styles wrapper
A helper resolves the canvas document: prefer `document.querySelector('iframe[name="editor-canvas"]').contentDocument`,
fall back to `document`. It then sets `data-theme` on **both** that document's `documentElement`
(front-end parity, and the toggle block's `:root[data-theme]` icon rules) **and** its
`.editor-styles-wrapper` element. The wrapper target is required: WordPress emits the theme.json
preset variables on `.editor-styles-wrapper`, so an override only on `<html>` is shadowed and the
light tokens never resolve (see Context). This still reuses the exact signal `color-scheme.css` keys
off — no new CSS, no new selector. **Why not manipulate the block's `ServerSideRender`:** the post
editor has no `theme-toggle` block in its content, so a block-scoped approach cannot cover the post
editor.

### Re-apply on canvas remount
The active scheme is held in editor state (a small module-level store or a React state in the
plugin component) and re-applied via an effect that also observes canvas replacement. Approach: a
`MutationObserver` on the editor root (or a short polling guard) that re-applies `data-theme` when a
new `iframe[name="editor-canvas"]` appears, plus re-apply on the WordPress device-preview store
change. **Why:** the iframe `contentDocument` is recreated on device-preview/zoom changes, dropping
any attribute previously set on it.

### Keyboard shortcut via `@wordpress/keyboard-shortcuts`
Register the shortcut with `store` `core/keyboard-shortcuts` so it appears in the editor's
keyboard-shortcuts help and binds in both editors. Requested combination is **⌘⌃M**. The WP
registry uses *named* modifiers (`primary`=⌘/Ctrl, `primaryShift`, `primaryAlt`, `secondary`,
`access`=⌃⌥ on macOS, `ctrl`, `ctrlShift`, `alt`); **⌘+⌃ is not a named modifier**, so ⌘⌃M cannot
be expressed through the standard `registerShortcut` keyCombination and would require a custom
`keydown` listener that checks `metaKey && ctrlKey`. See Open Questions — default plan is to attempt
⌘⌃M via a custom listener and fall back to `access+m` (⌃⌥M on macOS, ⇧⌥M on Windows) registered the
standard way if the custom combo proves brittle or conflicts.

### Initialization from `theme-state` resolution
On plugin mount, read `localStorage["burokku-theme"]`; if absent, fall back to
`prefers-color-scheme` then `dark`, matching the front-end precedence. Apply the resolved scheme to
the canvas immediately and persist only explicit toggles (the same rule as front end: system-derived
default is not written).

### Build & enqueue
Add an explicit entry `editor/scheme-preview` to the `scriptsConfig` in
`webpack.modules.config.js` (wrapping the existing entry function so block entries are preserved),
output under `dist/modules/editor/`. Enqueue the built `index.js` (with its generated
`index.asset.php` dependency array) on `enqueue_block_editor_assets` from a server module — either a
new small `Theme\EditorScripts` module or an addition to `Theme\Styles`/`Blocks`.

## Risks / Trade-offs

- **Relying on `iframe[name="editor-canvas"]`** → internal-ish selector that could change across WP
  versions. Mitigation: fallback to `document`, and isolate the lookup in one helper so a future
  change is a one-line fix.
- **⌘⌃M unsupported by the named-modifier registry** → handled as an Open Question; fallback
  `access+m` keeps the keyboard path working.
- **⌘⌃M collisions** (browser/OS bindings on macOS) → if it intercepts or conflicts, fall back to
  the registered `access+m`.
- **Canvas remount races** (observer fires before `contentDocument` ready) → re-apply is idempotent
  and guarded; retry on the iframe `load` event.
- **Persisting to `burokku-theme` from the editor** affects the front-end resolution for that
  browser. This is intended (preview matches front end) but is a shared-key side effect worth noting.

## Open Questions

- **Keyboard combination** — *Resolved.* `access+m` (⌃⌥M) is the canonical binding, registered
  through `registerShortcut`/`useShortcut` so it appears in the editor shortcuts help. ⌘⌃M is also
  honored via a custom `keydown` listener (bound on the top document and the canvas document). Both
  paths call the same toggle; verified in the post editor (⌘⌃M and ⌃⌥M each flip the canvas, the
  help modal lists "Toggle the previewed color scheme.", and the menu item shows ⌃⌥M). No conflict
  with the core ⇧⌥⌘M (visual/code editor) binding.
- **Server module placement**: new `Theme\EditorScripts` module vs. extending `Theme\Styles`. Lean
  toward a dedicated module for separation; confirm at apply time.

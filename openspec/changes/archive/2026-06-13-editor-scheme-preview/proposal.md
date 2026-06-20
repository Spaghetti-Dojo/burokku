## Why

The light/dark color scheme can only be flipped on the front end (via the `theme-toggle`
block's `viewScriptModule`). Inside the post and site editors the toggle renders as an inert
`ServerSideRender` button, so an editor cannot preview how content reads under the opposite
scheme before publishing. The light custom properties are already loaded into the editor canvas
(`color-scheme.css` is added via `add_editor_style`); the only missing piece is a way to set the
`data-theme` signal on the canvas document.

## What Changes

- Add an editor-only control that flips the active color scheme inside the editor canvas for both
  the post editor and the site editor.
- Surface the control as a **More-menu (⋮ options) item only** — no pinned sidebar, no toolbar
  button.
- Register a **keyboard shortcut** to toggle the scheme without the mouse (requested ⌘⌃M, with a
  documented fallback if that modifier combination is unsupported or conflicts — see open
  question).
- Apply the scheme by setting `data-theme` on the canvas iframe's `<html>`
  (`iframe[name="editor-canvas"]`), falling back to the current document for non-iframed editors,
  and re-applying when the canvas remounts (device preview, resize, editor switch).
- Mirror the editor's chosen scheme to `localStorage["burokku-theme"]` so editor preview honors
  the same persistence key as the front end.
- No front-end behavior changes; the existing `theme-toggle` block, `theme-state`, and
  `color-scheme-delivery` are reused, not modified.

## Capabilities

### New Capabilities
- `editor-scheme-preview`: The editor-only behavior for previewing the active color scheme in the
  post and site editor canvas — the More-menu affordance, the keyboard shortcut, how `data-theme`
  is applied to the canvas document and kept applied across canvas remounts, and how the choice
  reuses the `theme-state` persistence contract.

### Modified Capabilities
<!-- None. theme-state, color-scheme-delivery, and theme-toggle-block are reused unchanged. -->

## Impact

- **New client code**: an editor plugin (e.g. `sources/editor/scheme-preview/`) registered via
  `registerPlugin`, using `@wordpress/editor` (`PluginMoreMenuItem`), `@wordpress/keyboard-shortcuts`,
  and `@wordpress/element`.
- **Build**: a new explicit entry in `webpack.modules.config.js` (output under `dist/modules/editor/`).
- **Server**: enqueue the built editor script on `enqueue_block_editor_assets` (new or extended
  Theme module); reuses the existing `add_editor_style` registration for `color-scheme.css`.
- **Reused contracts**: `theme-state` (`data-theme`, `burokku-theme`), `color-scheme-delivery`
  (scoped `[data-theme="light"]` custom properties already in the canvas).
- **No impact** on front-end rendering, the `theme-toggle` block, or `theme.json` tokens.

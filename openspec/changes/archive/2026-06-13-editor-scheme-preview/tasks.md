## 1. Client plugin scaffold

- [x] 1.1 Create `sources/editor/scheme-preview/index.tsx` registering `burokku/scheme-preview` via `registerPlugin`
- [x] 1.2 Add a canvas-document helper that resolves `iframe[name="editor-canvas"]`.contentDocument with fallback to `document`
- [x] 1.3 Add an apply helper that sets/removes `data-theme` (`light`/`dark`) on the resolved document's `documentElement`

## 2. Scheme state & persistence

- [x] 2.1 Initialize the editor scheme from `theme-state` precedence: `localStorage["burokku-theme"]` → `prefers-color-scheme` → `dark`
- [x] 2.2 On toggle, flip the scheme, apply to the canvas, and persist explicit choices to `localStorage["burokku-theme"]`
- [x] 2.3 Re-apply `data-theme` on canvas remount (MutationObserver for new `editor-canvas` iframe + iframe `load`, and device-preview store changes)

## 3. UI affordance

- [x] 3.1 Render a `PluginMoreMenuItem` (`@wordpress/editor`) with a label reflecting the target scheme; wire its click to the toggle
- [x] 3.2 Verify the item appears in both post and site editor ⋮ menus and that no sidebar/panel/toolbar button is added

## 4. Keyboard shortcut

- [x] 4.1 Attempt ⌘⌃M via a custom `keydown` listener (metaKey && ctrlKey && key === 'm'); ensure it toggles identically to the menu item
- [x] 4.2 Register the canonical shortcut in `core/keyboard-shortcuts` so it shows in the editor shortcuts help (use `access+m` fallback if ⌘⌃M conflicts/unreliable — resolve the design Open Question here)
- [x] 4.3 Confirm menu-item label and shortcut stay in sync after toggling via either path

## 5. Build wiring

- [x] 5.1 Add an explicit `editor/scheme-preview` entry to `scriptsConfig` in `webpack.modules.config.js`, preserving existing block entries, output under `dist/modules/editor/`
- [x] 5.2 Build and verify `dist/modules/editor/scheme-preview/index.js` + `index.asset.php` are produced

## 6. Server enqueue

- [x] 6.1 Enqueue the built editor script on `enqueue_block_editor_assets` using its `index.asset.php` dependencies/version (dedicated `Theme\EditorScripts` module or extend `Theme\Styles`)
- [x] 6.2 Wire the new module into `Theme\Module::run()` if a dedicated module is used
- [x] 6.3 Confirm the script loads only on editor screens and not on the front end

## 7. Verification

- [x] 7.1 Post editor: toggle via menu and shortcut flips canvas between light/dark; light custom properties resolve from the already-loaded `color-scheme.css`
- [x] 7.2 Site editor: same toggle behavior in the canvas
- [x] 7.3 Switch device preview / resize and confirm the previewed scheme is re-applied to the new canvas
- [x] 7.4 Confirm `localStorage["burokku-theme"]` reflects explicit choices and front-end rendering/`theme-toggle` are unchanged

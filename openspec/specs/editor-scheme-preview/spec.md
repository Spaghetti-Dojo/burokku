# editor-scheme-preview Specification

## Purpose

Lets an editor preview the light/dark color scheme inside the block-editor canvas (post and site
editors) without leaving the editor. Editor-only: it reuses the `theme-state` `data-theme` signal
and `burokku-theme` persistence key and the `color-scheme-delivery` stylesheet, adding no new CSS
and changing nothing on the front end. It owns only the editor affordance (a More-menu item plus a
keyboard shortcut) and the act of writing `data-theme` onto the canvas.
## Requirements
### Requirement: Editor exposes a color-scheme preview affordance

The editor SHALL expose a single affordance to flip the active color scheme inside the editor
canvas, available in both the post editor and the site editor. The affordance SHALL be presented
as a More-menu (⋮ options) item only — it SHALL NOT add a pinned sidebar, a document settings
panel, or a header toolbar button. The menu item label SHALL reflect the scheme it switches to
(e.g. "Preview light scheme" when dark is active, and the inverse when light is active).

#### Scenario: More-menu item present in the post editor

- **WHEN** the post editor is open and the ⋮ options menu is expanded
- **THEN** a color-scheme preview item is listed
- **AND** no pinned sidebar button, document settings panel, or toolbar button is added by this
  capability

#### Scenario: More-menu item present in the site editor

- **WHEN** the site editor is open and the ⋮ options menu is expanded
- **THEN** the same color-scheme preview item is listed

#### Scenario: Item label reflects the target scheme

- **WHEN** the active editor scheme is `dark`
- **THEN** the menu item invites switching to the light scheme
- **WHEN** the active editor scheme is `light`
- **THEN** the menu item invites switching to the dark scheme

### Requirement: Keyboard shortcut toggles the preview

The capability SHALL register a keyboard shortcut that flips the active editor scheme without using
the mouse, registered through the WordPress keyboard-shortcuts system so it is discoverable in the
editor's keyboard-shortcuts help and active in both editors. The shortcut SHALL toggle the scheme
identically to activating the More-menu item.

#### Scenario: Shortcut flips the scheme

- **WHEN** the editor has focus and the registered shortcut is pressed
- **THEN** the active editor scheme flips between `light` and `dark`
- **AND** the canvas reflects the new scheme

#### Scenario: Shortcut and menu item stay in sync

- **WHEN** the scheme is flipped via the keyboard shortcut
- **THEN** the More-menu item label updates to reflect the new active scheme
- **AND** flipping via the menu item produces the same result as the shortcut

### Requirement: Scheme is applied to the editor canvas document

The active editor scheme SHALL be applied by setting the `data-theme` attribute (`light` or `dark`)
on the canvas document, per the `theme-state` contract. When the canvas is rendered in an iframe, the
attribute SHALL be set on the iframe document (`iframe[name="editor-canvas"]`); when the canvas is not
iframed, it SHALL be set on the editor's own document. Because the scheme now swaps only the theme's
own `--brk-color-*` semantic variables — which WordPress does NOT re-emit on `.editor-styles-wrapper`
(unlike palette preset variables) — the attribute SHALL be set on the canvas document root (`<html>`)
alone; a separate override on `.editor-styles-wrapper` is no longer required. The capability SHALL NOT
redefine the `data-theme` signal, its values, or the scoped custom properties — those remain owned by
`theme-state` and `color-scheme-delivery`.

#### Scenario: Attribute set on the iframe canvas

- **WHEN** the scheme is set to `light` and the canvas is iframed
- **THEN** the iframe document's `<html>` carries `data-theme="light"`
- **AND** the canvas renders with the light `--brk-color-*` mapping delivered by
  `color-scheme-delivery`

#### Scenario: Fallback to the non-iframed document

- **WHEN** the canvas is not rendered in an iframe
- **THEN** `data-theme` is set on the editor's own document root instead

#### Scenario: No wrapper-level override needed

- **WHEN** the scheme is applied
- **THEN** the light tokens resolve for content inside `.editor-styles-wrapper` without setting
  `data-theme` on the wrapper element, because the swapped variables are not shadowed by WordPress'
  preset re-emission

### Requirement: Applied scheme survives canvas remounts

The active editor scheme SHALL be re-applied whenever the canvas document is replaced (e.g. device
preview changes, viewport resize, or switching between editors), so the previewed scheme is not
lost when the canvas remounts.

#### Scenario: Device preview change preserves the scheme

- **WHEN** the editor scheme is `light` and the user switches the canvas device preview (remounting
  the iframe)
- **THEN** the new canvas document is set to `data-theme="light"`

### Requirement: Editor choice reuses the theme-state persistence key

The editor preview choice SHALL be written to `localStorage["burokku-theme"]` with a value of
`light` or `dark`, reusing the `theme-state` persistence contract, so the previewed scheme aligns
with the front-end resolution. On load, the capability SHALL initialize the editor scheme from the
`theme-state` resolution precedence (persisted `burokku-theme` → system preference → `dark`
default).

#### Scenario: Choice is persisted under the shared key

- **WHEN** the editor scheme is flipped to `light`
- **THEN** `localStorage["burokku-theme"]` holds `light`

#### Scenario: Initial editor scheme follows theme-state resolution

- **WHEN** the editor loads and `localStorage["burokku-theme"]` is `light`
- **THEN** the initial editor scheme is `light` and the canvas is set accordingly

### Requirement: No front-end behavior change

This capability SHALL be editor-only. It SHALL NOT alter front-end rendering, the `theme-toggle`
block, or `theme.json` tokens, and its script SHALL be enqueued only on block-editor screens.

#### Scenario: Script loads only in the editor

- **WHEN** a front-end page renders
- **THEN** the editor preview script is not enqueued
- **AND** the `theme-toggle` block and front-end scheme delivery behave exactly as before


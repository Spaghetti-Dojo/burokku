## MODIFIED Requirements

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

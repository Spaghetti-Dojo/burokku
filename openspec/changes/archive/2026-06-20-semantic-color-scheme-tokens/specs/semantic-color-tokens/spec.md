## ADDED Requirements

### Requirement: Palette is scheme-invariant

The theme SHALL keep the `theme.json` `settings` color tokens (`color.palette`, `color.gradients`,
`color.duotone`, and `custom.color`) identical across color schemes. No scheme SHALL redefine, flip,
or otherwise alter a palette/custom/gradient/duotone value; they remain the global, editor-selectable
colors regardless of the active style or `data-theme` value.

#### Scenario: A palette swatch means the same color in both schemes

- **WHEN** a swatch (e.g. `white`, `red-500`, or a custom color) is selected in the editor
- **THEN** it resolves to the same color value whether the active scheme is dark or light
- **AND** no `[data-theme]` scope redeclares any `--wp--preset--color--*`, `--wp--preset--gradient--*`,
  `--wp--preset--duotone--*`, or `--wp--custom--color--*` variable

### Requirement: Semantic role tokens prefixed `--brk-color-*`

The theme SHALL define a semantic color layer using custom properties prefixed `--brk-color-`
covering the element roles in use (at minimum `surface`, `on-surface`, `accent`, `on-accent`,
`link`, `link-hover`, `border`). Each `--brk-color-*` token SHALL be assigned a palette variable
reference (`var(--wp--preset--color--*)` or `var(--wp--custom--color--*)`) and SHALL NOT be assigned
a color literal, so the palette remains the single source of color values.

#### Scenario: Each semantic token references a palette variable

- **WHEN** the color-scheme stylesheet is inspected
- **THEN** every `--brk-color-*` declaration's value is a `var(--wp--preset--color--*)` or
  `var(--wp--custom--color--*)` reference
- **AND** no `--brk-color-*` declaration contains an `hsl()`, `rgb()`, hex, or other color literal

### Requirement: Element styles reference only semantic tokens

The theme SHALL assign element colors in `theme.json` `styles` using only `var(--brk-color-*)`
tokens — covering background, text, button color and `:hover`, link and `:hover`, headings, and
block borders — and SHALL NOT reference raw palette/custom variables there, so the active scheme is
determined entirely by the semantic mapping.

#### Scenario: No style assignment uses a raw palette variable

- **WHEN** `theme.json` `styles` color values are inspected
- **THEN** each color assignment is a `var(--brk-color-*)` reference (or `currentColor`)
- **AND** no `styles` color assignment references `--wp--preset--color--*` or `--wp--custom--color--*`
  directly

### Requirement: Scheme mapping is authored, not derived

The dark and light semantic mappings SHALL be authored in SCSS (`:root` for the dark base,
`[data-theme="light"]` for the light counterpart) and compiled by the existing styles build into the
delivered color-scheme stylesheet. The light mapping SHALL NOT be produced by a runtime or build-time
palette-derivation algorithm.

#### Scenario: Both mappings exist as authored declarations

- **WHEN** the compiled color-scheme stylesheet is inspected
- **THEN** `:root` declares the dark `--brk-color-*` mapping
- **AND** `[data-theme="light"]` declares the light `--brk-color-*` mapping
- **AND** the light values come from authored source, not a generated `light.json`

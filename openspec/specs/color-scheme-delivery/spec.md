# color-scheme-delivery

## Purpose

Runtime delivery of both color schemes: the scoped CSS structure (`:root` vs
`[data-theme="light"]`), the document `color-scheme` flag, both schemes loaded with attribute-only
selection, per-scheme translucent surfaces via `light-dark()`, and toggle integration.

## Requirements

### Requirement: Flatten both schemes into a single scoped stylesheet

Both schemes SHALL be delivered in a single stylesheet in which the base (dark) values remain under
`:root` and the derived light values are emitted under the `[data-theme="light"]` selector, using
the WordPress custom-property names that correspond to each token (`--wp--preset--color--*`,
`--wp--preset--gradient--*`, `--wp--preset--duotone--*`, `--wp--custom--color--*`) so existing SCSS
usages resolve to the active scheme's value with no SCSS change. (The output file and its generation
are mechanism — see `docs/build-and-registration.md`.)

#### Scenario: Light values are scoped, dark stays on :root

- **WHEN** the stylesheet is generated
- **THEN** `[data-theme="light"]` contains a custom-property declaration for each derived token
- **AND** the base dark values are not redeclared (they remain whatever `:root` already provides)

#### Scenario: Variable names match the consuming SCSS

- **WHEN** client SCSS reads `var(--wp--preset--color--red-700)`
- **THEN** the `[data-theme="light"]` block declares `--wp--preset--color--red-700` so existing
  usages resolve to the light value with no SCSS change

### Requirement: Both schemes are always loaded; toggle selects via attribute only

The flattened scheme stylesheet SHALL be enqueued on every page so both schemes are present at load
time, and the active scheme SHALL be selected solely by the `data-theme` attribute on the document
root — without fetching additional stylesheets or causing layout reflow on toggle.

#### Scenario: Stylesheet is enqueued

- **WHEN** a front-end page renders
- **THEN** the flattened scheme stylesheet is enqueued on the page

#### Scenario: Toggling theme flips colors without a network request

- **WHEN** the header toggle sets `data-theme="light"` on `<html>`
- **THEN** the light custom properties apply immediately
- **AND** no additional stylesheet is fetched
- **AND** removing or setting `data-theme="dark"` restores the `:root` (dark) values

### Requirement: Reuse existing toggle without modification

Scheme delivery SHALL integrate with the existing `theme-toggle` block via the `theme-state`
contract — the `data-theme` attribute on `<html>` — without changing the toggle's UI or
storage, and without redefining that attribute or its values (owned by `theme-state`). The
toggle applies the active scheme client-side after hydration; scheme delivery makes no
no-flash guarantee.

#### Scenario: Existing toggle drives scheme selection

- **WHEN** the user activates the existing header toggle
- **THEN** the `data-theme` attribute changes between `light` and `dark` per the `theme-state`
  contract
- **AND** the scheme stylesheet responds to that attribute with no changes to the toggle code

### Requirement: Translucent surfaces adapt opacity per scheme

The delivery SHALL set the CSS `color-scheme` property on the document root to match the active
scheme (`dark` by default, `light` under `[data-theme="light"]` and the
`prefers-color-scheme: light` fallback when not explicitly dark) so that `light-dark()` resolves
correctly. Translucent surfaces (e.g. the sticky/fixed header backdrop) SHALL express their
per-scheme alpha through `light-dark()` rather than a fixed opacity, keeping content below legible
in light without a hand-authored per-scheme override.

#### Scenario: color-scheme flag follows the active scheme

- **WHEN** `data-theme="light"` is set on `<html>` (or the system prefers light and no explicit dark
  is set)
- **THEN** the document root computes `color-scheme: light`
- **AND** otherwise it computes `color-scheme: dark`

#### Scenario: Header backdrop opacity flips with the scheme

- **WHEN** the header backdrop renders under the light scheme
- **THEN** its background alpha resolves to the light branch of `light-dark()` (40%)
- **AND** under the dark scheme it resolves to the dark branch (80%)
- **AND** no scheme-specific SCSS override is required

#### Scenario: Hover state layer stays perceptible in both schemes

- **WHEN** a filled button is hovered
- **THEN** the surface overlays a non-flipping `light-dark(black, white)` ink — darkening light
  surfaces, lightening dark ones
- **AND** the hover surface moves away from the page background in both schemes (no blend) while
  preserving text contrast

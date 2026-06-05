# color-scheme-generation

## Purpose

Build-time derivation of the opposite color scheme from `theme.json` tokens: transform rules, token-class coverage, the intermediate reviewable `light.json`, and the CSS output contract — so a light scheme stays in sync with `theme.json` as the single source of truth without hand-maintained duplication.

## Requirements

### Requirement: Derive opposite scheme from theme.json color tokens
The generator SHALL read every color token from `theme.json` — palette (`settings.color.palette`), gradients (`settings.color.gradients`), duotones (`settings.color.duotone`), and `settings.custom.color` — and derive the opposite color scheme without any hand-maintained per-token duplication.

#### Scenario: All color token classes are covered
- **WHEN** the generator runs against `theme.json`
- **THEN** it produces a derived value for every literal color in the palette, gradient stops, duotone color arrays, and `custom.color` literals
- **AND** no token class is silently skipped

#### Scenario: theme.json is the only source of truth
- **WHEN** a color token is added, removed, or changed in `theme.json`
- **AND** the generator is re-run
- **THEN** the derived scheme reflects the change with no other manual edit required

### Requirement: Transform lightness only, preserving hue, saturation, and alpha
For every transformed literal color, the generator SHALL preserve the hue, saturation, and alpha channels and modify only the lightness channel.

#### Scenario: Hue and saturation survive transformation
- **WHEN** a chromatic token `hsl(221.2 83.2% 53.3%)` is transformed
- **THEN** the derived value keeps hue `221.2` and saturation `83.2%`
- **AND** only the lightness differs

#### Scenario: Alpha is preserved on tinted tokens
- **WHEN** a token carries an alpha component (e.g. a `*-500-50` tint)
- **THEN** the derived value retains the same alpha

### Requirement: Exclude fixed/brand colors from the derived light scheme
The generator SHALL omit any token whose slug/key is listed in the exclude config from the derived light scheme entirely, emitting no declaration for it in `styles/light.json` or the scoped `[data-theme="light"]` CSS. The light layer is a delta over the base (`:root`) scheme, so an omitted token inherits its base value in both schemes. This keeps fixed/brand colors identical across schemes AND lets WordPress Global Styles user customizations (which land on `:root`) take effect — a redeclared value in the light layer would otherwise shadow them. The exclude list is declarative config (a top-level `exclude` array in `overrides.json`).

#### Scenario: Excluded brand color is omitted and stays customizable
- **WHEN** `theme-accent` is in the exclude list and the generator runs
- **THEN** `styles/light.json` contains no `theme-accent` palette entry
- **AND** the scoped light CSS emits no `--wp--preset--color--theme-accent` declaration
- **AND** in light mode `theme-accent` resolves to the base `:root` value, including any Global Styles user customization

### Requirement: Resolve each token by precedence — expression, curated step-swap, formula mirror
For each literal token the generator SHALL apply, in order: (1) if the value is a `var()` or `color-mix()` expression, emit it unchanged; (2) else if the token is a chromatic ramp member with a sibling `-700`/`-300` in the palette, swap the step (`-700`↔`-300`, `-500` maps to itself) using the sibling's curated value; (3) else mirror lightness as `L' = 100 − L`.

#### Scenario: Expression tokens pass through unchanged
- **WHEN** a token value is `color-mix(in oklab, var(--wp--preset--color--theme-accent) 100%, var(--wp--preset--color--black) var(--wp--custom--mod--amount))`
- **THEN** the generator emits the value unchanged so it inherits its flipped referents

#### Scenario: Chromatic ramp tokens reuse curated sibling values
- **WHEN** transforming `red-700`
- **THEN** the derived value equals the curated value of `red-300`
- **AND** `red-500` maps to its own value
- **AND** `red-300` maps to the curated value of `red-700`

#### Scenario: Orphan literals fall back to the mirror formula
- **WHEN** transforming a literal with no `-700`/`-300` sibling (e.g. `gray-950` at L 3.9%)
- **THEN** the derived lightness equals `100 − 3.9 = 96.1%`
- **AND** hue and saturation are unchanged

### Requirement: Transform composite tokens per constituent literal
The generator SHALL transform gradients by applying the per-token rule to each literal color stop within the `linear-gradient(...)` while preserving stop positions, and SHALL transform duotones by applying the rule to each color in the array while preserving array order and length.

#### Scenario: Gradient stops are transformed individually
- **WHEN** transforming a gradient `linear-gradient(90deg, hsl(0 0% 25.1%) 0%, hsl(0 0% 89.8%) 100%)`
- **THEN** each stop color is transformed (to `hsl(0 0% 74.9%)` and `hsl(0 0% 10.2%)`)
- **AND** the `0%`/`100%` positions and gradient direction are preserved

#### Scenario: Duotone color pairs are transformed in place
- **WHEN** transforming a duotone `["hsl(0 0% 3.9%)", "hsl(0 0% 98%)"]`
- **THEN** each color is mirrored to `["hsl(0 0% 96.1%)", "hsl(0 0% 2%)"]`
- **AND** the array length and order are preserved

### Requirement: Emit a reviewable intermediate light.json with hand-override support
The generator SHALL write the derived values to `styles/light.json` in a structure mirroring the `theme.json` color shape, and SHALL merge any human-provided override values over the computed values so hand-tuned colors survive regeneration.

#### Scenario: light.json is regenerated deterministically
- **WHEN** the generator runs twice with no input change
- **THEN** the produced `styles/light.json` is byte-identical between runs

#### Scenario: Overrides take precedence over computed values
- **WHEN** an override is provided for a specific token (e.g. `gray-500`)
- **AND** the generator runs
- **THEN** `styles/light.json` contains the override value for that token
- **AND** all non-overridden tokens retain their computed values

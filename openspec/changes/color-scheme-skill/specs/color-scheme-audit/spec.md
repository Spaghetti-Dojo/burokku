## ADDED Requirements

### Requirement: Enumerate element color pairings

The audit tool SHALL read `theme.json` `styles` and enumerate the foreground/background color
pairings that determine readability — at minimum: page background vs text, each button variant's
background vs text (default and `:hover`), link vs its surrounding surface (default and `:hover`),
heading vs surface, and block borders vs adjacent surface (`core/quote`, `core/accordion`). Each
pairing SHALL record the element role and the two `--brk-color-*` tokens involved.

#### Scenario: Button hover pairing is enumerated

- **WHEN** the tool runs against a `theme.json` whose button uses `var(--brk-color-accent)` background
  and `var(--brk-color-on-accent)` text with a `:hover` variant
- **THEN** the output includes a pairing for the button default state and one for its `:hover` state
- **AND** each names the foreground and background `--brk-color-*` tokens

### Requirement: Resolve variables and color-mix to literal colors

For a given scheme mapping, the tool SHALL resolve each pairing's tokens to a concrete color by
following `var()` chains (`--brk-color-*` → palette variable → literal) and by computing
`color-mix()` expressions, so contrast can be measured on real resolved colors.

#### Scenario: color-mix is resolved, not skipped

- **WHEN** a token resolves to `color-mix(in oklab, var(--a) 100%, var(--b) 30%)`
- **THEN** the tool computes the mixed literal color from the resolved operands
- **AND** does not skip or pass the expression through unmeasured

#### Scenario: Unresolved reference is reported, not silently dropped

- **WHEN** a token references a variable that is not defined in the active mapping or palette
- **THEN** the tool reports the pairing as unresolved with the offending reference
- **AND** does not emit a contrast number for it

### Requirement: Report WCAG contrast per pairing per scheme

The tool SHALL compute the WCAG 2.x contrast ratio for each resolved pairing in each scheme (dark and
light) and SHALL flag pairings that fall below a configurable threshold (default: AA, 4.5:1 for normal
text). Output SHALL be machine-readable.

#### Scenario: Failing pairing is flagged

- **WHEN** a light-scheme pairing resolves to a 3.07:1 ratio
- **THEN** the tool marks that pairing as failing the AA threshold
- **AND** includes the role, scheme, resolved colors, and ratio in the output

### Requirement: Enumerate pairings from the rendered page, across all color sources

The audit tool SHALL derive pairings from the rendered page's computed styles, not from `theme.json`
and SCSS alone, so it covers all three color sources: theme code (`theme.json` `styles` / SCSS),
block-markup attributes (template parts, patterns, posts), and `var:custom` bridge tokens. Auditing
only the code sources SHALL NOT be considered complete.

#### Scenario: A color frozen in block markup is audited

- **WHEN** a template part sets a paragraph color via a block attribute (e.g.
  `var:preset|color|gray-400`) that is not present in `theme.json` `styles` or SCSS
- **THEN** the tool still enumerates that element's pairing from the rendered page
- **AND** reports its contrast in both schemes

### Requirement: Detect colors that do not flip between schemes

The audit tool SHALL flag any element whose foreground or background resolves to the **same** color
in both the dark and light schemes ("non-flip"), since such a value is a frozen literal or constant
palette reference where a scheme-relative value is expected. Non-flip detection SHALL be reported
even when the constant value passes contrast in one scheme.

#### Scenario: A constant-across-schemes color is flagged

- **WHEN** an element's text resolves to the identical color in dark and light
- **THEN** the tool flags it as non-flipping
- **AND** identifies the source (theme code, block markup, or a custom token aliasing a literal)

### Requirement: Usable as a deterministic CI gate

The tool SHALL run headless with no agent involvement and SHALL exit non-zero when any audited pairing
fails the configured threshold, so it can gate CI. Repeated runs on unchanged inputs SHALL produce the
same result.

#### Scenario: CI fails on a contrast regression

- **WHEN** the tool runs in CI and at least one pairing is below threshold
- **THEN** the process exits non-zero
- **AND** the failing pairings are listed in the output

## MODIFIED Requirements

### Requirement: Flatten both schemes into a single scoped stylesheet

Both schemes SHALL be delivered in a single stylesheet in which the base (dark) semantic mapping
remains under `:root` and the light counterpart is emitted under the `[data-theme="light"]` selector,
using the theme's semantic custom properties (`--brk-color-*`). The palette variables
(`--wp--preset--color--*`, `--wp--preset--gradient--*`, `--wp--preset--duotone--*`,
`--wp--custom--color--*`) SHALL NOT be redeclared per scheme — they are scheme-invariant — so only
the ~role-level `--brk-color-*` assignments change between schemes. The stylesheet is produced by the
SCSS build (no JSON-flatten step).

#### Scenario: Light values are scoped, dark stays on :root

- **WHEN** the stylesheet is generated
- **THEN** `[data-theme="light"]` contains a `--brk-color-*` declaration for each role whose mapping
  differs from the dark base
- **AND** no palette/custom/gradient/duotone variable is redeclared under any `[data-theme]` scope

#### Scenario: Semantic tokens drive element styles

- **WHEN** `theme.json` element styles read `var(--brk-color-surface)`
- **THEN** the active scheme's `--brk-color-surface` declaration (from `:root` or
  `[data-theme="light"]`) resolves it to the mapped palette value with no SCSS change

#### Scenario: Stylesheet is produced by the SCSS build

- **WHEN** `pnpm build` runs
- **THEN** `dist/styles/color-scheme.css` is produced by the SCSS pipeline
- **AND** there is no separate color-scheme generation/flatten script in the build

## ADDED Requirements

### Requirement: Skill authors the counterpart semantic mapping

The skill SHALL, given a source scheme (a `--brk-color-*` mapping plus `theme.json` and palette) and a
target polarity, produce the counterpart `[data-theme="<polarity>"]` `--brk-color-*` mapping by
choosing, for each role, an appropriate palette variable reference. The skill SHALL NOT change
`theme.json` `settings` (palette/custom/gradients/duotone) and SHALL NOT assign color literals to any
`--brk-color-*` token (only palette `var()` references).

#### Scenario: Light mapping is produced from the dark source

- **WHEN** the skill runs with the dark `--brk-color-*` mapping as source and `light` as the target
- **THEN** it writes a `[data-theme="light"]` block assigning each role a palette `var()` reference
- **AND** `theme.json` `settings` are unchanged

### Requirement: Skill validates every pairing with the audit tool

The skill SHALL obtain accessibility judgments only from the `color-scheme-audit` tool's computed
contrast — never from estimated or assumed values. After producing a candidate mapping, the skill
SHALL run the audit for the target scheme and treat any pairing below the threshold as a defect to
fix.

#### Scenario: Contrast claims trace to the audit tool

- **WHEN** the skill reports that a pairing is readable or failing
- **THEN** the stated ratio matches the `color-scheme-audit` output for that pairing
- **AND** no readability claim is made without a corresponding audit measurement

### Requirement: Skill auto-corrects failing pairings and re-audits

When the audit flags a failing pairing, the skill SHALL revise the responsible role's palette choice
and re-run the audit, iterating until all audited pairings pass the threshold or it reports the
remaining failures as unresolved with rationale. The skill SHALL choose among palette entries
(principled strategy), never invent a color value.

#### Scenario: A failing pairing is fixed by re-mapping, then re-audited

- **WHEN** the light button pairing fails AA because the on-accent text role maps to a low-contrast
  entry
- **THEN** the skill re-maps that role to a higher-contrast palette entry
- **AND** re-runs the audit and confirms the pairing now passes

### Requirement: Skill records a reviewable scheme policy

The skill SHALL write a scheme-policy record capturing, per role, the chosen palette entry, a short
rationale, and the measured contrast for the pairings that role participates in, so the authored
mapping is reproducible and reviewable.

#### Scenario: Policy record accompanies the mapping

- **WHEN** the skill finishes authoring a counterpart mapping
- **THEN** it writes a scheme-policy record listing each role's palette choice, rationale, and
  measured contrast
- **AND** the record is consistent with the written SCSS mapping

### Requirement: Skill triages fixes by color source

When the audit flags a non-flipping or failing color, the skill SHALL choose its action by the
color's source: for **theme code** (`theme.json` `styles`/`custom`, SCSS) it SHALL rewrite the
value to a `--brk-color-*` reference; for **theme markup** (template parts, patterns) it SHALL
propose converting the frozen pick to a `var:custom|…` token that aliases a `--brk-color-*` role (or
stripping the color); for **user content** (posts/pages) it SHALL flag only and SHALL NOT modify it.

#### Scenario: A frozen markup color is proposed as a bridge token

- **WHEN** a template part colors an element via `var:preset|color|gray-400` that does not flip
- **THEN** the skill proposes a `settings.custom.color.*` token whose value is `var(--brk-color-…)`
  and rewrites the markup reference to `var:custom|color|…`
- **AND** leaves the same pattern in a user post flagged but unmodified

### Requirement: Custom bridge tokens must alias a role, not a literal

The skill SHALL assign every `settings.custom.color` bridge token it introduces or edits a
`var(--brk-color-*)` reference, never a color literal, so the token flips with the scheme; and it
SHALL treat any such custom token assigned a literal as a defect to fix.

#### Scenario: A literal custom token is corrected

- **WHEN** a `settings.custom.color` token is set to a color literal and the audit shows it does not
  flip
- **THEN** the skill proposes replacing the literal with the appropriate `var(--brk-color-*)` alias

### Requirement: Skill auto-applies fixes for user review

The skill SHALL apply its mapping and corrections directly (auto-apply), without prompting the user to
approve each token, leaving the result as a reviewable diff plus the contrast report. The skill MAY
use a live browser to visually confirm the result, but visual confirmation SHALL NOT replace the
audit-tool measurements.

#### Scenario: Result is presented as a diff and report

- **WHEN** the skill completes a run
- **THEN** the changes are applied to the SCSS mapping and scheme-policy record as an editable diff
- **AND** a contrast report summarizes pass/fail per pairing for the user to review

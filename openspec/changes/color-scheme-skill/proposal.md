## Why

Plan B (`semantic-color-scheme-tokens`) makes the light scheme an **authored** `--brk-color-*`
mapping rather than a generated flip. Authoring it well is a judgment task — picking a
polarity-appropriate palette entry per role and proving every element pairing stays readable — which
we just did by hand in the browser. We want an agent (a skill) to do that whole job, backed by a
small deterministic tool that does only the mechanical math (resolve variables, measure contrast).

## What Changes

- Add a deterministic **audit tool** (Node, headless): given a `--brk-color-*` mapping +
  `theme.json`, it enumerates the real element color pairings (background/text, button + `:hover`,
  link + `:hover`, headings, block borders), resolves each through `var()` / `color-mix()` to a
  literal color, and returns WCAG contrast ratios per pairing per scheme. No color-picking, no
  judgment. Usable as a CI gate.
- Add a **scheme-policy** artifact: a per-role record (role → chosen palette entry + rationale +
  measured contrast) that makes the authored mapping reproducible and reviewable.
- Add an agent **skill** under `.claude/skills` that performs the whole authoring job: read the
  source scheme + palette, confirm roles, derive the light `--brk-color-*` mapping, run the audit,
  auto-fix low-contrast roles and re-audit until they pass, then write the `[data-theme="light"]`
  SCSS block + the scheme-policy record + a contrast report. It auto-applies fixes for the user to
  review (no token-by-token prompting) and may use live Chrome for visual confirmation.
- Guardrails: accessibility claims are backed by the audit tool's computed contrast (never guessed);
  the agent chooses among principled strategies (which palette entry per role), never invents
  literal colors; the deterministic core runs headless so CI works without the agent.

## Capabilities

### New Capabilities
- `color-scheme-audit`: the deterministic resolve-and-measure tool — pairing enumeration, `var()` /
  `color-mix()` resolution to literals, WCAG ratio output, and its CI-gate contract.
- `color-scheme-skill`: the agent procedure that authors and auto-corrects the light `--brk-color-*`
  mapping using the audit tool, the scheme-policy record it produces, and the auto-apply/review flow.

### Modified Capabilities
<!-- none: this change is additive and depends on semantic-color-scheme-tokens being applied first -->

## Impact

- New deterministic audit tool (e.g. `tools/color-scheme-audit/`), runnable headless and in CI.
- New skill at `.claude/skills/<color-scheme>/SKILL.md` plus its bundled tool references.
- New scheme-policy artifact (committed alongside the SCSS mapping) recording role decisions.
- Depends on `semantic-color-scheme-tokens` (the `--brk-color-*` layer) being applied first — the
  skill reads and writes that mapping. No runtime/theme behavior changes; this is authoring-time
  tooling only.

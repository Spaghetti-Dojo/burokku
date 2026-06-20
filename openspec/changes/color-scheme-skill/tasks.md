## 1. Audit tool (deterministic)

- [x] 1.1 Scaffold a headless Node tool (e.g. `tools/color-scheme-audit/`) that takes `theme.json` +
      a `--brk-color-*` mapping for a scheme.
- [x] 1.2 Implement pairing enumeration from the **rendered page** (computed styles), covering all
      three color sources — theme code (`theme.json`/SCSS), block-markup attributes (template parts,
      patterns, posts), and `var:custom` bridge tokens — recording role + the two tokens.
- [x] 1.2a Implement the **non-flip detector**: flag any element whose fg/bg resolves to the same
      color in both schemes, and identify its source (code / markup / literal custom token).
- [x] 1.3 Implement resolution: `--brk-color-*` → palette `var()` → literal, including `color-mix(in
      oklab, …)`; report unresolved references instead of dropping them.
- [x] 1.4 Implement WCAG 2.x contrast per pairing per scheme with a configurable threshold (default AA
      4.5:1); emit machine-readable output.
- [x] 1.5 Non-zero exit when any pairing fails; deterministic on repeated runs.
- [x] 1.6 Validate the resolver + contrast against live-Chrome computed values on a fixture; add unit
      tests for `color-mix`/var resolution and known contrast vectors.

## 2. Scheme-policy record

- [x] 2.1 Define the scheme-policy format (per role: chosen palette entry, rationale, measured
      contrast) and where it lives relative to the SCSS mapping.
- [x] 2.2 Ensure the format round-trips: the recorded mapping reproduces the same SCSS on re-apply.

## 3. Skill (agent)

- [x] 3.1 Create `.claude/skills/<color-scheme>/SKILL.md` with the invocation and procedure: read
      source scheme + palette + roles.
- [x] 3.2 Derive the candidate counterpart mapping (palette entry per role; no literals; `settings`
      untouched).
- [x] 3.3 Run the audit tool; treat sub-threshold and non-flipping pairings as defects; auto-fix by
      re-mapping and re-audit, capped iterations; report unresolved failures with rationale.
- [x] 3.3a Source-aware triage: theme code → rewrite to `--brk-`; theme markup → propose a
      `settings.custom.color` token aliasing a `--brk-` role + rewrite `var:preset|… → var:custom|…`;
      user content → flag only. Reject literal-valued custom bridge tokens.
- [x] 3.4 Write the `[data-theme="<polarity>"]` SCSS block, the scheme-policy record, and a contrast
      report; auto-apply as a reviewable diff (no per-token prompts).
- [x] 3.5 Document the optional live-Chrome visual confirmation step (does not replace audit numbers).

## 4. CI gate (optional)

- [x] 4.1 Wire the audit tool into CI to fail on contrast regressions, using the committed mappings.

## 5. Verify end-to-end

- [x] 5.1 Run the skill to author the light mapping for the default theme; confirm all pairings pass
      AA, the diff + report + policy are produced, and front-end/editor render correctly.

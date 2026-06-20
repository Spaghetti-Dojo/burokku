---
name: color-scheme
description: Author and audit the burokku theme's light/dark color schemes. Use when adding or fixing a counterpart scheme, when colors look wrong in light or dark, or when a contrast/readability issue is reported. Derives the `--brk-color-*` role mapping for the opposite polarity, audits every rendered pairing for WCAG contrast, auto-fixes by re-mapping, and writes a reviewable diff + scheme-policy. Authoring-time helper; never a runtime dependency.
---

# color-scheme

Authoring helper for the theme's two color schemes. The palette is scheme-invariant; what flips is the
`--brk-color-*` **role mapping** (`sources/client/styles/color-scheme.scss`). Read
`COLOR_SCHEME_AUDIT.md` (repo root) first — it carries the role vocabulary, the element→role map, the
three color sources, and the gotchas.

## Model (non-negotiable)
- `theme.json` `settings` (palette/custom/gradients/duotone) stay **identical** across schemes.
- Each `--brk-color-*` token maps a role to a **palette `var()`** — never a literal.
- Element colors reference only `--brk-color-*` (code) or a `var:custom|…` bridge token (markup).
- Decisions are recorded in `tools/color-scheme-audit/color-scheme.policy.json` so re-runs reproduce the same SCSS.

## Procedure

1. **Read context.** `COLOR_SCHEME_AUDIT.md`, `sources/client/styles/color-scheme.scss`,
   `tools/color-scheme-audit/color-scheme.policy.json`, and `theme.json` `settings.color` (the palette to pick from).

2. **Derive / review the counterpart mapping.** For each role, choose a palette entry for the target
   polarity (opposite lightness pole; keep `accent`/`on-accent` flipping together). Never assign a
   literal. Add a role if the audit later finds an unmapped pairing.

3. **Build, then audit (the compute step — never guess contrast).** Build styles and run the audit
   tool against the running site in both schemes:
   ```bash
   pnpm build
   pnpm audit:color-scheme            # or: --pages /blocks/,/ --threshold 4.5 --json
   ```
   It loads each page in dark and light (seeding `localStorage['burokku-theme']` pre-paint, so reads
   are never stale), resolves `var()`/`color-mix()`/`oklab(from …)` via computed style, and reports
   per-pairing WCAG contrast, **non-flip** (same color in both schemes), and **unresolved** (text over
   media). Exit is non-zero on any contrast failure.

4. **Treat failures and non-flips as defects; fix by source (triage):**
   - **theme code** (`theme.json` `styles` / SCSS) → re-map the role to a higher-contrast palette
     entry, or point the value at the right `--brk-color-*`.
   - **theme markup** (template parts, patterns) → a frozen `var:preset|…` pick does not flip; add a
     `settings.custom.color.*` token whose value **aliases a `--brk-color-*` role** (never a literal)
     and rewrite the markup `var:preset|… → var:custom|…`. Note: `elements.link` color does **not**
     apply to links inside static template parts — style those in SCSS via the bridge token.
   - **user content** (posts/pages) → **flag only**, do not modify.
   Re-build and re-audit. Iterate (cap ~5 rounds); if a pairing won't pass, report it with rationale
   rather than forcing a choice.

5. **Record + apply.** Regenerate the policy (`node tools/color-scheme-audit/build-policy.mjs`), fill
   rationale for any changed role, and leave all edits as a reviewable diff plus the audit report. Do
   not commit. No per-token prompting — auto-apply, the reviewer ratifies the diff.

6. **(Optional) Visual confirmation.** Eyeball in a real browser (Chrome) — but visual checks **never
   replace** the audit numbers. Verify per scheme via a fresh load with `localStorage['burokku-theme']`
   set, not by toggling `data-theme` live (live toggling yields stale `getComputedStyle`).

## Guardrails
- Accessibility claims must cite the audit tool's measured contrast — never an estimate.
- The agent picks among **palette entries** (a bounded decision); it never invents a color value.
- The deterministic core (audit + policy) runs headless without the agent, so CI keeps working.

## Context

After `semantic-color-scheme-tokens`, the light scheme is an authored `--brk-color-*` mapping (role →
palette variable) in SCSS. Authoring it correctly means picking polarity-appropriate palette entries
and proving every element pairing stays readable — the manual browser loop we ran to catch the frozen
white/red accent failures. This change automates that loop: an agent skill does the judgment and
orchestration; a deterministic tool does the resolve-and-measure math.

## Goals / Non-Goals

**Goals:**
- A headless `color-scheme-audit` tool: pairings → resolved literals → WCAG ratios, CI-gateable.
- A skill that derives + auto-corrects the light mapping using only audit-measured contrast.
- A reproducible, reviewable scheme-policy record of role decisions.
- Auto-apply with human review (diff + report), optional live-Chrome confirmation.

**Non-Goals:**
- Changing the runtime toggle, palette, or `theme.json` `settings`.
- Letting the LLM invent literal colors or self-assess contrast.
- Per-variation toggle wiring or runtime generation.

## Decisions

**Three color sources, rendered-page audit.** Color enters from (1) theme code (`theme.json`/SCSS),
(2) block-markup attributes (template parts, patterns, posts), and (3) `var:custom` bridge tokens.
Only auditing the *rendered* page (computed colors in both schemes) catches source #2; scanning code
alone yields a false all-clear. Confirmed by the `parts/footer.html` copyright being unreadable in
light while `theme.json`/SCSS looked clean.

**Non-flip detector.** The core heuristic: flag any element whose fg/bg resolves to the *same* color
in both schemes. One check catches literal-in-a-custom-token, frozen `var:preset|…` markup picks, and
any other "should flip but doesn't" — regardless of source.

**`var:custom` bridge.** `--brk-color-*` is not referenceable from block markup (no `var:brk|…`).
To make a markup-set color flip, the skill introduces a `settings.custom.color` token whose value
**aliases a `--brk-` role** (never a literal) and rewrites the markup to `var:custom|color|…`. A
literal in such a token is a defect (it won't flip).

**Source-aware triage.** Theme code → rewrite to `--brk-`. Theme markup → propose the `var:custom`
bridge (or strip). User content → flag only (the author chose that color). The skill is a
developer-time helper that hands over a reviewed diff; there is no live agent on the remote
production instance, and the WordPress single-active-global-styles model means it does not try to
edit/store a second scheme in the editor (that would need separate, custom Gutenberg work — out of
scope).

**Split compute vs decide.** The tool owns deterministic math (var/`color-mix` resolution, WCAG
ratios, pairing enumeration); the agent owns judgment (role classification, palette choice per role,
iteration, writing). This keeps a11y claims verifiable and the core CI-gateable without an agent.
Alternative — one LLM step doing everything — rejected: unverifiable, non-reproducible.

**Agent picks among palette entries, never invents values.** Every `--brk-color-*` stays a palette
`var()`. The decision space is "which palette entry for this role," bounded and reviewable.

**Decisions-as-data (scheme-policy record).** Per-role choice + rationale + measured contrast is
serialized so a re-run reproduces the same mapping and a reviewer sees *why*. The agent is an
authoring assistant, never a runtime dependency.

**Tool is Node + headless.** Reuses the existing JS toolchain, runs in CI free; `color-mix(in oklab,
…)` resolution and WCAG math are deterministic. Chrome (live, via MCP) is an optional visual check
during authoring, not a gate.

**Skill lives in `.claude/skills`.** Versioned with the theme for now; invoked on demand
(e.g. `/color-scheme convert <scheme>`).

## Risks / Trade-offs

- [Audit misses a pairing the theme actually renders] → Enumerate from `theme.json` `styles` plus a
  curated list of known element states; grow coverage as gaps surface; the skill flags unmapped roles.
- [`color-mix`/`light-dark` resolution drift vs the browser] → Validate the tool's resolver against
  live Chrome computed values on a fixture before trusting it as the gate.
- [Agent loops without converging] → Cap iterations; on non-convergence, report remaining failures
  with rationale instead of forcing a choice.
- [Auto-apply churns files unexpectedly] → Output is a reviewable diff + report; nothing is committed
  by the skill.

## Migration Plan

Depends on `semantic-color-scheme-tokens` being applied first (the `--brk-color-*` layer must exist).
Then:
1. Build the `color-scheme-audit` tool; validate its resolver/contrast against live Chrome on a
   fixture.
2. Define the scheme-policy record format.
3. Write `SKILL.md` orchestrating: read scheme → classify roles → derive mapping → audit → auto-fix →
   re-audit → write SCSS + policy + report.
4. (Optional) wire the audit tool as a CI contrast gate.

Rollback: the skill and tool are additive authoring-time artifacts; removing them leaves the
hand-authored mapping intact.

## Open Questions

- Scheme-policy format: standalone JSON next to the SCSS, or comments embedded in the SCSS mapping?
- Pairing source: derive purely from `theme.json`, or also scan compiled CSS for element states the
  JSON doesn't express?
- Threshold policy: AA only, or AA + AAA reporting and large-text (3:1) handling per role?

## 1. Semantic token layer (SCSS)

- [x] 1.1 Add `sources/client/styles/color-scheme.scss` defining the `--brk-color-*` tokens
      (`surface`, `on-surface`, `on-surface-muted`, `accent`, `on-accent`, `accent-hover`, `muted`,
      `field`, `border`, `link-hover`), each mapped to a palette `var()` — no literals.
- [x] 1.2 Author the dark base mapping under `:root` and the light counterpart under
      `[data-theme="light"]`.
- [x] 1.3 Wired as a top-level webpack style entry → compiles to `dist/styles/color-scheme.css`;
      confirmed it contains both mappings and redeclares no palette/preset/custom variable.

## 2. Rewire theme.json styles to semantic tokens

- [x] 2.1 `styles.color.background`/`text` → `var(--brk-color-surface)` / `var(--brk-color-on-surface)`.
- [x] 2.2 `styles.elements.button` color + `:hover` → `accent` / `on-accent` / `accent-hover`,
      removing the `color-mix()` expression.
- [x] 2.3 `styles.elements.link` `:hover` → `link-hover`, removing the `color-mix()` link-hover
      expression.
- [x] 2.4 Heading and block border colors (`core/quote`, `core/accordion`) → `var(--brk-color-*)`.
- [x] 2.5 Confirmed `theme.json` `settings` unchanged and no `styles` color assignment references
      `--wp--preset--color--*` / `--wp--custom--color--*`.

## 3. Verify in the browser

- [x] 3.1 Built and verified front-end dark↔light (fresh load per scheme): body, all button variants,
      code/pre/search, headings all pass WCAG AA in both schemes (no failures). See
      `COLOR_SCHEME_AUDIT.md`.
- [x] 3.2 Editor scheme-preview parity verified in the Site Editor: the ⋮ → "Preview light scheme"
      item flips the canvas to light (white bg / dark text, sun icon), matching the front end.

## 4. Simplify editor scheme-preview

- [x] 4.1 `applyScheme` now sets `data-theme` on the canvas document root only; removed the
      `.editor-styles-wrapper` target and the stale preset-shadowing comment.
- [x] 4.2 Re-verified after rebuilding the editor modules bundle: `html[data-theme="light"]` is set
      on the canvas root only, `.editor-styles-wrapper` carries no `data-theme`, yet the light
      `--brk-color-*` tokens resolve inside the wrapper (bg 250 / text 10) — single target works,
      not shadowed. NOTE: `pnpm build` only builds styles; the editor JS needs the modules webpack
      config (`wp-scripts build --config webpack.modules.config.js`) — no one-shot prod script exists
      for it (pre-existing gap).

## 5. Remove the obsolete generator and wiring

- [x] 5.1 Deleted `tools/color-scheme/*`.
- [x] 5.2 Deleted `styles/light.json`.
- [x] 5.3 Removed `package.json` scripts `color-scheme:flatten` and `test:color-scheme`, and the
      `&& pnpm color-scheme:flatten` from `build`.
- [x] 5.4 Deleted `.github/workflows/color-scheme.yml`.
- [x] 5.5 Gates green (cs, analysis, lint:scripts, lint:styles, tsc, functional tests);
      `dist/styles/color-scheme.css` produced by `pnpm build` via SCSS.

## 6. Component SCSS rewire (surfaced during verification)

- [x] 6.1 Rewired every client SCSS color reference to `--brk-color-*`: buttons mixin, search, table,
      pre, code, selection, focus outline, footer, header, `wp-class-utils`. Zero raw palette color
      refs remain outside `color-scheme.scss`.
- [x] 6.2 Fixed pre-existing webpack break (`@wordpress/scripts` default config is now an array; use
      the first element) so `pnpm build` works.
- [x] 6.3 Wrote `COLOR_SCHEME_AUDIT.md` (real-scenario report) for the `color-scheme-skill` change.

## 1. Color transform core

- [x] 1.1 Add an HSL parse/serialize helper that round-trips `hsl(H S% L%)` and `hsl(H S% L% / A)` losslessly (hue, saturation, alpha preserved)
- [x] 1.2 Implement `mirrorLightness(color)` → `L' = 100 − L`, keeping H/S/alpha
- [x] 1.3 Implement chromatic step-swap: detect `-700`/`-500`/`-300` ramp members and map `-700`↔`-300` (`-500` self) to the sibling's curated value
- [x] 1.4 Implement the precedence resolver `deriveToken(value, slug, palette)`: expression pass-through → curated step-swap → mirror fallback
- [x] 1.5 Unit-test the resolver against representative tokens (`red-700`, `gray-950`, `theme-accent`, a `*-500-50` tint, a `color-mix()` expression)

## 2. theme.json reader + generator

- [x] 2.1 Read `theme.json` and extract palette, gradients, duotones, and `custom.color`
- [x] 2.2 Transform palette tokens via `deriveToken`
- [x] 2.3 Transform gradients per literal stop, preserving stop positions and direction
- [x] 2.4 Transform duotones per color, preserving array order/length
- [x] 2.5 Transform `custom.color` literals; pass through `var()`/`color-mix()` expressions unchanged
- [x] 2.6 Merge an optional override map over computed values (overrides win)
- [x] 2.7 Write `styles/light.json` mirroring the theme.json color shape; assert deterministic (byte-identical on re-run)

## 3. CSS flattener

- [x] 3.1 Map each token to its WordPress custom-property name (`--wp--preset--color--*`, `--wp--preset--gradient--*`, `--wp--preset--duotone--*`, `--wp--custom--color--*`)
- [x] 3.2 Emit `dist/styles/color-scheme.css` with light declarations under `[data-theme="light"]`; leave dark on `:root` (no redeclaration)
- [x] 3.3 Verify generated var names match those consumed in `sources/client/styles/**` (spot-check `red-700`, `gray-950`, a gradient, a duotone)

## 4. Build + CI integration

- [x] 4.1 Add a `pnpm` script (e.g. `build:color-scheme`) that runs reader → generator → flattener
- [x] 4.2 Wire the script into the existing build so `dist/styles/color-scheme.css` is produced alongside the other style bundles
- [x] 4.3 Add a GitHub Actions step (alongside `deploy-docs.yml`) that regenerates output and fails on drift vs committed `styles/light.json` and `dist/styles/color-scheme.css`
- [x] 4.4 Confirm `sources/server/Theme/Styles.php` enqueues `dist/styles/color-scheme.css` (already listed) — no PHP change expected

## 5. Verification

- [x] 5.1 Run the generator; review `styles/light.json` diff for sane light values (curated chromatics, mirrored neutrals)
- [x] 5.2 Load a page, toggle the header control, confirm colors flip with no network request and no reflow
- [x] 5.3 Confirm dark (default `:root`) is visually unchanged from the current theme
- [x] 5.4 Make a throwaway `theme.json` color edit without regenerating and confirm CI fails on drift; revert

## 6. Per-scheme translucent surfaces

- [x] 6.1 Emit a document `color-scheme` flag (`dist/styles/document.css` from `sources/client/styles/document.scss`): `dark` on `:root`, `light` on `[data-theme="light"]` and the `prefers-color-scheme: light` / `:not([data-theme="dark"])` fallback
- [x] 6.2 Enqueue `dist/styles/document.css` via `Styles.php` `ASSETS_FILE_NAMES`
- [x] 6.3 Switch the sticky/fixed header backdrop alpha from a fixed `calc(alpha * 80%)` to `light-dark(40%, 80%)` so the translucent surface reads correctly over light content
- [x] 6.4 Toggle the header control over busy light content; confirm the backdrop is 40% in light, 80% in dark, with no SCSS per-scheme override
- [x] 6.5 Replace the scheme-blind `darker()` button-hover mixin (mixed the flipping `black` token, which lightened toward the page in light scheme) with a `state-layer()` overlay using `light-dark(black, white)` literals so hover darkens light surfaces / lightens dark ones, preserving text and UI contrast in both schemes

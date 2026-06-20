/**
 * WCAG 2.x contrast math over CSS `rgb()` / `rgba()` strings.
 *
 * Colors are read from the browser's *computed* style, so `var()`,
 * `color-mix()`, and relative `oklab(from …)` are already resolved to
 * `rgb(...)` / `rgba(...)` by the engine — this module only needs to parse that
 * final form, composite any alpha over a backdrop, and compute the ratio.
 */

/**
 * Parse a computed `rgb(r g b)` / `rgb(r, g, b)` / `rgba(r, g, b, a)` string.
 *
 * @param {string} value
 * @return {{r:number,g:number,b:number,a:number}|null}
 */
export function parseRgb(value) {
	if (typeof value !== 'string') {
		return null;
	}
	const m = value.match(/-?[\d.]+/g);
	if (!m || m.length < 3) {
		return null;
	}
	const [r, g, b, a] = m.map(Number);
	return { r, g, b, a: a === undefined ? 1 : a };
}

/** True for fully transparent or unparseable. */
export function isTransparent(value) {
	const c = parseRgb(value);
	return !c || c.a === 0;
}

/**
 * Composite a (possibly translucent) color over an opaque backdrop.
 *
 * @param {{r:number,g:number,b:number,a:number}} fg
 * @param {{r:number,g:number,b:number,a:number}} bg Opaque (a=1) backdrop.
 * @return {{r:number,g:number,b:number,a:number}}
 */
export function composite(fg, bg) {
	const a = fg.a;
	return {
		r: fg.r * a + bg.r * (1 - a),
		g: fg.g * a + bg.g * (1 - a),
		b: fg.b * a + bg.b * (1 - a),
		a: 1,
	};
}

/** WCAG relative luminance of an opaque sRGB color (0–255 channels). */
export function relativeLuminance({ r, g, b }) {
	const lin = [r, g, b].map((c) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/**
 * WCAG contrast ratio between two computed color strings. The foreground is
 * composited over the background when it carries alpha.
 *
 * @param {string} fgValue
 * @param {string} bgValue Must be opaque; resolve the effective background first.
 * @return {number|null} Ratio rounded to 2 dp, or null when either is unparseable.
 */
export function contrastRatio(fgValue, bgValue) {
	const bg = parseRgb(bgValue);
	let fg = parseRgb(fgValue);
	if (!fg || !bg || bg.a < 1) {
		return null;
	}
	if (fg.a < 1) {
		fg = composite(fg, bg);
	}
	const l1 = relativeLuminance(fg);
	const l2 = relativeLuminance(bg);
	const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
	return Math.round(ratio * 100) / 100;
}

/** Default WCAG AA threshold for normal-size text. */
export const AA_NORMAL = 4.5;

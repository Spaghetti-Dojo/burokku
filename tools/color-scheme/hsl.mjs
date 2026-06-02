/**
 * HSL parse / serialize helpers.
 *
 * The theme authors colors with modern space-separated HSL syntax, e.g.
 * `hsl(221.2 83.2% 53.3%)` and optionally `hsl(0 0% 98% / 0.5)`. These helpers
 * round-trip that syntax losslessly: only the lightness channel is ever changed
 * by callers; hue, saturation, and alpha are preserved verbatim.
 */

/**
 * @typedef {Object} Hsl
 * @property {number} h Hue (degrees).
 * @property {number} s Saturation (percent, without the `%`).
 * @property {number} l Lightness (percent, without the `%`).
 * @property {number|null} a Alpha (0–1) or null when absent.
 */

const HSL_RE =
	/^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i;

/**
 * Parse a modern-syntax `hsl()` string.
 *
 * @param {string} value
 * @return {Hsl|null} Parsed channels, or null when the value is not a plain hsl literal.
 */
export function parseHsl( value ) {
	if ( typeof value !== 'string' ) {
		return null;
	}

	const match = value.trim().match( HSL_RE );

	if ( ! match ) {
		return null;
	}

	const [ , h, s, l, rawAlpha ] = match;

	return {
		h: Number( h ),
		s: Number( s ),
		l: Number( l ),
		a: rawAlpha === undefined ? null : parseAlpha( rawAlpha ),
	};
}

/**
 * Serialize parsed channels back to a modern `hsl()` string.
 *
 * @param {Hsl} hsl
 * @return {string}
 */
export function serializeHsl( { h, s, l, a } ) {
	const base = `hsl(${ num( h ) } ${ num( s ) }% ${ num( l ) }%`;

	return a === null || a === undefined
		? `${ base })`
		: `${ base } / ${ num( a ) })`;
}

/**
 * Format a number without floating-point noise, trimming trailing zeros.
 *
 * @param {number} n
 * @return {string}
 */
export function num( n ) {
	return Number( n.toFixed( 4 ) ).toString();
}

/**
 * @param {string} raw `0.5` or `50%`.
 * @return {number} Alpha in the 0–1 range.
 */
function parseAlpha( raw ) {
	return raw.endsWith( '%' ) ? Number( raw.slice( 0, -1 ) ) / 100 : Number( raw );
}

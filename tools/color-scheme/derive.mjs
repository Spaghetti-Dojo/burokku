/**
 * Color-scheme derivation.
 *
 * Given the base (dark) color tokens from `theme.json`, derive the opposite
 * (light) value for each token by transforming lightness only — hue,
 * saturation, and alpha are always preserved. See design.md (D2/D3) for the
 * precedence rule implemented here.
 */

import { parseHsl, serializeHsl } from './hsl.mjs';

const RAMP_RE = /^(.*)-(700|500|300)$/;
const STEP_SWAP = { 700: '300', 500: '500', 300: '700' };

/**
 * Mirror the lightness of a single hsl literal: `L' = 100 - L`.
 * Returns the input unchanged when it is not a plain hsl literal.
 *
 * @param {string} value
 * @return {string}
 */
export function mirrorLightness( value ) {
	const hsl = parseHsl( value );

	if ( ! hsl ) {
		return value;
	}

	return serializeHsl( { ...hsl, l: 100 - hsl.l } );
}

/**
 * True when the value is a CSS expression (a `var()` or `color-mix()` etc.)
 * that should pass through untouched so it inherits its flipped referents.
 *
 * @param {string} value
 * @return {boolean}
 */
export function isExpression( value ) {
	return typeof value === 'string' && /var\(|color-mix\(|calc\(/i.test( value );
}

/**
 * Resolve the chromatic step-swap counterpart for a ramp slug, if any.
 *
 * @param {string} slug    e.g. `red-700`.
 * @param {Map<string,string>} palette Map of slug → curated value.
 * @return {string|null} The sibling's curated value, the same value for `-500`,
 *                       or null when the slug is not a swappable ramp member.
 */
export function swapStep( slug, palette ) {
	const match = typeof slug === 'string' ? slug.match( RAMP_RE ) : null;

	if ( ! match ) {
		return null;
	}

	const [ , base, step ] = match;
	const siblingSlug = `${ base }-${ STEP_SWAP[ step ] }`;

	if ( siblingSlug === slug ) {
		return palette.get( slug ) ?? null; // `-500` maps to itself.
	}

	return palette.get( siblingSlug ) ?? null;
}

/**
 * Derive the light value for one token by precedence:
 *   1. expression  → unchanged (inherits flipped referents)
 *   2. curated ramp → sibling's curated value (`-700`↔`-300`, `-500` self)
 *   3. fallback     → mirror lightness `L' = 100 - L`
 *
 * @param {string} value   Base (dark) value.
 * @param {string|null} slug Token slug when available (palette/custom), else null.
 * @param {Map<string,string>} palette Map of palette slug → curated value.
 * @return {string} Derived (light) value.
 */
export function deriveToken( value, slug, palette ) {
	if ( isExpression( value ) ) {
		return value;
	}

	const swapped = swapStep( slug, palette );

	if ( swapped !== null ) {
		return swapped;
	}

	return mirrorLightness( value );
}

/**
 * Transform every literal hsl stop inside a gradient string, preserving stop
 * positions, direction, and gradient type.
 *
 * @param {string} gradient
 * @return {string}
 */
export function transformGradient( gradient ) {
	return gradient.replace( /hsl\([^)]*\)/gi, ( stop ) => mirrorLightness( stop ) );
}

/**
 * Transform each color in a duotone array, preserving order and length.
 *
 * @param {string[]} colors
 * @return {string[]}
 */
export function transformDuotone( colors ) {
	return colors.map( ( color ) => mirrorLightness( color ) );
}

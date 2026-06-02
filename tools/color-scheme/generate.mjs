/**
 * Generator: read color tokens from `theme.json`, derive the light scheme, and
 * produce a reviewable `styles/light.json` mirroring the theme.json color shape.
 *
 * Only literal colors are transformed; `var()` / `color-mix()` expressions pass
 * through so they inherit their flipped referents. An optional `overrides.json`
 * lets a human pin specific tokens — overrides always win over computed values.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	deriveToken,
	transformGradient,
	transformDuotone,
	isExpression,
} from './derive.mjs';

const HERE = path.dirname( fileURLToPath( import.meta.url ) );
const ROOT = path.resolve( HERE, '../..' );

export const THEME_JSON = path.join( ROOT, 'theme.json' );
export const OVERRIDES_JSON = path.join( HERE, 'overrides.json' );
export const LIGHT_JSON = path.join( ROOT, 'styles/light.json' );

/**
 * Build a slug → value map from a palette array.
 *
 * @param {Array<{slug:string,color:string}>} palette
 * @return {Map<string,string>}
 */
function paletteMap( palette = [] ) {
	return new Map( palette.map( ( { slug, color } ) => [ slug, color ] ) );
}

/**
 * Derive the light color settings from base theme.json color settings.
 *
 * @param {object} themeColor `settings.color` from theme.json.
 * @param {object} themeCustomColor `settings.custom.color` from theme.json.
 * @return {{color:object, custom:{color:object}}}
 */
export function deriveColor( themeColor = {}, themeCustomColor = {} ) {
	const palette = themeColor.palette ?? [];
	const map = paletteMap( palette );

	const color = {};

	if ( themeColor.palette ) {
		color.palette = palette.map( ( token ) => ( {
			...token,
			color: deriveToken( token.color, token.slug, map ),
		} ) );
	}

	if ( themeColor.gradients ) {
		color.gradients = themeColor.gradients.map( ( token ) => ( {
			...token,
			gradient: transformGradient( token.gradient ),
		} ) );
	}

	if ( themeColor.duotone ) {
		color.duotone = themeColor.duotone.map( ( token ) => ( {
			...token,
			colors: transformDuotone( token.colors ),
		} ) );
	}

	return { color, custom: { color: deriveCustomColor( themeCustomColor, map ) } };
}

/**
 * Derive `custom.color`, recursing into nested objects. Literal hsl values are
 * mirrored; expressions are emitted unchanged so they inherit flipped referents.
 *
 * @param {object} node
 * @param {Map<string,string>} map
 * @return {object}
 */
function deriveCustomColor( node, map ) {
	const out = {};

	for ( const [ key, value ] of Object.entries( node ) ) {
		if ( typeof value === 'object' && value !== null ) {
			out[ key ] = deriveCustomColor( value, map );
		} else if ( isExpression( value ) ) {
			out[ key ] = value; // inherits flipped referents
		} else {
			out[ key ] = deriveToken( value, key, map );
		}
	}

	return out;
}

/**
 * Apply slug-keyed overrides over the derived light settings (overrides win).
 *
 * Override shape (all sections optional), keyed by token slug:
 *   { "palette": { "<slug>": "<value>" },
 *     "gradients": { "<slug>": "<gradient>" },
 *     "duotone": { "<slug>": ["<c1>", "<c2>"] },
 *     "custom": { "<key>": "<value>" } }
 *
 * @param {{color:object, custom:{color:object}}} derived
 * @param {object} overrides
 * @return {{color:object, custom:{color:object}}}
 */
export function applyOverrides( derived, overrides = {} ) {
	const pinArray = ( tokens = [], key, pins = {} ) =>
		tokens.map( ( token ) =>
			pins[ token.slug ] !== undefined
				? { ...token, [ key ]: pins[ token.slug ] }
				: token
		);

	const color = { ...derived.color };

	if ( color.palette ) {
		color.palette = pinArray( color.palette, 'color', overrides.palette );
	}
	if ( color.gradients ) {
		color.gradients = pinArray( color.gradients, 'gradient', overrides.gradients );
	}
	if ( color.duotone ) {
		color.duotone = pinArray( color.duotone, 'colors', overrides.duotone );
	}

	const custom = { color: { ...derived.custom.color, ...( overrides.custom ?? {} ) } };

	return { color, custom };
}

/**
 * Build the full light.json object (without writing to disk).
 *
 * @param {object} theme Parsed theme.json.
 * @param {object} [overrides] Parsed overrides.json (slug-keyed pins).
 * @return {object}
 */
export function buildLightJson( theme, overrides = {} ) {
	const derived = deriveColor( theme.settings?.color, theme.settings?.custom?.color );
	const settings = applyOverrides( derived, overrides );

	return {
		$schema: theme.$schema,
		version: theme.version,
		title: 'Light',
		settings,
	};
}

/**
 * Serialize deterministically: tab indent + trailing newline (matches theme.json).
 *
 * @param {object} obj
 * @return {string}
 */
export function serialize( obj ) {
	return JSON.stringify( obj, null, '\t' ) + '\n';
}

/**
 * Read inputs, build light.json, and return its serialized string.
 *
 * @return {string}
 */
export function generate() {
	const theme = JSON.parse( fs.readFileSync( THEME_JSON, 'utf8' ) );
	const overrides = fs.existsSync( OVERRIDES_JSON )
		? JSON.parse( fs.readFileSync( OVERRIDES_JSON, 'utf8' ) )
		: {};

	return serialize( buildLightJson( theme, overrides ) );
}

/**
 * Generate and write `styles/light.json`.
 *
 * @return {string} The written content.
 */
export function writeLightJson() {
	const content = generate();
	fs.mkdirSync( path.dirname( LIGHT_JSON ), { recursive: true } );
	fs.writeFileSync( LIGHT_JSON, content );
	return content;
}

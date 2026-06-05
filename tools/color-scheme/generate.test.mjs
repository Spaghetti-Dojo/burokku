import { test } from 'node:test';
import assert from 'node:assert/strict';

import { deriveColor, buildLightJson } from './generate.mjs';

const themeColor = {
	palette: [
		{ slug: 'gray-950', color: 'hsl(0 0% 3.9%)', name: 'Gray 950' },
		{ slug: 'theme-accent', color: 'hsl(0 0% 98%)', name: 'Theme Accent' },
	],
};

const themeCustomColor = {
	link: 'hsl(0 0% 3.9%)',
	accent: 'hsl(0 0% 98%)',
};

test( 'deriveColor: excluded slug is omitted from the palette', () => {
	const { color } = deriveColor( themeColor, {}, new Set( [ 'theme-accent' ] ) );

	const slugs = color.palette.map( ( t ) => t.slug );
	assert.deepEqual( slugs, [ 'gray-950' ] ); // theme-accent dropped, inherits :root
} );

test( 'deriveColor: non-excluded palette tokens are still derived', () => {
	const { color } = deriveColor( themeColor, {}, new Set( [ 'theme-accent' ] ) );

	const gray = color.palette.find( ( t ) => t.slug === 'gray-950' );
	assert.equal( gray.color, 'hsl(0 0% 96.1%)' ); // mirrored 3.9 -> 96.1
} );

test( 'deriveColor: excluded key is omitted from custom.color', () => {
	const { custom } = deriveColor( themeColor, themeCustomColor, new Set( [ 'accent' ] ) );

	assert.ok( ! ( 'accent' in custom.color ) ); // dropped, inherits :root
	assert.equal( custom.color.link, 'hsl(0 0% 96.1%)' ); // others still derived
} );

test( 'buildLightJson: overrides.exclude drops the slug from light.json', () => {
	const theme = { settings: { color: themeColor } };
	const light = buildLightJson( theme, { exclude: [ 'theme-accent' ] } );

	const slugs = light.settings.color.palette.map( ( t ) => t.slug );
	assert.ok( ! slugs.includes( 'theme-accent' ) );
} );

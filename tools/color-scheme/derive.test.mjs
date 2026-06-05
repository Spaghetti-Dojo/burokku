import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseHsl, serializeHsl } from './hsl.mjs';
import {
	mirrorLightness,
	isExpression,
	swapStep,
	deriveToken,
	transformGradient,
	transformDuotone,
} from './derive.mjs';

const palette = new Map( [
	[ 'red-700', 'hsl(0 73.7% 41.8%)' ],
	[ 'red-500', 'hsl(0 84.2% 60.2%)' ],
	[ 'red-300', 'hsl(0 93.5% 81.8%)' ],
	[ 'black', 'hsl(0 0% 3.9%)' ],
	[ 'white', 'hsl(0 0% 98%)' ],
	[ 'theme-accent', 'hsl(0 0% 98%)' ],
] );

test( 'hsl round-trips losslessly', () => {
	assert.equal( serializeHsl( parseHsl( 'hsl(221.2 83.2% 53.3%)' ) ), 'hsl(221.2 83.2% 53.3%)' );
	assert.equal( serializeHsl( parseHsl( 'hsl(0 0% 98%)' ) ), 'hsl(0 0% 98%)' );
	assert.equal( serializeHsl( parseHsl( 'hsl(0 0% 45.1% / 0.5)' ) ), 'hsl(0 0% 45.1% / 0.5)' );
} );

test( 'parseHsl rejects non-hsl literals', () => {
	assert.equal( parseHsl( 'var(--x)' ), null );
	assert.equal( parseHsl( '#fff' ), null );
} );

test( 'mirrorLightness flips L, keeps H/S/alpha, no FP noise', () => {
	assert.equal( mirrorLightness( 'hsl(0 0% 3.9%)' ), 'hsl(0 0% 96.1%)' );
	assert.equal( mirrorLightness( 'hsl(0 0% 14.9%)' ), 'hsl(0 0% 85.1%)' );
	assert.equal( mirrorLightness( 'hsl(221.2 83.2% 53.3%)' ), 'hsl(221.2 83.2% 46.7%)' );
	assert.equal( mirrorLightness( 'hsl(0 0% 45.1% / 0.5)' ), 'hsl(0 0% 54.9% / 0.5)' );
} );

test( 'isExpression detects var()/color-mix()/calc()', () => {
	assert.ok( isExpression( 'color-mix(in oklab, var(--a) 100%, var(--b) 20%)' ) );
	assert.ok( isExpression( 'var(--wp--preset--color--black)' ) );
	assert.equal( isExpression( 'hsl(0 0% 3.9%)' ), false );
} );

test( 'swapStep maps -700<->-300 to curated values and -500 to self', () => {
	assert.equal( swapStep( 'red-700', palette ), 'hsl(0 93.5% 81.8%)' ); // red-300
	assert.equal( swapStep( 'red-300', palette ), 'hsl(0 73.7% 41.8%)' ); // red-700
	assert.equal( swapStep( 'red-500', palette ), 'hsl(0 84.2% 60.2%)' ); // self
	assert.equal( swapStep( 'gray-800', palette ), null ); // not a ramp member
} );

test( 'deriveToken: expression passes through unchanged', () => {
	const expr = 'color-mix(in oklab, var(--wp--preset--color--theme-accent) 100%, var(--wp--preset--color--black) 20%)';
	assert.equal( deriveToken( expr, 'link-hover', palette ), expr );
} );

test( 'deriveToken: chromatic ramp reuses curated sibling', () => {
	assert.equal( deriveToken( 'hsl(0 73.7% 41.8%)', 'red-700', palette ), 'hsl(0 93.5% 81.8%)' );
} );

test( 'deriveToken: orphan literal mirrors lightness', () => {
	// gray-950 has no -700/-300 sibling -> 100 - 3.9 = 96.1
	assert.equal( deriveToken( 'hsl(0 0% 3.9%)', 'gray-950', palette ), 'hsl(0 0% 96.1%)' );
} );

test( 'transformGradient mirrors each stop, keeps positions/direction', () => {
	assert.equal(
		transformGradient( 'linear-gradient(90deg, hsl(0 0% 25.1%) 0%, hsl(0 0% 89.8%) 100%)' ),
		'linear-gradient(90deg, hsl(0 0% 74.9%) 0%, hsl(0 0% 10.2%) 100%)'
	);
} );

test( 'transformDuotone mirrors each color, keeps order/length', () => {
	assert.deepEqual(
		transformDuotone( [ 'hsl(0 0% 3.9%)', 'hsl(0 0% 98%)' ] ),
		[ 'hsl(0 0% 96.1%)', 'hsl(0 0% 2%)' ]
	);
} );

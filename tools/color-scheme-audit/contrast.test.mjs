import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
	parseRgb,
	isTransparent,
	composite,
	relativeLuminance,
	contrastRatio,
} from './contrast.mjs';

test('parseRgb handles rgb and rgba, comma and space syntax', () => {
	assert.deepEqual(parseRgb('rgb(10, 20, 30)'), { r: 10, g: 20, b: 30, a: 1 });
	assert.deepEqual(parseRgb('rgb(10 20 30)'), { r: 10, g: 20, b: 30, a: 1 });
	assert.deepEqual(parseRgb('rgba(10, 20, 30, 0.5)'), { r: 10, g: 20, b: 30, a: 0.5 });
	assert.equal(parseRgb('transparent'), null);
});

test('isTransparent detects alpha 0 and unparseable', () => {
	assert.equal(isTransparent('rgba(0,0,0,0)'), true);
	assert.equal(isTransparent('transparent'), true);
	assert.equal(isTransparent('rgb(0,0,0)'), false);
});

test('relativeLuminance: black 0, white 1', () => {
	assert.equal(relativeLuminance({ r: 0, g: 0, b: 0 }), 0);
	assert.equal(Math.round(relativeLuminance({ r: 255, g: 255, b: 255 })), 1);
});

test('contrastRatio: black vs white is 21:1', () => {
	assert.equal(contrastRatio('rgb(0,0,0)', 'rgb(255,255,255)'), 21);
	assert.equal(contrastRatio('rgb(255,255,255)', 'rgb(0,0,0)'), 21);
});

test('contrastRatio: identical colors are 1:1', () => {
	assert.equal(contrastRatio('rgb(128,128,128)', 'rgb(128,128,128)'), 1);
});

test('contrastRatio: known gray-600 on white ≈ 7.4 (AA pass)', () => {
	// hsl(0 0% 32.2%) ≈ rgb(82,82,82)
	const ratio = contrastRatio('rgb(82,82,82)', 'rgb(250,250,250)');
	assert.ok(ratio >= 7 && ratio <= 8, `expected ~7.x, got ${ratio}`);
});

test('contrastRatio: returns null when background is not opaque', () => {
	assert.equal(contrastRatio('rgb(0,0,0)', 'rgba(255,255,255,0)'), null);
	assert.equal(contrastRatio('rgb(0,0,0)', '__image__'), null);
});

test('composite blends a translucent foreground over the backdrop', () => {
	const out = composite({ r: 255, g: 255, b: 255, a: 0.5 }, { r: 0, g: 0, b: 0, a: 1 });
	assert.deepEqual(out, { r: 127.5, g: 127.5, b: 127.5, a: 1 });
});

test('contrastRatio composites a translucent foreground before measuring', () => {
	// 50% white over black == mid gray; contrast vs black > 1, vs white < 21.
	const ratio = contrastRatio('rgba(255,255,255,0.5)', 'rgb(0,0,0)');
	assert.ok(ratio > 1 && ratio < 6, `expected mid, got ${ratio}`);
});

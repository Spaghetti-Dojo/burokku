import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseScss, buildPolicy, toScss } from './policy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCSS = fs.readFileSync(path.join(ROOT, 'sources/client/styles/color-scheme.scss'), 'utf8');

test('parseScss extracts both scheme maps with matching roles', () => {
	const { dark, light } = parseScss(SCSS);
	assert.ok(Object.keys(dark).length >= 8, 'expected the full role set');
	assert.deepEqual(Object.keys(dark), Object.keys(light));
	assert.match(dark.surface, /^var\(--wp--/);
	assert.match(light.surface, /^var\(--wp--/);
});

test('round-trip: parse → policy → toScss reproduces the SCSS scheme blocks', () => {
	const policy = buildPolicy(parseScss(SCSS));
	const regenerated = toScss(policy);

	// Every `--brk-color-*: …;` declaration from the source appears verbatim.
	const decls = SCSS.match(/--brk-color-[\w-]+:\s*[^;]+;/g) ?? [];
	assert.ok(decls.length >= 16, 'expected dark + light declarations');
	for (const decl of decls) {
		assert.ok(regenerated.includes(decl), `missing: ${decl}`);
	}
});

test('policy values are palette-sourced (a var or color-mix of vars), never raw literals', () => {
	const policy = buildPolicy(parseScss(SCSS));
	const literal = /hsl\(|rgb\(|#[0-9a-f]{3}/i;
	for (const [role, v] of Object.entries(policy.roles)) {
		// Each value references a palette variable (directly or inside color-mix())…
		assert.match(v.dark, /var\(--wp--(preset|custom)--color--/, `${role} dark`);
		assert.match(v.light, /var\(--wp--(preset|custom)--color--/, `${role} light`);
		// …and never hard-codes a color literal.
		assert.doesNotMatch(v.dark, literal, `${role} dark is a literal`);
		assert.doesNotMatch(v.light, literal, `${role} light is a literal`);
	}
});

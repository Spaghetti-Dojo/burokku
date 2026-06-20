#!/usr/bin/env node
/**
 * Color-scheme audit CLI.
 *
 *   node tools/color-scheme-audit/cli.mjs [--base-url URL] [--pages a,b]
 *                                         [--threshold 4.5] [--json]
 *
 * Exits non-zero when any audited pairing fails the contrast threshold in
 * either scheme, so it can gate CI. Non-flipping and unresolved pairings are
 * reported as warnings (not gate failures) unless `--strict` is passed.
 */

import { audit, AA_NORMAL } from './audit.mjs';

function arg(name, fallback) {
	const i = process.argv.indexOf(`--${name}`);
	return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const has = (name) => process.argv.includes(`--${name}`);

const baseUrl = arg('base-url', 'http://localhost:8888/');
const pages = arg('pages', '/blocks/').split(',').map((s) => s.trim()).filter(Boolean);
const threshold = Number(arg('threshold', String(AA_NORMAL)));
const asJson = has('json');
const strict = has('strict');

function pct(c) {
	return c === null ? 'n/a' : c.toFixed(2);
}

const report = await audit({ baseUrl, pages, threshold });

if (asJson) {
	process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
	console.log(`Color-scheme audit — ${baseUrl} (AA threshold ${threshold}:1)\n`);
	for (const r of report.rows) {
		const flag = r.fails.length ? '✗ FAIL' : r.nonFlip ? '~ non-flip' : '✓';
		console.log(
			`${flag.padEnd(11)} ${r.role.padEnd(18)} dark ${pct(r.dark.contrast).padStart(6)}  ` +
				`light ${pct(r.light.contrast).padStart(6)}  [${r.source}]`
		);
	}
	console.log(
		`\nFailing: ${report.failing.length} · Non-flipping: ${report.nonFlipping.length} · ` +
			`Unresolved: ${report.unresolved.length}`
	);
}

const gateFails = report.failing.length > 0 || (strict && report.nonFlipping.length > 0);
process.exit(gateFails ? 1 : 0);

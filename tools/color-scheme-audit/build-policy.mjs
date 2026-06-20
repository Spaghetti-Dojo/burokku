#!/usr/bin/env node
/**
 * Generate the committed scheme-policy (`tools/color-scheme-audit/color-scheme.policy.json`) from
 * the `--brk-color-*` SCSS mapping, attaching the per-role rationale. The policy
 * is the reviewable record; the SCSS is regenerable from it (see policy.test.mjs
 * round-trip). The skill rewrites this file when it (re)authors a scheme.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseScss, buildPolicy, serialize } from './policy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCSS = path.join(ROOT, 'sources/client/styles/color-scheme.scss');
const OUT = path.join(ROOT, 'tools/color-scheme-audit/color-scheme.policy.json');

const rationale = {
	'surface': 'Page background; opposite lightness pole per scheme.',
	'on-surface': 'Body text; maximal contrast against the surface.',
	'on-surface-muted': 'Secondary/placeholder text; readable but de-emphasized.',
	'accent': 'Primary button background and focus ring; flips with on-accent to keep contrast.',
	'on-accent': 'Text on the accent surface.',
	'accent-hover': 'Primary button hover background.',
	'muted': 'Secondary surfaces (secondary button, inline code, nav pill).',
	'field': 'Input / preformatted / striped-row surfaces.',
	'border': 'Hairline borders; intentionally low contrast.',
	'link-hover': 'Link hover text.',
};

const policy = buildPolicy(parseScss(fs.readFileSync(SCSS, 'utf8')), { rationale });
fs.writeFileSync(OUT, serialize(policy));
console.log(`✔ Wrote ${path.relative(ROOT, OUT)}`);

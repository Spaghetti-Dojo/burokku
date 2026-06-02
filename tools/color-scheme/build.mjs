#!/usr/bin/env node
/**
 * Orchestrator: reader → generator (light.json) → flattener (color-scheme.css).
 *
 * Usage:
 *   node tools/color-scheme/build.mjs           Write light.json + color-scheme.css.
 *   node tools/color-scheme/build.mjs --check    Fail (exit 1) if the committed
 *                                                styles/light.json is stale vs theme.json.
 *
 * Only `styles/light.json` is committed and gated here; `dist/` is gitignored,
 * so `dist/styles/color-scheme.css` is a pure build artifact, deterministically
 * (re)produced from light.json during `pnpm build`.
 */

import fs from 'node:fs';

import { generate, writeLightJson, LIGHT_JSON } from './generate.mjs';
import { writeCss, COLOR_SCHEME_CSS } from './flatten.mjs';

const rel = ( p ) => p.replace( `${ process.cwd() }/`, '' );

function readOrEmpty( file ) {
	return fs.existsSync( file ) ? fs.readFileSync( file, 'utf8' ) : '';
}

function check() {
	const freshLight = generate();
	const committedLight = readOrEmpty( LIGHT_JSON );

	if ( freshLight !== committedLight ) {
		console.error(
			`✖ ${ rel( LIGHT_JSON ) } is stale vs theme.json.\n` +
				'  Run `pnpm build:color-scheme` and commit the result.'
		);
		process.exit( 1 );
	}

	console.log( '✔ styles/light.json is up to date.' );
}

function build() {
	writeLightJson();
	writeCss();
	console.log( `✔ Wrote ${ rel( LIGHT_JSON ) } and ${ rel( COLOR_SCHEME_CSS ) }` );
}

process.argv.includes( '--check' ) ? check() : build();

/**
 * Color-scheme audit orchestrator.
 *
 * Loads each page in both schemes (dark / light) via headless Chromium —
 * applying the scheme before paint by seeding `localStorage['burokku-theme']`
 * so reads are never stale — enumerates the pairings, and for each element
 * computes the WCAG contrast in both schemes and whether it flips. The browser
 * resolves `var()` / `color-mix()` / `oklab(from …)` to final `rgb()` for us.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { contrastRatio, AA_NORMAL } from './contrast.mjs';
import { PAIRINGS, collectInPage } from './pairings.mjs';

const require = createRequire(import.meta.url);

/** Resolve Playwright's `chromium` across pnpm layouts. */
function loadChromium() {
	const tries = ['@playwright/test', 'playwright'];
	for (const id of tries) {
		try {
			return require(id).chromium;
		} catch {
			/* keep trying */
		}
	}
	// pnpm strict store fallback: scan for the hoisted package.
	const store = path.resolve(process.cwd(), 'node_modules/.pnpm/node_modules/@playwright/test');
	if (fs.existsSync(store)) {
		return require(store).chromium;
	}
	throw new Error('Playwright not found. Run: pnpm exec playwright install chromium-headless-shell');
}

/** Classify the likely source of a color from its inline-style / class hints. */
function classifySource({ inlineStyle }) {
	if (/var\(--wp--custom--/.test(inlineStyle)) {
		return 'bridge-token';
	}
	if (/var\(--wp--preset--|hsl\(|rgb\(|#[0-9a-f]/i.test(inlineStyle)) {
		return 'block-markup';
	}
	return 'theme-code';
}

const key = (r) => `${r.role}|${r.selector}|${r.index}`;

/**
 * @param {{baseUrl:string, pages:string[], threshold:number}} options
 */
export async function audit({ baseUrl, pages, threshold }) {
	const chromium = loadChromium();
	const browser = await chromium.launch({ headless: true });

	/** @type {Record<'dark'|'light', Map<string, any>>} */
	const byScheme = { dark: new Map(), light: new Map() };

	try {
		for (const scheme of ['dark', 'light']) {
			const context = await browser.newContext();
			await context.addInitScript((s) => {
				try {
					localStorage.setItem('burokku-theme', s);
				} catch {
					/* private mode */
				}
			}, scheme);
			const page = await context.newPage();
			for (const rel of pages) {
				await page.goto(new URL(rel, baseUrl).toString(), { waitUntil: 'networkidle' });
				const records = await page.evaluate(collectInPage, PAIRINGS);
				for (const rec of records) {
					byScheme[scheme].set(`${rel}|${key(rec)}`, rec);
				}
			}
			await context.close();
		}
	} finally {
		await browser.close();
	}

	const rows = [];
	for (const [id, dark] of byScheme.dark) {
		const light = byScheme.light.get(id);
		if (!light) {
			continue;
		}
		const darkContrast = contrastRatio(dark.fg, dark.bg);
		const lightContrast = contrastRatio(light.fg, light.bg);
		const nonFlip = dark.fg === light.fg && dark.bg === light.bg;
		const fails = [];
		if (darkContrast !== null && darkContrast < threshold) {
			fails.push('dark');
		}
		if (lightContrast !== null && lightContrast < threshold) {
			fails.push('light');
		}
		const unresolved = darkContrast === null || lightContrast === null;
		rows.push({
			role: dark.role,
			id,
			source: classifySource(dark),
			dark: { fg: dark.fg, bg: dark.bg, contrast: darkContrast },
			light: { fg: light.fg, bg: light.bg, contrast: lightContrast },
			nonFlip,
			unresolved,
			fails,
		});
	}

	return {
		threshold,
		baseUrl,
		pages,
		rows,
		failing: rows.filter((r) => r.fails.length > 0),
		nonFlipping: rows.filter((r) => r.nonFlip),
		unresolved: rows.filter((r) => r.unresolved),
	};
}

export { AA_NORMAL };

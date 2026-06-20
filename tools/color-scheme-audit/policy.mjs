/**
 * Scheme-policy: the durable, reviewable record of the role → palette decision
 * per scheme. It is the source of truth the skill writes; the `--brk-color-*`
 * SCSS mapping is regenerated from it, so a re-apply reproduces the same SCSS
 * (round-trip). Each role records its dark and light palette `var()`, a short
 * rationale, and (optionally) the measured contrast from the audit.
 */

const ROLE_RE = /--brk-color-([\w-]+):\s*([^;]+);/g;

/**
 * Parse the two scheme blocks out of `color-scheme.scss`.
 *
 * @param {string} scss
 * @return {{dark: Record<string,string>, light: Record<string,string>}}
 */
export function parseScss(scss) {
	scss = scss.replace(/\/\*[\s\S]*?\*\//g, '');
	const block = (selector) => {
		const start = scss.indexOf(selector);
		if (start === -1) {
			return {};
		}
		const open = scss.indexOf('{', start);
		const close = scss.indexOf('}', open);
		const body = scss.slice(open + 1, close);
		const map = {};
		let m;
		ROLE_RE.lastIndex = 0;
		while ((m = ROLE_RE.exec(body)) !== null) {
			map[m[1]] = m[2].trim();
		}
		return map;
	};
	return { dark: block(':root'), light: block('[data-theme="light"]') };
}

/**
 * Build the policy object from parsed scheme maps, carrying rationale/contrast
 * from a prior policy or an audit report when available.
 *
 * @param {{dark:Record<string,string>, light:Record<string,string>}} maps
 * @param {{rationale?:Record<string,string>, contrast?:Record<string,object>}} [meta]
 */
export function buildPolicy(maps, meta = {}) {
	const roles = {};
	for (const role of Object.keys(maps.dark)) {
		roles[role] = {
			dark: maps.dark[role],
			light: maps.light[role] ?? maps.dark[role],
			rationale: meta.rationale?.[role] ?? '',
			contrast: meta.contrast?.[role] ?? null,
		};
	}
	return { base: 'dark', counterpart: 'light', roles };
}

/**
 * Regenerate the two SCSS scheme blocks from a policy (round-trip target).
 *
 * @param {{roles: Record<string,{dark:string,light:string}>}} policy
 * @return {string}
 */
export function toScss(policy) {
	const decls = (scheme) =>
		Object.entries(policy.roles)
			.map(([role, v]) => `\t--brk-color-${role}: ${v[scheme]};`)
			.join('\n');
	return `:root {\n${decls('dark')}\n}\n\n[data-theme="light"] {\n${decls('light')}\n}\n`;
}

/** Stable JSON serialization (2-space, trailing newline). */
export function serialize(policy) {
	return JSON.stringify(policy, null, 2) + '\n';
}

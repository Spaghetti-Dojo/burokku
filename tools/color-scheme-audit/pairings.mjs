/**
 * The element → role pairings the audit enumerates from the rendered page.
 *
 * Selectors are matched against the live DOM (so block-markup-authored colors
 * and `var:custom` bridge tokens are covered, not just theme.json/SCSS). Each
 * entry yields up to `limit` elements; for each, the audit reads the computed
 * foreground and the effective (nearest opaque) background.
 */

/**
 * @typedef {{role:string, selector:string, limit?:number}} Pairing
 */

/** @type {Pairing[]} */
export const PAIRINGS = [
	{ role: 'body-text', selector: 'main p', limit: 4 },
	{ role: 'heading', selector: 'main h1, main h2, main h3', limit: 2 },
	{ role: 'link', selector: 'main a:not(.wp-element-button):not(.wp-block-navigation-item__content)', limit: 1 },
	{ role: 'button-default', selector: '.wp-block-button:not([class*="is-style-burokku"]) .wp-block-button__link', limit: 1 },
	{ role: 'button-outline', selector: '.wp-block-button.is-style-burokku-outline .wp-block-button__link', limit: 1 },
	{ role: 'button-ghost', selector: '.wp-block-button.is-style-burokku-ghost .wp-block-button__link', limit: 1 },
	{ role: 'button-secondary', selector: '.wp-block-button.is-style-burokku-secondary .wp-block-button__link', limit: 1 },
	{ role: 'inline-code', selector: ':not(pre) > code', limit: 1 },
	{ role: 'pre', selector: 'pre', limit: 1 },
	{ role: 'table-cell', selector: '.wp-block-table td, .wp-block-table th', limit: 3 },
	{ role: 'search-input', selector: '.wp-block-search__input', limit: 1 },
	{ role: 'footer-copyright', selector: '.burokku-footer-copyright', limit: 1 },
	{ role: 'footer-link', selector: '.burokku-footer-copyright a', limit: 1 },
	{ role: 'footer-nav', selector: '.burokku-footer-navigation a', limit: 2 },
];

/**
 * In-page collector. Stringified and run via `page.evaluate(collectSource,
 * pairings)`. Returns one record per matched element with its computed
 * foreground, effective opaque background, and source hints (inline style /
 * class) used later to classify the color source.
 *
 * @param {Pairing[]} pairings
 * @return {Array<{role:string,selector:string,index:number,fg:string,bg:string,inlineStyle:string,cls:string}>}
 */
export function collectInPage(pairings) {
	const isOpaque = (c) => {
		if (!c || c === 'transparent') {
			return false;
		}
		const m = c.match(/-?[\d.]+/g);
		const a = m && m.length >= 4 ? Number(m[3]) : 1;
		return a >= 1;
	};
	const effectiveBg = (el) => {
		let node = el;
		while (node && node.nodeType === 1) {
			const cs = getComputedStyle(node);
			// Text over media (cover blocks, CSS background images) is not
			// deterministically WCAG-gateable against the page background: bail out.
			if (node.matches && node.matches('.wp-block-cover')) {
				return '__image__';
			}
			if (cs.backgroundImage && cs.backgroundImage !== 'none') {
				return '__image__';
			}
			if (isOpaque(cs.backgroundColor)) {
				return cs.backgroundColor;
			}
			node = node.parentElement;
		}
		return getComputedStyle(document.body).backgroundColor;
	};

	const out = [];
	for (const p of pairings) {
		const nodes = Array.from(document.querySelectorAll(p.selector)).slice(0, p.limit || 1);
		nodes.forEach((el, index) => {
			const cs = getComputedStyle(el);
			out.push({
				role: p.role,
				selector: p.selector,
				index,
				fg: cs.color,
				bg: effectiveBg(el),
				inlineStyle: el.getAttribute('style') || '',
				cls: el.getAttribute('class') || '',
			});
		});
	}
	return out;
}

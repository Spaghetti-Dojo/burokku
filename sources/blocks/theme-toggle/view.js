/**
 * Theme toggle — WordPress Interactivity API store.
 *
 * Hand-written native ES module (not built by the CSS-only webpack pipeline).
 * Registered as the `@burokku/theme-toggle` script module with a dependency on
 * `@wordpress/interactivity`, which WordPress core serves via its import map.
 */

import { store } from '@wordpress/interactivity';

const STORAGE_KEY = 'burokku-theme';

/**
 * The scheme currently shown: an explicit `data-theme` on <html>, otherwise the
 * operating system preference. Mirrors the no-flash inline head script.
 *
 * @return {'light'|'dark'} Active scheme.
 */
function currentTheme() {
	const explicit = document.documentElement.dataset.theme;

	if ( explicit === 'light' || explicit === 'dark' ) {
		return explicit;
	}

	return window.matchMedia( '(prefers-color-scheme: dark)' ).matches
		? 'dark'
		: 'light';
}

const { state } = store( 'burokku/theme-toggle', {
	actions: {
		toggle() {
			const next = currentTheme() === 'dark' ? 'light' : 'dark';

			document.documentElement.dataset.theme = next;

			try {
				window.localStorage.setItem( STORAGE_KEY, next );
			} catch ( error ) {
				// Storage unavailable (private mode/quota); choice lives for the session only.
			}

			state.theme = next;
			state.isDark = next === 'dark';
		},
	},
	callbacks: {
		init() {
			// Sync reactive state (and aria-pressed) with the pre-paint scheme.
			const theme = currentTheme();
			state.theme = theme;
			state.isDark = theme === 'dark';

			try {
				var storedTheme = localStorage.getItem( 'burokku-theme' );
				if ( storedTheme === 'light' || storedTheme === 'dark' ) {
					document.documentElement.dataset.theme = storedTheme;
				}
			} catch ( e ) {}
		},
	},
} );

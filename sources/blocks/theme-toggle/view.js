import { store } from '@wordpress/interactivity';

const STORAGE_KEY = 'burokku-theme';

/**
 * The server-detected base polarity, published on `<html>` by the no-FOUC head
 * script. Defaults to `dark` when the signal is absent.
 *
 * @return {'light'|'dark'} Base scheme.
 */
function baseScheme() {
	return document.documentElement.dataset.themeBase === 'light'
		? 'light'
		: 'dark';
}

/**
 * @return {'light'|'dark'} Active scheme.
 */
function currentTheme() {
	const explicit = document.documentElement.dataset.theme;

	if ( explicit === 'light' || explicit === 'dark' ) {
		return explicit;
	}

	if ( window.matchMedia( '(prefers-color-scheme: light)' ).matches ) {
		return 'light';
	}

	if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) {
		return 'dark';
	}

	return baseScheme();
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
				const storedTheme = localStorage.getItem( 'burokku-theme' );
				if ( storedTheme === 'light' || storedTheme === 'dark' ) {
					document.documentElement.dataset.theme = storedTheme;
				}
			} catch ( e ) {}
		},
	},
} );

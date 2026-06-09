import { store } from '@wordpress/interactivity';

const STORAGE_KEY = 'burokku-theme';

/**
 * @return {'light'|'dark'} Active scheme.
 */
function currentTheme() {
	const explicit = document.documentElement.dataset.theme;

	if ( explicit === 'light' || explicit === 'dark' ) {
		return explicit;
	}

	return window.matchMedia( '(prefers-color-scheme: light)' ).matches
		? 'light'
		: 'dark';
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

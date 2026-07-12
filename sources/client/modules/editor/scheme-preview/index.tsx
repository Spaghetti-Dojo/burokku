import { registerPlugin } from '@wordpress/plugins';
import { PluginMoreMenuItem } from '@wordpress/editor';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { select, subscribe, useDispatch, useSelect } from '@wordpress/data';
import {
	store as keyboardShortcutsStore,
	useShortcut,
} from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';

const STORAGE_KEY = 'burokku-theme';
const SHORTCUT_NAME = 'burokku/scheme-preview/toggle';

// `PluginMoreMenuItem` forwards unknown props to the underlying `MenuItem`, but
// its published types omit `shortcut`; alias it so the prop type-checks.
const MoreMenuItem = PluginMoreMenuItem as unknown as (
	props: Record< string, unknown >
) => JSX.Element;

type Scheme = 'light' | 'dark';

function otherScheme( scheme: Scheme ): Scheme {
	return scheme === 'dark' ? 'light' : 'dark';
}

/**
 * Resolve the document the editor canvas renders into.
 *
 * The block editor renders content inside an iframe (`editor-canvas`) in both
 * the post and site editors. When the canvas is not iframed, the editor renders
 * into the current document.
 */
function canvasDocument(): Document {
	const iframe = document.querySelector< HTMLIFrameElement >(
		'iframe[name="editor-canvas"]'
	);

	return iframe?.contentDocument ?? document;
}

/**
 * Apply the active scheme to the canvas via the `data-theme` signal owned by the
 * `theme-state` contract; `color-scheme.css` keys its `[data-theme="light"]`
 * `--brk-color-*` overrides off it.
 *
 * Setting it on the canvas document root suffices: the scheme swaps only the
 * theme's own `--brk-color-*` variables, which WordPress does not re-emit on
 * `.editor-styles-wrapper` (unlike palette preset variables), so a wrapper-level
 * override is not needed for the light tokens to resolve inside the wrapper.
 * @param scheme
 */
function applyScheme( scheme: Scheme ): void {
	canvasDocument().documentElement.dataset[ 'theme' ] = scheme;
}

/**
 * Read an explicit, persisted choice from the shared `theme-state` storage key.
 */
function storedScheme(): Scheme | null {
	try {
		const value = window.localStorage.getItem( STORAGE_KEY );

		return value === 'light' || value === 'dark' ? value : null;
	} catch {
		return null;
	}
}

/**
 * Server-detected base polarity, published on `<html>` by the no-FOUC head
 * script (`data-theme-base`). Defaults to `dark` when the signal is absent.
 */
function baseScheme(): Scheme {
	return document.documentElement.dataset[ 'themeBase' ] === 'light'
		? 'light'
		: 'dark';
}

/**
 * `theme-state` resolution precedence: explicit stored choice →
 * `prefers-color-scheme` → base polarity.
 */
function resolveScheme(): Scheme {
	const stored = storedScheme();

	if ( stored ) {
		return stored;
	}

	if ( window.matchMedia( '(prefers-color-scheme: light)' ).matches ) {
		return 'light';
	}

	if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) {
		return 'dark';
	}

	return baseScheme();
}

/**
 * Persist only explicit toggles, mirroring the front end (system-derived
 * defaults are never written).
 * @param scheme
 */
function persistScheme( scheme: Scheme ): void {
	try {
		window.localStorage.setItem( STORAGE_KEY, scheme );
	} catch {
		// Storage unavailable (private mode/quota); choice lives for the session.
	}
}

type EditorSelectors = { getDeviceType?: () => string };

function deviceType(): string {
	const editor = select( 'core/editor' ) as unknown as EditorSelectors | null;

	return editor?.getDeviceType?.() ?? '';
}

/**
 * More-menu affordance that flips the previewed canvas scheme. The label names
 * the scheme the click switches *to*, so it reads as the action it performs.
 */
/**
 * The requested combination is ⌘⌃M, which the WordPress shortcut registry can't
 * express (⌘+⌃ is not a named modifier), so it is handled with a custom listener
 * here. The canonical, help-listed binding is `access+m` (⌃⌥M on macOS), bound
 * through `useShortcut`.
 * @param event
 */
function isMetaCtrlM( event: KeyboardEvent ): boolean {
	return event.metaKey && event.ctrlKey && event.code === 'KeyM';
}

type ToggleRef = { current: () => void };

/**
 * Owns the previewed scheme state and a stable toggle, plus a ref to the latest
 * toggle for the non-React keyboard listeners.
 */
function useSchemeToggle(): {
	scheme: Scheme;
	toggle: () => void;
	toggleRef: ToggleRef;
} {
	const [ scheme, setScheme ] = useState< Scheme >( resolveScheme );

	const toggle = useCallback( (): void => {
		setScheme( ( current: Scheme ): Scheme => {
			const next = otherScheme( current );

			applyScheme( next );
			persistScheme( next );

			return next;
		} );
	}, [] );

	const toggleRef = useRef( toggle );
	toggleRef.current = toggle;

	return { scheme, toggle, toggleRef };
}

/**
 * Registers the canonical, shortcuts-help-listed binding (`access+m`, ⌃⌥M) and
 * returns its display representation.
 * @param toggleRef
 */
function useAccessShortcut( toggleRef: ToggleRef ): string | null {
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );
	const shortcut = useSelect(
		( selectStore ): string | null =>
			selectStore( keyboardShortcutsStore ).getShortcutRepresentation(
				SHORTCUT_NAME
			),
		[]
	);

	useEffect( (): void => {
		registerShortcut( {
			name: SHORTCUT_NAME,
			category: 'global',
			description: __( 'Toggle the previewed color scheme.', 'burokku' ),
			keyCombination: { modifier: 'access', character: 'm' },
		} );
	}, [ registerShortcut ] );

	useShortcut( SHORTCUT_NAME, (): void => {
		toggleRef.current();
	} );

	return shortcut;
}

/**
 * Binds the best-effort ⌘⌃M listener on the top document and the canvas
 * document, watching for canvas (re)mounts. Returns a teardown.
 * @param toggleRef
 */
function bindMetaCtrlM( toggleRef: ToggleRef ): () => void {
	const handler = ( event: KeyboardEvent ): void => {
		if ( isMetaCtrlM( event ) ) {
			event.preventDefault();
			toggleRef.current();
		}
	};

	const bound: Set< Document > = new Set();
	const bind = ( doc: Document ): void => {
		if ( bound.has( doc ) ) {
			return;
		}
		bound.add( doc );
		doc.addEventListener( 'keydown', handler );
	};

	bind( document );
	bind( canvasDocument() );

	const observer = new MutationObserver( (): void => {
		bind( canvasDocument() );
	} );
	observer.observe( document.body, { childList: true, subtree: true } );

	return (): void => {
		observer.disconnect();
		bound.forEach( ( doc: Document ): void => {
			doc.removeEventListener( 'keydown', handler );
		} );
	};
}

/**
 * ⌘⌃M fires whether focus is in the editor chrome or inside the canvas iframe.
 * @param toggleRef
 */
function useMetaCtrlMShortcut( toggleRef: ToggleRef ): void {
	useEffect(
		(): ( () => void ) => bindMetaCtrlM( toggleRef ),
		[ toggleRef ]
	);
}

/**
 * Applies the scheme to the canvas now and re-applies it when a device/zoom
 * change or remount recreates the canvas iframe. Returns a teardown.
 * @param scheme
 */
function syncCanvasScheme( scheme: Scheme ): () => void {
	const reapply = (): void => {
		applyScheme( scheme );
	};
	reapply();

	// A device-preview/zoom change recreates the canvas iframe, dropping the
	// attribute previously set on its `contentDocument`.
	let lastDevice = deviceType();
	const unsubscribe = subscribe( (): void => {
		const current = deviceType();

		if ( current !== lastDevice ) {
			lastDevice = current;
			reapply();
		}
	} );

	// A freshly mounted canvas iframe needs the attribute (re-)applied, on both
	// insertion and document `load`.
	const observer = new MutationObserver( (): void => {
		const iframe = document.querySelector< HTMLIFrameElement >(
			'iframe[name="editor-canvas"]'
		);

		if ( iframe ) {
			reapply();
			iframe.addEventListener( 'load', reapply, { once: true } );
		}
	} );
	observer.observe( document.body, { childList: true, subtree: true } );

	return (): void => {
		unsubscribe();
		observer.disconnect();
	};
}

/**
 * Keeps the canvas `data-theme` in sync with the previewed scheme.
 * @param scheme
 */
function useCanvasSchemeSync( scheme: Scheme ): void {
	useEffect( (): ( () => void ) => syncCanvasScheme( scheme ), [ scheme ] );
}

function SchemePreview(): JSX.Element {
	const { scheme, toggle, toggleRef } = useSchemeToggle();
	const target = otherScheme( scheme );
	const shortcut = useAccessShortcut( toggleRef );

	useMetaCtrlMShortcut( toggleRef );
	useCanvasSchemeSync( scheme );

	return (
		<MoreMenuItem onClick={ toggle } shortcut={ shortcut }>
			{ target === 'light'
				? __( 'Preview light scheme', 'burokku' )
				: __( 'Preview dark scheme', 'burokku' ) }
		</MoreMenuItem>
	);
}

registerPlugin( 'burokku-scheme-preview', {
	render: SchemePreview,
} );

export { STORAGE_KEY, applyScheme, canvasDocument, resolveScheme };
export type { Scheme };

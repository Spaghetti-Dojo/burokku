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
 * token overrides off it.
 *
 * Two targets are needed in the editor: the document root (front-end parity,
 * and the toggle block's `:root[data-theme]` icon rules) and the
 * `.editor-styles-wrapper`, because WordPress re-emits the theme.json preset
 * custom properties on that wrapper — an override on the ancestor `<html>` is
 * shadowed for everything inside it.
 */
function applyScheme( scheme: Scheme ): void {
	const doc = canvasDocument();
	const targets: HTMLElement[] = [ doc.documentElement ];
	const wrapper = doc.querySelector< HTMLElement >(
		'.editor-styles-wrapper'
	);

	if ( wrapper ) {
		targets.push( wrapper );
	}

	for ( const target of targets ) {
		target.dataset[ 'theme' ] = scheme;
	}
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
 * `theme-state` resolution precedence: explicit stored choice →
 * `prefers-color-scheme` → `dark`.
 */
function resolveScheme(): Scheme {
	const stored = storedScheme();

	if ( stored ) {
		return stored;
	}

	return window.matchMedia( '(prefers-color-scheme: light)' ).matches
		? 'light'
		: 'dark';
}

/**
 * Persist only explicit toggles, mirroring the front end (system-derived
 * defaults are never written).
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
	const editor = select(
		'core/editor'
	) as unknown as EditorSelectors | null;

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
 */
function isMetaCtrlM( event: KeyboardEvent ): boolean {
	return event.metaKey && event.ctrlKey && event.code === 'KeyM';
}

function SchemePreview() {
	const [ scheme, setScheme ] = useState< Scheme >( resolveScheme );
	const target = otherScheme( scheme );

	const toggle = useCallback( () => {
		setScheme( ( current ) => {
			const next = otherScheme( current );

			applyScheme( next );
			persistScheme( next );

			return next;
		} );
	}, [] );

	// A stable handle to the latest toggle for non-React event listeners.
	const toggleRef = useRef( toggle );
	toggleRef.current = toggle;

	const { registerShortcut } = useDispatch( keyboardShortcutsStore );
	const shortcut = useSelect(
		( selectStore ) =>
			selectStore( keyboardShortcutsStore ).getShortcutRepresentation(
				SHORTCUT_NAME
			),
		[]
	);

	useEffect( () => {
		registerShortcut( {
			name: SHORTCUT_NAME,
			category: 'global',
			description: __(
				'Toggle the previewed color scheme.',
				'burokku'
			),
			keyCombination: { modifier: 'access', character: 'm' },
		} );
	}, [ registerShortcut ] );

	// Canonical, shortcuts-help-listed binding.
	useShortcut( SHORTCUT_NAME, () => toggleRef.current() );

	// Best-effort ⌘⌃M: bound on the top document and on the canvas document so it
	// fires whether focus is in the editor chrome or inside the canvas iframe.
	useEffect( () => {
		const handler = ( event: KeyboardEvent ) => {
			if ( isMetaCtrlM( event ) ) {
				event.preventDefault();
				toggleRef.current();
			}
		};

		const bound = new Set< Document >();
		const bind = ( doc: Document ) => {
			if ( ! bound.has( doc ) ) {
				bound.add( doc );
				doc.addEventListener( 'keydown', handler );
			}
		};

		bind( document );
		bind( canvasDocument() );

		const observer = new MutationObserver( () => bind( canvasDocument() ) );
		observer.observe( document.body, { childList: true, subtree: true } );

		return () => {
			observer.disconnect();
			bound.forEach( ( doc ) =>
				doc.removeEventListener( 'keydown', handler )
			);
		};
	}, [] );

	useEffect( () => {
		applyScheme( scheme );

		const reapply = () => applyScheme( scheme );

		// A device-preview/zoom change recreates the canvas iframe, dropping the
		// attribute previously set on its `contentDocument`.
		let lastDevice = deviceType();
		const unsubscribe = subscribe( () => {
			const current = deviceType();

			if ( current !== lastDevice ) {
				lastDevice = current;
				reapply();
			}
		} );

		// A freshly mounted canvas iframe (initial mount or remount) needs the
		// attribute (re-)applied, on both insertion and document `load`.
		const observer = new MutationObserver( () => {
			const iframe = document.querySelector< HTMLIFrameElement >(
				'iframe[name="editor-canvas"]'
			);

			if ( iframe ) {
				reapply();
				iframe.addEventListener( 'load', reapply, { once: true } );
			}
		} );
		observer.observe( document.body, { childList: true, subtree: true } );

		return () => {
			unsubscribe();
			observer.disconnect();
		};
	}, [ scheme ] );

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

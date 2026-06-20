<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme\ColorScheme;

/**
 * Prints a tiny synchronous, render-blocking script as the first thing in
 * `<head>`, so the visitor's color scheme is applied before first paint (no
 * flash of the base scheme on reload).
 *
 * The default theme (`theme.json`) is dark by convention; its counterpart is
 * `styles/light.json`, flattened to `[data-theme="light"]`. The script resolves
 * the concrete scheme by precedence — explicit `localStorage['burokku-theme']`
 * → `prefers-color-scheme` → the dark base — and sets `html[data-theme]` to a
 * concrete `light`/`dark` value. Must be non-module and inline to run pre-paint.
 */
final readonly class HeadScript
{
    private const BASE_SCHEME = 'dark';

    public static function new(): self
    {
        return new self();
    }

    private function __construct()
    {
    }

    public function init(): void
    {
        add_action('wp_head', $this->print_script(...), 0);
    }

    private function print_script(): void
    {
        $base = wp_json_encode(self::BASE_SCHEME);
        $base = is_string($base) ? $base : '"dark"';

        $script = '(function(){var d=document.documentElement,B=' . $base . ';'
            . 'd.setAttribute("data-theme-base",B);try{'
            . "var s=localStorage.getItem('burokku-theme');"
            . 'var m=window.matchMedia;'
            . "var t=(s==='light'||s==='dark')?s:"
            . "(m('(prefers-color-scheme: dark)').matches?'dark':"
            . "m('(prefers-color-scheme: light)').matches?'light':B);"
            . 'd.setAttribute("data-theme",t);'
            . '}catch(e){d.setAttribute("data-theme",B);}})();';

        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '<script>' . $script . '</script>' . "\n";
    }
}

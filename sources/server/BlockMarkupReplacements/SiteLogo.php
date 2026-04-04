<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\BlockMarkupReplacements;

class SiteLogo
{
    public static function new(): SiteLogo
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function init(): void
    {
        add_filter('render_block_core/site-logo', $this->maybe_render_fallback(...));
    }

    private function maybe_render_fallback(string $html): string
    {
        if ($html !== '') {
            return $html;
        }

        return sprintf(
            '<div class="wp-block-site-logo"><a href="%1$s" rel="home">%2$s</a></div>',
            esc_url(home_url('/')),
            $this->fallback_icon()
        );
    }

    private function fallback_icon(): string
    {
        static $icon = null;

        if ($icon === null) {
            $icon = file_get_contents(
                get_theme_file_path('/assets/icons/site-logo.svg')
            );
        }

        return $icon;
    }
}

<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

final readonly class Styles
{
    public static function new(): Styles
    {
        return new self();
    }

    final private function __construct()
    {
        add_action('wp_enqueue_scripts', $this->register_styles(...));
    }

    public function init(): void
    {
    }

    private function register_styles(): void
    {
        $is_prod_env = defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'production';
        wp_enqueue_style(
            '@burokku/styles-atoms',
            get_theme_file_uri('dist/styles/atoms.css'),
            [],
            $is_prod_env ? wp_get_theme()->get('Version') : null
        );
    }
}

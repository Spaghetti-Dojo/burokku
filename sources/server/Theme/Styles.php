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
    }

    public function init(): void
    {
        add_action('enqueue_block_assets', $this->register_styles(...));
    }

    private function register_styles(): void
    {
        $is_prod_env = wp_get_environment_type() === 'production';
        wp_enqueue_style(
            '@burokku/styles-atoms',
            get_theme_file_uri('dist/styles/atoms.css'),
            [],
            $is_prod_env ? wp_get_theme()->get('Version') : null
        );
    }
}

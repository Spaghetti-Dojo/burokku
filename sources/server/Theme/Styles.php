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
        $version = $is_prod_env
            ? wp_get_theme()->get('Version')
            : null;

        wp_enqueue_style(
            '@burokku/styles-atoms',
            get_theme_file_uri('dist/styles/atoms.css'),
            [],
            $version
        );
        wp_enqueue_style(
            '@burokku/styles-molecules',
            get_theme_file_uri('dist/styles/molecules.css'),
            [],
            $version
        );
        wp_enqueue_style(
            '@burokku/wp-class-utils',
            get_theme_file_uri('dist/styles/wp-class-utils.css'),
            [],
            $version
        );
    }
}

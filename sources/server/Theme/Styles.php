<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

final readonly class Styles
{
    /**
     * @var array<string>
     */
    private const array ASSETS_FILE_NAMES = [
        'dist/styles/atoms.css',
        'dist/styles/molecules.css',
        'dist/styles/wp-class-utils.css',
    ];

    public static function new(): Styles
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function init(): void
    {
        add_action('wp_enqueue_scripts', $this->register_styles(...));
        add_action('admin_init', $this->register_editor_styles(...));
    }

    private function register_styles(): void
    {
        $is_prod_env = wp_get_environment_type() === 'production';
        $version = $is_prod_env
            ? wp_get_theme()->get('Version')
            : null;

        foreach(self::ASSETS_FILE_NAMES as $file_name) {
            $name = basename($file_name, '.css');
            wp_enqueue_style(
                "@burokku/styles-{$name}",
                get_theme_file_uri($file_name),
                [],
                $version
            );
        }
    }

    private function register_editor_styles(): void
    {
        foreach(self::ASSETS_FILE_NAMES as $file_name) {
            add_editor_style($file_name);
        }
    }
}

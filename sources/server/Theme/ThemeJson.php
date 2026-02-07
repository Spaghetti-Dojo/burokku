<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

final readonly class ThemeJson
{
    public static function new(): self
    {
        return new self();
    }

    private function __construct()
    {
    }

    public function init(): void
    {
        add_action('init', $this->register_filter(...), 9999);
    }

    private function register_filter(): void
    {
        add_filter('wp_theme_json_data_default', $this->override_default_theme_json(...));
    }

    private function override_default_theme_json(): \WP_Theme_JSON_Data
    {
        return new \WP_Theme_JSON_Data([], 'default');
    }
}

<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Support;

trait ThemeVersionResolver
{
    private function resolve_version(): ?string
    {
        $is_prod = wp_get_environment_type() === 'production';
        $version = $is_prod ? wp_get_theme()->get('Version') : null;
        return is_string($version) ? $version : null;
    }
}

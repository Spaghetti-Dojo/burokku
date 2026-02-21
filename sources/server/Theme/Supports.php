<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

class Supports
{
    public static function new(): Supports
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function init(): void
    {
        add_theme_support('editor-styles');
        add_theme_support('responsive-embeds');
    }
}

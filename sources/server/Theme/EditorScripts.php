<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

final readonly class EditorScripts
{
    private const string HANDLE = '@burokku/editor-scheme-preview';
    private const string SCRIPT_FILE = 'dist/modules/editor/scheme-preview/index.js';
    private const string ASSET_FILE = 'dist/modules/editor/scheme-preview/index.asset.php';

    public static function new(): EditorScripts
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function init(): void
    {
        add_action('enqueue_block_editor_assets', $this->enqueue_scheme_preview(...));
    }

    private function enqueue_scheme_preview(): void
    {
        $asset_path = get_theme_file_path(self::ASSET_FILE);

        if (!is_readable($asset_path)) {
            return;
        }

        $asset = require $asset_path;

        wp_enqueue_script(
            self::HANDLE,
            get_theme_file_uri(self::SCRIPT_FILE),
            $asset['dependencies'] ?? [],
            $asset['version'] ?? false,
            ['in_footer' => true]
        );

        wp_set_script_translations(self::HANDLE, 'burokku');
    }
}

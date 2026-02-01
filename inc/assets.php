<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

/**
 * Enqueue a stylesheet with theme version.
 *
 * @param string      $handle The handle name for the stylesheet.
 * @param string      $src    The source path relative to theme directory.
 * @param array<int, string> $deps   Optional. Array of dependency handles.
 * @param string|null $media  Optional. The media for which this stylesheet has been defined.
 *
 * @return void
 */
function enqueue_style(
    string $handle,
    string $src,
    array $deps = [],
    ?string $media = 'all'
): void {
    $version = wp_get_theme()->get('Version');
    $uri = get_template_directory_uri() . '/' . ltrim($src, '/');

    wp_enqueue_style($handle, $uri, $deps, $version, $media);
}

/**
 * Enqueue a script with theme version.
 *
 * @param string      $handle    The handle name for the script.
 * @param string      $src       The source path relative to theme directory.
 * @param array<int, string> $deps      Optional. Array of dependency handles.
 * @param bool        $inFooter  Optional. Whether to enqueue the script in the footer.
 *
 * @return void
 */
function enqueue_script(
    string $handle,
    string $src,
    array $deps = [],
    bool $inFooter = true
): void {
    $version = wp_get_theme()->get('Version');
    $uri = get_template_directory_uri() . '/' . ltrim($src, '/');

    wp_enqueue_script($handle, $uri, $deps, $version, $inFooter);
}

/**
 * Register and enqueue editor assets for a block.
 *
 * @param string $blockName The block name (e.g., 'burokku/counter').
 * @param string $scriptHandle The script handle.
 * @param string $scriptPath The path to the script file relative to theme.
 * @param array<int, string>  $scriptDeps Optional. Script dependencies.
 *
 * @return void
 */
function enqueue_block_editor_assets(
    string $blockName,
    string $scriptHandle,
    string $scriptPath,
    array $scriptDeps = []
): void {
    if (!is_admin()) {
        return;
    }

    $version = wp_get_theme()->get('Version');
    $uri = get_template_directory_uri() . '/' . ltrim($scriptPath, '/');

    wp_enqueue_script(
        $scriptHandle,
        $uri,
        $scriptDeps,
        $version,
        true
    );
}

/**
 * Get asset metadata from a built asset file.
 *
 * @param string $assetFile Path to the asset file relative to theme directory.
 *
 * @return array{dependencies: array<int, string>, version: string}
 */
function get_asset_metadata(string $assetFile): array
{
    $assetPath = get_template_directory() . '/' . ltrim($assetFile, '/');

    if (!file_exists($assetPath)) {
        return [
            'dependencies' => [],
            'version' => wp_get_theme()->get('Version'),
        ];
    }

    // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
    $asset = require $assetPath;

    return is_array($asset) ? $asset : [
        'dependencies' => [],
        'version' => wp_get_theme()->get('Version'),
    ];
}

<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

/**
 * Check if a specific block type is registered.
 *
 * @param string $blockName The block name (e.g., 'burokku/counter').
 *
 * @return bool True if the block is registered, false otherwise.
 */
function is_block_registered(string $blockName): bool
{
    return \WP_Block_Type_Registry::get_instance()->is_registered($blockName);
}

/**
 * Get all registered blocks in the theme namespace.
 *
 * @param string $namespace The namespace prefix (e.g., 'burokku').
 *
 * @return array<string, \WP_Block_Type> Array of registered block types.
 */
function get_theme_blocks(string $namespace = 'burokku'): array
{
    $registry = \WP_Block_Type_Registry::get_instance();
    $allBlocks = $registry->get_all_registered();
    $themeBlocks = [];

    foreach ($allBlocks as $blockName => $blockType) {
        if (str_starts_with($blockName, $namespace . '/')) {
            $themeBlocks[$blockName] = $blockType;
        }
    }

    return $themeBlocks;
}

/**
 * Check if a specific block is used in the current content.
 *
 * @param string $blockName The block name to check for.
 *
 * @return bool True if the block is used, false otherwise.
 */
function has_block_in_content(string $blockName): bool
{
    if (is_singular()) {
        return has_block($blockName);
    }

    return false;
}

/**
 * Get block metadata from block.json file.
 *
 * @param string $blockPath The absolute path to the block directory.
 *
 * @return array<string, mixed>|null The block metadata or null if not found.
 */
function get_block_metadata(string $blockPath): ?array
{
    $blockJsonPath = trailingslashit($blockPath) . 'block.json';

    if (!file_exists($blockJsonPath)) {
        return null;
    }

    $metadata = file_get_contents($blockJsonPath);

    if (false === $metadata) {
        return null;
    }

    $decoded = json_decode($metadata, true);

    return is_array($decoded) ? $decoded : null;
}

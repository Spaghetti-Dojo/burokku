<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

/**
 * Render a template part with context variables.
 *
 * @param string               $slug    The template slug (e.g., 'header', 'footer').
 * @param array<string, mixed> $context Variables to extract into the template scope.
 * @param string|null          $name    Optional. The name of the specialized template.
 *
 * @return void
 */
function render_template_part(string $slug, array $context = [], ?string $name = null): void
{
    // Extract context variables into local scope
    if (!empty($context)) {
        // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
        extract($context, EXTR_SKIP);
    }

    // Load the template part
    get_template_part($slug, $name);
}

/**
 * Get the theme directory path.
 *
 * @return string The absolute path to the theme directory.
 */
function theme_path(): string
{
    return get_template_directory();
}

/**
 * Get the theme directory URI.
 *
 * @return string The URI to the theme directory.
 */
function theme_uri(): string
{
    return get_template_directory_uri();
}

/**
 * Check if a specific template part exists.
 *
 * @param string      $slug The template slug.
 * @param string|null $name Optional. The name of the specialized template.
 *
 * @return bool True if the template exists, false otherwise.
 */
function template_exists(string $slug, ?string $name = null): bool
{
    $templates = [];

    if (null !== $name) {
        $templates[] = "{$slug}-{$name}.php";
    }
    $templates[] = "{$slug}.php";

    return (bool) locate_template($templates, false);
}

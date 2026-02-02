<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

/**
 * Boot the Burokku theme package.
 *
 * This function initializes the theme package and handles any boot errors
 * by displaying an admin notice and firing an action for logging purposes.
 *
 * @return void
 */
function boot(): void
{
    try {
        $package = package();
        
        if (!$package->boot()) {
            throw new \RuntimeException(
                'Failed to boot the Burokku theme package.'
            );
        }
    } catch (\Throwable $exception) {
        handleBootFailure($exception);
    }
}

/**
 * Handle boot failure by displaying an admin notice and firing an action.
 *
 * @param \Throwable $exception The exception that occurred during boot.
 * @return void
 */
function handleBootFailure(\Throwable $exception): void
{
    // Fire action for logging or other custom handling
    do_action('burokku_boot_failed', $exception);
    
    // Display admin notice
    add_action(
        'admin_notices',
        static function () use ($exception): void {
            printf(
                '<div class="notice notice-error"><p><strong>%s:</strong> %s</p></div>',
                esc_html__('Burokku Theme Error', 'burokku'),
                esc_html($exception->getMessage())
            );
        }
    );
}

/**
 * Theme setup function.
 *
 * Configures theme supports and editor styles.
 *
 * @return void
 */
function themeSetup(): void
{
    // Add theme support for various features
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('responsive-embeds');
    
    // Enqueue editor styles
    add_editor_style('style.css');
}

// Hook theme setup
add_action('after_setup_theme', __NAMESPACE__ . '\\themeSetup');

// Boot the package
add_action('after_setup_theme', __NAMESPACE__ . '\\boot');

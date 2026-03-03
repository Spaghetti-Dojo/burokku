<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

/**
 * Boot the Burokku theme package.
 *
 * This function initializes the theme package and handles any boot errors
 * by displaying an admin notice and firing an action for logging purposes.
 *
 * @private
 * @internal
 */
function boot(): void
{
    autoload();

    try {
        $package = package();
        $package->boot();
    } catch (\Throwable $exception) {
        handleBootFailure($exception);
    }
}

/**
 * Load the Composer autoloader and ensure the package function is available.
 * This function is called during the boot process to set up autoloading for the theme.
 *
 * @private
 * @throws \RuntimeException if the autoload file is missing or the package function is not found
 *     after including it.
 * @internal
 */
function autoload(): void
{
    $autoloadFile = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoloadFile)) {
        throw new \RuntimeException(
            'Autoload file not found. Please run "composer install" to set up dependencies.'
        );
    }

    if (!function_exists('\\SpaghettiDojo\\Burokku\\package')) {
        require_once $autoloadFile;
    }
    if (!function_exists('\\SpaghettiDojo\\Burokku\\package')) {
        throw new \RuntimeException(
            'Package function not found after including autoload. Please check your setup.'
        );
    }
}

/**
 * Handle boot failure by displaying an admin notice and firing an action.
 *
 * @private
 *
 * @param \Throwable $exception The exception that occurred during boot.
 *
 * @internal
 */
function handleBootFailure(\Throwable $exception): void
{
    do_action('burokku.boot-failed', $exception);

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

// Boot the package
add_action('after_setup_theme', __NAMESPACE__ . '\\boot');

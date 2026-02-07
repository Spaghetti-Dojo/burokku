<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku;

use Inpsyde\Modularity;

/**
 * Get or initialize the theme package.
 *
 * This function provides a singleton instance of the Modularity package
 * for the Burokku theme. It initializes the package with theme properties
 * on first call and returns the cached instance on subsequent calls.
 *
 * @return Modularity\Package The theme package instance.
 */
function package(): Modularity\Package
{
    static $package = null;

    if (null === $package) {
        $themeFilePath = get_template_directory() . '/style.css';
        $properties = Modularity\Properties\ThemeProperties::new($themeFilePath);
        $package = Modularity\Package::new($properties);
        $package->addModule(Theme\Module::new());
        $package->addModule(BlockStyles\Module::new());
    }

    return $package;
}

<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\BlockStyles;

use Inpsyde\Modularity\Module\ExecutableModule;
use Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use Psr\Container\ContainerInterface;

class Module implements ExecutableModule
{
    use ModuleClassNameIdTrait;

    public static function new(): Module
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function run(ContainerInterface $container): bool
    {
        Button::new([
            ['burokku-outline', __('Outline', 'burokku')],
            ['burokku-secondary', __('Secondary', 'burokku')],
            ['burokku-ghost', __('Ghost', 'burokku')],
            ['burokku-link', __('Link', 'burokku')],
        ])->init();

        return true;
    }
}

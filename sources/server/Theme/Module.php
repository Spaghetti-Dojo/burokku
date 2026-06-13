<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

use Inpsyde\Modularity\Module\ExecutableModule;
use Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use Inpsyde\Modularity\Properties\Properties;
use Psr\Container\ContainerInterface;

final readonly class Module implements ExecutableModule
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
        /** @var Properties $properties */
        $properties = $container->get('properties');

        Blocks::new($properties)->init();
        Supports::new()->init();
        ThemeJson::new()->init();
        Styles::new()->init();
        EditorScripts::new()->init();

        return true;
    }
}

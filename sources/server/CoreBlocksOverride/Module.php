<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverride;

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
        Orchestrator::new(
            Quote::new(),
            Button::new(),
        )->init();

        return true;
    }
}

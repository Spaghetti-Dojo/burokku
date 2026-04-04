<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksVisibility;

use Inpsyde\Modularity\Module\ExecutableModule;
use Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use Psr\Container\ContainerInterface;

class Module implements ExecutableModule
{
    use ModuleClassNameIdTrait;

    private const array ALLOWED_BLOCKS = [
        'core/paragraph',
        'core/heading',
        'core/buttons',
        'core/button',
        'core/list',
        'core/list-item',
        'core/quote',
        'core/code',
        'core/preformatted',
        'core/table',
        'core/image',
        'core/accordion',
        'core/accordion-heading',
        'core/group',
        'core/search'
    ];

    public static function new(): Module
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function run(ContainerInterface $container): bool
    {
        add_filter('allowed_block_types_all', static fn() => self::ALLOWED_BLOCKS);

        return true;
    }
}

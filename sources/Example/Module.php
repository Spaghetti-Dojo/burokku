<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Example;

use Inpsyde\Modularity\Module\ExecutableModule;
use Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use Inpsyde\Modularity\Module\ServiceModule;
use Psr\Container\ContainerInterface;

/**
 * Example Module demonstrating Burokku architecture patterns.
 *
 * This module showcases:
 * - Static factory pattern (::new())
 * - ServiceModule for dependency injection
 * - ExecutableModule for WordPress integration
 * - Proper separation of concerns
 */
final class Module implements ServiceModule, ExecutableModule
{
    use ModuleClassNameIdTrait;

    /**
     * Static factory method to create new instance.
     *
     * @return self New module instance.
     */
    public static function new(): self
    {
        return new self();
    }

    /**
     * Private constructor to enforce factory pattern.
     */
    final private function __construct()
    {
        // Constructor intentionally left empty
        // Modules should be stateless
    }

    /**
     * Register services in the PSR container.
     *
     * Services defined here will be available throughout the application
     * via dependency injection.
     *
     * @return array<string, callable> Array of service definitions.
     */
    public function services(): array
    {
        return [
            // Example service with no dependencies
            ExampleService::class => static fn(): ExampleService => ExampleService::new(),

            // Example service with dependencies from container
            ExampleRepository::class => static fn(
                ContainerInterface $container
            ): ExampleRepository => ExampleRepository::new(
                $container->get(ExampleService::class)
            ),
        ];
    }

    /**
     * Execute WordPress integration.
     *
     * This is where WordPress hooks, filters, and REST routes are registered.
     * Business logic should be in separate classes, not here.
     *
     * @param ContainerInterface $container The PSR container.
     *
     * @return bool True on success, false on failure.
     */
    public function run(ContainerInterface $container): bool
    {
        // Register WordPress hooks
        add_action('init', static function () use ($container): void {
            $service = $container->get(ExampleService::class);
            $service->initialize();
        });

        // Register filters
        add_filter('the_content', static function (string $content) use ($container): string {
            $repository = $container->get(ExampleRepository::class);

            return $repository->filterContent($content);
        }, 10, 1);

        return true;
    }
}

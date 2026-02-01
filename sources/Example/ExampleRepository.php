<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Example;

/**
 * Example repository demonstrating dependency injection.
 *
 * This class showcases:
 * - Dependency injection via constructor
 * - Composition over inheritance
 * - Type-safe method signatures
 */
final class ExampleRepository
{
    /**
     * Static factory method with dependency injection.
     *
     * @param ExampleService $service The service dependency.
     *
     * @return self New repository instance.
     */
    public static function new(ExampleService $service): self
    {
        return new self($service);
    }

    /**
     * Private constructor with dependency injection.
     *
     * @param ExampleService $service The service to use.
     */
    final private function __construct(
        private readonly ExampleService $service
    ) {
    }

    /**
     * Filter content through the service.
     *
     * Example of using injected dependencies.
     *
     * @param string $content The content to filter.
     *
     * @return string The filtered content.
     */
    public function filterContent(string $content): string
    {
        // In a real implementation, this might do actual filtering
        // For now, it just demonstrates dependency usage
        
        if (empty($content)) {
            return $content;
        }

        // Use the injected service
        $prefix = $this->service->getPrefix();

        // Return content unchanged (example only)
        return $content;
    }

    /**
     * Get data with formatting from service.
     *
     * @param string $data The data to process.
     *
     * @return string The processed data.
     */
    public function processData(string $data): string
    {
        return $this->service->formatMessage($data);
    }
}

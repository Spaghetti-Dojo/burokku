<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Example;

/**
 * Example service demonstrating architecture patterns.
 *
 * This class showcases:
 * - Static factory pattern
 * - Readonly properties with property promotion
 * - Private constructor
 * - Type safety (strict types)
 */
final class ExampleService
{
    /**
     * Static factory method to create new instance.
     *
     * @param string $prefix Optional prefix for messages.
     *
     * @return self New service instance.
     */
    public static function new(string $prefix = 'Burokku'): self
    {
        return new self($prefix);
    }

    /**
     * Private constructor with readonly property promotion.
     *
     * @param string $prefix The message prefix.
     */
    final private function __construct(
        private readonly string $prefix
    ) {
        // Validation can go in constructor body
        if (empty($this->prefix)) {
            throw new \InvalidArgumentException(
                'Prefix must be a non-empty string'
            );
        }
    }

    /**
     * Initialize the service.
     *
     * @return void
     */
    public function initialize(): void
    {
        // Service initialization logic
        // This could register post types, taxonomies, etc.
    }

    /**
     * Get a formatted message.
     *
     * @param string $message The message to format.
     *
     * @return string The formatted message.
     */
    public function formatMessage(string $message): string
    {
        return sprintf('[%s] %s', $this->prefix, $message);
    }

    /**
     * Get the prefix.
     *
     * @return string The current prefix.
     */
    public function prefix(): string
    {
        return $this->prefix;
    }
}

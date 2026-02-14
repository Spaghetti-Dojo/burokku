<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverride;

use ReflectionClass;

final readonly class Orchestrator
{
    /**
     * @param list<Metadata> $configurations
     */
    public static function new(Metadata ...$configurations): self
    {
        return new self($configurations);
    }

    /**
     * @param list<Metadata> $configurations
     */
    private function __construct(private array $configurations)
    {
    }

    public function init(): void
    {
        add_action('after_setup_theme', $this->remove_block_theme_styles(...), 999);
        add_filter('block_type_metadata', $this->override_metadata(...), 999);
    }

    private function remove_block_theme_styles(): void
    {
        remove_theme_support( 'wp-block-styles' );
    }

    /**
     * @param array<string, mixed> $metadata
     *
     * @return array<string, mixed>
     */
    private function override_metadata(array $metadata): array
    {
        $block_name = $metadata['name'] ?? null;
        if (!is_string($block_name)) {
            return $metadata;
        }

        $configuration = $this->configuration_for($block_name);

        if (!$configuration) {
            return $metadata;
        }

        $overrides = [
            'apiVersion' => $configuration->api_version(),
            'title' => $configuration->title(),
            'category' => $configuration->category(),
            'parent' => $configuration->parent(),
            'description' => $configuration->description(),
            'keywords' => $configuration->keywords(),
            'attributes' => $configuration->attributes(),
            'providesContext' => $configuration->provides_context(),
            'usesContext' => $configuration->uses_context(),
            'supports' => $configuration->supports(),
            'styles' => $configuration->styles(),
            'variations' => $configuration->variations(),
            'example' => $configuration->example(),
            'editorScript' => $configuration->editor_script(),
            'script' => $configuration->script(),
            'viewScript' => $configuration->view_script(),
            'viewScriptModule' => $configuration->view_script_module(),
            'editorStyle' => $configuration->editor_style(),
            'style' => $configuration->style(),
            'render' => $configuration->render(),
        ];

        foreach ($overrides as $key => $value) {
            if ($value !== null) {
                $metadata[$key] = $value;
            }
        }

        return $metadata;
    }

    private function configuration_for(string $blockName): ?Metadata
    {
        return array_find(
            $this->configurations,
            fn (Metadata $configuration) => $this->block_name_for($configuration) === $blockName
        );
    }

    private function block_name_for(Metadata $configuration): ?string
    {
        $reflection = new ReflectionClass($configuration);
        $attributes = $reflection->getAttributes(BlockName::class);

        if ($attributes === []) {
            return null;
        }

        /** @var BlockName $instance */
        $instance = $attributes[0]->newInstance();
        $name = $instance->name();

        return $name !== '' ? $name : null;
    }
}

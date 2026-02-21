<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverride;

#[BlockName('core/quote')]
final readonly class Quote implements Metadata
{
    public static function new(): self
    {
        return new self();
    }

    private function __construct()
    {
    }

    public function api_version(): ?int
    {
        return null;
    }

    public function title(): ?string
    {
        return null;
    }

    public function category(): ?string
    {
        return null;
    }

    public function parent(): ?array
    {
        return null;
    }

    public function description(): ?string
    {
        return null;
    }

    public function keywords(): ?array
    {
        return null;
    }

    public function attributes(): ?array
    {
        return null;
    }

    public function provides_context(): ?array
    {
        return null;
    }

    public function uses_context(): ?array
    {
        return null;
    }

    public function supports(): array|bool|null
    {
        return null;
    }

    public function styles(): ?array
    {
        return [];
    }

    public function variations(): ?array
    {
        return null;
    }

    public function example(): ?array
    {
        return null;
    }

    public function editor_script(): array|string|null
    {
        return null;
    }

    public function script(): array|string|null
    {
        return null;
    }

    public function view_script(): array|string|null
    {
        return null;
    }

    public function view_script_module(): array|string|null
    {
        return null;
    }

    public function editor_style(): array|string|null
    {
        return null;
    }

    public function style(): array|string|null
    {
        return null;
    }

    public function render(): ?string
    {
        return null;
    }

    public function allowed_blocks(): ?array
    {
        return null;
    }

    public function block_hooks(): ?array
    {
        return null;
    }
}

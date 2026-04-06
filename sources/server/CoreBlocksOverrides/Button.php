<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverrides;

#[BlockName('core/button')]
class Button implements Metadata
{
    public static function new(): Button
    {
        return new self();
    }

    final private function __construct()
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

    /** @return string[]|null */
    public function parent(): ?array
    {
        return null;
    }

    public function description(): ?string
    {
        return null;
    }

    /** @return string[]|null */
    public function keywords(): ?array
    {
        return null;
    }

    /** @return array<string, mixed>|null */
    public function attributes(): ?array
    {
        return null;
    }

    /** @return array<string, string>|null */
    public function provides_context(): ?array
    {
        return null;
    }

    /** @return string[]|null */
    public function uses_context(): ?array
    {
        return null;
    }

    /** @return array<string, mixed>|bool|null */
    public function supports(): array|bool|null
    {
        return null;
    }

    /** @return list<array{name: string, label: string}> */
    public function styles(): array
    {
        return [];
    }

    /** @return list<array<string, mixed>>|null */
    public function variations(): ?array
    {
        return null;
    }

    /** @return array<string, mixed>|null */
    public function example(): ?array
    {
        return null;
    }

    /** @return string[]|string|null */
    public function editor_script(): array|string|null
    {
        return null;
    }

    /** @return string[]|string|null */
    public function script(): array|string|null
    {
        return null;
    }

    /** @return string[]|string|null */
    public function view_script(): array|string|null
    {
        return null;
    }

    /** @return string[]|string|null */
    public function view_script_module(): array|string|null
    {
        return null;
    }

    /** @return string[]|string|null */
    public function editor_style(): array|string|null
    {
        return null;
    }

    /** @return string[]|string|null */
    public function style(): array|string|null
    {
        return null;
    }

    public function render(): ?string
    {
        return null;
    }

    /** @return string[]|null */
    public function allowed_blocks(): ?array
    {
        return null;
    }

    /** @return array<string, string>|null */
    public function block_hooks(): ?array
    {
        return null;
    }
}

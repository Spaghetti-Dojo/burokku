<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverrides;

interface Metadata
{
    public function api_version(): ?int;

    public function title(): ?string;

    public function category(): ?string;

    /** @return string[]|null */
    public function parent(): ?array;

    public function description(): ?string;

    /** @return string[]|null */
    public function keywords(): ?array;

    /** @return array<string, mixed>|null */
    public function attributes(): ?array;

    /** @return array<string, string>|null */
    public function provides_context(): ?array;

    /** @return string[]|null */
    public function uses_context(): ?array;

    /** @return array<string, mixed>|bool|null */
    public function supports(): array|bool|null;

    /** @return list<array{name: string, label: string}>|null */
    public function styles(): ?array;

    /** @return list<array<string, mixed>>|null */
    public function variations(): ?array;

    /** @return array<string, mixed>|null */
    public function example(): ?array;

    /** @return string[]|string|null */
    public function editor_script(): array|string|null;

    /** @return string[]|string|null */
    public function script(): array|string|null;

    /** @return string[]|string|null */
    public function view_script(): array|string|null;

    /** @return string[]|string|null */
    public function view_script_module(): array|string|null;

    /** @return string[]|string|null */
    public function editor_style(): array|string|null;

    /** @return string[]|string|null */
    public function style(): array|string|null;

    public function render(): ?string;

    /** @return string[]|null */
    public function allowed_blocks(): ?array;

    /** @return array<string, string>|null */
    public function block_hooks(): ?array;
}

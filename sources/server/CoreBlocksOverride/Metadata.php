<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverride;

interface Metadata
{
    public function api_version(): ?int;

    public function title(): ?string;

    public function category(): ?string;

    public function parent(): ?array;

    public function description(): ?string;

    public function keywords(): ?array;

    public function attributes(): ?array;

    public function provides_context(): ?array;

    public function uses_context(): ?array;

    public function supports(): array|bool|null;

    public function styles(): ?array;

    public function variations(): ?array;

    public function example(): ?array;

    public function editor_script(): array|string|null;

    public function script(): array|string|null;

    public function view_script(): array|string|null;

    public function view_script_module(): array|string|null;

    public function editor_style(): array|string|null;

    public function style(): array|string|null;

    public function render(): ?string;

    public function allowed_blocks(): ?array;

    public function block_hooks(): ?array;
}

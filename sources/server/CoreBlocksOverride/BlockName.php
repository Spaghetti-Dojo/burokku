<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\CoreBlocksOverride;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class BlockName
{
    public function __construct(private string $name)
    {
    }

    public function name(): string
    {
        return $this->name;
    }
}

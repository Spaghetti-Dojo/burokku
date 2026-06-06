<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Theme;

use Inpsyde\Modularity\Properties\Properties;

final readonly class Blocks
{
    public static function new(Properties $properties): Blocks
    {
        return new self($properties);
    }

    final private function __construct(private Properties $properties) {}

    public function init(): void
    {
        add_action(
            'init',
            function () : void {
                wp_register_block_types_from_metadata_collection(
                    $this->properties->basePath() . '/dist/modules/blocks',
                    $this->properties->basePath() . '/dist/modules/blocks/blocks-manifest.php',
                );
            }
        );
    }
}

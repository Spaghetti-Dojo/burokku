<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\CoreBlocksOverrides;

use SpaghettiDojo\Burokku\CoreBlocksOverrides\{Button, Orchestrator};

describe('CoreBlocksOverrides Button', function (): void {
    beforeEach(function (): void {
        Orchestrator::new(Button::new())->init();
    });

    it('clears core/button styles via block_type_metadata filter', function (): void {
        $metadata = [
            'name' => 'core/button',
            'styles' => [
                ['name' => 'fill', 'label' => 'Fill'],
            ],
        ];

        $result = apply_filters('block_type_metadata', $metadata);

        expect($result['styles'])->toBe([]);
    });

    it('preserves non-overridden fields for core/button', function (): void {
        $metadata = [
            'name' => 'core/button',
            'styles' => [
                ['name' => 'fill', 'label' => 'Fill'],
            ],
        ];

        $result = apply_filters('block_type_metadata', $metadata);

        expect($result['name'])->toBe('core/button');
    });

    it('does not affect unrelated blocks', function (): void {
        $metadata = [
            'name' => 'core/paragraph',
            'styles' => [
                ['name' => 'default'],
            ],
        ];

        $result = apply_filters('block_type_metadata', $metadata);

        expect($result['styles'])->toBe([['name' => 'default']]);
    });
});

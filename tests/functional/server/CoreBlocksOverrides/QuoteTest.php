<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\CoreBlocksOverrides;

use SpaghettiDojo\Burokku\CoreBlocksOverrides\{Quote, Orchestrator};

// phpcs:disable Syde.Functions.StaticClosure.PossiblyStaticClosure
describe('CoreBlocksOverrides\Quote', function (): void {
    it('clears core/quote styles via block_type_metadata filter', function (): void {
        Orchestrator::new(Quote::new())->init();

        $metadata = [
            'name' => 'core/quote',
            'styles' => [
                ['name' => 'default', 'label' => 'Default'],
                ['name' => 'plain', 'label' => 'Plain'],
            ],
        ];

        $result = apply_filters('block_type_metadata', $metadata);

        expect($result['styles'])->toBe([]);
    });

    it('preserves non-overridden fields for core/quote', function (): void {
        Orchestrator::new(Quote::new())->init();

        $metadata = [
            'name' => 'core/quote',
            'styles' => [
                ['name' => 'default', 'label' => 'Default'],
            ],
        ];

        $result = apply_filters('block_type_metadata', $metadata);

        expect($result['name'])->toBe('core/quote');
    });

    it('does not affect unrelated blocks', function (): void {
        Orchestrator::new(Quote::new())->init();

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
// phpcs:enable Syde.Functions.StaticClosure.PossiblyStaticClosure

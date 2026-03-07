<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\Theme;

use SpaghettiDojo\Burokku\Theme\Styles;

describe('Theme Styles', function (): void {
    it('enqueues block assets via enqueue_block_assets action', function (): void {
        Styles::new()->init();
        do_action('enqueue_block_assets');

        expect(wp_style_is('@burokku/styles-atoms', 'enqueued'))->toBeTrue()
            ->and(wp_style_is('@burokku/styles-molecules', 'enqueued'))->toBeTrue()
            ->and(wp_style_is('@burokku/wp-class-utils', 'enqueued'))->toBeTrue();
    });

    it('registers styles with correct URIs', function (): void {
        Styles::new()->init();
        do_action('enqueue_block_assets');

        $styles = wp_styles()->registered;

        expect($styles['@burokku/styles-atoms']->src)
            ->toContain('dist/styles/atoms.css')
            ->and($styles['@burokku/styles-molecules']->src)
            ->toContain('dist/styles/molecules.css')
            ->and($styles['@burokku/wp-class-utils']->src)
            ->toContain('dist/styles/wp-class-utils.css');
    });
});

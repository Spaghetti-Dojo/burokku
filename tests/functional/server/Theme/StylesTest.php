<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\Theme;

use SpaghettiDojo\Burokku\Theme\Styles;

describe('Theme Styles', function (): void {
    it('enqueues block assets via wp_enqueue_scripts action', function (): void {
        Styles::new()->init();
        do_action('wp_enqueue_scripts');

        expect(wp_style_is('@burokku/styles-atoms', 'enqueued'))->toBeTrue()
            ->and(wp_style_is('@burokku/styles-molecules', 'enqueued'))->toBeTrue()
            ->and(wp_style_is('@burokku/styles-color-scheme', 'enqueued'))->toBeTrue()
            ->and(wp_style_is('@burokku/styles-wp-class-utils', 'enqueued'))->toBeTrue();
    });

    it('registers styles with correct URIs', function (): void {
        Styles::new()->init();
        do_action('wp_enqueue_scripts');

        $styles = wp_styles()->registered;

        expect($styles['@burokku/styles-atoms']->src)
            ->toContain('dist/styles/atoms.css')
            ->and($styles['@burokku/styles-molecules']->src)
            ->toContain('dist/styles/molecules.css')
            ->and($styles['@burokku/styles-color-scheme']->src)
            ->toContain('dist/styles/color-scheme.css')
            ->and($styles['@burokku/styles-wp-class-utils']->src)
            ->toContain('dist/styles/wp-class-utils.css');
    });
});

<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\BlockStyles;

use SpaghettiDojo\Burokku\BlockStyles\Button;

describe('BlockStyles Button', function (): void {
    beforeEach(function (): void {
        Button::new([
            ['burokku-outline', 'Outline'],
            ['burokku-secondary', 'Secondary'],
            ['burokku-ghost', 'Ghost'],
            ['burokku-link', 'Link'],
        ])->init();
    });

    it('registers four custom block styles for core/button', function (): void {
        do_action('init');

        $styles = \WP_Block_Styles_Registry::get_instance()->get_registered_styles_for_block('core/button');
        $names = array_column($styles, 'name');

        expect($names)->toContain('burokku-outline')
            ->and($names)->toContain('burokku-secondary')
            ->and($names)->toContain('burokku-ghost')
            ->and($names)->toContain('burokku-link');
    });

    it('registers the css style handle on enqueue_block_assets', function (): void {
        do_action('enqueue_block_assets');

        expect(wp_style_is('@burokku/block-styles-button', 'registered'))->toBeTrue();
    });

    it('enqueues css when button block is rendered with html', function (): void {
        do_action('enqueue_block_assets');
        apply_filters('render_block_core/button', '<div class="wp-block-button">Button</div>');

        expect(wp_style_is('@burokku/block-styles-button', 'enqueued'))->toBeTrue();
    });

    it('does not enqueue css when button block is rendered with empty html', function (): void {
        apply_filters('render_block_core/button', '');

        expect(wp_style_is('@burokku/block-styles-button', 'enqueued'))->toBeFalse();
    });
});

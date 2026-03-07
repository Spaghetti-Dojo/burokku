<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\Theme;

use SpaghettiDojo\Burokku\Theme\Supports;

describe('Theme Supports', function (): void {
    it('registers editor-styles support', function (): void {
        Supports::new()->init();
        expect(get_theme_support('editor-styles'))->toBeTruthy();
    });

    it('registers responsive-embeds support', function (): void {
        Supports::new()->init();
        expect(get_theme_support('responsive-embeds'))->toBeTruthy();
    });
});

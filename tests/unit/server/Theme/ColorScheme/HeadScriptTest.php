<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Unit\Theme\ColorScheme;

use Brain\Monkey\Functions;
use SpaghettiDojo\Burokku\Theme\ColorScheme\HeadScript;

describe('HeadScript', function (): void {
    it('registers a synchronous wp_head printer at priority 0', function (): void {
        $registered = [];
        Functions\when('add_action')->alias(
            function (string $hook, callable $cb, int $priority = 10) use (&$registered): bool {
                $registered[] = [$hook, $cb, $priority];
                return true;
            }
        );

        HeadScript::new()->init();

        expect($registered)->toHaveCount(1)
            ->and($registered[0][0])->toBe('wp_head')
            ->and($registered[0][2])->toBe(0)
            ->and($registered[0][1])->toBeCallable();
    });

    it('prints a pre-paint script that resolves the stored scheme onto html[data-theme]', function (): void {
        $printer = null;
        Functions\when('add_action')->alias(
            function (string $hook, callable $cb) use (&$printer): bool {
                if ($hook === 'wp_head') {
                    $printer = $cb;
                }
                return true;
            }
        );
        Functions\when('wp_json_encode')->alias('json_encode');

        HeadScript::new()->init();

        ob_start();
        ($printer)();
        $html = (string) ob_get_clean();

        expect($html)->toStartWith('<script>')
            ->and($html)->toContain("localStorage.getItem('burokku-theme')")
            ->and($html)->toContain('prefers-color-scheme: dark')
            ->and($html)->toContain('setAttribute("data-theme"')
            ->and($html)->toContain('"dark"'); // server base polarity inlined
    });
});

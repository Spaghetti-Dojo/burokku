<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server;

describe('Theme Json', function (): void {
    it('overrides the default theme json', function (): void {
        $core_data = \WP_Theme_JSON_Resolver::get_core_data()->get_data();
        expect(isset($core_data['settings']))->toBeFalse()
            ->and(isset($core_data['styles']))->toBeFalse();
    });
});

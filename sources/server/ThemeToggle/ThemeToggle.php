<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\ThemeToggle;

use SpaghettiDojo\Burokku\Support\ThemeVersionResolver;

final readonly class ThemeToggle
{
    use ThemeVersionResolver;

    private const string MODULE_HANDLE = '@burokku/theme-toggle';
    private const string STORE_NAMESPACE = 'burokku/theme-toggle';
    private const string STORAGE_KEY = 'burokku-theme';

    public static function new(): self
    {
        return new self();
    }

    private function __construct()
    {
    }

    public function init(): void
    {
        add_action('init', $this->register_block(...));
        add_action('init', $this->register_view_module(...));
        add_action('wp_enqueue_scripts', $this->register_interactivity_state(...));
        add_action('wp_head', $this->print_no_flash_script(...), 0);
    }

    private function register_block(): void
    {
        register_block_type(get_theme_file_path('blocks/theme-toggle'));
    }

    private function register_view_module(): void
    {
        wp_register_script_module(
            self::MODULE_HANDLE,
            get_theme_file_uri('blocks/theme-toggle/view.js'),
            ['@wordpress/interactivity'],
            $this->resolve_version()
        );
    }

    private function register_interactivity_state(): void
    {
        // SSR seed for aria-pressed; the view module corrects it on hydration
        // from localStorage / prefers-color-scheme.
        wp_interactivity_state(self::STORE_NAMESPACE, [
            'theme' => 'dark',
            'isDark' => true,
        ]);
    }

    private function print_no_flash_script(): void
    {
        $key = self::STORAGE_KEY;
        ?>
		<script>
			( function () {
				try {
					var t = localStorage.getItem( '<?= esc_js($key) ?>' );
					if ( t === 'light' || t === 'dark' ) {
						document.documentElement.dataset.theme = t;
					}
				} catch ( e ) {}
			} )();
		</script>
        <?php
    }
}

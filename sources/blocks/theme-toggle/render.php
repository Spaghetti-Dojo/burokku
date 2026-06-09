<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

wp_interactivity_state('burokku/theme-toggle', [
    'theme' => 'dark',
    'isDark' => true,
]);

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'theme-toggle',
    'type' => 'button',
    'aria-label' => __('Toggle light and dark color scheme', 'burokku'),
    'data-wp-interactive' => 'burokku/theme-toggle',
    'data-wp-init' => 'callbacks.init',
    'data-wp-on--click' => 'actions.toggle',
    'data-wp-bind--aria-pressed' => 'state.isDark',
]);
?>
<button <?= wp_kses_data($wrapper_attributes) ?>>
	<svg class="wp-block-burokku-theme-toggle__sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
	</svg>
	<svg class="wp-block-burokku-theme-toggle__moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
</button>

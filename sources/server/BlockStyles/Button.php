<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\BlockStyles;

/**
 * @phpstan-type Styles = array<{
 *     0: string,
 *     1: string,
 * }>
 */
final readonly class Button
{
    private const string BLOCK_STYLES_HANDLE = '@burokku/block-styles-button';

    /**
     * @param Styles $styles
     */
    public static function new(array $styles): self
    {
        return new self($styles);
    }

    /**
     * @param Styles $styles
     */
    private function __construct(private array $styles)
    {
    }

    public function init(): void
    {
        add_action('init', $this->register_block_styles(...));
        add_action('enqueue_block_assets', $this->enqueue_block_styles(...));
        add_action('enqueue_block_assets', $this->set_block_style_as_dependency(...));
    }

    private function register_block_styles(): void
    {
        foreach ($this->styles as [$name, $label]) {
            register_block_style(
                'core/button',
                [
                    'name' => $name,
                    'label' => $label,
                    'style_handle' => self::BLOCK_STYLES_HANDLE
                ]
            );
        }
    }

    private function enqueue_block_styles(): void
    {
        if (wp_style_is(self::BLOCK_STYLES_HANDLE, 'registered')) {
            return;
        }

        $is_prod_env = wp_get_environment_type() === 'production';
        wp_register_style(
            self::BLOCK_STYLES_HANDLE,
            get_theme_file_uri('/dist/styles/@block-styles/button.css'),
            [],
            $is_prod_env ? wp_get_theme()->get('Version') : null
        );
    }

    /**
     * Enqueue the block styles as dependencies of the button block to be sure the styles
     * are loaded. This is something WordPress would address, but due to a bug with the
     * `enqueue_block_styles_assets` executed after the `render_block` hook has been dispatched, the
     * block styles registered with a `style_handle` are not correctly enqueued.
     *
     * @link https://core.trac.wordpress.org/ticket/55184
     * @link https://github.com/WordPress/wordpress-develop/pull/6628
     */
    private function set_block_style_as_dependency(): void
    {
        $wp_styles = wp_styles();
        $style_configuration = $wp_styles->registered['wp-block-button'] ?? null;

        if (!$style_configuration) {
            return;
        }
        if (!in_array(self::BLOCK_STYLES_HANDLE, $style_configuration->deps, true)) {
            $style_configuration->deps[] = self::BLOCK_STYLES_HANDLE;
        }

        $wp_styles->registered['wp-block-button'] = $style_configuration;
    }
}

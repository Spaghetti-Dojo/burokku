<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\BlockStyles;

use SpaghettiDojo\Burokku\Support\ThemeVersionResolver;

/**
 * @phpstan-type StyleTuple = array{string, string}
 */
final readonly class Button
{
    use ThemeVersionResolver;

    private const string BLOCK_STYLES_HANDLE = '@burokku/block-styles-button';

    /**
     * @param list<StyleTuple> $styles
     */
    public static function new(array $styles): self
    {
        return new self($styles);
    }

    /**
     * @param list<StyleTuple> $styles
     */
    private function __construct(private array $styles)
    {
    }

    public function init(): void
    {
        add_action('init', $this->register_block_styles(...));
        add_action('enqueue_block_assets', $this->register_block_css_style(...));
        add_filter('render_block_core/button', $this->enqueue_styles(...));
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

    private function register_block_css_style(): void
    {
        if (wp_style_is(self::BLOCK_STYLES_HANDLE, 'registered')) {
            return;
        }

        wp_register_style(
            self::BLOCK_STYLES_HANDLE,
            get_theme_file_uri('/dist/styles/@block-styles/button.css'),
            [],
            $this->resolve_version()
        );
    }

    private function enqueue_styles(string $html): string
    {
        if ($html) {
            wp_enqueue_style(self::BLOCK_STYLES_HANDLE);
        }

        return $html;
    }
}

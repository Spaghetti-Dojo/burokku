<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\BlockMarkupReplacements;

class CoreAccordion
{
    private const string TOGGLE_ICON_CLASS = 'wp-block-accordion-heading__toggle-icon';
    private const string PLACEHOLDER_TOKEN = '{{@@TOGGLE_ICON}}';

    public static function new(): CoreAccordion
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function init(): void
    {
        add_filter('render_block_core/accordion-heading', $this->replace_toggle_icon(...), 10, 2);
    }

    private function replace_toggle_icon(string $html): string
    {
        if ($html === '') {
            return $html;
        }

        $processor = new \WP_HTML_Tag_Processor($html);
        if ($processor->next_tag(['class_name' => self::TOGGLE_ICON_CLASS])) {
            while ($processor->next_token()) {
                if ($processor->get_token_name() === '#text') {
                    $processor->set_modifiable_text(self::PLACEHOLDER_TOKEN);
                    break;
                }
            }
        }

        return str_replace(
            self::PLACEHOLDER_TOKEN,
            self::iconMarkup(),
            $processor->get_updated_html()
        );
    }

    private function iconMarkup(): string
    {
        static $icon = null;

        if ($icon === null) {
            $icon = file_get_contents(
                get_theme_file_path('/assets/icons/arrow-down.svg')
            );
        }

        return $icon;
    }
}

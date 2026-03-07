<?php

declare(strict_types=1);

namespace SpaghettiDojo\Burokku\Tests\Functional\Server\BlockMarkupReplacements;

describe('CoreAccordion', function (): void {
    it('replaces toggle icon with svg via do_blocks', function (): void {
        $content = <<<'HTML'
        <!-- wp:accordion -->
        <div class="wp-block-accordion">
        <!-- wp:accordion-item -->
        <div class="wp-block-accordion-item">
        <!-- wp:accordion-heading -->
        <div class="wp-block-accordion-heading"><button class="wp-block-accordion-heading__toggle" type="button"><span class="wp-block-accordion-heading__toggle-title">Accordion Title</span><span class="wp-block-accordion-heading__toggle-icon">▼</span></button></div>
        <!-- /wp:accordion-heading -->
        <!-- wp:accordion-panel -->
        <div class="wp-block-accordion-panel"><p>Panel content</p></div>
        <!-- /wp:accordion-panel -->
        </div>
        <!-- /wp:accordion-item -->
        </div>
        <!-- /wp:accordion -->
        HTML;

        $result = do_blocks($content);

        expect($result)->toContain('<svg xmlns="http://www.w3.org/2000/svg"')
            ->and($result)->not()->toContain('▼')
            ->and($result)->toContain('wp-block-accordion-heading__toggle')
            ->and($result)->toContain('wp-block-accordion-heading__toggle-title')
            ->and($result)->toContain('wp-block-accordion-heading__toggle-icon');
    });

    it('returns empty string via apply_filters', function (): void {
        $result = apply_filters('render_block_core/accordion-heading', '');

        expect($result)->toBe('');
    });

    it('returns unchanged html when toggle-icon element is missing via apply_filters', function (): void {
        $html = '<div class="wp-block-accordion-heading"><p>No icon here</p></div>';

        $result = apply_filters('render_block_core/accordion-heading', $html);

        expect($result)->toBe($html);
    });
});

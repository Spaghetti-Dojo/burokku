# Copilot Instructions for Burokku Theme

## Project Overview

Burokku is a modern WordPress Block Theme inspired by shadcn/ui design system. The theme emphasizes:
- **Accessibility-first** development (WCAG 2.1 AA compliance)
- **Performance-focused** architecture
- **Developer-friendly** monorepo structure
- **Design token-driven** styling via theme.json

## Core Architectural Principles

### SOLID Principles

Apply SOLID principles within WordPress conventions:

1. **Single Responsibility Principle (SRP)**
   - Each PHP class/function should have one clear purpose
   - Separate concerns: data handling, rendering, business logic
   - Example: Separate block registration from block rendering logic

2. **Open/Closed Principle (OCP)**
   - Use WordPress hooks (actions/filters) for extensibility
   - Design functions to be extended via filters without modification
   - Leverage WordPress plugin API for customization points

3. **Liskov Substitution Principle (LSP)**
   - Ensure child classes/implementations can replace parents
   - Maintain consistent interfaces when extending WordPress classes
   - Type hints should be honored by implementations

4. **Interface Segregation Principle (ISP)**
   - Keep interfaces focused and minimal
   - Don't force classes to depend on unused methods
   - Use PHP interfaces for contract definitions

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions, not concrete implementations
   - Use dependency injection where appropriate
   - Pass dependencies via constructors or factory patterns

### Additional Principles

- **Separation of Concerns (SoC)**: Keep presentation, business logic, and data access separate
- **DRY (Don't Repeat Yourself)**: Extract reusable code into utilities
- **YAGNI (You Aren't Gonna Need It)**: Implement only what's currently needed
- **Composition over Inheritance**: Favor composition and traits over deep inheritance hierarchies

## WordPress Standards and Best Practices

### Coding Standards

Follow WordPress Coding Standards strictly:

```php
// Use WordPress naming conventions
function burokku_register_blocks() {
    // Prefix all functions with theme name
}

// Use underscores for function names
function burokku_enqueue_block_assets() {
    // WordPress style: snake_case
}

// Class names: Uppercase first letter of each word
class Burokku_Block_Registry {
    // Class internals
}
```

### File Organization

```
burokku/
├── .github/
│   └── copilot-instructions.md
├── sources/                      # Monorepo structure
│   ├── Blocks/                  # Custom blocks (PSR-4 style)
│   │   ├── Counter/
│   │   │   ├── Block.php       # Block class
│   │   │   ├── block.json      # Block metadata
│   │   │   ├── edit.js         # Editor component
│   │   │   ├── save.js         # Save function
│   │   │   ├── view.js         # Frontend JS
│   │   │   └── style.scss      # Block styles
│   │   └── ...
│   ├── Animations/              # Animation system
│   │   ├── core/
│   │   │   ├── IntersectionManager.js
│   │   │   └── ReducedMotion.js
│   │   └── presets/
│   ├── Styles/                  # Shared styles
│   ├── Utils/                   # Utility functions
│   ├── Integrations/            # Third-party wrappers
│   └── Rest/                    # REST API handlers
├── assets/                      # Compiled output
├── templates/                   # Block templates
├── parts/                       # Template parts
├── patterns/                    # Block patterns
├── styles/                      # Style variations
├── inc/                         # PHP includes (if needed)
├── style.css                    # Theme metadata
├── theme.json                   # Design system
└── functions.php                # Theme setup
```

### WordPress-Specific Guidelines

#### 1. Always Escape Output

```php
// Good
echo esc_html( $text );
echo esc_url( $url );
echo esc_attr( $attribute );
echo wp_kses_post( $html_content );

// Bad
echo $text;  // Never echo raw variables
```

#### 2. Sanitize Input

```php
// Good
$value = sanitize_text_field( $_POST['field'] );
$email = sanitize_email( $_POST['email'] );
$url = esc_url_raw( $_POST['url'] );

// Bad
$value = $_POST['field'];  // Never use raw input
```

#### 3. Use Nonces for Security

```php
// Good
wp_verify_nonce( $_POST['_wpnonce'], 'my_action' );

// Always verify nonces for any form submissions or AJAX requests
```

#### 4. Follow WordPress Hook System

```php
// Good - Use actions for side effects
add_action( 'after_setup_theme', 'burokku_setup' );

// Good - Use filters to modify data
add_filter( 'body_class', 'burokku_body_classes' );

// Provide extensibility through hooks
do_action( 'burokku_before_content' );
$content = apply_filters( 'burokku_content', $content );
```

#### 5. Internationalization (i18n)

```php
// Good - Always use text domain
__( 'Text', 'burokku' );
_e( 'Text', 'burokku' );
_n( 'Singular', 'Plural', $count, 'burokku' );
esc_html__( 'Text', 'burokku' );

// JavaScript i18n
wp_set_script_translations( 'burokku-block', 'burokku' );
```

#### 6. Enqueue Assets Properly

```php
// Good - Use WordPress enqueue system
function burokku_enqueue_assets() {
    wp_enqueue_style(
        'burokku-style',
        get_template_directory_uri() . '/assets/css/style.css',
        array(),
        wp_get_theme()->get( 'Version' )
    );
    
    wp_enqueue_script(
        'burokku-script',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        wp_get_theme()->get( 'Version' ),
        true
    );
}
add_action( 'wp_enqueue_scripts', 'burokku_enqueue_assets' );

// Bad - Don't hardcode script/style tags in templates
```

## Block Development Guidelines

### Block Structure

Each block should follow this pattern:

```php
// sources/Blocks/Counter/Block.php
<?php
namespace Burokku\Blocks\Counter;

class Block {
    /**
     * Register the block
     */
    public static function register() {
        register_block_type(
            __DIR__,
            array(
                'render_callback' => array( __CLASS__, 'render' ),
            )
        );
    }
    
    /**
     * Render callback for server-side rendering
     */
    public static function render( $attributes, $content ) {
        // Render logic here
        return $content;
    }
}
```

### block.json Schema

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "burokku/counter",
  "title": "Animated Counter",
  "category": "widgets",
  "icon": "chart-line",
  "description": "Display animated counting numbers",
  "keywords": ["counter", "number", "animate", "stats"],
  "textdomain": "burokku",
  "supports": {
    "html": false,
    "align": ["wide", "full"],
    "spacing": {
      "margin": true,
      "padding": true
    },
    "color": {
      "background": true,
      "text": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "endValue": {
      "type": "number",
      "default": 100
    },
    "duration": {
      "type": "number",
      "default": 2
    }
  },
  "editorScript": "file:./index.js",
  "viewScript": "file:./view.js",
  "style": "file:./style.css"
}
```

### JavaScript Guidelines

#### React/Block Editor

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

registerBlockType('burokku/counter', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Counter Settings', 'burokku')}>
                        <RangeControl
                            label={__('End Value', 'burokku')}
                            value={attributes.endValue}
                            onChange={(value) => setAttributes({ endValue: value })}
                            min={0}
                            max={10000}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps}>
                    {/* Block content */}
                </div>
            </>
        );
    },
    
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();
        
        return (
            <div 
                {...blockProps}
                data-end-value={attributes.endValue}
            >
                0
            </div>
        );
    }
});
```

#### Frontend JavaScript

```javascript
// Use modern ES6+ features
class CounterBlock {
    constructor(element) {
        this.element = element;
        this.endValue = Number(element.dataset.endValue);
        this.init();
    }
    
    init() {
        // Initialization logic
        this.observe();
    }
    
    observe() {
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.5 }
        );
        observer.observe(this.element);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animate();
            }
        });
    }
    
    animate() {
        // Animation logic using CountUp.js
    }
}

// Initialize all counter blocks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.wp-block-burokku-counter').forEach(element => {
        new CounterBlock(element);
    });
});
```

## theme.json Best Practices

### Structure

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        {
          "name": "Background",
          "slug": "background",
          "color": "hsl(222.2, 84%, 4.9%)"
        }
      ]
    },
    "custom": {
      "radius": {
        "sm": "0.25rem",
        "base": "0.5rem"
      },
      "shadow": {
        "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)"
      }
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--background)",
      "text": "var(--wp--preset--color--foreground)"
    }
  }
}
```

### CSS Custom Properties

WordPress auto-generates custom properties from theme.json:
- Colors: `--wp--preset--color--{slug}`
- Font sizes: `--wp--preset--font-size--{slug}`
- Spacing: `--wp--preset--spacing--{slug}`
- Custom: `--wp--custom--{path}--{key}`

Use these in your SCSS:

```scss
.my-component {
  background-color: var(--wp--preset--color--background);
  border-radius: var(--wp--custom--radius--md);
  box-shadow: var(--wp--custom--shadow--lg);
  padding: var(--wp--preset--spacing--4);
}
```

## Accessibility Requirements

### ARIA Patterns

Implement proper ARIA patterns for all interactive components:

```javascript
// Tabs example
class TabsComponent {
    constructor(element) {
        this.tabList = element.querySelector('[role="tablist"]');
        this.tabs = element.querySelectorAll('[role="tab"]');
        this.panels = element.querySelectorAll('[role="tabpanel"]');
        
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.selectTab(index));
            tab.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
        });
    }
    
    selectTab(index) {
        this.tabs.forEach((tab, i) => {
            const isSelected = i === index;
            tab.setAttribute('aria-selected', isSelected);
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
        
        this.panels.forEach((panel, i) => {
            panel.hidden = i !== index;
        });
    }
    
    handleKeyDown(event, currentIndex) {
        const { key } = event;
        let newIndex = currentIndex;
        
        switch(key) {
            case 'ArrowRight':
                newIndex = (currentIndex + 1) % this.tabs.length;
                break;
            case 'ArrowLeft':
                newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = this.tabs.length - 1;
                break;
            default:
                return;
        }
        
        event.preventDefault();
        this.selectTab(newIndex);
        this.tabs[newIndex].focus();
    }
}
```

### Keyboard Navigation Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key closes modals/dialogs
- [ ] Arrow keys navigate within components (tabs, menus)
- [ ] Enter/Space activate buttons/links

### Reduced Motion

Always respect `prefers-reduced-motion`:

```scss
// Animation styles
.animate-fade-in {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  
  &.is-visible {
    opacity: 1;
  }
}

// Disable animations for users who prefer reduced motion
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  [data-animate] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### Color Contrast

Ensure all color combinations meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text** (18pt+ or 14pt+ bold): 3:1 minimum
- **UI components**: 3:1 minimum

Test with tools like:
- Chrome DevTools Accessibility Panel
- axe DevTools
- WAVE Browser Extension

## Performance Guidelines

### JavaScript Bundle Size

Keep bundles small and load efficiently:

```javascript
// Good - Dynamic import for heavy libraries
async function loadCountUp() {
    const { CountUp } = await import('countup.js');
    return CountUp;
}

// Good - Intersection Observer to load only when needed
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadCountUp().then(CountUp => {
                // Initialize counter
            });
        }
    });
});

// Bad - Loading everything upfront
import { CountUp } from 'countup.js';  // Only if used immediately
```

### CSS Performance

```scss
// Good - Use transforms and opacity for animations (GPU accelerated)
.animate-slide-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 300ms, transform 300ms;
  
  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

// Bad - Animating position, width, height (causes reflow)
.bad-animation {
  top: 20px;
  transition: top 300ms;
}
```

### WordPress Optimization

```php
// Good - Conditional loading
function burokku_enqueue_block_assets() {
    // Only load if block is used
    if ( has_block( 'burokku/counter' ) ) {
        wp_enqueue_script( 'countup-js', '...' );
    }
}

// Good - Defer non-critical JavaScript
wp_enqueue_script( 'burokku-animations', '...', array(), '1.0.0', true );

// Good - Preload critical assets
function burokku_preload_assets() {
    echo '<link rel="preload" href="' . esc_url( get_template_directory_uri() . '/assets/css/critical.css' ) . '" as="style">';
}
add_action( 'wp_head', 'burokku_preload_assets', 1 );
```

## Testing Requirements

### Before Submitting Code

1. **Linting**
   ```bash
   npm run lint:js
   npm run lint:css
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **WordPress Standards**
   - Use PHPCS with WordPress Coding Standards
   - Run `phpcs --standard=WordPress style.css functions.php`

4. **Accessibility**
   - Run axe DevTools on your changes
   - Test keyboard navigation
   - Verify focus indicators

5. **Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

6. **Responsive Testing**
   - Mobile (320px - 767px)
   - Tablet (768px - 1023px)
   - Desktop (1024px+)

## Code Review Checklist

Before marking an issue as complete:

- [ ] Code follows WordPress Coding Standards
- [ ] All outputs are escaped
- [ ] All inputs are sanitized
- [ ] Nonces are used for form submissions
- [ ] Text is internationalized with proper text domain
- [ ] ARIA patterns are correctly implemented
- [ ] Keyboard navigation works
- [ ] Focus management is proper
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion is respected
- [ ] Assets are enqueued properly
- [ ] Performance optimizations applied
- [ ] No console errors or warnings
- [ ] Code is documented with PHPDoc/JSDoc
- [ ] Dependencies are listed in package.json
- [ ] Build process works without errors

## Common Patterns

### Creating a Custom Block

1. Create directory: `sources/Blocks/MyBlock/`
2. Add `block.json` with metadata
3. Create `edit.js` for editor
4. Create `save.js` for frontend markup
5. Create `view.js` for frontend interactivity (if needed)
6. Create `style.scss` for block styles
7. Register in `functions.php`

### Adding a REST Endpoint

```php
// sources/Rest/MyEndpoint.php
<?php
namespace Burokku\Rest;

class MyEndpoint {
    public static function register() {
        register_rest_route( 'burokku/v1', '/endpoint', array(
            'methods'             => 'GET',
            'callback'            => array( __CLASS__, 'handle' ),
            'permission_callback' => array( __CLASS__, 'permissions' ),
        ) );
    }
    
    public static function handle( $request ) {
        // Handle request
        return rest_ensure_response( $data );
    }
    
    public static function permissions( $request ) {
        return current_user_can( 'edit_posts' );
    }
}
```

### Creating a Pattern

```php
// patterns/my-pattern.php
<?php
/**
 * Title: My Pattern
 * Slug: burokku/my-pattern
 * Categories: featured
 * Description: A custom pattern
 */
?>

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- Pattern content using block markup -->
</div>
<!-- /wp:group -->
```

## Version Control

### Commit Messages

Follow conventional commits:

```
feat: Add Counter block with CountUp.js integration
fix: Resolve keyboard navigation issue in Tabs block
docs: Update README with installation instructions
style: Format code according to WordPress standards
refactor: Extract utility functions to separate file
test: Add accessibility tests for Modal block
chore: Update dependencies
```

### Branch Naming

```
feature/counter-block
fix/tabs-keyboard-navigation
docs/update-readme
refactor/animation-system
```

## Questions or Issues?

If you encounter any issues or have questions:
1. Check the GitHub issues for similar problems
2. Review WordPress documentation: https://developer.wordpress.org/
3. Consult shadcn/ui design system: https://ui.shadcn.com/
4. Ask in the discussion thread for the specific issue

## Additional Resources

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [CountUp.js Documentation](https://github.com/inorganik/CountUp.js)
- [AOS Documentation](https://github.com/michalsnik/aos)

---

**Remember:** Quality over speed. Write code that is maintainable, accessible, and follows WordPress best practices. Every contribution should make the theme better for users and developers alike.

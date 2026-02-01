# Burokku (ブロック)

[![WordPress](https://img.shields.io/badge/WordPress-6.4+-blue.svg)](https://wordpress.org/)
[![License](https://img.shields.io/badge/license-GPL--2.0+-red.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![GitHub Issues](https://img.shields.io/github/issues/Spaghetti-Dojo/burokku)](https://github.com/Spaghetti-Dojo/burokku/issues)

> Yet another WordPress Block Theme made by AI - inspired by shadcn/ui design system

**Burokku** (Japanese for "block") is a modern, accessible WordPress Block Theme that brings the elegant design principles of [shadcn/ui](https://ui.shadcn.com/) to WordPress. Built with performance, accessibility, and developer experience in mind.

## 🌟 Features

- ✨ **shadcn/ui Inspired Design** - Beautiful, modern aesthetic with 7 color themes
- ♿ **Accessibility First** - WCAG 2.1 AA compliant out of the box
- 🎨 **Design Token System** - Comprehensive theme.json with design tokens
- 🧩 **5 Custom Blocks** - Counter, Tabs, Alert, Badge, and Modal blocks
- 📱 **Fully Responsive** - Mobile-first approach
- ⚡ **Performance Optimized** - Lazy loading, efficient animations
- 🎭 **Scroll Animations** - Smooth, accessible scroll-triggered animations
- 🎯 **20+ Patterns** - Pre-built patterns for quick page building
- 🌈 **7 Style Variations** - Slate, Zinc, Stone, Blue, Green, Violet, Rose

## 📋 Requirements

- WordPress 6.4 or higher
- PHP 7.4 or higher
- Node.js 18+ (for development)
- npm or yarn (for development)

## 🚀 Quick Start

### For Users

1. Download the theme from the [releases page](https://github.com/Spaghetti-Dojo/burokku/releases)
2. Upload to WordPress via Appearance → Themes → Add New → Upload Theme
3. Activate the theme
4. Customize via Appearance → Editor

### For Developers

```bash
# Clone the repository
git clone https://github.com/Spaghetti-Dojo/burokku.git
cd burokku

# Install dependencies
npm install

# Start development
npm start

# Build for production
npm run build
```

## 🏗️ Project Structure

```
burokku/
├── .github/
│   └── copilot-instructions.md    # Development guidelines
├── sources/                        # Source code (monorepo)
│   ├── Blocks/                    # Custom blocks
│   ├── Animations/                # Animation system
│   ├── Styles/                    # Shared styles
│   ├── Utils/                     # Utilities
│   └── Integrations/              # Third-party wrappers
├── assets/                        # Compiled output
├── templates/                     # Block templates
├── parts/                         # Template parts
├── patterns/                      # Block patterns
├── styles/                        # Style variations
├── style.css                      # Theme metadata
├── theme.json                     # Design system
└── functions.php                  # Theme setup
```

## 🎨 Custom Blocks

### Counter Block
Animated number counter with CountUp.js integration. Perfect for stats sections.

**Features:**
- Configurable duration, prefix, suffix
- Animates on scroll into view
- Respects reduced motion preferences

### Tabs Block
Fully accessible tabs component with keyboard navigation.

**Features:**
- ARIA tabs pattern
- Arrow key navigation
- Multiple style variants

### Alert Block
Versatile alert/callout block with 6 variants.

**Features:**
- Info, warning, success, error, destructive styles
- Optional icons and dismiss button
- Smooth animations

### Badge Block
Lightweight inline labels and tags.

**Features:**
- 3 sizes, 4 style variants
- Works inline with text
- Minimal JavaScript

### Modal Block
Accessible modal/dialog with focus management.

**Features:**
- Proper focus trapping
- Keyboard support (ESC to close)
- Body scroll lock
- 5 size variants

## 🎭 Animation System

Built-in scroll-triggered animation system with:
- Intersection Observer API
- Reduced motion support
- 10+ animation presets (fade, slide, scale)
- Optional AOS integration for advanced animations

**Usage:**
```html
<div data-animate="fade-in" data-animate-delay="100">
    Content fades in on scroll
</div>
```

## 🌈 Style Variations

Choose from 7 beautiful color themes:
- **Slate** (default) - Cool gray tones
- **Zinc** - Neutral gray tones
- **Stone** - Warm gray tones
- **Blue** - Primary blue accents
- **Green** - Nature-inspired greens
- **Violet** - Purple accents
- **Rose** - Pink/red accents

Switch themes via: Appearance → Editor → Styles

## 🛠️ Development

### Build Commands

```bash
npm start           # Start development with watch
npm run build       # Production build
npm run lint:css    # Lint CSS
npm run lint:js     # Lint JavaScript
npm run format      # Format code
```

### Coding Standards

- Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- Apply SOLID principles
- Write accessible code (WCAG 2.1 AA)
- Test in multiple browsers and devices

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed guidelines.

## 📚 Documentation

- [Development Guide](.github/copilot-instructions.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Project Issues](https://github.com/Spaghetti-Dojo/burokku/issues)
- [Project Board](https://github.com/orgs/Spaghetti-Dojo/projects/10)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow

1. Check [open issues](https://github.com/Spaghetti-Dojo/burokku/issues)
2. Fork and create a feature branch
3. Follow coding standards and guidelines
4. Submit a pull request

## 📄 License

This theme is licensed under [GPL v2 or later](https://www.gnu.org/licenses/gpl-2.0.html).

## 🙏 Credits

### Design Inspiration
- [shadcn/ui](https://ui.shadcn.com/) - Design system and component library

### Third-Party Libraries
- [CountUp.js](https://github.com/inorganik/CountUp.js) - Number animations (MIT License)
- [AOS](https://github.com/michalsnik/aos) - Animate on Scroll (MIT License)

### Built With
- [WordPress Block Editor](https://developer.wordpress.org/block-editor/)
- [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts)

## 🔗 Links

- **Repository:** https://github.com/Spaghetti-Dojo/burokku
- **Issues:** https://github.com/Spaghetti-Dojo/burokku/issues
- **Project Board:** https://github.com/orgs/Spaghetti-Dojo/projects/10
- **WordPress Theme Directory:** Coming soon

## 📞 Support

Having issues? Please:
1. Check existing [issues](https://github.com/Spaghetti-Dojo/burokku/issues)
2. Create a new issue with details
3. Join discussions on the project board

---

Made with ❤️ by the Spaghetti Dojo team and AI

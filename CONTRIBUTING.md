# Contributing to Burokku

Thank you for your interest in contributing to Burokku! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- WordPress 6.4+ development environment
- Node.js 18+
- npm or yarn
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/burokku.git
   cd burokku
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Spaghetti-Dojo/burokku.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development**
   ```bash
   npm start
   ```

## 🔄 Development Workflow

### 1. Pick an Issue

- Browse [open issues](https://github.com/Spaghetti-Dojo/burokku/issues)
- Check the [project board](https://github.com/orgs/Spaghetti-Dojo/projects/10)
- Look for issues labeled `good first issue` for beginner-friendly tasks
- Comment on the issue to claim it

### 2. Create a Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Make Changes

Follow our [coding standards](.github/copilot-instructions.md) and:
- Write clean, documented code
- Follow WordPress coding standards
- Apply SOLID principles
- Ensure accessibility (WCAG 2.1 AA)
- Test thoroughly

### 4. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: Add Counter block with CountUp.js"
git commit -m "fix: Resolve keyboard navigation in Tabs"
git commit -m "docs: Update README installation steps"
git commit -m "style: Format code per WordPress standards"
git commit -m "refactor: Extract animation utilities"
git commit -m "test: Add accessibility tests for Modal"
```

**Commit Message Format:**
```
<type>: <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code restructuring (no functional changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Coding Standards

### PHP

Follow [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/):

```php
<?php
/**
 * Function description
 *
 * @param string $param Parameter description.
 * @return void
 */
function burokku_example_function( $param ) {
    // Code here
}
```

**Key Points:**
- Use WordPress naming conventions
- Always escape output: `esc_html()`, `esc_url()`, `esc_attr()`
- Sanitize input: `sanitize_text_field()`, `sanitize_email()`
- Use nonces for security
- Internationalize all strings with `'burokku'` text domain

### JavaScript

Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/):

```javascript
/**
 * Function description
 *
 * @param {string} param - Parameter description
 * @return {void}
 */
function exampleFunction( param ) {
    // Code here
}
```

**Key Points:**
- Use ES6+ features
- Follow React best practices for blocks
- Document with JSDoc comments
- Use WordPress i18n functions

### CSS/SCSS

Follow [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/):

```scss
.wp-block-burokku-counter {
    background-color: var(--wp--preset--color--background);
    border-radius: var(--wp--custom--radius--md);
    padding: var(--wp--preset--spacing--4);
    
    &__content {
        font-size: var(--wp--preset--font-size--xl);
    }
}
```

**Key Points:**
- Use BEM naming convention for custom classes
- Leverage theme.json CSS custom properties
- Write mobile-first responsive styles
- Support reduced motion

## ✅ Pre-Submission Checklist

Before submitting a pull request:

### Code Quality
- [ ] Code follows WordPress coding standards
- [ ] All outputs are escaped
- [ ] All inputs are sanitized
- [ ] Nonces used for forms/AJAX
- [ ] Text is internationalized with `'burokku'` domain
- [ ] Code is documented (PHPDoc/JSDoc)

### Testing
- [ ] Code has been tested locally
- [ ] Build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint:css && npm run lint:js`
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile, tablet, desktop

### Accessibility
- [ ] ARIA patterns correctly implemented
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion is respected
- [ ] Tested with screen reader (optional but encouraged)

### Documentation
- [ ] README updated (if applicable)
- [ ] Comments explain complex logic
- [ ] Issue reference included in PR description

## 🔍 Pull Request Process

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #issue_number

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows WordPress standards
- [ ] All tests pass
- [ ] Linting passes
- [ ] Accessibility tested
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks**
   - Linting must pass
   - Build must succeed

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments

3. **Testing**
   - Reviewer will test changes
   - Ensure no regressions

4. **Merge**
   - Maintainer will merge once approved
   - Your contribution will be credited

## 🐛 Issue Guidelines

### Reporting Bugs

Use the bug report template:

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- WordPress version:
- PHP version:
- Browser:
- Theme version:

**Additional context**
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Alternative solutions

**Additional context**
Any other relevant information
```

## 🎯 Development Priorities

Current focus areas:

1. **Phase 1-2**: Foundation and design system
2. **Phase 3**: Animation system
3. **Phase 4**: Custom blocks
4. **Phase 5**: Templates and patterns
5. **Phase 6**: Testing and documentation

Check the [project board](https://github.com/orgs/Spaghetti-Dojo/projects/10) for current priorities.

## 💡 Tips for Contributors

### First-Time Contributors

- Look for issues labeled `good first issue`
- Start with documentation improvements
- Ask questions - we're here to help!
- Join discussions on issues

### Experienced Contributors

- Help review pull requests
- Mentor new contributors
- Propose architectural improvements
- Work on complex features

### Testing Help

- Test on different browsers
- Test with assistive technology
- Report edge cases
- Verify accessibility

## 📚 Resources

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Copilot Instructions](.github/copilot-instructions.md)

## 🙋 Questions?

- Open a [discussion](https://github.com/Spaghetti-Dojo/burokku/discussions)
- Comment on relevant issues
- Check existing documentation

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Appreciated by the community!

Thank you for contributing to Burokku! 🚀

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Burokku** is a WordPress Block Theme (FSE) inspired by shadcn/ui design system. It combines PHP modules for server-side block customization with TypeScript/SCSS for frontend styling.

### Design Tokens

All colors, typography, spacing, and transitions are defined in `theme.json`. This is the single source of truth for design values consumed by both PHP and SCSS.

## Quality Gates

After completing edits, always run the linter for the affected layer before considering the task done:

- PHP files → `composer cs && composer analysis`
- TS/JS files → `pnpm lint:js` and `pnpm lint:js:fix` for auto-fixes
- SCSS/CSS files → `pnpm lint:css` and `pnpm lint:css:fix` for auto-fixes

Before committing, run the full suite: `composer qa && pnpm lint:js && pnpm lint:css`. Do not commit if any linter or test reports an error.

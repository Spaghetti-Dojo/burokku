# Graph Report - .  (2026-06-18)

## Corpus Check
- Corpus is ~47,951 words - fits in a single context window. You may not need a graph.

## Summary
- 785 nodes · 908 edges · 56 communities (44 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.82)
- Token cost: 64,344 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_ESLint Rules Config|ESLint Rules Config]]
- [[_COMMUNITY_Block Styles & Typography|Block Styles & Typography]]
- [[_COMMUNITY_Token Derivation Build|Token Derivation Build]]
- [[_COMMUNITY_Module Base Class|Module Base Class]]
- [[_COMMUNITY_theme.json Design Tokens|theme.json Design Tokens]]
- [[_COMMUNITY_NPM Package Dependencies|NPM Package Dependencies]]
- [[_COMMUNITY_Image Block|Image Block]]
- [[_COMMUNITY_Color Scheme Specs & Docs|Color Scheme Specs & Docs]]
- [[_COMMUNITY_Docusaurus Site Deps|Docusaurus Site Deps]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Quote Block|Quote Block]]
- [[_COMMUNITY_Button Block (PHP)|Button Block (PHP)]]
- [[_COMMUNITY_Color Palette & Duotone|Color Palette & Duotone]]
- [[_COMMUNITY_WP Test Harness|WP Test Harness]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_block.json Manifest|block.json Manifest]]
- [[_COMMUNITY_light.json Palette|light.json Palette]]
- [[_COMMUNITY_Block Style Registration|Block Style Registration]]
- [[_COMMUNITY_Editor Scheme Preview (TS)|Editor Scheme Preview (TS)]]
- [[_COMMUNITY_Composer Scripts|Composer Scripts]]
- [[_COMMUNITY_ESLint Project Config|ESLint Project Config]]
- [[_COMMUNITY_Webpack Build Config|Webpack Build Config]]
- [[_COMMUNITY_PHP Dev Dependencies|PHP Dev Dependencies]]
- [[_COMMUNITY_Accordion Item Styles|Accordion Item Styles]]
- [[_COMMUNITY_Composer Plugin Config|Composer Plugin Config]]
- [[_COMMUNITY_theme.json PHP Filter|theme.json PHP Filter]]
- [[_COMMUNITY_Composer Package Meta|Composer Package Meta]]
- [[_COMMUNITY_Core Accordion Block|Core Accordion Block]]
- [[_COMMUNITY_Site Logo Fallback|Site Logo Fallback]]
- [[_COMMUNITY_Theme Bootstrap|Theme Bootstrap]]
- [[_COMMUNITY_Stylelint Logical CSS|Stylelint Logical CSS]]
- [[_COMMUNITY_Test Autoload PSR-4|Test Autoload PSR-4]]
- [[_COMMUNITY_Supports Module|Supports Module]]
- [[_COMMUNITY_Website tsconfig|Website tsconfig]]
- [[_COMMUNITY_Theme Autoload PSR-4|Theme Autoload PSR-4]]
- [[_COMMUNITY_BlockName Base|BlockName Base]]
- [[_COMMUNITY_Composer Require|Composer Require]]
- [[_COMMUNITY_Theme View Script|Theme View Script]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `rules` - 61 edges
2. `Image` - 27 edges
3. `Quote` - 27 edges
4. `Button` - 26 edges
5. `compilerOptions` - 25 edges
6. `scripts` - 16 edges
7. `color` - 13 edges
8. `scripts` - 12 edges
9. `WpTestCase` - 12 edges
10. `elements` - 12 edges

## Surprising Connections (you probably didn't know these)
- `boot()` --calls--> `package()`  [INFERRED]
  functions.php → inc/package.php
- `Color Scheme CI Workflow` --conceptually_related_to--> `Color Scheme Generation Spec`  [INFERRED]
  .github/workflows/color-scheme.yml → openspec/specs/color-scheme-generation/spec.md
- `Deploy Docs Workflow` --references--> `Docs Introduction`  [INFERRED]
  .github/workflows/deploy-docs.yml → docs/intro.md
- `Color Scheme CI Workflow` --references--> `styles/light.json Intermediate`  [EXTRACTED]
  .github/workflows/color-scheme.yml → openspec/specs/color-scheme-generation/spec.md
- `Color Scheme CI Workflow` --references--> `theme.json Source of Truth`  [EXTRACTED]
  .github/workflows/color-scheme.yml → openspec/specs/color-scheme-generation/spec.md

## Import Cycles
- 1-file cycle: `webpack.config.js -> webpack.config.js`

## Hyperedges (group relationships)
- **Color Scheme Generation to Delivery Pipeline** — theme_json_source, light_json_artifact, color_scheme_css_artifact, color_scheme_generation_spec, color_scheme_delivery_spec [INFERRED 0.85]
- **theme-state Contract and Consumers** — theme_state_data_theme, theme_state_burokku_theme_key, theme_toggle_block_entity, color_scheme_delivery_spec, editor_scheme_preview_spec [INFERRED 0.85]
- **Block Theme Template Composition** — templates_index, templates_header_cover, parts_header, parts_footer [EXTRACTED 1.00]

## Communities (56 total, 12 thin omitted)

### Community 0 - "ESLint Rules Config"
Cohesion: 0.03
Nodes (61): rules, complexity, consistent-return, dot-notation, init-declarations, max-classes-per-file, max-depth, max-lines (+53 more)

### Community 1 - "Block Styles & Typography"
Cohesion: 0.06
Nodes (54): core/accordion-heading, core/quote, left, :hover, spacing, typography, typography, typography (+46 more)

### Community 2 - "Token Derivation Build"
Cohesion: 0.10
Nodes (39): build(), check(), readOrEmpty(), rel(), deriveToken(), isExpression(), mirrorLightness(), STEP_SWAP (+31 more)

### Community 3 - "Module Base Class"
Cohesion: 0.07
Nodes (14): Module, Module, Module, Module, ExecutableModule, ModuleClassNameIdTrait, Properties, ContainerInterface (+6 more)

### Community 4 - "theme.json Design Tokens"
Cohesion: 0.05
Nodes (40): color, radius, radiusSizes, style, width, border, mod, spacing (+32 more)

### Community 5 - "NPM Package Dependencies"
Cohesion: 0.05
Nodes (38): author, bugs, url, dependencies, aos, @wordpress/block-editor, @wordpress/blocks, @wordpress/components (+30 more)

### Community 6 - "Image Block"
Cohesion: 0.06
Nodes (5): Image, Orchestrator, ContainerInterface, Metadata, self

### Community 7 - "Color Scheme Specs & Docs"
Cohesion: 0.10
Nodes (30): Editor Scheme Preview Design, Editor Scheme Preview Proposal, Editor Scheme Preview Tasks, color-scheme.css Flattened Stylesheet, Color Scheme Delivery Spec, Color Scheme Generation Spec, Docs Introduction, WordPress CSS Utilities Docs (+22 more)

### Community 8 - "Docusaurus Site Deps"
Cohesion: 0.07
Nodes (28): browserslist, development, production, dependencies, clsx, @docusaurus/core, @docusaurus/preset-classic, @mdx-js/react (+20 more)

### Community 9 - "TypeScript Compiler Config"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, baseUrl, checkJs, esModuleInterop, exactOptionalPropertyTypes, isolatedModules, jsx (+19 more)

### Community 12 - "Color Palette & Duotone"
Cohesion: 0.09
Nodes (26): color, background, custom, customDuotone, customGradient, defaultDuotone, defaultGradients, defaultPalette (+18 more)

### Community 13 - "WP Test Harness"
Cohesion: 0.09
Nodes (6): RecursiveIteratorIterator, SplFileInfo, TestCase, InstallWpDropIn, WpLoad, WpTestCase

### Community 15 - "Dev Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, clean-webpack-plugin, dotenv-cli, sass, stylelint-plugin-logical-css, ts-node, @types/aos, @types/node (+12 more)

### Community 16 - "block.json Manifest"
Cohesion: 0.10
Nodes (18): apiVersion, category, description, editorScript, icon, keywords, name, render (+10 more)

### Community 17 - "light.json Palette"
Cohesion: 0.11
Nodes (18): duotone, gradients, gray-100, gray-300, gray-500, gray-700, gray-900, gray-950 (+10 more)

### Community 18 - "Block Style Registration"
Cohesion: 0.17
Nodes (4): Button, self, Styles, ThemeVersionResolver

### Community 19 - "Editor Scheme Preview (TS)"
Cohesion: 0.19
Nodes (9): applyScheme(), canvasDocument(), EditorSelectors, MoreMenuItem, otherScheme(), resolveScheme(), Scheme, SchemePreview() (+1 more)

### Community 20 - "Composer Scripts"
Cohesion: 0.17
Nodes (12): scripts, analysis, cs, cs:fix, post-install-cmd, post-update-cmd, qa, test:functional (+4 more)

### Community 21 - "ESLint Project Config"
Cohesion: 0.17
Nodes (11): env, browser, es2024, extends, parserOptions, ecmaVersion, project, sourceType (+3 more)

### Community 22 - "Webpack Build Config"
Cohesion: 0.18
Nodes (8): { CleanWebpackPlugin }, defaultConfig, fs, path, styles, defaultConfig, path, [scriptsConfig, modulesConfig]

### Community 23 - "PHP Dev Dependencies"
Cohesion: 0.20
Nodes (10): require-dev, automattic/wordbless, bnf/phpstan-psr-container, brain/monkey, inpsyde/wp-stubs, mockery/mockery, pestphp/pest, phpstan/phpstan (+2 more)

### Community 24 - "Accordion Item Styles"
Cohesion: 0.20
Nodes (10): core/accordion-item, bottom, color, style, width, border, spacing, bottom (+2 more)

### Community 25 - "Composer Plugin Config"
Cohesion: 0.22
Nodes (9): dealerdirect/phpcodesniffer-composer-installer, pestphp/pest-plugin, roots/wordpress-core-installer, config, allow-plugins, apcu-autoloader, classmap-authoritative, optimize-autoloader (+1 more)

### Community 26 - "theme.json PHP Filter"
Cohesion: 0.28
Nodes (3): self, ThemeJson, WP_Theme_JSON_Data

### Community 27 - "Composer Package Meta"
Cohesion: 0.25
Nodes (7): authors, description, license, minimum-stability, name, prefer-stable, type

### Community 30 - "Theme Bootstrap"
Cohesion: 0.38
Nodes (5): autoload(), boot(), handleBootFailure(), package(), Throwable

### Community 31 - "Stylelint Logical CSS"
Cohesion: 0.29
Nodes (6): extends, rules, logical-css/require-logical-keywords, logical-css/require-logical-properties, logical-css/require-logical-units, selector-class-pattern

### Community 32 - "Test Autoload PSR-4"
Cohesion: 0.40
Nodes (5): autoload-dev, psr-4, SpaghettiDojo\\Burokku\\Tests\\, SpaghettiDojo\\Burokku\\Tests\\Functional\\, SpaghettiDojo\\Burokku\\Tests\\Unit\\

### Community 34 - "Website tsconfig"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, exclude, extends

### Community 35 - "Theme Autoload PSR-4"
Cohesion: 0.50
Nodes (4): autoload, files, psr-4, SpaghettiDojo\\Burokku\\

### Community 37 - "Composer Require"
Cohesion: 0.67
Nodes (3): require, inpsyde/modularity, php

## Knowledge Gaps
- **346 isolated node(s):** `browser`, `es2024`, `extends`, `import/resolver`, `project` (+341 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Module` connect `Module Base Class` to `Image Block`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Quote` connect `Quote Block` to `Image Block`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `browser`, `es2024`, `extends` to the rest of the system?**
  _347 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ESLint Rules Config` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Should `Block Styles & Typography` be split into smaller, more focused modules?**
  _Cohesion score 0.06079664570230608 - nodes in this community are weakly interconnected._
- **Should `Token Derivation Build` be split into smaller, more focused modules?**
  _Cohesion score 0.09565217391304348 - nodes in this community are weakly interconnected._
- **Should `Module Base Class` be split into smaller, more focused modules?**
  _Cohesion score 0.07084785133565621 - nodes in this community are weakly interconnected._
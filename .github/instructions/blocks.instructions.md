# Block Development Instructions

## Block.json Configuration

When defining blocks in `block.json` files, **always reference the built assets**, not the source TypeScript files.

### ❌ Incorrect

```json
{
  "editorScript": "file:./edit.tsx",
  "style": "file:./style.scss"
}
```

### ✅ Correct

```json
{
  "editorScript": "file:./edit.js",
  "style": "file:./style.css"
}
```

### Why?

WordPress loads the compiled JavaScript and CSS files from the `dist/` directory at runtime, not the source TypeScript or SCSS files. The build process compiles:
- `edit.tsx` → `edit.js`
- `view.tsx` → `view.js`
- `style.scss` → `style.css`

The `block.json` file should reference the **output files** that WordPress will actually load.

## Entry Point Naming

Blocks should use one of these entry point patterns:
- `edit.ts` or `edit.tsx` - For editor-only functionality
- `view.ts` or `view.tsx` - For frontend-only functionality

The build system automatically creates entries following the pattern:
- Source: `sources/Blocks/MyBlock/edit.tsx`
- Output: `dist/@burokku/MyBlock-edit.js`

## File Structure

```
sources/Blocks/MyBlock/
├── block.json          # Block metadata (references .js and .css)
├── edit.tsx           # Editor component (TypeScript source)
├── view.tsx           # Frontend component (optional)
└── style.scss         # Block styles (SCSS source)
```

After build:

```
dist/@burokku/
├── MyBlock-edit.js           # Compiled editor script
├── MyBlock-edit.asset.php    # Dependencies manifest
├── MyBlock-view.js           # Compiled frontend script (if exists)
├── style-MyBlock-edit.css    # Compiled styles
└── style-MyBlock-edit-rtl.css # RTL styles
```

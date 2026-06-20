# CLAUDE.md

## Plans and Open Spec Implementation Flow Constraints

1. When executing a plan or implementing tasks of a spec, always stop at each step / task and ask for confirmation before proceeding to the next one.

## Writing Code

1. Keep the comments at the minimum and avoid repetition for something we can infer by reading
   the code.

## Design Tokens

All colors, typography, spacing, and transitions are defined in `theme.json`. This is the single source of truth for design values consumed by both PHP and SCSS.

# theme-toggle-block

## Purpose

The `theme-toggle` block's user-facing behavior: applying and flipping the active color scheme
client-side after hydration, consuming the `theme-state` contract. Build, registration, and
editor-representation mechanism are documented in `docs/build-and-registration.md`, not here.

## Requirements

### Requirement: Scheme applied client-side after hydration; no inline no-flash script

The toggle SHALL apply and mutate the active scheme client-side after hydration, with no
inline no-flash head script (which is removed). The document signal, persistence, resolution
precedence, and reactive state shape are owned by `theme-state`; this block consumes that
contract and does not redefine it. On initialization the toggle SHALL sync its reactive state
from the `theme-state` resolution. Activating the toggle SHALL flip and persist the active
scheme per `theme-state`, and SHALL keep `aria-pressed` reflecting the active scheme.

#### Scenario: Init syncs toggle state from resolved scheme

- **WHEN** the toggle initializes after hydration
- **THEN** its reactive state is set from the `theme-state` resolution
- **AND** there is no inline no-flash head script applying the scheme before paint

#### Scenario: Toggle flips and persists the active scheme

- **WHEN** the user activates the toggle
- **THEN** the active scheme flips and persists per the `theme-state` contract
- **AND** `aria-pressed` reflects the active scheme

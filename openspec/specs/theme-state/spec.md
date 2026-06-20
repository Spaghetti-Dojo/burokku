# theme-state Specification

## Purpose

The active color scheme as observable, shared state — the single contract that the toggle and
the stylesheet delivery agree on. Owns the `data-theme` document signal, the `burokku-theme`
persistence key, the resolution precedence (persisted choice → system preference → dark
default), and the reactive `theme`/`isDark` shape consumers read. Implementation-agnostic: it
holds regardless of how the scheme is applied (Interactivity store, plain script, or future
server logic).

## Requirements

### Requirement: data-theme is the document scheme signal

The active color scheme SHALL be expressed by the `data-theme` attribute on the document root
(`<html>`), whose value is `light` or `dark`. When `data-theme` is absent, no explicit scheme
is set and the resolved scheme falls back per the resolution rule. This attribute is the
single signal that all consumers (CSS delivery, the toggle, future server logic) read and
write; no consumer SHALL invent a parallel signal.

#### Scenario: Explicit scheme is signalled by the attribute

- **WHEN** `data-theme="light"` is set on `<html>`
- **THEN** the resolved active scheme is `light`
- **WHEN** `data-theme="dark"` is set on `<html>`
- **THEN** the resolved active scheme is `dark`

#### Scenario: Absent attribute defers to resolution

- **WHEN** `<html>` has no `data-theme` attribute
- **THEN** no explicit scheme is set and the active scheme is resolved per the precedence rule

### Requirement: User choice persists under burokku-theme

A user's explicit scheme choice SHALL persist in `localStorage` under the key `burokku-theme`
with a value of `light` or `dark`, so the choice survives reloads and navigation. Only an
explicit user choice is written; a scheme derived purely from the system preference SHALL NOT
be persisted.

#### Scenario: Choice is stored

- **WHEN** the user selects a scheme
- **THEN** `localStorage["burokku-theme"]` holds `light` or `dark` matching the choice

#### Scenario: System-derived scheme is not persisted

- **WHEN** the active scheme comes only from the system `prefers-color-scheme` with no user
  choice made
- **THEN** `localStorage["burokku-theme"]` is not written

### Requirement: Active scheme resolves by precedence

The active scheme SHALL resolve in this order: (1) the persisted `burokku-theme` value if
present; otherwise (2) the system `prefers-color-scheme` (`light` → light, else dark);
otherwise (3) the `dark` default. The resolved scheme SHALL be reflected by `data-theme` on
`<html>`.

#### Scenario: Persisted choice wins over system preference

- **WHEN** `burokku-theme` is `light` and the system prefers dark
- **THEN** the resolved active scheme is `light`

#### Scenario: System preference applies with no persisted choice

- **WHEN** no `burokku-theme` value is stored and the system prefers light
- **THEN** the resolved active scheme is `light`

#### Scenario: Dark is the default

- **WHEN** no `burokku-theme` value is stored and the system expresses no light preference
- **THEN** the resolved active scheme is `dark`

### Requirement: Reactive state mirrors the active scheme

A consumer of theme state SHALL be able to read reactive `theme` (`light` | `dark`) and
`isDark` (boolean) values that mirror the resolved active scheme, so UI affordances (e.g. a
toggle's pressed state) stay in sync with `data-theme`. These values are derived from the
active scheme; they are not an independent source of truth.

#### Scenario: State follows the active scheme

- **WHEN** the active scheme is `dark`
- **THEN** `theme` is `dark` and `isDark` is `true`
- **WHEN** the active scheme is `light`
- **THEN** `theme` is `light` and `isDark` is `false`

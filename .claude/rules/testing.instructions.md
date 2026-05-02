---
paths:
    - 'tests/functional/**'
    - 'tests/unit/**'
---

### Testing

Tests live in `/tests/` with separate suites:

- `unit/server/` — isolated PHP unit tests using Brain Monkey mocks
- `functional/server/` — integration tests that load WordPress (WorDBless/SQLite)

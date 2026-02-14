---
applyTo: "sources/**/*.php"
---

# PHP Server Instructions

The following instructions are applicable to all php files in this repository.

## Requirements

- PHP 8.4 or higher
- WordPress 6.9 or higher

## Core Architectural Principles

### SOLID Principles

Apply SOLID principles within WordPress conventions:

1. **Single Responsibility Principle (SRP)**
   - Each PHP class/function should have one clear purpose
   - Separate concerns: data handling, rendering, business logic.

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

## Code Comments

- Avoid redundant comments that state the obvious
- Focus comments on explaining the "why" and "how" rather than the "what"
- Don't use docblocks for functions and methods where parameters types and return types are already clear from type hints

## Namespaces

When importing classes from other namespaces, group the declaration together. See following code
sample:

```php
<?php

use Vendor\Package\{
	ClassA,
	ClassB,
	Namespace\SubNamespace\ClassC
};
```

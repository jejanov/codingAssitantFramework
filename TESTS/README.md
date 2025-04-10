# Tests Directory

This directory contains all tests for the project, organized to mirror the application structure.

## Structure

```
tests/
├── components/
│   ├── Button/
│   │   ├── Button.test.ts
│   │   └── ...
│   └── ...
├── services/ 
│   ├── ...
│   └── ...
└── utils/
    ├── ...
    └── ...
```

## Running Tests

```bash
# Run all tests
npm test

# Run a specific test file
npm test -- path/to/test

# Run tests matching a pattern
npm test -- -t "pattern"

# Run tests with coverage
npm test -- --coverage
```

## Test Guidelines

1. **Name tests clearly** - Test names should describe the expected behavior
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Test edge cases** - Include tests for edge and failure cases
4. **Map to acceptance criteria** - Tests should validate specific acceptance criteria
5. **Keep tests isolated** - Tests should not depend on other tests

## Vitest Configuration

See `vitest.config.ts` for configuration details.
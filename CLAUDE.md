# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Test Commands**: `npm test` for running all tests, `npm test -- -t "test name"` for specific tests
- No build/lint commands identified (add if found in package.json)

## Project Structure
- Read `PLANNING.md` first for architecture overview
- Use the Test-Driven Development workflow in `USER_STORIES/WORKFLOW.md`
- Check `TASK.md` to identify current workflow phase
- Reference `.cursor/rules/*.mdc` files for context-specific coding rules

## Code Style Guidelines
- **TypeScript**: Use type annotations for component props (e.g., variant?: "primary" | "secondary")
- **Components**: Use Emotion styled components with TypeScript interfaces
- **Design System**: Use tokens from `/DESIGN_SYSTEM/tokens/` for all styling
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Components**: Keep in own directory with .tsx and .md documentation
- **Imports**: Use absolute imports; prefer importing from index files
- **File Size**: Keep files under 500 lines, split into modules when needed
- **Testing**: Follow AAA pattern (Arrange-Act-Assert) and test edge cases
- **Workflow**: Follow Red-Green-Refactor TDD cycle for all feature development
- **Glassmorphism**: Implement container/interactive/emphasized/content hierarchy

## Documentation
- Each component should have its own .md documentation file
- Use minimal code comments; let the code be self-documenting
- For complex logic, explain the "why" not just the "what"
- Update documentation as features change
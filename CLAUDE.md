# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Initialization Check (IMPORTANT!)
- **First Step**: Always check INITIALIZATION.md to see if one-time project setup is required
- **If Required**: Follow the steps in .cursor/rules/initialization-check.mdc
- **Only Once**: Initialization should only be performed once per project

## Commands
- **Build**: `npm run dev` for development, `npm run build` for production build
- **Test**: `npm test` (all tests), `npm test -- -t "test name"` (single test), `npm test -- --coverage` (with coverage)
- **Lint**: `npm run lint` for ESLint, `npm run format` for Prettier formatting
- **Type Check**: `npm run typecheck` to verify TypeScript types

## Project Structure
- **PLANNING.md**: Read first for architecture and tech stack overview
- **WORKFLOW.md**: Follow TDD workflow with Red-Green-Refactor pattern
- **TASK.md**: Check current workflow phase and implementation tasks
- **.cursor/rules/**: Reference MDC files for context-specific coding rules

## Code Style Guidelines
- **React**: Functional components with hooks, avoid classes
- **TypeScript**: Strong typing (no `any`), use interfaces for component props 
- **Components**: Follow design system, use tokens from `/DESIGN_SYSTEM/tokens/`
- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **Imports**: Absolute imports, group by type (React, components, utils, types)
- **Testing**: AAA pattern (Arrange-Act-Assert), test edge cases and errors
- **State**: Use React Context API for global state management
- **Styling**: Tailwind CSS with consistent patterns

## Documentation
- Each component needs documentation in its own .md file
- Self-documenting code preferred over comments
- Document "why" not "what" for complex logic
- Follow Glassmorphism patterns for UI components
# AI Coding TDD Framework

This repository provides a structured Test-Driven Development (TDD) framework for AI-assisted coding projects, with an integrated design system.

## Quick Start

To create a new project with this template:

```bash
# Create a new directory for your project
mkdir my-ai-project
cd my-ai-project

# Download the template
npx degit jejanov/codingAssistantFramework

# Initialize git repository (optional)
git init
```

## Getting Started

1. Read `PLANNING.md` to understand the project architecture and goals
2. Check `WORKFLOW.md` for the detailed TDD workflow
3. Review `WORKFLOW_TRACKING.md` to see the current status of active user stories
4. Examine `TASK.md` for current implementation tasks
5. Run `scripts/create-user-story.sh` to create new user stories:
   ```bash
   # Make the script executable if needed
   chmod +x scripts/create-user-story.sh
   
   # Create a new user story
   ./scripts/create-user-story.sh 001 feature-name
   ```

## Key Documents

- **PLANNING.md**: Project architecture, tech stack, and constraints
- **WORKFLOW.md**: Detailed TDD workflow with visual diagrams
- **WORKFLOW_TRACKING.md**: Current status of user stories and workflow phases
- **TASK.md**: Implementation tasks organized by workflow phase
- **USER_STORIES/**: User stories with acceptance criteria
- **DESIGN_SYSTEM/**: UI component design system with tokens and documentation

## TDD Workflow

This project follows a strict TDD workflow:

1. **User Story Creation**: Define requirements with clear acceptance criteria
2. **Test Planning**: Create test cases mapped to acceptance criteria
3. **Task Planning**: Break down implementation into specific tasks
4. **TDD Implementation**: Follow the Red-Green-Refactor cycle
   - Red: Write failing tests that validate acceptance criteria
   - Green: Implement minimum code to make tests pass
   - Refactor: Improve code while keeping tests passing
5. **Verification**: Ensure all acceptance criteria are met

## Design System Integration

UI components are built using the project's design system:

- **Tokens**: Colors, spacing, typography, and other design tokens
- **Components**: Reusable UI components with documentation
- **Guidelines**: Implementation standards for consistent UI

## For AI Assistants

AI coding assistants should follow these guidelines:

- Always check current workflow phase in `WORKFLOW_TRACKING.md`
- Follow the MDC rules in `.cursor/rules/` for specific file types
- Reference `CURSOR_RULES/UserRules.md` for high-level guidance
- Use existing components and tokens from the Design System


The hierarchy of information is:
1. UserRules.md - Persistent always present context that orients the AI Coding Assistant to the structure of the project and standards it should adhere to in order to be effective.
2. .cursor/Rules/ - The files in this directory are templated instructions designed to instruct the Coding Assistant on a standard way to create supporting files, or to inform the Coding Assistant on topic specific sets of rules. As an example, the task_creation.mdc is a set of instructions with a template on how to create a task document. The design_system_components.mdc is not a template but a reminder of specific details related to the design of UI/UX components. In both cases, they may refer to other directory or files that exist or will exist in the project directory.
3. Planning.md This file's purpose is to describe the high level vision for what is being built, the file structure, architecture, etc. It needs to be high level.
4. WORKFLOW.md / WORKFLOW_TRACKING.md this is the high level work flow that we need to follow in our development process
5. USER_STORIES this is the directory that manages the user stories
6. TESTS this is the directory that manages the tests
7. TASKS.md this the file that will be created routinely to keep track of the work that needs to get executed on at a detailed level.
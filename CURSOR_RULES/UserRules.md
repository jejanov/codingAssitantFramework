### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `WORKFLOW_TRACKING.md`** to identify active user stories and their current workflow phase.
- **Review `TASK.md`** for current implementation tasks and their status.
- **For new features**, follow the workflow in `WORKFLOW.md` starting with user story creation.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Refer to the Design System** in the `/DESIGN_SYSTEM` directory for UI component development. Check `DESIGN_SYSTEM/documentation/01-Overview.md` for an introduction.

### 📑 Document Hierarchy & Purpose
- **High-Level Instructions**: This UserRules document provides overarching guidance for all development work.
- **Context-Specific Rules**: MCP rules in `.cursor/rules/*.mdc` provide specialized guidance for specific file types or tasks.
- **Planning Documents**: `PLANNING.md` describes what we're building and architectural decisions.
- **Workflow Documents**: `WORKFLOW.md` and `WORKFLOW_TRACKING.md` guide the development process.
- **User Stories**: Define requirements with acceptance criteria (Using `.cursor/rules/user-story-creation.mdc`).
- **Test Documents**: Define test cases mapped to acceptance criteria (Using `.cursor/rules/test-case-creation.mdc`).
- **Task Lists**: Break down implementation steps by workflow phase (Using `.cursor/rules/task-creation.mdc`).
- **Always reference each document at the appropriate level** in the hierarchy when making decisions.

### 🔁 Test-Driven Development Workflow
- **Follow the TDD workflow** as documented in `WORKFLOW.md` with the current status in `WORKFLOW_TRACKING.md`.
- **Write tests before implementation** following the Red-Green-Refactor cycle.
- **Map tests to acceptance criteria** in the user story.
- **Implement only what's needed** to make tests pass, then refactor.
- **Track progress** in `TASK.md` as you move through the workflow phases.
- **Update the workflow phase** in `WORKFLOW_TRACKING.md` as you progress.
- **Workflow stages**:
  1. User Story Creation (Acceptance Criteria)
  2. Test Planning (Test Cases)
  3. Task Planning (Implementation Tasks)
  4. TDD Implementation (Red-Green-Refactor)
  5. Verification & Completion

### 🎨 Design System Guidelines
- **Use design tokens** from `/DESIGN_SYSTEM/tokens/` for all UI styling (colors, spacing, typography, etc.).
- **Follow component patterns** established in `/DESIGN_SYSTEM/components/`.
- **Implement glassmorphism hierarchy** (container/interactive/emphasized/content) as described in `/DESIGN_SYSTEM/documentation/06-Glassmorphism.md`.
- **Each component should have** both a `.tsx` implementation file and a `.md` documentation file.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Use clear, consistent imports** (prefer relative imports within packages).

### 🧪 Testing & Reliability
- **Follow the test cases** in `USER_STORIES/US-XXX-feature-name/US-XXX-tests.md`.
- **Write tests in the `/tests` directory** mirroring the application structure.
- **Include at least**:
  - 1 test for expected use
  - 1 edge case 
  - 1 failure case
- **Use the Arrange-Act-Assert pattern** in test implementations.

### ✅ Task Creation & Completion
- **For new features**, create a task list using the structure in `.cursor/rules/task-creation.mdc`.
- **Organize tasks by TDD workflow phases** (Test Planning, Red, Green, Refactor, Verification).
- **Follow the implementation tasks** in `USER_STORIES/US-XXX-feature-name/US-XXX-tasks.md`.
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- **Add new sub-tasks** discovered during development to `TASK.md` under a "Discovered During Work" section.
- **Update the "Current Workflow Phase"** indicator in `WORKFLOW_TRACKING.md` as you progress.
- **Verify acceptance criteria** before marking a user story as complete.

### 📎 Style & Conventions
- **Use javascript** as the primary language.
- **Use JSDoc** for typing.
- **For UI components**, use Emotion styled components with TypeScript interfaces.

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified NodeJS packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
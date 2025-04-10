# User Stories Process

This directory contains user stories that drive our test-driven development process. Each user story follows a structured format that flows through acceptance criteria, test cases, and implementation tasks.

## User Story Creation Process

1. Create a new user story using the format in `.cursor/rules/user-story-creation.mdc`
2. Define clear acceptance criteria using the Given/When/Then format
3. Generate test cases based on acceptance criteria using the format in `.cursor/rules/test-case-creation.mdc`
4. Create implementation tasks using the format in `.cursor/rules/task-creation.mdc`
5. Develop code to pass tests following the Red-Green-Refactor cycle
6. Verify acceptance criteria are met
7. Track the current workflow phase in `WORKFLOW_TRACKING.md`

## Directory Structure 

```
USER_STORIES/
  ├── README.md (this file)
  ├── COMPLETED.md (tracking completed stories)
  └── US-XXX-feature-name/
      ├── US-XXX.md (user story with acceptance criteria)
      ├── US-XXX-tests.md (test cases derived from acceptance criteria)
      └── US-XXX-tasks.md (implementation tasks)
```

## Integration with Project

- Tests from user stories are implemented in the `/tests` directory
- Tasks are tracked in the main `TASK.md` file
- Workflow phases are tracked in `WORKFLOW_TRACKING.md`
- Completed user stories are tracked in `USER_STORIES/COMPLETED.md`

## Creating a New User Story

```bash
# Create directory for new user story
mkdir -p USER_STORIES/US-XXX-feature-name

# Create files (use the MDC rule templates for content)
touch USER_STORIES/US-XXX-feature-name/US-XXX.md
touch USER_STORIES/US-XXX-feature-name/US-XXX-tests.md
touch USER_STORIES/US-XXX-feature-name/US-XXX-tasks.md
```

For full workflow details, see `WORKFLOW.md` in the project root.
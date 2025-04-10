#!/bin/bash

# Script to create a new user story with all required files

# Check if the story number and name are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 [story-number] [feature-name]"
  echo "Example: $0 001 login-feature"
  exit 1
fi

# Get the story number and feature name
STORY_NUMBER=$1
FEATURE_NAME=$2
STORY_ID="US-$STORY_NUMBER"
DIR_NAME="$STORY_ID-$FEATURE_NAME"

# Create the directory
mkdir -p "USER_STORIES/$DIR_NAME"

if [ $? -ne 0 ]; then
  echo "Failed to create directory USER_STORIES/$DIR_NAME"
  exit 1
fi

# Copy template files
cp "USER_STORIES/TEMPLATE.md" "USER_STORIES/$DIR_NAME/$STORY_ID.md"
cp "USER_STORIES/TEST_TEMPLATE.md" "USER_STORIES/$DIR_NAME/$STORY_ID-tests.md"
cp "USER_STORIES/TASK_TEMPLATE.md" "USER_STORIES/$DIR_NAME/$STORY_ID-tasks.md"

# Replace placeholders in the files
sed -i "s/\[NUMBER\]/$STORY_NUMBER/g" "USER_STORIES/$DIR_NAME/$STORY_ID.md"
sed -i "s/\[NUMBER\]/$STORY_NUMBER/g" "USER_STORIES/$DIR_NAME/$STORY_ID-tests.md"
sed -i "s/\[NUMBER\]/$STORY_NUMBER/g" "USER_STORIES/$DIR_NAME/$STORY_ID-tasks.md"

# Update the story status in WORKFLOW_TRACKING.md
echo "Adding user story to WORKFLOW_TRACKING.md..."
if ! grep -q "$STORY_ID" "WORKFLOW_TRACKING.md"; then
  # Add a new section for this story under the workflow phases
  MARKER="## NOTES:"
  NEW_CONTENT="\n## $STORY_ID: Current Phase\n\n- [x] **User Story Creation**\n- [ ] **Test Planning**\n- [ ] **Task Planning**\n- [ ] **TDD Implementation**\n- [ ] **Verification**\n"
  
  # Use sed to insert the new content before the marker
  sed -i "/$MARKER/i $NEW_CONTENT" "WORKFLOW_TRACKING.md"
fi

echo "User story created successfully!"
echo ""
echo "Files created:"
echo "- USER_STORIES/$DIR_NAME/$STORY_ID.md"
echo "- USER_STORIES/$DIR_NAME/$STORY_ID-tests.md"
echo "- USER_STORIES/$DIR_NAME/$STORY_ID-tasks.md"
echo ""
echo "Next steps:"
echo "1. Edit USER_STORIES/$DIR_NAME/$STORY_ID.md to define your user story and acceptance criteria"
echo "2. Edit USER_STORIES/$DIR_NAME/$STORY_ID-tests.md to define test cases"
echo "3. Edit USER_STORIES/$DIR_NAME/$STORY_ID-tasks.md to define implementation tasks"
echo "4. Add tasks to TASK.md"
echo "5. Update WORKFLOW_TRACKING.md as you progress through phases"
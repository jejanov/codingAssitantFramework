# Test Cases for US-001: Display First Slide Content

## Unit Tests

### Test Case 1: Slide Data Fetching Service
**Maps to Acceptance Criterion:** 1 (Load), 5 (Error)

```typescript
// Test code to be implemented in /tests/services/slideService.test.ts
describe('slideService', () => {
  it('should fetch and parse markdown content for a given slide number', async () => {
    // Arrange: Mock fetch/file read for slide_01.md
    // Act: Call fetchSlideContent(1)
    // Assert: Returned data contains expected frontmatter (title) and body content
  });

  it('should handle file not found error', async () => {
    // Arrange: Mock fetch/file read to simulate a 404 or file system error
    // Act: Call fetchSlideContent(999) // Non-existent slide
    // Assert: Throws or returns an appropriate error
  });

  it('should handle malformed markdown or missing frontmatter', async () => {
    // Arrange: Mock fetch/file read with invalid markdown or missing title
    // Act: Call fetchSlideContent(1)
    // Assert: Handles the error gracefully (e.g., returns default values or throws specific error)
  });
});
```

### Test Case 2: Markdown Rendering Utility (Optional)
**Maps to Acceptance Criterion:** 3 (Body Content)

```typescript
// Test code to be implemented in /tests/utils/markdownRenderer.test.ts (if a dedicated utility is created)
describe('markdownRenderer', () => {
  it('should convert basic markdown to HTML', () => {
    // Arrange: Input markdown string (e.g., "# Title\n\nParagraph")
    // Act: Call renderMarkdown(input)
    // Assert: Output HTML string matches expected (e.g., "<h1>Title</h1>\n<p>Paragraph</p>")
  });
});
```

## UI Component Tests

### Test Case 3: Slide Display Component
**Maps to Acceptance Criteria:** 2 (Title), 3 (Body Content), 4 (Loading), 5 (Error)

```typescript
// Test code to be implemented in /tests/components/slides/SlideDisplay.test.tsx (or similar)
import { render, screen } from '@testing-library/react';
// Import necessary mocks and the component itself

describe('SlideDisplay Component', () => {
  it('should display a loading indicator when loading', () => {
    // Arrange: Mock useSlideData hook to return { loading: true, data: null, error: null }
    // Act: Render the SlideDisplay component
    // Assert: Loading indicator text/element is present
  });

  it('should display an error message when an error occurs', () => {
    // Arrange: Mock useSlideData hook to return { loading: false, data: null, error: 'Failed to load' }
    // Act: Render the SlideDisplay component
    // Assert: Error message is displayed
  });

  it('should display the slide title when data is loaded', () => {
    // Arrange: Mock useSlideData hook to return { loading: false, data: { title: 'Test Title', body: '...' }, error: null }
    // Act: Render the SlideDisplay component
    // Assert: screen.getByRole('heading', { name: /Test Title/i }) is present
  });

  it('should display the rendered markdown body when data is loaded', () => {
    // Arrange: Mock useSlideData hook to return { loading: false, data: { title: '...', body: '<p>Test Content</p>' }, error: null }
    // Act: Render the SlideDisplay component
    // Assert: Element containing "Test Content" is present
  });
});
```

## Integration Tests

(None planned specifically for this story, covered by UI component tests using mocked service/hook)

## Manual Test Cases

(None required if automated tests pass) 
# Test Cases for US-002: Create "Introduction Code" Slide

## UI Component Tests

### Test Case 1: Slide02 Component Rendering
**Maps to Acceptance Criterion:** 1 (Simulated IDE Environment)

```typescript
// Test code to be implemented in /tests/components/slides/Slide02.test.tsx
import { render, screen } from '@testing-library/react';
import Slide02 from '@/components/slides/Slide02';

describe('Slide02 Component', () => {
  it('should render the IDE environment with correct styling', () => {
    // Arrange & Act
    render(<Slide02 />);
    
    // Assert
    // Check for IDE container
    const ideContainer = screen.getByTestId('ide-container');
    expect(ideContainer).toBeInTheDocument();
    expect(ideContainer).toHaveClass('dark-theme');
    
    // Check for line numbers
    const lineNumbers = screen.getByTestId('line-numbers');
    expect(lineNumbers).toBeInTheDocument();
    
    // Check for code editor area
    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toBeInTheDocument();
  });
});
```

### Test Case 2: Code Animation Functionality
**Maps to Acceptance Criteria:** 2 (Code Typing Animation), 3 (Syntax Highlighting)

```typescript
// Tests for the CodeTyping component
import { render, screen, act } from '@testing-library/react';
import CodeTyping from '@/components/slides/CodeTyping';

describe('CodeTyping Component', () => {
  beforeEach(() => {
    // Mock timers for animation testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start with an empty editor and add text progressively', () => {
    // Arrange
    const code = `// Test Code\nconst x = 1;`;
    
    // Act
    render(<CodeTyping code={code} speed={10} />);
    
    // Initial state should be empty or just starting
    const codeContainer = screen.getByTestId('code-content');
    expect(codeContainer.textContent).toBe('');
    
    // Fast-forward time to simulate partial typing
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Should have typed part of the code
    expect(codeContainer.textContent?.length).toBeGreaterThan(0);
    expect(codeContainer.textContent?.length).toBeLessThan(code.length);
    
    // Fast-forward to complete animation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should have completed typing
    expect(codeContainer.textContent).toContain('Test Code');
    expect(codeContainer.textContent).toContain('const x = 1');
  });

  it('should include syntax highlighting for JavaScript code', () => {
    // Arrange
    const code = `const x = 1; // Number variable`;
    
    // Act
    render(<CodeTyping code={code} speed={10} />);
    
    // Fast-forward to complete animation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Assert
    // Check for syntax highlighting elements (specific classes depend on the implementation)
    const keywordElement = screen.getByText('const');
    expect(keywordElement).toHaveClass('token', 'keyword'); // Assumes Prism.js classes
    
    const commentElement = screen.getByText('// Number variable');
    expect(commentElement).toHaveClass('token', 'comment');
  });
});
```

### Test Case 3: Translation Panel
**Maps to Acceptance Criteria:** 4 (Translation Panel Animation), 5 (Translation Panel Styling)

```typescript
// Tests for the TranslationPanel component
import { render, screen } from '@testing-library/react';
import TranslationPanel from '@/components/slides/TranslationPanel';

describe('TranslationPanel Component', () => {
  it('should render with correct styling and content', () => {
    // Arrange
    const isVisible = true;
    
    // Act
    render(<TranslationPanel isVisible={isVisible} />);
    
    // Assert
    const panel = screen.getByTestId('translation-panel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass('translation-panel');
    
    // Check for title
    expect(screen.getByText(/WHAT THIS ACTUALLY MEANS/i)).toBeInTheDocument();
    
    // Check for bullet points
    expect(screen.getByText(/Today, AI writes about 65% of code/i)).toBeInTheDocument();
    
    // Check for styling
    expect(panel).toHaveClass('light-background');
  });
  
  it('should not be visible when isVisible is false', () => {
    // Arrange
    const isVisible = false;
    
    // Act
    render(<TranslationPanel isVisible={isVisible} />);
    
    // Assert
    const panel = screen.getByTestId('translation-panel');
    expect(panel).toHaveClass('hidden'); // Or check for appropriate CSS class/style
  });
});
```

### Test Case 4: Audio Integration
**Maps to Acceptance Criterion:** 6 (Audio Integration)

```typescript
// Tests for the AudioEffects component/hook
import { renderHook, act } from '@testing-library/react-hooks';
import useAudioEffects from '@/hooks/useAudioEffects';

describe('useAudioEffects Hook', () => {
  let originalPlay;
  
  beforeEach(() => {
    // Mock the Howler.play implementation or HTMLAudioElement
    originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = jest.fn();
  });
  
  afterEach(() => {
    HTMLAudioElement.prototype.play = originalPlay;
  });
  
  it('should play keyboard typing sound', () => {
    // Arrange
    const { result } = renderHook(() => useAudioEffects());
    
    // Act
    act(() => {
      result.current.playTypingSound();
    });
    
    // Assert
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });
  
  it('should play translation panel entry sound', () => {
    // Arrange
    const { result } = renderHook(() => useAudioEffects());
    
    // Act
    act(() => {
      result.current.playPanelSlideSound();
    });
    
    // Assert
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });
});
```

### Test Case 5: Animation Sequencing
**Maps to Acceptance Criterion:** 7 (Animation Sequencing)

```typescript
// Tests for the animation sequencing in Slide02
import { render, screen, act } from '@testing-library/react';
import Slide02 from '@/components/slides/Slide02';

describe('Slide02 Animation Sequence', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('should animate in the correct sequence', () => {
    // Arrange
    render(<Slide02 />);
    
    // Act & Assert: IDE appears first
    const ide = screen.getByTestId('ide-container');
    expect(ide).toBeVisible();
    
    // Code typing begins
    const codeContent = screen.getByTestId('code-content');
    expect(codeContent.textContent).toBe(''); // Initially empty
    
    // Fast-forward to simulate code typing progress
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Should have some code typed by now
    expect(codeContent.textContent?.length).toBeGreaterThan(0);
    
    // Translation panel should still be hidden
    const panel = screen.queryByTestId('translation-panel');
    expect(panel).toHaveClass('hidden'); // Or appropriate class/style
    
    // Fast-forward to complete code typing
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Translation panel should be visible after code typing completes
    expect(panel).not.toHaveClass('hidden');
  });
});
```

## Manual Test Cases

### Manual Test 1: Visual and Audio Experience
**Maps to Acceptance Criteria:** 1-7 (All criteria)

1. Start the application and navigate to the second slide
2. Verify the IDE environment appears with proper dark theme styling
3. Observe the code typing animation, checking for:
   - Realistic typing speed
   - Proper indentation and formatting
   - Syntax highlighting applied correctly
   - Cursor blinking at appropriate times
4. Listen for typing sounds synchronized with the animation
5. After code typing completes, verify the translation panel slides in with proper animation
6. Check that the translation panel has the correct styling and content
7. Verify all audio effects play at the appropriate times

### Manual Test 2: Animation Timing and Flow
**Maps to Acceptance Criterion:** 7 (Animation Sequencing)

1. Start the slide animation and time each phase
2. Verify the typing speed is reasonable (not too fast or too slow)
3. Check for appropriate pauses at logical code breakpoints
4. Verify that the translation panel appears only after the code typing is complete
5. Observe the translation bullet points appearing with the slight bouncing effect
6. Check the overall timing of the slide's animation sequence 
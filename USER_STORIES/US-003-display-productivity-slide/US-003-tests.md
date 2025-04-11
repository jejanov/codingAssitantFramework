# Test Cases for US-003: Display Productivity Visualization Slide

## Unit Tests

### Test Case 1: Slide03 component renders correctly
**Maps to Acceptance Criterion:** 1

```typescript
// Test to be implemented in /tests/components/slides/Slide03.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Slide03 from '../../../src/components/slides/Slide03';
import { SlideContext } from '../../../src/contexts/SlideContext';

// Mock the useAudioEffects hook
vi.mock('../../../src/hooks/useAudioEffects', () => ({
  useAudioEffects: () => ({
    playSound: vi.fn(),
    stopSound: vi.fn(),
    isPlaying: false,
    toggleSound: vi.fn(),
    setSoundEnabled: vi.fn(),
    isSoundEnabled: true
  })
}));

describe('Slide03 Component', () => {
  it('should render with correct title and structure', () => {
    // Arrange
    const slideContextValue = {
      currentSlide: 3,
      totalSlides: 5,
      navigateToSlide: vi.fn(),
      nextSlide: vi.fn(),
      previousSlide: vi.fn(),
      isLastSlide: false,
      isFirstSlide: false
    };
    
    // Act
    render(
      <SlideContext.Provider value={slideContextValue}>
        <Slide03 />
      </SlideContext.Provider>
    );
    
    // Assert
    expect(screen.getByText('Breaking the Speed Limit: The Multiplier Effect')).toBeInTheDocument();
    expect(screen.getByTestId('slide-03-container')).toHaveClass('productivity-slide');
  });
  
  it('should apply proper glassmorphism styling', () => {
    // Arrange
    const slideContextValue = {
      currentSlide: 3,
      totalSlides: 5,
      navigateToSlide: vi.fn(),
      nextSlide: vi.fn(),
      previousSlide: vi.fn(),
      isLastSlide: false,
      isFirstSlide: false
    };
    
    // Act
    render(
      <SlideContext.Provider value={slideContextValue}>
        <Slide03 />
      </SlideContext.Provider>
    );
    
    // Assert
    // Check that Glass components are used with proper hierarchy
    const container = screen.getByTestId('slide-03-container');
    expect(container).toBeInTheDocument();
    // Note: Further styling tests would be handled by snapshot tests or style-specific assertions
  });
  
  it('should handle case when slide context is not provided', () => {
    // Act & Assert
    expect(() => render(<Slide03 />)).not.toThrow();
  });
});
```

### Test Case 2: Racing visualization component
**Maps to Acceptance Criterion:** 2

```typescript
// Test to be implemented in /tests/components/slides/RaceTrack.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RaceTrack from '../../../src/components/slides/RaceTrack';

describe('RaceTrack Component', () => {
  it('should render with two cars at correct positions', () => {
    // Arrange
    const progress = 0.5; // 50% progress through race
    
    // Act
    render(<RaceTrack progress={progress} />);
    
    // Assert
    const traditionalCar = screen.getByTestId('traditional-car');
    const aiAssistedCar = screen.getByTestId('ai-assisted-car');
    
    expect(traditionalCar).toBeInTheDocument();
    expect(aiAssistedCar).toBeInTheDocument();
    
    // The AI car should be further along the track (exact position would depend on implementation)
    const traditionalCarRect = traditionalCar.getBoundingClientRect();
    const aiAssistedCarRect = aiAssistedCar.getBoundingClientRect();
    expect(aiAssistedCarRect.x).toBeGreaterThan(traditionalCarRect.x);
  });
  
  it('should render countdown when race is starting', () => {
    // Arrange 
    const progress = 0.05; // Early in the race
    
    // Act
    render(<RaceTrack progress={progress} />);
    
    // Assert
    // Check for countdown elements
    const countdown = screen.getByTestId('countdown');
    expect(countdown).toBeInTheDocument();
  });
  
  it('should show finish line when race is complete', () => {
    // Arrange
    const progress = 1.0; // Race complete
    
    // Act
    render(<RaceTrack progress={progress} />);
    
    // Assert
    const finishLine = screen.getByTestId('finish-line');
    expect(finishLine).toBeInTheDocument();
    expect(finishLine).toHaveClass('active');
  });
});
```

### Test Case 3: Productivity metrics display
**Maps to Acceptance Criterion:** 3

```typescript
// Test to be implemented in /tests/components/slides/ProductivityMetrics.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductivityMetrics from '../../../src/components/slides/ProductivityMetrics';

describe('ProductivityMetrics Component', () => {
  it('should render metrics when race progress is sufficient', () => {
    // Arrange
    const raceProgress = 0.4; // 40% progress
    
    // Act
    render(<ProductivityMetrics raceProgress={raceProgress} />);
    
    // Assert
    expect(screen.getByText(/55.8%/)).toBeInTheDocument(); // Task completion metric
    expect(screen.getByText(/126%/)).toBeInTheDocument(); // Weekly tasks metric
    expect(screen.getByText(/26%/)).toBeInTheDocument(); // PRs merged metric
    expect(screen.getByText(/50%/)).toBeInTheDocument(); // Production time metric
  });
  
  it('should not show metrics when race has not progressed enough', () => {
    // Arrange
    const raceProgress = 0.1; // Only 10% progress
    
    // Act
    render(<ProductivityMetrics raceProgress={raceProgress} />);
    
    // Assert
    expect(screen.queryByText(/55.8%/)).not.toBeInTheDocument();
    // Other metrics should also not be visible yet
  });
  
  it('should respond to hover interactions', async () => {
    // Arrange
    const raceProgress = 0.5;
    
    // Act
    render(<ProductivityMetrics raceProgress={raceProgress} />);
    
    // Get a metric card
    const metricCard = screen.getByTestId('metric-task-completion');
    
    // Simulate hover
    fireEvent.mouseEnter(metricCard);
    
    // Assert
    // Check for class changes or style changes that indicate hover state
    expect(metricCard).toHaveClass('hovered');
  });
});
```

### Test Case 4: Timeline comparison visualization
**Maps to Acceptance Criterion:** 4

```typescript
// Test to be implemented in /tests/components/slides/TimelineComparison.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimelineComparison from '../../../src/components/slides/TimelineComparison';

describe('TimelineComparison Component', () => {
  it('should render when race is sufficiently progressed', () => {
    // Arrange
    const raceProgress = 0.8; // 80% progress (beyond the 70% threshold)
    
    // Act
    render(<TimelineComparison raceProgress={raceProgress} />);
    
    // Assert
    expect(screen.getByText('Traditional: 10 weeks')).toBeInTheDocument();
    expect(screen.getByText('AI-Augmented: 4.8 weeks')).toBeInTheDocument();
    expect(screen.getByText('52% Time Reduction')).toBeInTheDocument();
  });
  
  it('should not render when race has not progressed enough', () => {
    // Arrange
    const raceProgress = 0.6; // 60% progress (below the 70% threshold)
    
    // Act
    render(<TimelineComparison raceProgress={raceProgress} />);
    
    // Assert
    expect(screen.queryByText('Traditional: 10 weeks')).not.toBeInTheDocument();
  });
  
  it('should display all phases of the timeline', () => {
    // Arrange
    const raceProgress = 1.0; // Race complete
    
    // Act
    render(<TimelineComparison raceProgress={raceProgress} />);
    
    // Assert
    // Check for all timeline phases
    const phases = ['Requirements', 'Implementation', 'Integration', 'Testing', 'Documentation'];
    phases.forEach(phase => {
      expect(screen.getAllByText(phase).length).toBeGreaterThan(0);
    });
  });
});
```

### Test Case 5: Audio elements integration
**Maps to Acceptance Criterion:** 5

```typescript
// Test to be implemented in /tests/components/slides/Slide03.audio.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Slide03 from '../../../src/components/slides/Slide03';

// Create a more detailed mock for useAudioEffects
const playSound = vi.fn();
const stopSound = vi.fn();

vi.mock('../../../src/hooks/useAudioEffects', () => ({
  useAudioEffects: () => ({
    playSound,
    stopSound,
    isPlaying: false,
    toggleSound: vi.fn(),
    setSoundEnabled: vi.fn(),
    isSoundEnabled: true
  })
}));

describe('Slide03 Audio Integration', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    playSound.mockClear();
    stopSound.mockClear();
  });
  
  it('should play tech-ambience sound when slide mounts', () => {
    // Act
    render(<Slide03 />);
    
    // Assert
    expect(playSound).toHaveBeenCalledWith('tech-ambience', expect.objectContaining({
      loop: true,
      volume: expect.any(Number)
    }));
  });
  
  it('should play countdown sounds as race begins', async () => {
    // Arrange
    vi.useFakeTimers();
    
    // Act
    render(<Slide03 />);
    
    // Fast-forward timers to trigger countdown
    vi.advanceTimersByTime(2000);
    
    // Assert
    expect(playSound).toHaveBeenCalledWith(expect.stringContaining('beep'), expect.any(Object));
    
    vi.useRealTimers();
  });
  
  it('should clean up sounds when unmounting', () => {
    // Arrange
    const { unmount } = render(<Slide03 />);
    
    // Act
    unmount();
    
    // Assert
    expect(stopSound).toHaveBeenCalled();
  });
});
```

### Test Case 6: Research citation display
**Maps to Acceptance Criterion:** 6

```typescript
// Test to be implemented in /tests/components/slides/Slide03.citation.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Slide03 from '../../../src/components/slides/Slide03';

describe('Slide03 Research Citation', () => {
  it('should display citation when race is complete', () => {
    // Arrange - We need to mock the race progress to be complete
    // This might need to be handled via a prop or state manipulation
    vi.useFakeTimers();
    
    // Act
    render(<Slide03 />);
    
    // Fast-forward time to complete all animations
    vi.advanceTimersByTime(15000); // Assuming race takes about 15 seconds
    
    // Assert
    expect(screen.getByText(/MIT\/Microsoft study/)).toBeInTheDocument();
    expect(screen.getByText(/Microsoft\/MIT\/Wharton field research/)).toBeInTheDocument();
    
    vi.useRealTimers();
  });
  
  it('should have proper styling and animation', () => {
    // Arrange
    vi.useFakeTimers();
    
    // Act
    render(<Slide03 />);
    
    // Fast-forward time to complete all animations
    vi.advanceTimersByTime(15000);
    
    // Assert
    const citation = screen.getByTestId('research-citation');
    expect(citation).toBeInTheDocument();
    expect(citation).toHaveClass('fade-in'); // Assuming a class for the fade animation
    
    vi.useRealTimers();
  });
});
```

## Integration Tests

### Test Case 7: Slide integration with SlideContext
**Maps to Acceptance Criteria:** 1, 2, 3, 4, 5, 6

```typescript
// Test to be implemented in /tests/integration/ProductivitySlideIntegration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Slide03 from '../../../src/components/slides/Slide03';
import { SlideContext } from '../../../src/contexts/SlideContext';

describe('Productivity Slide Integration', () => {
  it('should integrate with SlideContext for navigation', () => {
    // Arrange
    const mockNextSlide = vi.fn();
    const slideContextValue = {
      currentSlide: 3,
      totalSlides: 5,
      navigateToSlide: vi.fn(),
      nextSlide: mockNextSlide,
      previousSlide: vi.fn(),
      isLastSlide: false,
      isFirstSlide: false
    };
    
    // Act
    render(
      <SlideContext.Provider value={slideContextValue}>
        <Slide03 />
      </SlideContext.Provider>
    );
    
    // Simulate completing the race and all animations
    vi.useFakeTimers();
    act(() => {
      vi.advanceTimersByTime(20000); // Advance beyond all animations
    });
    
    // Trigger next slide navigation (implementation-dependent)
    const slideContainer = screen.getByTestId('slide-03-container');
    fireEvent.click(slideContainer);
    
    // Assert
    expect(mockNextSlide).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
  
  it('should properly clean up resources when navigating away', () => {
    // Arrange
    const stopSound = vi.fn();
    vi.mock('../../../src/hooks/useAudioEffects', () => ({
      useAudioEffects: () => ({
        playSound: vi.fn(),
        stopSound,
        isPlaying: false,
        toggleSound: vi.fn(),
        setSoundEnabled: vi.fn(),
        isSoundEnabled: true
      })
    }));
    
    const slideContextValue = {
      currentSlide: 3,
      totalSlides: 5,
      navigateToSlide: vi.fn(),
      nextSlide: vi.fn(),
      previousSlide: vi.fn(),
      isLastSlide: false,
      isFirstSlide: false
    };
    
    // Act
    const { unmount } = render(
      <SlideContext.Provider value={slideContextValue}>
        <Slide03 />
      </SlideContext.Provider>
    );
    
    // Simulate navigating away
    unmount();
    
    // Assert
    expect(stopSound).toHaveBeenCalled();
  });
});
```

## Manual Test Cases

### Manual Test 1: Visual confirmation of animations and transitions
**Maps to Acceptance Criteria:** 1, 2, 3, 4, 5, 6

1. Navigate to slide 3 in the presentation
2. Observe the title fade in and race track appear
3. Watch the countdown animation and verify audio cues
4. Verify racing animation shows AI car moving faster
5. Confirm metrics appear with counting animations
6. Verify timeline comparison appears when race is 70% complete
7. Confirm the "52% Time Reduction" highlight is prominent
8. Verify all sound effects play at appropriate times
9. Confirm research citation appears at conclusion
10. Check that all animations are smooth and professional

### Manual Test 2: Responsive layout testing
**Maps to Acceptance Criterion:** 1

1. View slide 3 on different screen sizes (desktop, tablet, mobile)
2. Verify all elements remain visible and properly positioned
3. Confirm text remains readable at all viewport sizes
4. Verify that racing animation and metrics scale appropriately
5. Check that glassmorphism effects render properly across devices 
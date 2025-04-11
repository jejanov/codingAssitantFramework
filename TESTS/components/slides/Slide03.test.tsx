import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the Glass component
vi.mock('../../../DESIGN_SYSTEM/components/Glass/Glass', () => ({
    Glass: ({ children, className, 'data-testid': dataTestId }) => (
        <div className={className} data-testid={dataTestId}>
            {children}
        </div>
    ),
}));

// Mock child components
vi.mock('../../../src/components/slides/RaceTrack', () => ({
    default: ({ progress }: { progress: number }) => (
        <div data-testid="mock-race-track">RaceTrack: {progress}</div>
    ),
}));

vi.mock('../../../src/components/slides/ProductivityMetrics', () => ({
    default: ({ raceProgress }: { raceProgress: number }) => (
        <div data-testid="mock-productivity-metrics">ProductivityMetrics: {raceProgress}</div>
    ),
}));

vi.mock('../../../src/components/slides/TimelineComparison', () => ({
    default: ({ raceProgress }: { raceProgress: number }) => (
        <div data-testid="mock-timeline-comparison">TimelineComparison: {raceProgress}</div>
    ),
}));

// Mock the AudioContext
vi.mock('../../../src/App', () => ({
    AudioContext: React.createContext(null)
}));

// Mock the useAudioEffects hook
vi.mock('../../../src/hooks/useAudioEffects', () => ({
    default: () => ({
        playSound: vi.fn(),
        stopSound: vi.fn(),
        isPlaying: false,
        toggleSound: vi.fn(),
        setSoundEnabled: vi.fn(),
        isSoundEnabled: true
    })
}));

// Now import Slide03 after all mocks are set up
import Slide03 from '../../../src/components/slides/Slide03';

// Mock the SlideContext - make sure this is after all imports
const SlideContext = React.createContext({
    currentSlide: 3,
    totalSlides: 5,
    navigateToSlide: vi.fn(),
    nextSlide: vi.fn(),
    previousSlide: vi.fn(),
    isLastSlide: false,
    isFirstSlide: false
});

describe('Slide03 Component', () => {
    it('should render with correct title', () => {
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
}); 
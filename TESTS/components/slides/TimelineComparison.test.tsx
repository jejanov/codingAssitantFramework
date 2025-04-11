import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the Glass component
vi.mock('../../../DESIGN_SYSTEM/components/Glass/Glass', () => ({
    Glass: ({ children, className, level }) => (
        <div className={className} data-level={level}>
            {children}
        </div>
    ),
}));

// Mock the AnimatePresence component
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} data-motion="true">
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the AudioContext
vi.mock('../../../src/App', () => ({
    AudioContext: React.createContext(null)
}));

// Import the component after mocks
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

        // Check that the "52% Time Reduction" appears
        expect(screen.getByText('52% Time Reduction')).toBeInTheDocument();
    });

    it('should not render when race has not progressed enough', () => {
        // Arrange
        const raceProgress = 0.6; // 60% progress (below the 70% threshold)

        // Act
        render(<TimelineComparison raceProgress={raceProgress} />);

        // Assert - timeline comparison should not be visible yet
        expect(screen.queryByText('Traditional: 10 weeks')).not.toBeInTheDocument();
        expect(screen.queryByText('AI-Augmented: 4.8 weeks')).not.toBeInTheDocument();
    });

    it('should display phases of the timeline', () => {
        // Arrange
        const raceProgress = 1.0; // Race complete

        // Act
        render(<TimelineComparison raceProgress={raceProgress} />);

        // Assert
        // Check for timeline phases - use getAllByText since each phase appears twice (once for each timeline)
        const phases = ['Requirements', 'Implementation', 'Integration', 'Testing', 'Documentation'];
        phases.forEach(phase => {
            expect(screen.getAllByText(phase).length).toBe(2); // Each phase appears in both timelines
        });

        // Check for timeline labels
        expect(screen.getByText('Traditional: 10 weeks')).toBeInTheDocument();
        expect(screen.getByText('AI-Augmented: 4.8 weeks')).toBeInTheDocument();
    });
}); 
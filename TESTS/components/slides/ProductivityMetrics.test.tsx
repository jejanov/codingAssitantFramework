import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock the Glass component
vi.mock('../../../DESIGN_SYSTEM/components/Glass/Glass', () => ({
    Glass: ({ children, className, level }) => (
        <div className={className} data-level={level}>
            {children}
        </div>
    ),
}));

// Mock the AudioContext
vi.mock('../../../src/App', () => ({
    AudioContext: React.createContext(null)
}));

// Import after mocks
import ProductivityMetrics from '../../../src/components/slides/ProductivityMetrics';

describe('ProductivityMetrics Component', () => {
    it('should render metrics when race progress is sufficient', () => {
        // Arrange
        const raceProgress = 0.5; // 50% progress - enough to show all metrics

        // Act
        render(<ProductivityMetrics raceProgress={raceProgress} />);

        // Assert - check if metrics are visible
        expect(screen.getByText(/Task Completion Speed/)).toBeInTheDocument();
        expect(screen.getByText(/\+55.8%/)).toBeInTheDocument();
        expect(screen.getByText(/Weekly Tasks Completed/)).toBeInTheDocument();
        expect(screen.getByText(/\+126%/)).toBeInTheDocument();
        expect(screen.getByText(/Pull Requests Merged/)).toBeInTheDocument();
        expect(screen.getByText(/\+26%/)).toBeInTheDocument();
        expect(screen.getByText(/Production Time/)).toBeInTheDocument();
        expect(screen.getByText(/\-50%/)).toBeInTheDocument();
    });

    it('should not show metrics when race has not progressed enough', () => {
        // Arrange
        const raceProgress = 0.1; // Only 10% progress - not enough to show metrics

        // Act
        render(<ProductivityMetrics raceProgress={raceProgress} />);

        // Assert - metrics should not be visible yet
        expect(screen.queryByText(/\+55.8%/)).not.toBeInTheDocument();
        expect(screen.queryByText(/\+126%/)).not.toBeInTheDocument();
    });

    it('should respond to hover interactions', () => {
        // Arrange
        const raceProgress = 0.5; // 50% progress

        // Act
        render(<ProductivityMetrics raceProgress={raceProgress} />);

        // Get the first metric card
        const metricCard = screen.getByTestId('metric-task-completion');

        // Simulate hover
        fireEvent.mouseEnter(metricCard);

        // Assert - card should have hovered class
        expect(metricCard).toHaveClass('hovered');

        // Simulate mouse leave
        fireEvent.mouseLeave(metricCard);

        // Assert - card should not have hovered class
        expect(metricCard).not.toHaveClass('hovered');
    });
}); 
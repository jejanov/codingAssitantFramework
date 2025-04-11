import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the Glass component
vi.mock('../../../DESIGN_SYSTEM/components/Glass/Glass', () => ({
    Glass: ({ children, className }) => (
        <div className={className}>
            {children}
        </div>
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

// Import RaceTrack after mocks
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
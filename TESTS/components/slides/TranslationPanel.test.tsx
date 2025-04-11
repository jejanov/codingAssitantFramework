import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Import the component (will be implemented later)
// import TranslationPanel from '@/components/slides/TranslationPanel';

// Temporary mock component until the real one is implemented
const TranslationPanel = ({ isVisible = false }: { isVisible?: boolean }) => {
    const visibilityClass = isVisible ? 'visible' : 'hidden';

    return (
        <div
            data-testid="translation-panel"
            className={`translation-panel light-background ${visibilityClass}`}
        >
            <h2>WHAT THIS ACTUALLY MEANS (FOR THE NON-DEVELOPERS):</h2>
            <ul>
                <li>Today, AI writes about 65% of code</li>
                <li>By mid-2025, AI will write 90% of code</li>
                <li>By early 2026, prepare for AI to write ALL the code</li>
            </ul>
        </div>
    );
};

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
        expect(panel).toHaveClass('hidden');
    });
}); 
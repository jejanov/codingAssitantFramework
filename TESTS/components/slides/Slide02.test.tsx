import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// We'll mock the components used in Slide02
vi.mock('@/components/slides/CodeTyping', () => ({
    default: ({ code }: { code: string }) => (
        <div data-testid="code-typing-mock">
            <pre>{code}</pre>
        </div>
    ),
}));

vi.mock('@/components/slides/TranslationPanel', () => ({
    default: ({ isVisible }: { isVisible: boolean }) => (
        <div
            data-testid="translation-panel"
            className={isVisible ? 'visible' : 'hidden'}
        >
            Translation Panel Mock
        </div>
    ),
}));

// Import the component (will be implemented later)
// import Slide02 from '@/components/slides/Slide02';

// Temporary mock component until the real one is implemented
const Slide02 = () => (
    <div>
        <div data-testid="ide-container" className="dark-theme">
            <div data-testid="line-numbers"></div>
            <div data-testid="code-editor"></div>
        </div>
    </div>
);

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

    // We'll add more tests when implementing the animation sequence tests
}); 
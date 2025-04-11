import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the components we'll use
vi.mock('@/components/slides/CodeTyping', () => ({
    default: ({ code, onComplete }: { code: string; onComplete?: () => void }) => {
        React.useEffect(() => {
            // Simulate typing completion after 5 seconds
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 5000);
            return () => clearTimeout(timer);
        }, [onComplete]);

        return <div data-testid="code-typing-mock">{code.substring(0, 10)}...</div>;
    },
}));

vi.mock('@/components/slides/TranslationPanel', () => ({
    default: ({ isVisible }: { isVisible: boolean }) => (
        <div
            data-testid="translation-panel"
            className={isVisible ? 'visible' : 'hidden'}
        >
            Translation Panel
        </div>
    ),
}));

// Import the component (will be implemented later)
// import Slide02 from '@/components/slides/Slide02';

// Simplified mock component for testing animation sequence
const Slide02 = () => {
    const [typingComplete, setTypingComplete] = React.useState(false);

    const handleTypingComplete = () => {
        setTypingComplete(true);
    };

    return (
        <div>
            <div data-testid="ide-container" className="dark-theme">
                <div data-testid="code-content">
                    {/* Here we'd render the CodeTyping component */}
                    Code is being typed...
                </div>
            </div>
            <div
                data-testid="translation-panel"
                className={typingComplete ? 'visible' : 'hidden'}
            >
                Translation Panel
            </div>
        </div>
    );
};

describe('Slide02 Animation Sequence', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should animate in the correct sequence', () => {
        // Arrange
        render(<Slide02 />);

        // Act & Assert: IDE appears first
        const ide = screen.getByTestId('ide-container');
        expect(ide).toBeVisible();

        // Code content should be visible
        const codeContent = screen.getByTestId('code-content');
        expect(codeContent).toBeVisible();

        // Translation panel should be hidden initially
        const panel = screen.getByTestId('translation-panel');
        expect(panel).toHaveClass('hidden');

        // Fast-forward to 6 seconds, after typing should be complete
        act(() => {
            vi.advanceTimersByTime(6000);
        });

        // Translation panel should be visible after code typing completes
        expect(panel).toHaveClass('visible');
    });
}); 
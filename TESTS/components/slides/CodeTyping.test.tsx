import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import the component (will be implemented later)
// import CodeTyping from '@/components/slides/CodeTyping';

// Mock Prism.js for syntax highlighting
vi.mock('prismjs', () => ({
    default: {
        highlight: vi.fn().mockImplementation((code, grammar) => {
            // Simple mock implementation that wraps keywords in spans
            return code
                .replace(/const/g, '<span class="token keyword">const</span>')
                .replace(/\/\/.*$/gm, '<span class="token comment">$&</span>');
        }),
        languages: {
            javascript: {}
        }
    }
}));

// Temporary mock component until the real one is implemented
const CodeTyping = ({ code, speed = 10 }: { code: string; speed?: number }) => {
    const [displayedCode, setDisplayedCode] = React.useState('');

    React.useEffect(() => {
        let timeoutId: number;
        let currentPos = 0;

        const typeNextChar = () => {
            if (currentPos < code.length) {
                setDisplayedCode(code.substring(0, currentPos + 1));
                currentPos++;
                timeoutId = window.setTimeout(typeNextChar, 1000 / speed);
            }
        };

        timeoutId = window.setTimeout(typeNextChar, 1000 / speed);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [code, speed]);

    return (
        <pre data-testid="code-content">
            <code dangerouslySetInnerHTML={{ __html: displayedCode }} />
        </pre>
    );
};

describe('CodeTyping Component', () => {
    beforeEach(() => {
        // Setup fake timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Restore timers
        vi.useRealTimers();
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
            vi.advanceTimersByTime(100);
        });

        // Should have typed part of the code
        expect(codeContainer.textContent?.length).toBeGreaterThan(0);
        expect(codeContainer.textContent?.length).toBeLessThan(code.length);

        // Fast-forward to complete animation
        act(() => {
            vi.advanceTimersByTime(1000);
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

        // Advance to the end of typing
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // Assert - we can only partially test this due to the mock component limitations
        // In the real component we'll use actual Prism.js for syntax highlighting
        const codeContainer = screen.getByTestId('code-content');
        expect(codeContainer.innerHTML).toContain('token');
    });
}); 
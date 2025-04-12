import React, { useState, useEffect, useRef, memo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
// Explicitly import Prism CSS again to ensure it's loaded
import 'prismjs/themes/prism-okaidia.css'; // Try a different theme

interface CodeTypingProps {
    code: string;
    speed?: number;
    onComplete?: () => void;
    onProgress?: (position: number, text: string) => void;
    brandColors?: {
        keyword?: string;
        string?: string;
        function?: string;
        comment?: string;
    };
}

/**
 * CodeTyping component that animates typing code with syntax highlighting
 */
const CodeTypingComponent: React.FC<CodeTypingProps> = ({
    code,
    speed = 10,
    onComplete,
    onProgress,
    brandColors
}) => {
    const [displayedCode, setDisplayedCode] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const typingTimeoutRef = useRef<number | null>(null);
    const isTypingStartedRef = useRef(false);
    const isUnmountedRef = useRef(false);

    // Apply custom syntax highlighting colors if provided
    useEffect(() => {
        if (brandColors) {
            const style = document.createElement('style');
            style.textContent = `
                .code-typing .token.keyword { color: ${brandColors.keyword || '#569cd6'} !important; }
                .code-typing .token.string { color: ${brandColors.string || '#ce9178'} !important; }
                .code-typing .token.function { color: ${brandColors.function || '#dcdcaa'} !important; }
                .code-typing .token.comment { color: ${brandColors.comment || '#6a9955'} !important; }
            `;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(style);
            };
        }
    }, [brandColors]);

    // Track component unmount to prevent state updates after unmount
    useEffect(() => {
        isUnmountedRef.current = false;
        return () => {
            isUnmountedRef.current = true;
        };
    }, []);

    // Main typing animation effect - runs only once when component mounts
    useEffect(() => {
        // Prevent multiple starts
        if (isTypingStartedRef.current) return;
        isTypingStartedRef.current = true;

        // Reset state
        setDisplayedCode('');
        setIsComplete(false);

        let currentPosition = 0;

        const typeNextCharacter = () => {
            if (isUnmountedRef.current) return;

            if (currentPosition < code.length) {
                // Add next character to displayed code
                setDisplayedCode(code.substring(0, currentPosition + 1));
                currentPosition++;

                // Call progress callback if provided
                if (onProgress) {
                    onProgress(currentPosition, code);
                }

                // Calculate delay - slow down at logical pauses
                let delay = 1000 / speed;
                const nextChar = code[currentPosition];
                // Pause longer at line breaks and punctuation
                if (nextChar === '\n' || nextChar === ';' || nextChar === '{' || nextChar === '}') {
                    delay *= 3;
                }

                typingTimeoutRef.current = window.setTimeout(typeNextCharacter, delay);
            } else {
                // Typing complete
                if (!isUnmountedRef.current) {
                    setIsComplete(true);
                    if (onComplete) {
                        onComplete();
                    }
                }
            }
        };

        // Start typing with a small delay
        typingTimeoutRef.current = window.setTimeout(typeNextCharacter, 500);

        // Cleanup function
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - run only once on mount

    // Apply syntax highlighting
    const highlightedCode = displayedCode ?
        Prism.highlight(displayedCode, Prism.languages.javascript, 'javascript') : '';

    // Add blinking cursor at the end
    const codeWithCursor = isComplete ?
        highlightedCode :
        highlightedCode + '<span class="cursor">|</span>';

    return (
        <pre data-testid="code-content" className="code-typing" style={{
            color: '#e0e0e0',
            fontSize: '16px',
            lineHeight: '1.5'
        }}>
            <code dangerouslySetInnerHTML={{ __html: codeWithCursor }} />
        </pre>
    );
};

// Use React.memo to prevent re-renders unless props change
const CodeTyping = memo(CodeTypingComponent);

export default CodeTyping; 
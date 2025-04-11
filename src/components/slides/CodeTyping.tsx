import React, { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

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
const CodeTyping: React.FC<CodeTypingProps> = ({
    code,
    speed = 10,
    onComplete,
    onProgress,
    brandColors
}) => {
    const [displayedCode, setDisplayedCode] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const typingTimeoutRef = useRef<number | null>(null);

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

    useEffect(() => {
        let currentPosition = 0;

        const typeNextCharacter = () => {
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
                setIsComplete(true);
                if (onComplete) {
                    onComplete();
                }
            }
        };

        // Start typing
        typingTimeoutRef.current = window.setTimeout(typeNextCharacter, 500);

        // Cleanup function
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [code, speed, onComplete, onProgress]);

    // Apply syntax highlighting
    const highlightedCode = displayedCode ?
        Prism.highlight(displayedCode, Prism.languages.javascript, 'javascript') : '';

    // Add blinking cursor at the end
    const codeWithCursor = isComplete ?
        highlightedCode :
        highlightedCode + '<span class="cursor">|</span>';

    return (
        <pre data-testid="code-content" className="code-typing">
            <code dangerouslySetInnerHTML={{ __html: codeWithCursor }} />
        </pre>
    );
};

export default CodeTyping; 
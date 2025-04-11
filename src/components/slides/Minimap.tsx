import React from 'react';

interface MinimapProps {
    code: string;
    currentPosition: number;
    brandColors?: {
        keyword?: string;
        string?: string;
        function?: string;
    };
}

/**
 * Minimap component that mimics VS Code's minimap
 */
const Minimap: React.FC<MinimapProps> = ({
    code,
    currentPosition,
    brandColors = {
        keyword: '#569cd6',
        string: '#ce9178',
        function: '#dcdcaa'
    }
}) => {
    // Create a simple visual representation of the code
    const lines = code.split('\n');
    const minimapHeight = Math.min(400, lines.length * 3); // Cap the height
    const viewportPercentage = currentPosition / code.length;

    return (
        <div
            data-testid="minimap"
            className="minimap glass-panel-content"
            style={{
                width: '60px',
                height: '100%',
                backgroundColor: 'rgba(30, 30, 30, 0.6)',
                backdropFilter: 'blur(5px)',
                borderLeft: '1px solid rgba(62, 62, 62, 0.4)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-paper-texture opacity-5" />

            {/* Minimap content visualization */}
            <div style={{
                height: minimapHeight,
                padding: '5px',
                position: 'relative'
            }}>
                {lines.map((line, index) => {
                    // Create simplified representations of code lines
                    const lineLength = Math.min(line.length / 2, 40);

                    // Different colors for comments, code blocks, etc.
                    let color = '#6a737d'; // Default gray
                    if (line.trim().startsWith('//')) {
                        color = '#6a9955'; // Green for comments
                    } else if (line.includes('function') || line.includes('const') || line.includes('let')) {
                        color = brandColors.keyword; // Keywords
                    } else if (line.includes('if') || line.includes('else') || line.includes('for')) {
                        color = brandColors.keyword; // Control flow 
                    } else if (line.includes('"') || line.includes("'")) {
                        color = brandColors.string; // Strings
                    } else if (line.includes('(') && line.includes(')') && !line.includes('if')) {
                        color = brandColors.function; // Function calls
                    }

                    return (
                        <div
                            key={index}
                            style={{
                                height: '2px',
                                width: `${lineLength}px`,
                                backgroundColor: color,
                                margin: '1px 0',
                                opacity: 0.7
                            }}
                        />
                    );
                })}
            </div>

            {/* Viewport indicator */}
            <div style={{
                position: 'absolute',
                top: `${viewportPercentage * 100}%`,
                width: '100%',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default Minimap; 
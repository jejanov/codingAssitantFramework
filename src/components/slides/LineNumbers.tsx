import React from 'react';

interface LineNumbersProps {
    count: number;
    brandColor?: string;
}

/**
 * LineNumbers component to display line numbers in the simulated IDE
 */
const LineNumbers: React.FC<LineNumbersProps> = ({
    count,
    brandColor = '#636d83'
}) => {
    return (
        <div
            data-testid="line-numbers"
            className="line-numbers glass-panel-content"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                paddingRight: '0.5rem',
                userSelect: 'none',
                color: brandColor,
                backgroundColor: 'rgba(40, 44, 52, 0.6)',
                backdropFilter: 'blur(5px)',
                fontFamily: 'monospace',
                fontSize: '14px',
                width: '3rem',
                textAlign: 'right',
                borderRight: `1px solid ${brandColor}30`,
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        padding: '0.125rem 0',
                        width: '100%'
                    }}
                >
                    {i + 1}
                </div>
            ))}
        </div>
    );
};

export default LineNumbers; 
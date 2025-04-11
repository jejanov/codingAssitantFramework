import React from 'react';

interface StatusBarProps {
    lineCount: number;
    currentLine: number;
    aiAssisted?: boolean;
    brandColors?: {
        primary?: string;
        accent?: string;
    };
}

/**
 * StatusBar component that mimics a VS Code status bar
 */
const StatusBar: React.FC<StatusBarProps> = ({
    lineCount,
    currentLine,
    aiAssisted = true,
    brandColors = {
        primary: '#2196f3',
        accent: '#00bcd4'
    }
}) => {
    return (
        <div
            data-testid="status-bar"
            className="status-bar glass-panel-interactive"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: `linear-gradient(to right, ${brandColors.primary}99, ${brandColors.accent}99)`,
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '12px',
                padding: '0 10px',
                height: '22px',
                fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                borderTop: '1px solid rgba(30, 30, 30, 0.6)'
            }}
        >
            <div className="status-left" style={{ display: 'flex', gap: '15px' }}>
                <span>JavaScript</span>
                <span>UTF-8</span>
                <span>LF</span>
            </div>

            <div className="status-center" style={{ display: 'flex', gap: '15px' }}>
                {aiAssisted && (
                    <span
                        className="hover-elevate"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        AI Assisted
                    </span>
                )}
            </div>

            <div className="status-right" style={{ display: 'flex', gap: '15px' }}>
                <span>Ln {currentLine}, Col 1</span>
                <span>{lineCount} lines</span>
                <span>Spaces: 2</span>
            </div>
        </div>
    );
};

export default StatusBar; 
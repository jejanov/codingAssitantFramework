import React from 'react';
import type { NodeProps } from 'reactflow';

// Basic styling for the title within the group node
const titleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-25px', // Position above the node's top border
    left: '15px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.8)', // Adjust color as needed
    fontSize: '14px',
    background: 'rgba(30, 41, 59, 0.8)', // Optional background for readability
    padding: '2px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
};

// Custom node component to render group nodes with a visible title
const TitledGroupNode: React.FC<NodeProps> = ({ data, style }) => {
    // data.label contains the title (e.g., "Foundation Layer")
    // style contains background, border, padding, width, height etc.

    return (
        // The main div represents the node itself, applying the styles
        <div style={style}>
            {/* Render the title using the data.label */}
            {data?.label && (
                <div style={titleStyle}>
                    {data.label}
                </div>
            )}
            {/* Child nodes will be rendered inside this by React Flow */}
        </div>
    );
};

export default React.memo(TitledGroupNode); 
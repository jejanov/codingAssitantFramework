import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Position,
    ReactFlowProvider, // Import ReactFlowProvider if needed for hooks like useReactFlow
    BackgroundVariant, // Import BackgroundVariant
    OnNodesChange, // Import change handler types
    OnEdgesChange, // Import change handler types
    NodeTypes, // Import NodeTypes type
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import ReactFlow styles

// Update Props for ReactFlow
export interface ReactFlowChartProps {
    /**
     * Nodes for the ReactFlow graph
     */
    nodes: Node[];
    /**
     * Edges for the ReactFlow graph
     */
    edges: Edge[];
    /**
     * Additional className for the container
     */
    className?: string;
    /**
     * Custom style for the container
     */
    style?: React.CSSProperties;
    /**
     * Optional flag to fit the view on change
     */
    fitView?: boolean;
    /**
     * Show minimap
     */
    showMiniMap?: boolean;
    /**
     * Show controls
     */
    showControls?: boolean;
    /**
     * Background variant
     */
    backgroundVariant?: BackgroundVariant;
    // Add props for edit mode
    isEditable?: boolean;
    onNodesChange?: OnNodesChange;
    onEdgesChange?: OnEdgesChange;
    nodeTypes?: NodeTypes; // Add nodeTypes prop
}

const ReactFlowChart: React.FC<ReactFlowChartProps> = ({
    nodes,
    edges,
    className = '',
    style,
    fitView = true,
    showMiniMap = true,
    showControls = true,
    backgroundVariant = BackgroundVariant.Dots,
    // Destructure new props
    isEditable = false,
    onNodesChange,
    onEdgesChange,
    nodeTypes, // Destructure nodeTypes
}) => {
    // Define default node options if needed (optional)
    const defaultNodeOptions = {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
            // Add default node styles if desired
            // background: '#fff',
            // border: '1px solid #ddd',
            // padding: 10,
            // borderRadius: 4,
        },
    };

    // Define default edge options if needed (optional)
    const defaultEdgeOptions = {
        // animated: true, // Example: make edges animated
        style: {
            // stroke: '#666', // Example: set default edge color
        },
    };

    return (
        <div
            className={`reactflow-chart-container ${className}`}
            style={{ height: '100%', width: '100%', ...style }} // Ensure container has dimensions
            data-chart-type="reactflow"
            data-testid="reactflow-chart"
            data-editable={isEditable ? 'true' : 'false'}
        >
            {/* Wrapping with ReactFlowProvider allows using hooks like useReactFlow */}
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    // Pass change handlers ONLY if in editable mode
                    onNodesChange={isEditable ? onNodesChange : undefined}
                    onEdgesChange={isEditable ? onEdgesChange : undefined}
                    // onConnect={onConnect} // Handle new connections if needed
                    fitView={fitView}
                    // fitViewOptions={{ padding: 0.2 }} // Customize fitView padding
                    defaultNodes={[]} // Provide default nodes if any
                    defaultEdges={[]} // Provide default edges if any
                    nodeOrigin={[0.5, 0.5]} // Center nodes origin if desired
                    // Conditionally enable/disable interactions
                    nodesDraggable={isEditable}
                    nodesConnectable={isEditable}
                    elementsSelectable={isEditable}
                    nodeTypes={nodeTypes} // Pass nodeTypes to ReactFlow
                // defaultNodeOptions={defaultNodeOptions} // Apply default node options
                // defaultEdgeOptions={defaultEdgeOptions} // Apply default edge options
                // nodeTypes={nodeTypes} // Provide custom node types if used
                // edgeTypes={edgeTypes} // Provide custom edge types if used
                >
                    {showControls && <Controls />}
                    {showMiniMap && <MiniMap />}
                    <Background variant={backgroundVariant} gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>

            {/* Remove Mermaid specific loading/rendering indicators */}
            {/* {!fontsReady && ...} */}
            {/* {isRendering && ...} */}
        </div>
    );
};

// Rename the export
// export default MermaidChartRefactored;
export default ReactFlowChart;
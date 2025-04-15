import React, { useEffect, useRef, useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore, useSlideStore, useDialogueStore } from '@/stores/StoreContext';
import { observer } from 'mobx-react-lite';
import './Slide04.css';
import { createPortal } from 'react-dom';
import ReactFlowChart from '../ui/ReactFlowChart';
import { Node, Edge, Position, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, getNodesBounds, getViewportForBounds, useNodesInitialized } from 'reactflow';
import * as dagre from 'dagre';
import TitledGroupNode from '../ui/TitledGroupNode';

/**
 * Standalone Debug Panel Component
 * Rendered via portal to avoid container styling conflicts
 */
interface DebugPanelProps {
    showDebugPanel: boolean;
    setShowDebugPanel: (show: boolean) => void;
    isDebugging: boolean;
    toggleDebugMode: () => void;
    debugDialogueIndex: number;
    activeView: 'initial' | 'context' | 'agentic' | 'integration' | 'complete';
    isRendering: boolean;
    jumpToDialogueIndex: (index: number) => void;
    setDirectView: (view: 'initial' | 'context' | 'agentic' | 'integration' | 'complete') => void;
    resetToNormalMode: () => void;
    isLayoutEditable: boolean;
    toggleLayoutEditable: () => void;
    handleSaveLayout: () => void;
}

const StandaloneDebugPanel: React.FC<DebugPanelProps> = ({
    showDebugPanel,
    setShowDebugPanel,
    isDebugging,
    toggleDebugMode,
    debugDialogueIndex,
    activeView,
    isRendering,
    jumpToDialogueIndex,
    setDirectView,
    resetToNormalMode,
    isLayoutEditable,
    toggleLayoutEditable,
    handleSaveLayout,
}) => {
    if (!showDebugPanel) return null;

    // Create portal to render outside main component tree
    return createPortal(
        <div
            className="debug-panel-backdrop"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="debug-panel-container">
                <div className="debug-panel-header">
                    <h4>Debug Controls</h4>
                    <button
                        onClick={() => setShowDebugPanel(false)}
                        className="debug-panel-close"
                    >
                        ✕
                    </button>
                </div>

                <div className="debug-panel-content">
                    <label className="debug-checkbox-label">
                        <input
                            type="checkbox"
                            checked={isDebugging}
                            onChange={toggleDebugMode}
                            className="debug-checkbox"
                        />
                        <span>Debug Mode {isDebugging ? '(Active)' : '(Off)'}</span>
                    </label>

                    {isDebugging && (
                        <>
                            <div className="debug-info">
                                <div>Current Dialogue Index: {debugDialogueIndex}</div>
                                <div>Current View: <strong>{activeView}</strong></div>
                                {isRendering && <div className="debug-rendering">Rendering...</div>}
                            </div>

                            <div className="debug-section">
                                <label className="debug-label">Set Dialogue Index:</label>
                                <div className="debug-button-group">
                                    {[0, 5, 9, 13, 15, 17].map((index) => (
                                        <button
                                            key={index}
                                            onClick={() => jumpToDialogueIndex(index)}
                                            className={`debug-button ${debugDialogueIndex === index ? 'debug-button-active' : ''}`}
                                            disabled={isRendering}
                                        >
                                            {index}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="debug-section">
                                <label className="debug-label">Set View Directly:</label>
                                <div className="debug-button-group">
                                    {(['initial', 'context', 'agentic', 'integration', 'complete'] as const).map((view) => (
                                        <button
                                            key={view}
                                            onClick={() => setDirectView(view)}
                                            className={`debug-button ${activeView === view ? 'debug-button-view-active' : ''}`}
                                            disabled={isRendering}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={resetToNormalMode}
                                className="debug-reset-button"
                                disabled={isRendering}
                            >
                                Reset to Normal Mode
                            </button>
                        </>
                    )}

                    <hr className="debug-divider" />

                    <label className="debug-checkbox-label">
                        <input
                            type="checkbox"
                            checked={isLayoutEditable}
                            onChange={toggleLayoutEditable}
                        />
                        <span>Layout Edit Mode {isLayoutEditable ? '(Active)' : '(Off)'}</span>
                    </label>

                    {isLayoutEditable && (
                        <button
                            onClick={handleSaveLayout}
                            className="debug-save-button"
                        >
                            Save Current Layout (to Console)
                        </button>
                    )}

                    <div className="debug-footer">
                        Press Shift+D or Alt+D to toggle debug panel
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Standalone Debug Button Component
interface DebugButtonProps {
    showDebugPanel: boolean;
    setShowDebugPanel: (show: boolean) => void;
}

const StandaloneDebugButton: React.FC<DebugButtonProps> = ({ showDebugPanel, setShowDebugPanel }) => {
    return createPortal(
        <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="debug-toggle-button"
        >
            {showDebugPanel ? 'Hide Debug' : 'Debug Controls'}
        </button>,
        document.body
    );
};

// Define the structure for the new layout data
interface ReactFlowLayout {
    nodes: Node[];
    edges: Edge[];
}

// --- Store complete React Flow layouts here --- 
const reactFlowLayouts: Record<string, ReactFlowLayout> = {
    initial: {
        "nodes": [
            {
                "id": "group-gJlywf",
                "type": "group",
                "position": {
                    "x": 115.25,
                    "y": 228.5
                },
                "data": {
                    "label": "Tools"
                },
                "style": {
                    "width": 600,
                    "height": 363,
                    "borderRadius": "8px"
                }
            },
            {
                "id": "group-18s_M9",
                "type": "group",
                "position": {
                    "x": -300.86553599233656,
                    "y": 167.6536828422877
                },
                "data": {
                    "label": "Chat"
                },
                "style": {
                    "width": 160,
                    "height": 198,
                    "borderRadius": "8px"
                }
            },
            {
                "id": "yfpEzhhLDZxZm_zqNlqer",
                "type": "default",
                "position": {
                    "x": -309.6036244150963,
                    "y": 97.89738600108313
                },
                "data": {
                    "label": "LLM Model"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "30px"
                },
                "extent": "parent"
            },
            {
                "id": "FoIrvVAdYSeVQJR_v_wRT",
                "type": "default",
                "position": {
                    "x": -310.52138379576655,
                    "y": 216.860781127496
                },
                "data": {
                    "label": "Prompt"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "30px"
                },
                "extent": "parent"
            },
            {
                "id": "Qyl3dAvBTyEBmT2r_BsIH",
                "type": "default",
                "position": {
                    "x": 142.8312715762001,
                    "y": 97.68556408298167
                },
                "data": {
                    "label": "Tool Calling Orchestrator"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "186px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "2kraheRPE_jTZOjpo765q",
                "type": "default",
                "position": {
                    "x": -85.87762439586291,
                    "y": 204.07218171475398
                },
                "data": {
                    "label": "Code Generation"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "134px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "cxC5nvIj1j8ZUhUwMi4Eu",
                "type": "default",
                "position": {
                    "x": -82.8721938346298,
                    "y": 331.8163336950588
                },
                "data": {
                    "label": "File System"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "oEXz6aJnqgDKLg9O7RFTN",
                "type": "default",
                "position": {
                    "x": 75.64712148547596,
                    "y": 200.49241568355808
                },
                "data": {
                    "label": "Testing Agent"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "114px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "D2ox3QNFKZ4dVv5vyxqdE",
                "type": "default",
                "position": {
                    "x": 335.3092885524642,
                    "y": 203.06315084259842
                },
                "data": {
                    "label": "Code Search"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "108px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "so6b-GCd3i6sKrY6HIm_j",
                "type": "default",
                "position": {
                    "x": 208.38445893935102,
                    "y": 202.28229869915606
                },
                "data": {
                    "label": "Debugging"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "2mcrPBTg6b8M1EPu6hGKG",
                "type": "default",
                "position": {
                    "x": 136.35723846987815,
                    "y": 329.798271950748
                },
                "data": {
                    "label": "Command Execution"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "158px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "yz_RjK-pmCQxT6R-wNbRY",
                "type": "default",
                "position": {
                    "x": 332.97129520298995,
                    "y": 326.03596293658177
                },
                "data": {
                    "label": "Code Indexing"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "118px",
                    "height": "45px"
                },
                "extent": "parent"
            }
        ],
        "edges": [
            {
                "source": "oEXz6aJnqgDKLg9O7RFTN",
                "target": "2mcrPBTg6b8M1EPu6hGKG",
                "id": "reactflow__edge-oEXz6aJnqgDKLg9O7RFTN-2mcrPBTg6b8M1EPu6hGKG"
            },
            {
                "source": "so6b-GCd3i6sKrY6HIm_j",
                "target": "2mcrPBTg6b8M1EPu6hGKG",
                "id": "reactflow__edge-so6b-GCd3i6sKrY6HIm_j-2mcrPBTg6b8M1EPu6hGKG"
            },
            {
                "source": "2kraheRPE_jTZOjpo765q",
                "target": "cxC5nvIj1j8ZUhUwMi4Eu",
                "id": "reactflow__edge-2kraheRPE_jTZOjpo765q-cxC5nvIj1j8ZUhUwMi4Eu"
            },
            {
                "source": "D2ox3QNFKZ4dVv5vyxqdE",
                "target": "yz_RjK-pmCQxT6R-wNbRY",
                "id": "reactflow__edge-D2ox3QNFKZ4dVv5vyxqdE-yz_RjK-pmCQxT6R-wNbRY"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "D2ox3QNFKZ4dVv5vyxqdE",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-D2ox3QNFKZ4dVv5vyxqdE"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "so6b-GCd3i6sKrY6HIm_j",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-so6b-GCd3i6sKrY6HIm_j"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "oEXz6aJnqgDKLg9O7RFTN",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-oEXz6aJnqgDKLg9O7RFTN"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "2kraheRPE_jTZOjpo765q",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-2kraheRPE_jTZOjpo765q"
            },
            {
                "source": "yfpEzhhLDZxZm_zqNlqer",
                "target": "FoIrvVAdYSeVQJR_v_wRT",
                "id": "reactflow__edge-yfpEzhhLDZxZm_zqNlqer-FoIrvVAdYSeVQJR_v_wRT"
            },
            {
                "source": "yfpEzhhLDZxZm_zqNlqer",
                "target": "Qyl3dAvBTyEBmT2r_BsIH",
                "id": "reactflow__edge-yfpEzhhLDZxZm_zqNlqer-Qyl3dAvBTyEBmT2r_BsIH"
            }
        ]
    },
    agentic: {
        "nodes": [
            {
                "id": "group-gJlywf",
                "type": "group",
                "position": {
                    "x": 115.25,
                    "y": 228.5
                },
                "data": {
                    "label": "Tools"
                },
                "style": {
                    "width": 600,
                    "height": 363,
                    "borderRadius": "8px"
                }
            },
            {
                "id": "group-18s_M9",
                "type": "group",
                "position": {
                    "x": -300.86553599233656,
                    "y": 167.6536828422877
                },
                "data": {
                    "label": "Chat"
                },
                "style": {
                    "width": 160,
                    "height": 198,
                    "borderRadius": "8px"
                }
            },
            {
                "id": "yfpEzhhLDZxZm_zqNlqer",
                "type": "default",
                "position": {
                    "x": -309.6036244150963,
                    "y": 97.89738600108313
                },
                "data": {
                    "label": "LLM Model"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "30px"
                },
                "extent": "parent"
            },
            {
                "id": "FoIrvVAdYSeVQJR_v_wRT",
                "type": "default",
                "position": {
                    "x": -310.52138379576655,
                    "y": 216.860781127496
                },
                "data": {
                    "label": "Prompt"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "30px"
                },
                "extent": "parent"
            },
            {
                "id": "Qyl3dAvBTyEBmT2r_BsIH",
                "type": "default",
                "position": {
                    "x": 142.8312715762001,
                    "y": 97.68556408298167
                },
                "data": {
                    "label": "Tool Calling Orchestrator"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "186px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "2kraheRPE_jTZOjpo765q",
                "type": "default",
                "position": {
                    "x": -85.87762439586291,
                    "y": 204.07218171475398
                },
                "data": {
                    "label": "Code Generation"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "134px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "cxC5nvIj1j8ZUhUwMi4Eu",
                "type": "default",
                "position": {
                    "x": -82.8721938346298,
                    "y": 331.8163336950588
                },
                "data": {
                    "label": "File System"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "oEXz6aJnqgDKLg9O7RFTN",
                "type": "default",
                "position": {
                    "x": 75.64712148547596,
                    "y": 200.49241568355808
                },
                "data": {
                    "label": "Testing Agent"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "114px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "D2ox3QNFKZ4dVv5vyxqdE",
                "type": "default",
                "position": {
                    "x": 335.3092885524642,
                    "y": 203.06315084259842
                },
                "data": {
                    "label": "Code Search"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "108px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "so6b-GCd3i6sKrY6HIm_j",
                "type": "default",
                "position": {
                    "x": 208.38445893935102,
                    "y": 202.28229869915606
                },
                "data": {
                    "label": "Debugging"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "100px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "2mcrPBTg6b8M1EPu6hGKG",
                "type": "default",
                "position": {
                    "x": 136.35723846987815,
                    "y": 329.798271950748
                },
                "data": {
                    "label": "Command Execution"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "158px",
                    "height": "45px"
                },
                "extent": "parent"
            },
            {
                "id": "yz_RjK-pmCQxT6R-wNbRY",
                "type": "default",
                "position": {
                    "x": 332.97129520298995,
                    "y": 326.03596293658177
                },
                "data": {
                    "label": "Code Indexing"
                },
                "style": {
                    "fontSize": "6px",
                    "width": "118px",
                    "height": "45px"
                },
                "extent": "parent"
            }
        ],
        "edges": [
            {
                "source": "oEXz6aJnqgDKLg9O7RFTN",
                "target": "2mcrPBTg6b8M1EPu6hGKG",
                "id": "reactflow__edge-oEXz6aJnqgDKLg9O7RFTN-2mcrPBTg6b8M1EPu6hGKG"
            },
            {
                "source": "so6b-GCd3i6sKrY6HIm_j",
                "target": "2mcrPBTg6b8M1EPu6hGKG",
                "id": "reactflow__edge-so6b-GCd3i6sKrY6HIm_j-2mcrPBTg6b8M1EPu6hGKG"
            },
            {
                "source": "2kraheRPE_jTZOjpo765q",
                "target": "cxC5nvIj1j8ZUhUwMi4Eu",
                "id": "reactflow__edge-2kraheRPE_jTZOjpo765q-cxC5nvIj1j8ZUhUwMi4Eu"
            },
            {
                "source": "D2ox3QNFKZ4dVv5vyxqdE",
                "target": "yz_RjK-pmCQxT6R-wNbRY",
                "id": "reactflow__edge-D2ox3QNFKZ4dVv5vyxqdE-yz_RjK-pmCQxT6R-wNbRY"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "D2ox3QNFKZ4dVv5vyxqdE",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-D2ox3QNFKZ4dVv5vyxqdE"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "so6b-GCd3i6sKrY6HIm_j",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-so6b-GCd3i6sKrY6HIm_j"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "oEXz6aJnqgDKLg9O7RFTN",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-oEXz6aJnqgDKLg9O7RFTN"
            },
            {
                "source": "Qyl3dAvBTyEBmT2r_BsIH",
                "target": "2kraheRPE_jTZOjpo765q",
                "id": "reactflow__edge-Qyl3dAvBTyEBmT2r_BsIH-2kraheRPE_jTZOjpo765q"
            },
            {
                "source": "yfpEzhhLDZxZm_zqNlqer",
                "target": "FoIrvVAdYSeVQJR_v_wRT",
                "id": "reactflow__edge-yfpEzhhLDZxZm_zqNlqer-FoIrvVAdYSeVQJR_v_wRT"
            },
            {
                "source": "yfpEzhhLDZxZm_zqNlqer",
                "target": "Qyl3dAvBTyEBmT2r_BsIH",
                "id": "reactflow__edge-yfpEzhhLDZxZm_zqNlqer-Qyl3dAvBTyEBmT2r_BsIH"
            }
        ]
    },
    context: { nodes: [], edges: [] },
    integration: { nodes: [], edges: [] },
    complete: { nodes: [], edges: [] },
};

// Define the custom node types mapping OUTSIDE the component
const nodeTypes = {
    group: TitledGroupNode,
};

/**
 * Slide04Refactored: The Tipping Point - Beyond Models to Agentic Systems
 * 
 * This visualization demonstrates the architectural evolution from basic LLMs
 * to sophisticated agentic coding systems, illustrating how two key forces
 * (advanced models and agentic systems) converge to transform development.
 * 
 * This is a refactored version using the improved MermaidChart component.
 */
const Slide04Inner: React.FC = observer(() => {
    // Get MobX stores
    const audioStore = useAudioStore();
    const slideStore = useSlideStore();
    const dialogueStore = useDialogueStore();

    // Local state
    const [activeView, setActiveView] = useState<'initial' | 'context' | 'agentic' | 'integration' | 'complete'>('initial');
    const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
    const [isDebugging, setIsDebugging] = useState<boolean>(false);
    const [debugDialogueIndex, setDebugDialogueIndex] = useState<number>(0);
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [debugInitialized, setDebugInitialized] = useState<boolean>(false);
    const [isLayoutEditable, setIsLayoutEditable] = useState<boolean>(false);
    const [initialNodes, setInitialNodes] = useState<Node[]>([]);
    const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
    const [nodesForFlow, setNodesForFlow, onNodesChangeHandler] = useNodesState([]);
    const [edgesForFlow, setEdgesForFlow, onEdgesChangeHandler] = useEdgesState([]);

    // Reference for debug panel
    const debugPanelRef = useRef<HTMLDivElement>(null);

    // Get ReactFlow instance and container ref
    const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
    const rfInstance = useReactFlow();
    const nodesInitialized = useNodesInitialized();

    // Compute dialogue index from DialogueStore or debug overrides
    // Note: We're not using this variable directly in the useEffect to ensure reactivity
    const dialogueIndex = isDebugging ? debugDialogueIndex : dialogueStore.currentLineIndex;

    // Log current dialogue state for debugging
    useEffect(() => {
        console.log(`Dialogue store updated - currentLineIndex: ${dialogueStore.currentLineIndex}, isPlaying: ${dialogueStore.isPlaying}`);
    }, [dialogueStore.currentLineIndex, dialogueStore.isPlaying]);

    // Load layout DIRECTLY and ONLY from reactFlowLayouts
    useEffect(() => {
        const viewKey = activeView as keyof typeof reactFlowLayouts;
        const layout = reactFlowLayouts[viewKey];
        let nodesToUse: Node[] = [];
        let edgesToUse: Edge[] = [];

        if (layout?.nodes && layout?.edges) {
            console.log(`Using FIXED layout for view: ${activeView}`);
            // Make copies to avoid potential state mutation issues
            nodesToUse = layout.nodes.map(n => ({ ...n }));
            edgesToUse = layout.edges.map(e => ({ ...e }));
        } else {
            console.warn(`No predefined layout found for view: ${activeView}. Displaying empty.`);
        }

        // Set the state directly from the loaded layout
        setInitialNodes(nodesToUse);
        setInitialEdges(edgesToUse);
        setNodesForFlow(nodesToUse);
        setEdgesForFlow(edgesToUse);
        setIsLayoutEditable(false);

    }, [activeView, setNodesForFlow, setEdgesForFlow]); // Dependencies are just view and setters

    // Programmatic fitting useEffect
    useEffect(() => {
        if (nodesInitialized && !isLayoutEditable && !!reactFlowWrapperRef.current && initialNodes.length > 0) {
            const viewport = getViewportForBounds(reactFlowWrapperRef.current, getNodesBounds(initialNodes));
            rfInstance.setViewport(viewport, { duration: 300 });
            console.log('[FitEffect] setViewport called.');
        } else {
            console.log('[FitEffect] Conditions not met or in editable mode, skipping auto-fit.', { nodesInitialized, isLayoutEditable, hasWrapper: !!reactFlowWrapperRef.current, nodeCount: initialNodes.length });
        }
    }, [nodesInitialized, initialNodes, rfInstance, isLayoutEditable, slideStore.isFullscreen]);

    // Initialize background audio and keyboard controls
    useEffect(() => {
        // Start background audio when the component mounts
        audioStore.playBackgroundMusic();

        // Setup keyboard shortcut for toggling debug panel
        const handleKeyDown = (e: KeyboardEvent) => {
            // Support both Alt+D and Shift+D shortcuts
            if ((e.altKey && e.key === 'd') || (e.shiftKey && e.key === 'D')) {
                setShowDebugPanel(prev => !prev);
                e.preventDefault(); // Prevent browser default actions
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            audioStore.stopBackgroundMusic();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [audioStore]);

    // Determine which architectural view to display based on dialogue index
    useEffect(() => {
        const currentDialogueIndex = isDebugging ? debugDialogueIndex : dialogueStore.currentLineIndex;
        let newView: 'initial' | 'context' | 'agentic' | 'integration' | 'complete';

        // Map dialogue indices to architectural stages
        if (currentDialogueIndex < 5) {
            newView = 'initial';
        } else if (currentDialogueIndex < 9) {
            newView = 'context';
        } else if (currentDialogueIndex < 13) {
            newView = 'agentic';
        } else if (currentDialogueIndex < 15) {
            newView = 'integration';
        } else {
            newView = 'complete';
        }

        // Only update if the view has changed
        if (newView !== activeView) {
            console.log(`Updating view from ${activeView} to ${newView}`);
            setActiveView(newView);
            setIsLayoutEditable(false);
        }
    }, [dialogueStore.currentLineIndex, debugDialogueIndex, isDebugging, activeView]);

    // Toggle debug mode
    const toggleDebugMode = () => {
        const newIsDebugging = !isDebugging;
        setIsDebugging(newIsDebugging);
        if (newIsDebugging) {
            setDebugDialogueIndex(dialogueStore.currentLineIndex);
        }
    };

    // Navigate to a specific dialogue index
    const jumpToDialogueIndex = (index: number) => {
        setDebugDialogueIndex(index);
    };

    // Directly set view (bypass dialogue index)
    const setDirectView = (view: 'initial' | 'context' | 'agentic' | 'integration' | 'complete') => {
        setActiveView(view);
        setIsLayoutEditable(false);
    };

    // Reset to normal mode (follow actual dialogue)
    const resetToNormalMode = () => {
        setIsDebugging(false);
        setIsLayoutEditable(false);
    };

    // Toggle layout edit mode
    const toggleLayoutEditable = useCallback(() => {
        setIsLayoutEditable(prev => {
            const turningOn = !prev;
            if (turningOn) {
                setNodesForFlow(initialNodes);
                setEdgesForFlow(initialEdges);
            }
            return turningOn;
        });
    }, [initialNodes, initialEdges, setNodesForFlow, setEdgesForFlow]);

    // Save current layout to console
    const handleSaveLayout = useCallback(async () => {
        // Prepare the data in the desired format
        const layoutData: ReactFlowLayout = {
            nodes: nodesForFlow.map(node => {
                // Clean up runtime properties before saving
                const {
                    selected, dragging, positionAbsolute,
                    // Also remove width/height if they are not part of the node's style
                    // (Keep if style.width/height is used for sizing)
                    width, height,
                    ...rest
                } = node;
                // Ensure parentId is used instead of parentNode if needed by future versions
                const finalNode = { ...rest, parentId: node.parentNode };
                delete (finalNode as any).parentNode; // Remove old property
                return finalNode as Node; // Type assertion might be needed depending on strictness
            }),
            edges: edgesForFlow.map(edge => {
                // Clean up runtime properties from edges
                const { selected, ...rest } = edge;
                return rest;
            })
        };

        const layoutJson = JSON.stringify(layoutData, null, 2);

        console.log("--- SAVED LAYOUT DATA (Copy JSON below) ---");
        console.log(`--- View: ${activeView} ---`);
        console.log(layoutJson);
        console.log("--- END SAVED LAYOUT DATA ---");

        // Attempt to copy to clipboard
        try {
            await navigator.clipboard.writeText(layoutJson);
            alert(`Layout for view '${activeView}' saved to console AND copied to clipboard.`);
        } catch (err) {
            console.error('Failed to copy layout to clipboard:', err);
            alert(`Layout for view '${activeView}' saved to console. (Clipboard copy failed)`);
        }
    }, [nodesForFlow, edgesForFlow, activeView]); // Add edgesForFlow dependency

    // Get stage description based on active view
    const getStageDescription = () => {
        switch (activeView) {
            case 'initial':
                return 'Basic LLM vs AI Assistance';
            case 'context':
                return 'Context Window Evolution';
            case 'agentic':
                return 'Agentic System Introduction';
            case 'integration':
                return 'Development Environment Integration';
            case 'complete':
                return 'Complete Agentic Architecture';
            default:
                return '';
        }
    };

    // Get stage explanation based on active view
    const getStageExplanation = () => {
        switch (activeView) {
            case 'initial':
                return 'Limited context window, simple code completion';
            case 'context':
                return 'Expanded context enables full codebase understanding';
            case 'agentic':
                return 'Specialized agents coordinate through tool calling';
            case 'integration':
                return 'Direct integration with development environment';
            case 'complete':
                return 'End-to-end agentic architecture with all components';
            default:
                return '';
        }
    };

    // Prevent mouse events from propagating
    const handleMouseMove = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="slide04-container"
        >
            {/* Background Video */}
            <video
                className="slide04-background-video"
                src="/images/DevRaceWinner.mp4" // Use path consistent with Slide 3
                autoPlay
                loop
                muted
                playsInline // Important for mobile
            />

            {/* Gradient background (Keep or remove depending on desired effect) */}
            <div className="gradient-background"></div>

            {/* Content container */}
            <div className="architecture-container">
                <h1 className="slide-title">
                    The Tipping Point: Beyond Models to Agentic Systems
                </h1>

                {/* Use ReactFlowChart with nodes/edges from Dagre layout */}
                <div className="slide04-chart-wrapper" ref={reactFlowWrapperRef}>
                    <ReactFlowChart
                        key={`${activeView}-${isLayoutEditable}`}
                        nodes={nodesForFlow}
                        edges={edgesForFlow}
                        onNodesChange={onNodesChangeHandler}
                        onEdgesChange={onEdgesChangeHandler}
                        isEditable={isLayoutEditable}
                        nodeTypes={nodeTypes}
                        className={`slide04-reactflow-chart ${activeView}`}
                        showControls={true}
                        showMiniMap={false}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>

                {/* Architecture info panel */}
                <div className="architecture-info">
                    <h3>{getStageDescription()}</h3>
                    <p>{getStageExplanation()}</p>
                </div>

                {/* Legend */}
                <div className="architecture-legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
                        <div className="legend-label">Foundation LLMs</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#9C27B0' }}></div>
                        <div className="legend-label">Agentic Systems</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                        <div className="legend-label">Environment Integration</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
                        <div className="legend-label">Developer Interfaces</div>
                    </div>
                </div>
            </div>

            {/* Debug components */}
            <StandaloneDebugPanel
                showDebugPanel={showDebugPanel}
                setShowDebugPanel={setShowDebugPanel}
                isDebugging={isDebugging}
                toggleDebugMode={toggleDebugMode}
                debugDialogueIndex={debugDialogueIndex}
                activeView={activeView}
                isRendering={isRendering}
                jumpToDialogueIndex={jumpToDialogueIndex}
                setDirectView={setDirectView}
                resetToNormalMode={resetToNormalMode}
                isLayoutEditable={isLayoutEditable}
                toggleLayoutEditable={toggleLayoutEditable}
                handleSaveLayout={handleSaveLayout}
            />
            <StandaloneDebugButton
                showDebugPanel={showDebugPanel}
                setShowDebugPanel={setShowDebugPanel}
            />
        </div>
    );
});

// Wrap Slide04Inner with ReactFlowProvider as hooks are used inside it
const Slide04Refactored: React.FC = () => (
    <ReactFlowProvider>
        <Slide04Inner />
    </ReactFlowProvider>
);

export default Slide04Refactored;
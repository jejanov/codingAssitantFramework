import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore, useSlideStore, useDialogueStore } from '@/stores/StoreContext';
import { observer } from 'mobx-react-lite';
import './Slide04.css';
import { createPortal } from 'react-dom';
import MermaidChartRefactored from '../ui/MermaidChartRefactored';


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
    resetToNormalMode
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

/**
 * Slide04Refactored: The Tipping Point - Beyond Models to Agentic Systems
 * 
 * This visualization demonstrates the architectural evolution from basic LLMs
 * to sophisticated agentic coding systems, illustrating how two key forces
 * (advanced models and agentic systems) converge to transform development.
 * 
 * This is a refactored version using the improved MermaidChart component.
 */
const Slide04Refactored: React.FC = observer(() => {
    // Get MobX stores
    const audioStore = useAudioStore();
    const slideStore = useSlideStore();
    const dialogueStore = useDialogueStore();

    // Local state
    const [activeView, setActiveView] = useState<'initial' | 'context' | 'agentic' | 'integration' | 'complete'>('initial');
    const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
    const [debugDialogueIndex, setDebugDialogueIndex] = useState<number>(0);
    const [isDebugging, setIsDebugging] = useState<boolean>(false);
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [debugInitialized, setDebugInitialized] = useState<boolean>(false);

    // Reference for debug panel
    const debugPanelRef = useRef<HTMLDivElement>(null);

    // Compute dialogue index from DialogueStore or debug overrides
    // Note: We're not using this variable directly in the useEffect to ensure reactivity
    const dialogueIndex = isDebugging ? debugDialogueIndex : dialogueStore.currentLineIndex;

    // Log current dialogue state for debugging
    useEffect(() => {
        console.log(`Dialogue store updated - currentLineIndex: ${dialogueStore.currentLineIndex}, isPlaying: ${dialogueStore.isPlaying}`);
    }, [dialogueStore.currentLineIndex, dialogueStore.isPlaying]);


    // Define diagram definitions for each stage (unchanged)
    const diagrams = {
        initial: `
            graph TD
                BaseLLM[Base Model]

            BaseLLM
                classDef llm fill:#2196F3,stroke:#2196F3,color:white,stroke-width:1px,rx:8,ry:8

            class BaseLLM llm
        `,

        context: `
            graph TD
                BaseLLM[Base LLM]
                ContextWindow[Context Window]
                PromptEng[Prompt Engineering]
                
                BaseLLM --- ContextWindow
                BaseLLM --- PromptEng
                
                classDef llm fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
                classDef agent fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
                classDef integration fill:#4CAF50,stroke:#4CAF50,color:white,stroke-width:1px,rx:8,ry:8
                classDef interface fill:#FF9800,stroke:#FF9800,color:white,stroke-width:1px,rx:8,ry:8
                
                class BaseLLM,ContextWindow,PromptEng llm
        `,

        agentic: `
            graph TD
                subgraph LLM [Foundation Layer]
                    BaseLLM[Base LLM]
                    ContextWindow[Context Window]
                    PromptEng[Prompt Engineering]
                end
                
                subgraph Agents [Agentic Layer]
                    ToolCalling[Tool Calling<br>Orchestrator]
                    CodeGen[Code Generation]
                    CodeSearch[Code Search]
                    Testing[Testing Agent]
                    Debugging[Debugging Agent]
                end
                
                BaseLLM --- ContextWindow
                BaseLLM --- PromptEng
                BaseLLM ==> ToolCalling
                ToolCalling ==> CodeGen
                ToolCalling ==> CodeSearch
                ToolCalling ==> Testing
                ToolCalling ==> Debugging
                
                classDef llm fill:#2196F3,stroke:#2196F3,color:white,stroke-width:1px,rx:8,ry:8
                classDef agent fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
                classDef integration fill:#4CAF50,stroke:#4CAF50,color:white,stroke-width:1px,rx:8,ry:8
                classDef interface fill:#FF9800,stroke:#FF9800,color:white,stroke-width:1px,rx:8,ry:8
                
                class BaseLLM,ContextWindow,PromptEng llm
                class ToolCalling,CodeGen,CodeSearch,Testing,Debugging agent
                class LLM llm
                class Agents agent
        `,

        integration: `
            graph TD
                subgraph LLM [Foundation Layer]
                    BaseLLM[Base LLM]
                    ContextWindow[Context Window]
                    PromptEng[Prompt Engineering]
                end
                
                subgraph Agents [Agentic Layer]
                    ToolCalling[Tool Calling<br>Orchestrator]
                    CodeGen[Code Generation]
                    CodeSearch[Code Search]
                    Testing[Testing Agent]
                    Debugging[Debugging Agent]
                end
                
                subgraph Integration [Environment Integration]
                    FileSystem[File System]
                    CommandExec[Command Execution]
                    CodeIndex[Code Indexing]
                end
                
                BaseLLM --- ContextWindow
                BaseLLM --- PromptEng
                BaseLLM ==> ToolCalling
                ToolCalling ==> CodeGen
                ToolCalling ==> CodeSearch
                ToolCalling ==> Testing
                ToolCalling ==> Debugging
                CodeGen ==> FileSystem
                CodeSearch ==> CodeIndex
                Testing ==> CommandExec
                Debugging ==> CommandExec
                
                classDef llm fill:#2196F3,stroke:#2196F3,color:white,stroke-width:1px,rx:8,ry:8
                classDef agent fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
                classDef integration fill:#4CAF50,stroke:#4CAF50,color:white,stroke-width:1px,rx:8,ry:8
                classDef interface fill:#FF9800,stroke:#FF9800,color:white,stroke-width:1px,rx:8,ry:8
                
                class BaseLLM,ContextWindow,PromptEng llm
                class ToolCalling,CodeGen,CodeSearch,Testing,Debugging agent
                class FileSystem,CommandExec,CodeIndex integration
                class LLM llm
                class Agents agent
                class Integration integration
        `,

        complete: `
            graph TD
                subgraph LLM [Foundation Layer]
                    BaseLLM[Base LLM]
                    ContextWindow[Context Window]
                    PromptEng[Prompt Engineering]
                end
                
                subgraph Agents [Agentic Layer]
                    ToolCalling[Tool Calling<br>Orchestrator]
                    CodeGen[Code Generation]
                    CodeSearch[Code Search]
                    Testing[Testing Agent]
                    Debugging[Debugging Agent]
                end
                
                subgraph Integration [Environment Integration]
                    FileSystem[File System]
                    CommandExec[Command Execution]
                    CodeIndex[Code Indexing]
                end
                
                subgraph Interface [Developer Interface]
                    NLUI[Natural Language UI]
                    CodeSuggest[Code Suggestions]
                    CommandPalette[Command Palette]
                end
                
                NLUI ==> BaseLLM
                BaseLLM ==> CodeSuggest
                CommandPalette ==> BaseLLM
                BaseLLM --- ContextWindow
                BaseLLM --- PromptEng
                BaseLLM ==> ToolCalling
                ToolCalling ==> CodeGen
                ToolCalling ==> CodeSearch
                ToolCalling ==> Testing
                ToolCalling ==> Debugging
                CodeGen ==> FileSystem
                CodeSearch ==> CodeIndex
                Testing ==> CommandExec
                Debugging ==> CommandExec
                
                classDef llm fill:#2196F3,stroke:#2196F3,color:white,stroke-width:1px,rx:8,ry:8
                classDef agent fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
                classDef integration fill:#4CAF50,stroke:#4CAF50,color:white,stroke-width:1px,rx:8,ry:8
                classDef interface fill:#FF9800,stroke:#FF9800,color:white,stroke-width:1px,rx:8,ry:8
                
                class BaseLLM,ContextWindow,PromptEng llm
                class ToolCalling,CodeGen,CodeSearch,Testing,Debugging agent
                class FileSystem,CommandExec,CodeIndex integration
                class NLUI,CodeSuggest,CommandPalette interface
                class LLM llm
                class Agents agent
                class Integration integration
                class Interface interface
        `
    };

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
        // Don't update while rendering to prevent flashing
        if (isRendering) return;

        // Get the raw dialogue index directly from the store to ensure we're using the latest value
        const currentDialogueIndex = isDebugging ? debugDialogueIndex : dialogueStore.currentLineIndex;

        console.log(`Current dialogue index: ${currentDialogueIndex}, activeView: ${activeView}`);

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

        console.log(`Determined view based on index ${currentDialogueIndex}: ${newView}`);

        // Only update if the view has changed
        if (newView !== activeView) {
            console.log(`Updating view from ${activeView} to ${newView}`);
            setActiveView(newView);
            setIsRendering(true);
            // Add a small delay to show rendering state
            setTimeout(() => setIsRendering(false), 300);
        }
    }, [dialogueStore.currentLineIndex, debugDialogueIndex, isDebugging, activeView, isRendering]);

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
        if (isRendering) return; // Prevent changes during rendering
        setDebugDialogueIndex(index);
    };

    // Directly set view (bypass dialogue index)
    const setDirectView = (view: 'initial' | 'context' | 'agentic' | 'integration' | 'complete') => {
        if (isRendering) return; // Prevent changes during rendering
        setActiveView(view);
    };

    // Reset to normal mode (follow actual dialogue)
    const resetToNormalMode = () => {
        setIsDebugging(false);
    };

    return (
        <div
            className="slide04-container"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseMove}
            onMouseOver={handleMouseMove}
        >
            {/* Gradient background */}
            <div className="gradient-background"></div>

            {/* Content container */}
            <div className="architecture-container">
                <h1 className="slide-title">
                    The Tipping Point: Beyond Models to Agentic Systems
                </h1>

                {/* Direct MermaidChart integration - no intermediate container */}
                <MermaidChartRefactored
                    definition={diagrams[activeView]}
                    className={`slide04-mermaid-chart ${activeView}`}
                    debug={isDebugging}
                    style={{
                        overflow: 'visible',
                        maxHeight: 'none'
                    }}
                // style={{
                //     flex: '1 1 auto',
                //     width: '100%',
                //     position: 'relative',
                //     zIndex: 6,
                //     margin: '0.5rem 0'
                // }}
                />
                {isRendering && (
                    <div className="rendering-overlay">
                        <span>Rendering...</span>
                    </div>
                )}

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

            {/* Debug components rendered through portals */}
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
            />
            <StandaloneDebugButton
                showDebugPanel={showDebugPanel}
                setShowDebugPanel={setShowDebugPanel}
            />
        </div>
    );
});

export default Slide04Refactored;
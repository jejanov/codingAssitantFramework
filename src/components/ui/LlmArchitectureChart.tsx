import React from 'react';
import MermaidChart from './MermaidChart';

export interface LlmArchitectureChartProps {
    /**
     * Show full architecture or just the basic version
     */
    view?: 'basic' | 'full';
    /**
     * Additional className for the container
     */
    className?: string;
    /**
     * Height of the chart container
     */
    height?: string;
    /**
     * Width of the chart container
     */
    width?: string;
    /**
     * Custom styling options
     */
    style?: React.CSSProperties;
}

const LlmArchitectureChart: React.FC<LlmArchitectureChartProps> = ({
    view = 'basic',
    className = '',
    height = '400px',
    width = '100%',
    style,
}) => {
    // Define the mermaid diagram definition based on view
    const diagramDefinition = view === 'basic'
        ? `
      graph TD
        BaseLLM[Base LLM]
        ContextWindow[Context Window]
        PromptEng[Prompt Engineering]
        
        BaseLLM --- ContextWindow
        BaseLLM --- PromptEng
        
        classDef llm fill:#2196F3,stroke:#2196F3,color:white,stroke-width:1px,rx:8,ry:8
        classDef agent fill:#9C27B0,stroke:#9C27B0,color:white,stroke-width:1px,rx:8,ry:8
        classDef integration fill:#4CAF50,stroke:#4CAF50,color:white,stroke-width:1px,rx:8,ry:8
        classDef interface fill:#FF9800,stroke:#FF9800,color:white,stroke-width:1px,rx:8,ry:8
        
        class BaseLLM,ContextWindow,PromptEng llm
    `
        : `
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
    `;

    return (
        <div
            className={`llm-architecture-chart ${className}`}
            style={{
                width,
                height,
                ...style
            }}
        >
            <MermaidChart
                definition={diagramDefinition}
                className={`llm-architecture-diagram ${view}`}
                textFontSize="14px"
                textFontWeight="600"
            />

            {/* Legend */}
            <div
                className="architecture-legend"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '16px',
                    fontSize: '12px'
                }}
            >
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                        className="legend-color"
                        style={{
                            backgroundColor: '#2196F3',
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px'
                        }}
                    />
                    <div className="legend-label">Foundation LLMs</div>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                        className="legend-color"
                        style={{
                            backgroundColor: '#9C27B0',
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px'
                        }}
                    />
                    <div className="legend-label">Agentic Systems</div>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                        className="legend-color"
                        style={{
                            backgroundColor: '#4CAF50',
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px'
                        }}
                    />
                    <div className="legend-label">Environment Integration</div>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                        className="legend-color"
                        style={{
                            backgroundColor: '#FF9800',
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px'
                        }}
                    />
                    <div className="legend-label">Developer Interfaces</div>
                </div>
            </div>
        </div>
    );
};

export default LlmArchitectureChart; 
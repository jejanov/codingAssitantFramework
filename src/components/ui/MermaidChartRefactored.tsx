import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Types for theme configuration
export type MermaidTheme = 'default' | 'neutral' | 'dark' | 'forest' | 'base';
export type MermaidLook = 'neo' | 'handDrawn' | 'classic';

// Theme variables interface - extends the variables from the styling guide
export interface MermaidThemeVariables {
    primaryColor?: string;
    primaryTextColor?: string;
    lineColor?: string;
    fontFamily?: string;
    fontSize?: string;
    // Add more theme variables as needed
}

// Initialize mermaid with default configuration
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'Arial, Helvetica, sans-serif', // Use only web-safe fonts
    look: 'classic',
    handDrawnSeed: 3,
    flowchart: {
        diagramPadding: 30, // Increased padding for text 
        htmlLabels: true,
        nodeSpacing: 100, // More space between nodes
        rankSpacing: 120, // More space between ranks
        padding: 30, // More internal node padding
        curve: 'basis',
        wrappingWidth: 150 // REDUCED to encourage earlier wrapping
    },
});

export interface MermaidChartProps {
    /**
     * The mermaid diagram definition
     */
    definition: string;
    /**
     * Additional className for the container
     */
    className?: string;
    /**
     * Debug mode to show container boundaries
     */
    debug?: boolean;
    /**
     * Custom style for the container
     */
    style?: React.CSSProperties;
    /**
     * Mermaid theme to use
     */
    theme?: MermaidTheme;
    /**
     * Visual style for the diagram
     */
    look?: MermaidLook;
    /**
     * Custom theme variables (works best with 'base' theme)
     */
    themeVariables?: MermaidThemeVariables;
    /**
     * Layout direction: TD (top-down), BT (bottom-top), LR (left-right), RL (right-left)
     */
    layoutDirection?: 'TD' | 'TB' | 'BT' | 'LR' | 'RL';
    /**
     * Seed for handDrawn look (if enabled)
     */
    handDrawnSeed?: number;
    /**
     * Node class definitions to apply to diagram nodes
     * Format: { className: "fill:#color,stroke:#color,..." }
     */
    classDefinitions?: Record<string, string>;
}

const MermaidChartRefactored: React.FC<MermaidChartProps> = ({
    definition,
    className = '',
    debug = false,
    style,
    theme,
    look,
    themeVariables,
    layoutDirection,
    handDrawnSeed,
    classDefinitions,
}) => {
    // Single container reference
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [renderedDiagram, setRenderedDiagram] = useState<string | null>(null);
    const [diagramId, setDiagramId] = useState<string>(`mermaid-diagram-${Math.random().toString(36).substring(2, 9)}`);
    const [renderAttempts, setRenderAttempts] = useState<number>(0);
    const [fontsReady, setFontsReady] = useState<boolean>(false);

    // Check font readiness
    useEffect(() => {
        const checkFonts = () => {
            if (document.fonts && typeof document.fonts.ready.then === 'function') {
                // Modern browsers - use Font Loading API
                document.fonts.ready.then(() => {
                    console.log("All system fonts are ready!");
                    setFontsReady(true);
                }).catch(() => {
                    // If there's an error, still proceed
                    console.warn("Error checking font readiness, proceeding anyway");
                    setFontsReady(true);
                });
            } else {
                // Fallback for browsers without Font Loading API
                console.log("Font Loading API not available, proceeding");
                setFontsReady(true);
            }
        };

        checkFonts();
    }, []);

    // Process the definition with configuration
    const getProcessedDefinition = (): string => {
        // Start with the original definition
        let processedDef = definition.trim();

        // Check if we need to modify the layout direction
        if (layoutDirection && processedDef.match(/^graph\s+(TD|TB|BT|LR|RL)/)) {
            processedDef = processedDef.replace(/^graph\s+(TD|TB|BT|LR|RL)/, `graph ${layoutDirection}`);
        }

        // Add configuration using frontmatter if any styling options are provided
        if (theme || look || themeVariables || handDrawnSeed) {
            // Prepare config objects
            const config: Record<string, any> = {};

            if (theme) config.theme = theme;
            if (look) config.look = look;
            if (handDrawnSeed) config.handDrawnSeed = handDrawnSeed;

            // Ensure we always set the fontFamily to web-safe fonts
            if (themeVariables) {
                const updatedVariables = {
                    ...themeVariables,
                    fontFamily: themeVariables.fontFamily || 'Arial, Helvetica, sans-serif',
                };
                config.themeVariables = updatedVariables;
            } else {
                config.themeVariables = {
                    fontFamily: 'Arial, Helvetica, sans-serif',
                };
            }

            // Only add frontmatter if we have configuration to add
            if (Object.keys(config).length > 0) {
                // Check if definition already has frontmatter
                if (processedDef.startsWith('---')) {
                    // If it does, we'll respect it and not add our own
                    console.warn('Mermaid definition already contains frontmatter. Custom theme/look settings will be ignored.');
                } else {
                    // Add frontmatter to the beginning
                    const frontmatter = `---\nconfig:\n${Object.entries(config).map(([key, value]) => {
                        if (typeof value === 'object') {
                            // Format nested objects (like themeVariables)
                            return `  ${key}:\n${Object.entries(value).map(([k, v]) => `    ${k}: "${v}"`).join('\n')}`;
                        }
                        return `  ${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
                    }).join('\n')}\n---\n`;

                    processedDef = `${frontmatter}${processedDef}`;
                }
            }
        }

        // Add class definitions if provided
        if (classDefinitions && Object.keys(classDefinitions).length > 0) {
            const classDefStrings = Object.entries(classDefinitions).map(
                ([className, styles]) => `classDef ${className} ${styles}`
            );

            // Append the class definitions to the end of the definition
            processedDef = `${processedDef}\n\n${classDefStrings.join('\n')}`;
        }

        return processedDef;
    };

    // Render the diagram only after fonts are ready or attempts exhausted
    useEffect(() => {
        // If fonts aren't ready yet, don't render, retry logic
        if (!fontsReady && renderAttempts < 10) {
            const timer = setTimeout(() => {
                setRenderAttempts(prev => prev + 1);
            }, 20000);
            return () => clearTimeout(timer);
        }

        // Log if proceeding despite font uncertainty
        if (!fontsReady && renderAttempts >= 3) {
            console.warn("Proceeding with render despite font readiness uncertainty after multiple attempts.");
        } else if (!fontsReady) {
            console.log("Fonts not ready yet, waiting for next attempt or readiness.");
            return; // Still waiting for fontsReady state update or next attempt
        }

        // *** Add a LONGER delay for testing ***
        console.log(`Fonts ready (or attempts exhausted), scheduling render in 500ms for diagramId: ${diagramId}.`);
        const renderTimeoutId = setTimeout(() => {
            console.log(`Executing delayed render for diagramId: ${diagramId}`);
            const renderDiagram = async () => {
                if (isRendering) {
                    console.log(`Render already in progress for ${diagramId}, skipping.`);
                    return;
                }
                console.log(`Starting render for ${diagramId}`);
                setIsRendering(true);

                try {
                    const processedDefinition = getProcessedDefinition();
                    console.log(`Rendering definition for ${diagramId}:\n${processedDefinition}`);
                    const { svg } = await mermaid.render(diagramId, processedDefinition);
                    console.log(`Render successful for ${diagramId}`);
                    setRenderedDiagram(svg);
                } catch (error: any) {
                    console.error(`Error rendering mermaid diagram (${diagramId}):`, error);
                    setRenderedDiagram(
                        `<div class="mermaid-error">Error rendering diagram: ${error?.message || 'Unknown error'}</div>`
                    );
                } finally {
                    console.log(`Finished render attempt for ${diagramId}`);
                    setIsRendering(false);
                }
            };
            renderDiagram();
        }, 500); // Use 500ms delay for testing

        // Cleanup function to clear the timeout if dependencies change before it fires
        return () => {
            console.log(`Clearing render timeout for ${diagramId}`);
            clearTimeout(renderTimeoutId);
        };

    }, [definition, diagramId, theme, look, themeVariables, layoutDirection, handDrawnSeed, classDefinitions, fontsReady, renderAttempts]); // REMOVED isRendering and getProcessedDefinition from deps

    // Apply the rendered diagram to the DOM and enhance text display
    useEffect(() => {
        if (!containerRef.current || !renderedDiagram) return;

        // Insert the pre-rendered diagram
        containerRef.current.innerHTML = renderedDiagram;

    }, [renderedDiagram]);

    return (
        <div
            ref={containerRef}
            className={`mermaid-chart ${className}`}
            data-chart-type="mermaid"
            data-chart-state={isRendering ? 'rendering' : (renderedDiagram ? 'ready' : 'pending')}
            data-testid="mermaid-chart"
            data-debug={debug ? 'true' : undefined}
            data-theme={theme}
            data-look={look}
            data-fonts-ready={fontsReady ? 'true' : 'false'}
        >
            {!fontsReady && renderAttempts < 3 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#666',
                        zIndex: 5,
                        pointerEvents: 'none',
                    }}
                >
                    Loading fonts...
                </div>
            )}
            {isRendering && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#666',
                        zIndex: 10,
                        pointerEvents: 'none',
                    }}
                >
                    Rendering diagram...
                </div>
            )}
        </div>
    );
};

export default MermaidChartRefactored;
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeTyping from './CodeTyping';
import LineNumbers from './LineNumbers';
import TranslationPanel from './TranslationPanel';
import StatusBar from './StatusBar';
import Minimap from './Minimap';
import { AudioContext } from '@/App';
import './Slide02.css';

/**
 * Slide02: Introduction Code slide as specified in slide_instructions/slide_02.md
 * Implements a simulated IDE environment with code typing animation and translation panel
 */
const Slide02: React.FC = () => {
    // Actual code content from instructions
    const codeContent = `// AI Dev Workshop – A Story in Code
// The Regis Company - Get Skills. Gain Confidence. Grow Value.

const today = new Date("2025-04-09");
let codeWrittenByAI = 0.65; // 65% today
let engineers = ["us"];
let mission = null;
let skills = { practice: { personalize: () => "Learners captivated, not held captive" } };
let value = { grow: () => "Maximizing worker and workplace value" };

console.log("Bootstrapping the future...");

// Forecast
if (today >= new Date("2025-07-01")) {
  codeWrittenByAI = 0.90; // 90% by mid-2025
}
if (today >= new Date("2026-03-01")) {
  codeWrittenByAI = 1.00; // 100% by early 2026
}

// Business logic
if (AI.assist === true) {
  speed += 3;                 // Work 3x faster
  bugs -= 0.5;                // 50% fewer bugs
  valueDelivered *= 2;        // 2x more value
  engineers.forEach(dev => dev.focus("architecture", "product thinking"));
  skills.practice.personalize();
  value.grow();
  mission = "accelerate innovation";
} else {
  console.warn("Falling behind... competitors deploying updates without us.");
  mission = "catch up";
}

// Final state
console.log("AI writes the code.");
console.log("We engineer the future.");
// Let's get to work.`;

    // Animation state
    const [animationStage, setAnimationStage] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [currentLine, setCurrentLine] = useState(1);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const rootSlideRef = useRef<HTMLDivElement>(null);

    // Get audio effects from context
    const audioEffects = useContext(AudioContext);

    // Count lines in the code
    const lineCount = codeContent.split('\n').length;

    // Throttle function to limit how often a function runs
    const throttle = (func: Function, limit: number) => {
        let inThrottle: boolean;
        return function (this: any, ...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Handle mouse movement for particle effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        // Stop event propagation to prevent bubbling to App.tsx
        e.stopPropagation();

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    }, []);

    // Throttled version for performance
    const throttledMouseMove = useCallback(throttle(handleMouseMove, 16), [handleMouseMove]);

    // Start animation sequence
    useEffect(() => {
        // Background and IDE container appear first
        const stageTimers = [
            // IDE appears after 500ms
            setTimeout(() => setAnimationStage(1), 500),
            // Status bar and minimap appear after 1s
            setTimeout(() => setAnimationStage(2), 1000),
            // Start typing after 1.5s
            setTimeout(() => setAnimationStage(3), 1500),
        ];

        // Clean up timers on unmount
        return () => {
            stageTimers.forEach(timer => clearTimeout(timer));
        };
    }, []);

    // Handle typing completion
    const handleTypingComplete = useCallback(() => {
        setIsTypingComplete(true);
        audioEffects?.playSuccessSound();

        // Wait a moment and then show translation panel
        setTimeout(() => {
            setShowTranslation(true);
            audioEffects?.playPanelSlideSound();

            // Play pop sounds for bullet points with delay
            setTimeout(() => audioEffects?.playPopSound(), 500);
            setTimeout(() => audioEffects?.playPopSound(), 1000);
            setTimeout(() => audioEffects?.playPopSound(), 1500);
            setTimeout(() => audioEffects?.playPopSound(), 2000);
        }, 1000);
    }, [audioEffects]);

    // Update current line based on typing progress
    const handleTypingProgress = useCallback((position: number, text: string) => {
        setCurrentPosition(position);
        const typedContent = text.substring(0, position);
        const lineCount = (typedContent.match(/\n/g) || []).length + 1;
        setCurrentLine(lineCount);

        // Play typing sound occasionally (not on every character to avoid sound overload)
        if (position % 3 === 0) {
            audioEffects?.playTypingSound();
        }
    }, [audioEffects]);

    // Start background ambience on mount
    useEffect(() => {
        audioEffects?.playBackgroundAmbience();

        // Clean up on unmount
        return () => {
            audioEffects?.stopBackgroundAmbience();
        };
    }, [audioEffects]);

    // Generate subtle particles
    const ParticleBackground = () => (
        <div className="particle-container">
            {Array.from({ length: 30 }).map((_, i) => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                const size = 2 + Math.random() * 3;

                return (
                    <div
                        key={i}
                        className="code-particle"
                        style={{
                            left: `${randomX}%`,
                            top: `${randomY}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: 0.05 + Math.random() * 0.1,
                            backgroundColor: i % 3 === 0
                                ? '#2196f3' // Blue
                                : i % 3 === 1
                                    ? '#00bcd4' // Teal
                                    : '#9c27b0', // Purple
                            transform: `translate(${(mousePosition.x / 80) * (randomX > 50 ? -1 : 1)
                                }px, ${(mousePosition.y / 80) * (randomY > 50 ? -1 : 1)
                                }px)`,
                            transition: 'transform 0.8s ease-out',
                        }}
                    />
                );
            })}
        </div>
    );

    // Create handlers for mouse events
    const handleMouseEvents = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            ref={containerRef}
            className="slide-02-container"
            onMouseMove={throttledMouseMove}
            onMouseEnter={handleMouseEvents}
            onMouseOver={handleMouseEvents}
            onMouseLeave={handleMouseEvents}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'JetBrains Mono', monospace",
                background: 'linear-gradient(135deg, #1e1e1e 0%, #2c2c2c 100%)'
            }}
        >
            {/* Particle background */}
            <ParticleBackground />

            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-paper-texture opacity-5" />

            {/* IDE environment */}
            <AnimatePresence>
                {animationStage >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
                        data-testid="ide-container"
                        className="dark-theme glass-panel-container"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '95%',
                            height: '90%',
                            margin: 'auto',
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Tab bar */}
                        <div style={{
                            backgroundColor: 'rgba(37, 37, 38, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: '1px solid rgba(62, 62, 62, 0.6)',
                            display: 'flex',
                            padding: '0 10px'
                        }}>
                            <div style={{
                                padding: '8px 15px',
                                backgroundColor: 'rgba(30, 30, 30, 0.7)',
                                borderBottom: '2px solid #00bcd4',
                                color: 'white',
                                fontSize: '13px'
                            }}>
                                workshop.js
                            </div>
                        </div>

                        {/* Main editor area */}
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            overflow: 'hidden'
                        }}>
                            {/* Line numbers */}
                            <LineNumbers count={lineCount} brandColor="#00bcd4" />

                            {/* Code editor */}
                            <div
                                data-testid="code-editor"
                                className="glass-panel-content code-container-background"
                                style={{
                                    flex: 1,
                                    padding: '0.5rem 0',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    color: '#d4d4d4',
                                    overflow: 'auto',
                                    position: 'relative'
                                }}
                            >
                                {animationStage >= 3 && (
                                    <CodeTyping
                                        code={codeContent}
                                        speed={30}
                                        onComplete={handleTypingComplete}
                                        onProgress={handleTypingProgress}
                                        brandColors={{
                                            keyword: '#00bcd4',   // teal
                                            string: '#9c27b0',    // purple
                                            function: '#2196f3',  // blue
                                            comment: '#757575'    // gray
                                        }}
                                    />
                                )}
                            </div>

                            {/* Minimap */}
                            <AnimatePresence>
                                {animationStage >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Minimap
                                            code={codeContent}
                                            currentPosition={currentPosition}
                                            brandColors={{
                                                keyword: '#00bcd4',   // teal
                                                string: '#9c27b0',    // purple
                                                function: '#2196f3'   // blue
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Status bar */}
                        <AnimatePresence>
                            {animationStage >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <StatusBar
                                        lineCount={lineCount}
                                        currentLine={currentLine}
                                        aiAssisted={true}
                                        brandColors={{
                                            primary: '#2196f3',
                                            accent: '#00bcd4'
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Translation panel */}
            <TranslationPanel
                isVisible={showTranslation}
                brandColors={{
                    primary: '#2196f3',
                    secondary: '#9c27b0',
                    accent: '#00bcd4'
                }}
            />
        </div>
    );
};

export default Slide02; 
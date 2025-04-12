import React, { useEffect, useState, useRef, useCallback, useContext, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisLogo from '@/components/ui/RegisLogo';
import './Slide01.css';
import { AudioContext } from '@/App';
import CodeTyping from '@/components/slides/CodeTyping';
import Typewriter from 'typewriter-effect';

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

// Particle type definition
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: {
        x: number;
        y: number;
    };
    opacity: number;
    type: 'normal' | 'neural' | 'connector';
    effect?: 'sparkle' | 'pulse' | 'color-shift' | 'none';
    effectState?: {
        timer: number;
        duration: number;
        intensity: number;
    };
    connectedTo?: number[];
    pulseData?: {
        active: boolean;
        progress: number;
        targetId?: number;
    };
}

// Create memoized child components to prevent re-renders

// Memoized Logo component
const LogoSection = memo(({ animationStage }: {
    animationStage: number;
}) => (
    <div className="absolute top-10 w-full flex justify-center">
        <AnimatePresence>
            {animationStage >= 1 && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
                    className="relative z-20 perspective-item-high"
                >
                    <RegisLogo width={480} height={150} />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));

// Memoized Title section
const TitleSection = memo(({ animationStage }: {
    animationStage: number;
}) => (
    <div className="absolute top-1/4 w-full flex justify-center">
        <AnimatePresence>
            {animationStage >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
                    className="perspective-container perspective-item-medium"
                >
                    <h1
                        className="text-5xl font-bold text-center mb-3 title-headline glass-text glass-text-primary glass-text-refract text-depth-1"
                        data-text="AI Dev Workshop"
                    >
                        AI Dev Workshop
                    </h1>
                    <h2
                        className="text-2xl text-center glass-text glass-text-secondary text-depth-2"
                        data-text="Revolutionizing Development with AI Coding Tools"
                    >
                        Revolutionizing Development with AI Coding Tools
                    </h2>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));

// Memoized Code section
const CodeSection = memo(({
    shouldShowCode,
    codeSnippet,
    handleCodeComplete,
    playTypingSound
}: {
    shouldShowCode: boolean;
    codeSnippet: string;
    handleCodeComplete: () => void;
    playTypingSound: () => void;
}) => (
    <div className="absolute top-[50%] w-full flex justify-center" style={{ zIndex: 30 }}>
        <AnimatePresence>
            {shouldShowCode && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg perspective-item-low"
                >
                    <div className="glass-panel-interactive rounded-lg p-4 font-mono border border-teal-500/30" style={{ zIndex: 30 }}>
                        <CodeTyping
                            code={codeSnippet}
                            speed={12}
                            onComplete={handleCodeComplete}
                            onProgress={(position, text) => {
                                playTypingSound();
                            }}
                            brandColors={{
                                keyword: '#00bcd4',   // teal
                                string: '#9c27b0',    // purple
                                function: '#2196f3',  // blue
                                comment: '#757575'    // gray
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));

// Memoized Presenter section
const PresenterSection = memo(({
    shouldShowPresenter
}: {
    shouldShowPresenter: boolean;
}) => (
    <div className="absolute bottom-10 w-full flex justify-center">
        <AnimatePresence>
            {shouldShowPresenter && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center text-depth-3 perspective-item-lowest"
                >
                    {/* Presenter content removed */}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));

/**
 * Title Slide (Slide 01) for the AI Dev Workshop presentation.
 * Includes animations, styling, and branding elements as specified.
 */
const Slide01: React.FC = () => {
    // State for animation sequence
    const [animationStage, setAnimationStage] = useState(0);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const [isCodeComplete, setIsCodeComplete] = useState(false);
    const [shouldShowCode, setShouldShowCode] = useState(false);
    const [shouldShowPresenter, setShouldShowPresenter] = useState(false);
    const particleContainerRef = useRef<HTMLDivElement>(null);
    const perspectiveContainerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();
    const lastUpdateTimeRef = useRef<number>(Date.now());
    const isMouseMovingRef = useRef(false);
    const mouseUpdateTimeoutRef = useRef<number | null>(null);
    const rootSlideRef = useRef<HTMLDivElement>(null);

    // Get audio effects from context
    const audioEffects = useContext(AudioContext);

    // Code snippet from requirements - memoized to keep reference stable
    const codeSnippet = useMemo(() => `// AI Dev Workshop - The Regis Company
if (AI.codes) {
  engineer.thinkBigger();
  skills.practice.personalize();
  value.grow();
}`, []);

    // Handle mouse movement for particle effect - with throttling
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        // Stop event propagation to prevent bubbling to App.tsx
        e.stopPropagation();

        // Set flag that mouse is moving and needs updating
        isMouseMovingRef.current = true;

        // Store mouse position for animation frame updates
        if (particleContainerRef.current) {
            const rect = particleContainerRef.current.getBoundingClientRect();
            mousePositionRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        // Clear previous timeout if exists
        if (mouseUpdateTimeoutRef.current) {
            window.clearTimeout(mouseUpdateTimeoutRef.current);
        }

        // Set timeout to mark mouse as stopped after delay
        mouseUpdateTimeoutRef.current = window.setTimeout(() => {
            isMouseMovingRef.current = false;
        }, 100);
    }, []);

    // Throttled version for performance
    const throttledMouseMove = useCallback(throttle(handleMouseMove, 16), [handleMouseMove]);

    // Handle perspective mouse movement using CSS variables
    const handlePerspectiveMouseMove = useCallback((e: React.MouseEvent) => {
        // Stop event propagation to prevent bubbling to App.tsx
        e.stopPropagation();

        if (perspectiveContainerRef.current) {
            const rect = perspectiveContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation values based on mouse position
            const rotateX = (y - rect.height / 2) / (rect.height / 2) * 10;
            const rotateY = (x - rect.width / 2) / (rect.width / 2) * 10;

            // Update CSS custom properties on the container
            perspectiveContainerRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
            perspectiveContainerRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
        }
    }, []);

    // Throttled version for performance
    const throttledPerspectiveMouseMove = useCallback(throttle(handlePerspectiveMouseMove, 16), [handlePerspectiveMouseMove]);

    // Memoized function to play typing sound
    const playTypingSound = useCallback(() => {
        audioEffects?.playTypingSound();
    }, [audioEffects]);

    // Handle code typing completion
    const handleCodeComplete = useCallback(() => {
        setIsCodeComplete(true);
        audioEffects?.playSuccessSound();

        // Add pulsing effect to title
        const titleElement = document.querySelector('.title-headline');
        if (titleElement) {
            titleElement.classList.add('pulse-animation');
        }
    }, [audioEffects]);

    // Move through animation stages
    useEffect(() => {
        // Start background music specific to Slide01
        audioEffects?.playSpecificBackgroundAudio('/audio/cool-hip-hop-loop-275527.mp3');

        // Clear any previous state
        setShouldShowCode(false);
        setShouldShowPresenter(false);
        setAnimationStage(0);

        // Background appears first
        const stageTimers = [
            // Logo appears after 800ms
            setTimeout(() => {
                setAnimationStage(1);
                audioEffects?.playPanelSlideSound();
            }, 800),
            // Headline appears after 1.8s 
            setTimeout(() => setAnimationStage(2), 1800),
            // Code snippet appears after 3s
            setTimeout(() => {
                console.log('Setting shouldShowCode to true');
                setShouldShowCode(true);
                audioEffects?.playPanelSlideSound();
            }, 3000),
            // Presenter info appears after 7.5s (more time for code typing)
            setTimeout(() => {
                setShouldShowPresenter(true);
                audioEffects?.playPanelSlideSound();
            }, 7500),
        ];

        // Cleanup timers and audio on unmount
        return () => {
            stageTimers.forEach(timer => clearTimeout(timer));
            audioEffects?.stopBackgroundAmbience();
        };
    }, [audioEffects]);

    // Initialize particles with DOM elements instead of React state
    useEffect(() => {
        // Create container for particles
        const particleContainer = particleContainerRef.current?.querySelector('.particle-container');
        if (!particleContainer) return;

        // Clear any existing particles
        particleContainer.innerHTML = '';

        const neuralNodeIds: number[] = [];
        const particleElements: Array<{
            element: HTMLDivElement;
            data: Particle;
        }> = [];

        // Create particles with DOM elements
        for (let i = 0; i < 75; i++) {
            const size = Math.random() * 2 + 2; // Base size between 2-4px
            const isNeuralNode = i % 15 === 0;

            // Create the particle data
            const particle: Particle = {
                id: i,
                x: Math.random() * 100, // % position
                y: Math.random() * 100, // % position
                size: isNeuralNode ? 8 : size,
                color: isNeuralNode
                    ? '#9c27b0' // Neural nodes are purple
                    : i % 4 === 0
                        ? '#2196f3' // Blue particles
                        : i % 4 === 1
                            ? '#00bcd4' // Teal particles
                            : i % 4 === 2
                                ? '#673ab7' // Deep purple particles
                                : '#ffffff', // White particles
                velocity: {
                    x: (Math.random() - 0.5) * 0.05, // Slower, more natural movement
                    y: (Math.random() - 0.5) * 0.05,
                },
                opacity: 0.1 + Math.random() * 0.5,
                type: isNeuralNode ? 'neural' : 'normal',
                effect: Math.random() > 0.7
                    ? ['sparkle', 'pulse', 'color-shift', 'none'][Math.floor(Math.random() * 4)] as any
                    : 'none',
                effectState: {
                    timer: Math.random() * 5000, // Random start time
                    duration: 2000 + Math.random() * 3000, // Effect duration between 2-5 seconds
                    intensity: Math.random(),
                },
                connectedTo: [],
                pulseData: {
                    active: false,
                    progress: 0
                }
            };

            // Create and position DOM element for particle
            const particleEl = document.createElement('div');
            particleEl.className = particle.type === 'neural' ? 'neural-node' : 'particle';
            particleEl.style.position = 'absolute';
            particleEl.style.left = `${particle.x}%`;
            particleEl.style.top = `${particle.y}%`;
            particleEl.style.width = `${particle.size}px`;
            particleEl.style.height = `${particle.size}px`;
            particleEl.style.backgroundColor = particle.color;
            particleEl.style.opacity = particle.opacity.toString();
            particleEl.style.borderRadius = '50%';

            if (particle.type === 'neural') {
                particleEl.style.boxShadow = `0 0 10px 2px rgba(156, 39, 176, 0.5)`;
                particleEl.style.zIndex = '2';
            }

            // Add particle to DOM
            particleContainer.appendChild(particleEl);

            // Store element reference with particle data
            particleElements.push({ element: particleEl, data: particle });

            // Track neural node IDs for connections
            if (isNeuralNode) {
                neuralNodeIds.push(i);
            }
        }

        // Create neural connections between nodes
        const connectionElements: Array<{
            line: HTMLDivElement;
            pulse?: HTMLDivElement;
            sourceId: number;
            targetId: number;
        }> = [];

        neuralNodeIds.forEach((nodeId, index) => {
            const particle = particleElements.find(p => p.data.id === nodeId)?.data;
            if (!particle) return;

            // Connect to 1-3 other neural nodes
            const connectionsCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < connectionsCount; i++) {
                // Find another neural node to connect to
                const targetIndex = (index + 1 + Math.floor(Math.random() * (neuralNodeIds.length - 1))) % neuralNodeIds.length;
                const targetId = neuralNodeIds[targetIndex];
                const target = particleElements.find(p => p.data.id === targetId)?.data;

                if (!target) continue;

                // Avoid self-connections and duplicates
                if (targetId === nodeId || particle.connectedTo?.includes(targetId)) {
                    continue;
                }

                // Add connection to both particles
                particle.connectedTo = [...(particle.connectedTo || []), targetId];
                target.connectedTo = [...(target.connectedTo || []), nodeId];

                // Only create connection once (from lower ID to higher ID)
                if (particle.id > targetId) continue;

                // Create connection line element
                const connectionEl = document.createElement('div');
                connectionEl.className = 'neural-connection';
                connectionEl.style.position = 'absolute';
                connectionEl.style.left = `${particle.x}%`;
                connectionEl.style.top = `${particle.y}%`;
                connectionEl.style.height = '1px';
                connectionEl.style.backgroundColor = '#9c27b0';
                connectionEl.style.opacity = '0.25';
                connectionEl.style.transformOrigin = 'left center';

                // Calculate length and angle
                const dx = target.x - particle.x;
                const dy = target.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                connectionEl.style.width = `${distance}%`;
                connectionEl.style.transform = `rotate(${angle}deg)`;

                // Create pulse element (hidden initially)
                const pulseEl = document.createElement('div');
                pulseEl.className = 'neural-pulse';
                pulseEl.style.position = 'absolute';
                pulseEl.style.width = '6px';
                pulseEl.style.height = '6px';
                pulseEl.style.backgroundColor = '#ff00ff';
                pulseEl.style.borderRadius = '50%';
                pulseEl.style.transform = 'translate(-50%, -50%)';
                pulseEl.style.boxShadow = '0 0 10px 2px rgba(255, 0, 255, 0.7)';
                pulseEl.style.zIndex = '5';
                pulseEl.style.display = 'none';

                // Add connection elements to DOM
                particleContainer.appendChild(connectionEl);
                particleContainer.appendChild(pulseEl);

                // Store connection for animation
                connectionElements.push({
                    line: connectionEl,
                    pulse: pulseEl,
                    sourceId: nodeId,
                    targetId: targetId
                });
            }
        });

        // Paper texture overlay
        const textureOverlay = document.createElement('div');
        textureOverlay.className = 'absolute inset-0 bg-paper-texture opacity-5';
        particleContainer.appendChild(textureOverlay);

        // Animation loop with direct DOM manipulation
        let animationFrameId: number;
        let lastUpdateTime = Date.now();

        const updateParticles = (timestamp: number) => {
            // Calculate delta time
            const now = Date.now();
            const deltaTime = now - lastUpdateTime;
            lastUpdateTime = now;

            // Skip if delta is too large (tab was inactive)
            if (deltaTime > 100) {
                animationFrameId = requestAnimationFrame(updateParticles);
                return;
            }

            // Update particles with DOM manipulation
            particleElements.forEach(({ element, data }) => {
                // Skip connector particles
                if (data.type === 'connector') return;

                // Get mouse influence
                let mouseInfluenceX = 0;
                let mouseInfluenceY = 0;

                if (mousePositionRef.current.x > 0 && mousePositionRef.current.y > 0 && isMouseMovingRef.current) {
                    // Convert percentage positions to pixels
                    const containerWidth = particleContainerRef.current?.clientWidth || 1000;
                    const containerHeight = particleContainerRef.current?.clientHeight || 600;

                    const particleX = data.x * containerWidth / 100;
                    const particleY = data.y * containerHeight / 100;

                    // Calculate distance to mouse
                    const dx = mousePositionRef.current.x - particleX;
                    const dy = mousePositionRef.current.y - particleY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Apply influence based on distance
                    if (distance < 200) {
                        const influence = (1 - distance / 200) * 0.03;
                        mouseInfluenceX = dx * influence;
                        mouseInfluenceY = dy * influence;
                    }
                }

                // Update position
                data.x += data.velocity.x * deltaTime + mouseInfluenceX;
                data.y += data.velocity.y * deltaTime + mouseInfluenceY;

                // Bounce off edges
                if (data.x < 0 || data.x > 100) {
                    data.velocity.x *= -1;
                    data.x = Math.max(0, Math.min(100, data.x));
                }

                if (data.y < 0 || data.y > 100) {
                    data.velocity.y *= -1;
                    data.y = Math.max(0, Math.min(100, data.y));
                }

                // Apply position update to DOM
                element.style.left = `${data.x}%`;
                element.style.top = `${data.y}%`;

                // Update effects
                if (data.effect !== 'none' && data.effectState) {
                    // Increment effect timer
                    data.effectState.timer += deltaTime;

                    // Reset after duration
                    if (data.effectState.timer >= data.effectState.duration) {
                        data.effectState.timer = 0;

                        // Randomize next effect
                        if (Math.random() > 0.7) {
                            data.effect = ['sparkle', 'pulse', 'color-shift', 'none'][Math.floor(Math.random() * 4)] as any;
                            data.effectState.duration = 2000 + Math.random() * 3000;
                            data.effectState.intensity = Math.random();
                        }
                    }

                    // Apply effects
                    const effectProgress = data.effectState.timer / data.effectState.duration;

                    if (data.effect === 'sparkle' && effectProgress > 0.3 && effectProgress < 0.7) {
                        const sparkleIntensity = Math.sin(effectProgress * Math.PI) * data.effectState.intensity;
                        element.style.opacity = (data.opacity * (1 + sparkleIntensity)).toString();
                        element.style.width = `${data.size * (1 + sparkleIntensity * 0.5)}px`;
                        element.style.height = `${data.size * (1 + sparkleIntensity * 0.5)}px`;

                        if (data.type !== 'neural') {
                            element.style.boxShadow = `0 0 ${5 + Math.random() * 5}px ${Math.random() * 2}px rgba(255, 255, 255, 0.8)`;
                        }
                    } else if (data.effect === 'pulse') {
                        const pulseIntensity = Math.sin(effectProgress * Math.PI * 2) * data.effectState.intensity;
                        element.style.width = `${data.size * (1 + pulseIntensity * 0.3)}px`;
                        element.style.height = `${data.size * (1 + pulseIntensity * 0.3)}px`;
                    } else if (data.effect === 'color-shift' && data.type === 'normal') {
                        const colorPhase = effectProgress * 2 * Math.PI;
                        const r = 33 + Math.sin(colorPhase) * 100;
                        const g = 150 + Math.sin(colorPhase + 2) * 50;
                        const b = 243 + Math.sin(colorPhase + 4) * 50;
                        element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                    } else {
                        // Reset to default
                        element.style.opacity = data.opacity.toString();
                        element.style.width = `${data.size}px`;
                        element.style.height = `${data.size}px`;
                        element.style.backgroundColor = data.color;

                        if (data.type !== 'neural') {
                            element.style.boxShadow = 'none';
                        }
                    }
                }

                // Neural pulses
                if (data.type === 'neural' && Math.random() < 0.001) {
                    if (!data.pulseData?.active && data.connectedTo && data.connectedTo.length > 0) {
                        // Start a pulse to a random connected node
                        const targetId = data.connectedTo[Math.floor(Math.random() * data.connectedTo.length)];
                        data.pulseData = {
                            active: true,
                            progress: 0,
                            targetId
                        };
                    }
                }

                if (data.pulseData?.active) {
                    data.pulseData.progress += deltaTime / 1000;

                    if (data.pulseData.progress >= 1) {
                        data.pulseData = {
                            active: false,
                            progress: 0
                        };
                    }
                }
            });

            // Update connections and pulses
            connectionElements.forEach(conn => {
                // Get source and target particles
                const source = particleElements.find(p => p.data.id === conn.sourceId)?.data;
                const target = particleElements.find(p => p.data.id === conn.targetId)?.data;

                if (source && target) {
                    // Update connection line position
                    conn.line.style.left = `${source.x}%`;
                    conn.line.style.top = `${source.y}%`;

                    // Calculate updated length and angle
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    conn.line.style.width = `${distance}%`;
                    conn.line.style.transform = `rotate(${angle}deg)`;

                    // Check for active pulses
                    const sourcePulsing = source.pulseData?.active && source.pulseData.targetId === conn.targetId;
                    const targetPulsing = target.pulseData?.active && target.pulseData.targetId === conn.sourceId;

                    if (sourcePulsing || targetPulsing) {
                        let pulsePosition = 0;

                        if (sourcePulsing && source.pulseData) {
                            pulsePosition = source.pulseData.progress;
                        } else if (targetPulsing && target.pulseData) {
                            pulsePosition = 1 - target.pulseData.progress;
                        }

                        if (conn.pulse) {
                            conn.pulse.style.display = 'block';
                            conn.pulse.style.left = `calc(${source.x}% + ${pulsePosition * distance}% * cos(${angle}deg))`;
                            conn.pulse.style.top = `calc(${source.y}% + ${pulsePosition * distance}% * sin(${angle}deg))`;
                        }
                    } else if (conn.pulse) {
                        conn.pulse.style.display = 'none';
                    }
                }
            });

            animationFrameId = requestAnimationFrame(updateParticles);
        };

        // Start animation
        animationFrameId = requestAnimationFrame(updateParticles);

        // Cleanup
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    // Memoized particle background
    const ParticleBackground = useCallback(() => (
        <div
            ref={particleContainerRef}
            className="absolute inset-0 overflow-hidden z-0"
            onMouseMove={throttledMouseMove}
        >
            <div className="particle-container">
                {/* Particles will be created and managed with DOM manipulation */}
            </div>
        </div>
    ), [throttledMouseMove]);

    // Handle mouse events to prevent propagation
    const handleMouseEvents = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            ref={rootSlideRef}
            className="h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 overflow-hidden"
            onMouseMove={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEvents}
            onMouseOver={handleMouseEvents}
            onMouseLeave={handleMouseEvents}
        >
            {/* Particle animation background */}
            <ParticleBackground />

            {/* Content container with z-index to appear above particles */}
            <div
                className="z-10 flex flex-col items-center w-full h-full relative perspective-container"
                style={{
                    perspective: '1500px',
                    transformStyle: 'preserve-3d',
                }}
                ref={perspectiveContainerRef}
                onMouseMove={throttledPerspectiveMouseMove}
            >
                {/* Top section - Logo */}
                <LogoSection
                    animationStage={animationStage}
                />

                {/* Middle section - Title and Subtitle */}
                <TitleSection
                    animationStage={animationStage}
                />

                {/* Code section - Fixed position in the middle-lower part */}
                <CodeSection
                    shouldShowCode={shouldShowCode}
                    codeSnippet={codeSnippet}
                    handleCodeComplete={handleCodeComplete}
                    playTypingSound={playTypingSound}
                />

                {/* Bottom section - Presenter info */}
                <PresenterSection
                    shouldShowPresenter={shouldShowPresenter}
                />
            </div>
        </div>
    );
};

export default Slide01; 
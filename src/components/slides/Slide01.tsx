import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisLogo from '@/components/ui/RegisLogo';
import './Slide01.css';
import { AudioContext } from '@/App';
import CodeTyping from '@/components/slides/CodeTyping';
import Typewriter from 'typewriter-effect';

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

/**
 * Title Slide (Slide 01) for the AI Dev Workshop presentation.
 * Includes animations, styling, and branding elements as specified.
 */
const Slide01: React.FC = () => {
    // State for animation sequence
    const [animationStage, setAnimationStage] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isCodeComplete, setIsCodeComplete] = useState(false);
    const [shouldShowCode, setShouldShowCode] = useState(false);
    const [shouldShowPresenter, setShouldShowPresenter] = useState(false);
    const particleContainerRef = useRef<HTMLDivElement>(null);
    const perspectiveContainerRef = useRef<HTMLDivElement>(null);
    const [perspectiveValues, setPerspectiveValues] = useState({ rotateX: 0, rotateY: 0 });
    const [particles, setParticles] = useState<Particle[]>([]);
    const animationFrameRef = useRef<number>();
    const lastUpdateTimeRef = useRef<number>(Date.now());

    // Get audio effects from context
    const audioEffects = useContext(AudioContext);

    // Code snippet from requirements
    const codeSnippet = `// AI Dev Workshop - The Regis Company
if (AI.codes) {
  engineer.thinkBigger();
  skills.practice.personalize();
  value.grow();
}`;

    // Initialize particles
    useEffect(() => {
        const initialParticles: Particle[] = [];
        const neuralNodeIds: number[] = [];

        // Create particles with more varied properties
        for (let i = 0; i < 75; i++) {
            const size = Math.random() * 2 + 2; // Base size between 2-4px
            const isNeuralNode = i % 15 === 0;

            // Create the particle
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

            // Track neural node IDs for connections
            if (isNeuralNode) {
                neuralNodeIds.push(i);
            }

            initialParticles.push(particle);
        }

        // Create neural connections between nodes
        neuralNodeIds.forEach((nodeId, index) => {
            const particle = initialParticles[nodeId];

            // Connect to 1-3 other neural nodes
            const connectionsCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < connectionsCount; i++) {
                // Find another neural node to connect to
                const targetIndex = (index + 1 + Math.floor(Math.random() * (neuralNodeIds.length - 1))) % neuralNodeIds.length;
                const targetId = neuralNodeIds[targetIndex];

                // Avoid self-connections and duplicates
                if (targetId !== nodeId && !particle.connectedTo?.includes(targetId)) {
                    // Add connection to both particles
                    particle.connectedTo = [...(particle.connectedTo || []), targetId];
                    initialParticles[targetId].connectedTo = [...(initialParticles[targetId].connectedTo || []), nodeId];

                    // Create a connector particle that will visualize the connection
                    const connectorParticle: Particle = {
                        id: initialParticles.length,
                        x: (particle.x + initialParticles[targetId].x) / 2, // Middle point
                        y: (particle.y + initialParticles[targetId].y) / 2, // Middle point
                        size: 1,
                        color: '#9c27b0',
                        velocity: { x: 0, y: 0 },
                        opacity: 0.2 + Math.random() * 0.2,
                        type: 'connector',
                        connectedTo: [nodeId, targetId]
                    };

                    initialParticles.push(connectorParticle);
                }
            }
        });

        setParticles(initialParticles);
    }, []);

    // Animation loop for particle physics
    useEffect(() => {
        const updateParticles = (timestamp: number) => {
            // Calculate delta time for smoother animations
            const deltaTime = timestamp - lastUpdateTimeRef.current;
            lastUpdateTimeRef.current = timestamp;

            // Skip if delta is too large (tab was inactive)
            if (deltaTime > 100) {
                animationFrameRef.current = requestAnimationFrame(updateParticles);
                return;
            }

            setParticles(prevParticles => {
                return prevParticles.map(particle => {
                    // Skip updating connector particles
                    if (particle.type === 'connector') {
                        // Update connector positions based on connected particles
                        if (particle.connectedTo && particle.connectedTo.length === 2) {
                            const [id1, id2] = particle.connectedTo;
                            const p1 = prevParticles.find(p => p.id === id1);
                            const p2 = prevParticles.find(p => p.id === id2);

                            if (p1 && p2) {
                                return {
                                    ...particle,
                                    x: (p1.x + p2.x) / 2,
                                    y: (p1.y + p2.y) / 2
                                };
                            }
                        }
                        return particle;
                    }

                    // Get mouse influence - particles are attracted to or repelled by mouse
                    let mouseInfluenceX = 0;
                    let mouseInfluenceY = 0;

                    if (mousePosition.x > 0 && mousePosition.y > 0) {
                        // Convert percentage positions to container relative
                        const containerWidth = particleContainerRef.current?.clientWidth || 1000;
                        const containerHeight = particleContainerRef.current?.clientHeight || 600;

                        const particleX = particle.x * containerWidth / 100;
                        const particleY = particle.y * containerHeight / 100;

                        // Calculate distance to mouse
                        const dx = mousePosition.x - particleX;
                        const dy = mousePosition.y - particleY;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Apply mouse influence inversely proportional to distance
                        // (closer particles are affected more)
                        if (distance < 200) {
                            const influence = (1 - distance / 200) * 0.03;
                            mouseInfluenceX = dx * influence;
                            mouseInfluenceY = dy * influence;
                        }
                    }

                    // Update particle position
                    let newX = particle.x + particle.velocity.x * deltaTime + mouseInfluenceX;
                    let newY = particle.y + particle.velocity.y * deltaTime + mouseInfluenceY;

                    // Bounce off edges
                    if (newX < 0 || newX > 100) {
                        particle.velocity.x *= -1;
                        newX = Math.max(0, Math.min(100, newX));
                    }

                    if (newY < 0 || newY > 100) {
                        particle.velocity.y *= -1;
                        newY = Math.max(0, Math.min(100, newY));
                    }

                    // Update special effects
                    let updatedOpacity = particle.opacity;
                    let updatedSize = particle.size;
                    let updatedColor = particle.color;
                    let updatedEffect = particle.effect;
                    let updatedEffectState = particle.effectState ? {
                        timer: particle.effectState.timer || 0,
                        duration: particle.effectState.duration || 3000,
                        intensity: particle.effectState.intensity || 0.5
                    } : undefined;

                    if (particle.effect && particle.effect !== 'none' && updatedEffectState) {
                        // Increment effect timer
                        updatedEffectState.timer += deltaTime;

                        // Reset effect after duration
                        if (updatedEffectState.timer >= updatedEffectState.duration) {
                            updatedEffectState.timer = 0;

                            // Randomize next effect for variety
                            if (Math.random() > 0.7) {
                                updatedEffect = ['sparkle', 'pulse', 'color-shift', 'none'][Math.floor(Math.random() * 4)] as any;
                                updatedEffectState.duration = 2000 + Math.random() * 3000;
                                updatedEffectState.intensity = Math.random();
                            }
                        }

                        // Apply effects based on type
                        const effectProgress = updatedEffectState.timer / updatedEffectState.duration;

                        if (updatedEffect === 'sparkle' && effectProgress > 0.3 && effectProgress < 0.7) {
                            // Sparkle effect - increase opacity and size briefly
                            const sparkleIntensity = Math.sin(effectProgress * Math.PI) * updatedEffectState.intensity;
                            updatedOpacity = particle.opacity * (1 + sparkleIntensity);
                            updatedSize = particle.size * (1 + sparkleIntensity * 0.5);
                        } else if (updatedEffect === 'pulse') {
                            // Pulse effect - size oscillation
                            const pulseIntensity = Math.sin(effectProgress * Math.PI * 2) * updatedEffectState.intensity;
                            updatedSize = particle.size * (1 + pulseIntensity * 0.3);
                        } else if (updatedEffect === 'color-shift' && particle.type === 'normal') {
                            // Color shift effect - smoothly transition between colors
                            const colorPhase = effectProgress * 2 * Math.PI;
                            const r = 33 + Math.sin(colorPhase) * 100;
                            const g = 150 + Math.sin(colorPhase + 2) * 50;
                            const b = 243 + Math.sin(colorPhase + 4) * 50;
                            updatedColor = `rgb(${r}, ${g}, ${b})`;
                        }
                    }

                    // Handle neural pulses
                    let updatedPulseData = particle.pulseData ? {
                        active: particle.pulseData.active,
                        progress: particle.pulseData.progress || 0,
                        targetId: particle.pulseData.targetId
                    } : {
                        active: false,
                        progress: 0
                    };

                    if (particle.type === 'neural' && Math.random() < 0.001) {
                        // Randomly initiate neural pulses
                        if (!updatedPulseData.active && particle.connectedTo && particle.connectedTo.length > 0) {
                            // Pick a random connection to pulse to
                            const targetId = particle.connectedTo[Math.floor(Math.random() * particle.connectedTo.length)];
                            updatedPulseData = {
                                active: true,
                                progress: 0,
                                targetId
                            };
                        }
                    }

                    // Update pulse progress
                    if (updatedPulseData.active) {
                        updatedPulseData.progress += deltaTime / 1000; // Progress in seconds

                        // Reset when complete
                        if (updatedPulseData.progress >= 1) {
                            updatedPulseData = {
                                active: false,
                                progress: 0
                            };
                        }
                    }

                    return {
                        ...particle,
                        x: newX,
                        y: newY,
                        opacity: updatedOpacity,
                        size: updatedSize,
                        color: updatedColor,
                        effect: updatedEffect,
                        effectState: updatedEffectState,
                        pulseData: updatedPulseData
                    } as Particle; // Explicitly cast to Particle type to resolve TypeScript error
                });
            });

            animationFrameRef.current = requestAnimationFrame(updateParticles);
        };

        // Start animation loop
        animationFrameRef.current = requestAnimationFrame(updateParticles);

        // Cleanup on component unmount
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [mousePosition]);

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

    // Handle mouse movement for particle effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (particleContainerRef.current) {
            const rect = particleContainerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    }, []);

    // Handle perspective mouse movement
    const handlePerspectiveMouseMove = useCallback((e: React.MouseEvent) => {
        if (perspectiveContainerRef.current) {
            const rect = perspectiveContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPerspectiveValues({
                rotateX: (y - rect.height / 2) / (rect.height / 2) * 10,
                rotateY: (x - rect.width / 2) / (rect.width / 2) * 10
            });
        }
    }, []);

    // Enhanced particle background with fluid physics
    const ParticleBackground = () => (
        <div
            ref={particleContainerRef}
            className="absolute inset-0 overflow-hidden z-0"
            onMouseMove={handleMouseMove}
        >
            <div className="particle-container">
                {/* Render neural connections first (so they appear behind particles) */}
                {particles.filter(p => p.type === 'neural' && p.connectedTo && p.connectedTo.length > 0).map(particle => {
                    return particle.connectedTo!.map(targetId => {
                        const target = particles.find(p => p.id === targetId);
                        if (!target) return null;

                        // Only render each connection once (from lower ID to higher ID)
                        if (particle.id > targetId) return null;

                        // Calculate connection properties
                        const startX = `${particle.x}%`;
                        const startY = `${particle.y}%`;
                        const endX = `${target.x}%`;
                        const endY = `${target.y}%`;

                        // Calculate length and angle for proper rendering
                        const dx = target.x - particle.x;
                        const dy = target.y - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                        // Check if there's an active pulse on this connection
                        const isPulsing = (particle.pulseData?.active && particle.pulseData.targetId === targetId) ||
                            (target.pulseData?.active && target.pulseData.targetId === particle.id);

                        // Get pulse position if pulsing
                        let pulsePosition = 0;
                        if (particle.pulseData?.active && particle.pulseData.targetId === targetId) {
                            pulsePosition = particle.pulseData.progress;
                        } else if (target.pulseData?.active && target.pulseData.targetId === particle.id) {
                            pulsePosition = 1 - target.pulseData.progress;
                        }

                        return (
                            <React.Fragment key={`connection-${particle.id}-${targetId}`}>
                                {/* Neural connection line */}
                                <div
                                    className="neural-connection"
                                    style={{
                                        position: 'absolute',
                                        left: startX,
                                        top: startY,
                                        width: `${distance}%`,
                                        height: '1px',
                                        transform: `rotate(${angle}deg)`,
                                        transformOrigin: 'left center',
                                        backgroundColor: '#9c27b0',
                                        opacity: 0.25 + Math.random() * 0.15
                                    }}
                                />

                                {/* Pulse effect if active */}
                                {isPulsing && (
                                    <div
                                        className="neural-pulse"
                                        style={{
                                            position: 'absolute',
                                            left: `calc(${startX} + ${pulsePosition * distance}% * cos(${angle}deg))`,
                                            top: `calc(${startY} + ${pulsePosition * distance}% * sin(${angle}deg))`,
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: '#ff00ff',
                                            borderRadius: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            boxShadow: '0 0 10px 2px rgba(255, 0, 255, 0.7)',
                                            zIndex: 5
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    });
                })}

                {/* Render all particles */}
                {particles.filter(p => p.type !== 'connector').map(particle => {
                    // Determine if particle has any special effects active
                    const hasActiveEffect = particle.effect !== 'none' &&
                        particle.effectState &&
                        particle.effectState.timer < particle.effectState.duration &&
                        particle.effectState.timer > 0;

                    // Determine if this is a neural node with active pulse
                    const hasPulse = particle.type === 'neural' &&
                        particle.pulseData &&
                        particle.pulseData.active;

                    return (
                        <div
                            key={`particle-${particle.id}`}
                            className={`
                                ${particle.type === 'neural' ? 'neural-node' : 'particle'}
                                ${hasActiveEffect ? `effect-${particle.effect}` : ''}
                                ${hasPulse ? 'pulse-active' : ''}
                            `}
                            style={{
                                position: 'absolute',
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                backgroundColor: particle.color,
                                opacity: particle.opacity,
                                borderRadius: '50%',
                                transition: 'transform 0.3s ease-out',
                                boxShadow: particle.type === 'neural'
                                    ? `0 0 ${10 + (hasPulse ? 5 : 0)}px ${2 + (hasPulse ? 2 : 0)}px rgba(156, 39, 176, ${0.5 + (hasPulse ? 0.3 : 0)})`
                                    : particle.effect === 'sparkle' && hasActiveEffect
                                        ? `0 0 ${5 + Math.random() * 5}px ${Math.random() * 2}px rgba(255, 255, 255, 0.8)`
                                        : 'none',
                                zIndex: particle.type === 'neural' ? 2 : 1
                            }}
                        />
                    );
                })}
            </div>

            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-paper-texture opacity-5" />
        </div>
    );

    return (
        <div className="h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 overflow-hidden">
            {/* Particle animation background */}
            <ParticleBackground />

            {/* Content container with z-index to appear above particles */}
            <div
                className="z-10 flex flex-col items-center w-full h-full relative"
                style={{
                    perspective: '1500px',
                    transformStyle: 'preserve-3d',
                }}
                ref={perspectiveContainerRef}
                onMouseMove={handlePerspectiveMouseMove}
            >
                {/* Top section - Logo */}
                <div className="absolute top-10 w-full flex justify-center">
                    <AnimatePresence>
                        {animationStage >= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
                                className="relative z-20"
                                style={{
                                    transform: `rotateX(${perspectiveValues.rotateX}deg) rotateY(${perspectiveValues.rotateY}deg) translateZ(30px)`,
                                    transition: 'transform 0.2s ease-out',
                                }}
                            >
                                <RegisLogo width={480} height={150} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Middle section - Title and Subtitle */}
                <div className="absolute top-1/4 w-full flex justify-center">
                    <AnimatePresence>
                        {animationStage >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
                                className="perspective-container"
                                style={{
                                    transform: `rotateX(${perspectiveValues.rotateX * 0.7}deg) rotateY(${perspectiveValues.rotateY * 0.7}deg) translateZ(20px)`,
                                    transition: 'transform 0.3s ease-out',
                                }}
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

                {/* Code section - Fixed position in the middle-lower part */}
                <div className="absolute top-[50%] w-full flex justify-center" style={{ zIndex: 30 }}>
                    <AnimatePresence>
                        {shouldShowCode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full max-w-lg"
                                style={{
                                    transform: `rotateX(${perspectiveValues.rotateX * 0.5}deg) rotateY(${perspectiveValues.rotateY * 0.5}deg) translateZ(10px)`,
                                    transition: 'transform 0.4s ease-out',
                                    zIndex: 30
                                }}
                            >
                                <div className="glass-panel-interactive rounded-lg p-4 font-mono border border-teal-500/30" style={{ zIndex: 30 }}>
                                    <CodeTyping
                                        code={codeSnippet}
                                        speed={12}
                                        onComplete={handleCodeComplete}
                                        onProgress={(position, text) => {
                                            audioEffects?.playTypingSound();
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

                {/* Bottom section - Presenter info */}
                <div className="absolute bottom-10 w-full flex justify-center">
                    <AnimatePresence>
                        {shouldShowPresenter && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="text-center text-depth-3"
                                style={{
                                    transform: `rotateX(${perspectiveValues.rotateX * 0.3}deg) rotateY(${perspectiveValues.rotateY * 0.3}deg) translateZ(5px)`,
                                    transition: 'transform 0.5s ease-out',
                                }}
                            >
                                <p
                                    className="glass-text glass-text-accent text-lg mb-2"
                                    data-text="Presented by: Joel Janov"
                                >
                                    Presented by: Joel Janov
                                </p>
                                <p
                                    className="glass-text glass-text-primary text-sm"
                                    data-text="April 15, 2025"
                                >
                                    April 15, 2025
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Slide01; 
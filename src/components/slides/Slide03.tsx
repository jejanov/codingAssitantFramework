import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Glass } from '../../../DESIGN_SYSTEM/components/Glass/Glass';
import ProductivityMetrics from './ProductivityMetrics';
import TimelineComparison from './TimelineComparison';
import './Slide03.css';
import { useGlobalAudio } from '../../contexts/AudioContext';

/**
 * Slide03: Productivity Visualization slide as specified in slide_instructions/slide_03.md
 * Visualizes the productivity gains that AI-assisted development enables through a dynamic racing video
 * and overlaid metrics visualization with glassmorphism effects
 */
const Slide03: React.FC = () => {
    // State for progress animation (0 to 1)
    const [animationProgress, setAnimationProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Get global audio context
    const { isDialoguePlaying } = useGlobalAudio();

    // Animate metrics appearance - separated from audio effect
    useEffect(() => {
        // Start with a delay
        const startDelay = setTimeout(() => {
            // Animation start time reference
            let startTime: number | null = null;
            let animationFrameId: number;

            // Animation function for smooth progress
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;

                // Total duration: 5 seconds (3x faster than original 15 seconds)
                const progress = Math.min(elapsed / 5000, 1);
                setAnimationProgress(progress);

                // Continue animation if not complete
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            // Start animation
            animationFrameId = requestAnimationFrame(animate);

            // Play the video when animation starts
            if (videoRef.current) {
                videoRef.current.play();
            }

            // Cleanup
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }, 1000);

        // Cleanup on unmount
        return () => {
            clearTimeout(startDelay);
        };
    }, []);

    // Memoize the mouse handler to prevent unnecessary re-renders
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            className="slide03-container"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseMove}
            onMouseOver={handleMouseMove}
        >
            {/* Background Video - 16:9 aspect ratio */}
            <div className="video-background">
                <video
                    ref={videoRef}
                    className="background-video"
                    src="/images/DevRace.mp4"
                    muted
                    loop
                    playsInline
                />
                <div className="video-overlay"></div>
            </div>

            {/* Dust particles effect */}
            <div className="dust-particles">
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
                <div className="dust-particle"></div>
            </div>

            {/* Speed lines effect */}
            <div className="speed-lines">
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
            </div>

            {/* Content container - completely transparent */}
            <div className="content-container">
                <h1 className="slide-title">
                    Breaking the Speed Limit: The Multiplier Effect
                </h1>

                <div className="metrics-container">
                    <ProductivityMetrics raceProgress={animationProgress} />
                    <TimelineComparison raceProgress={animationProgress} />
                </div>

                <motion.div
                    className="research-citation"
                    data-testid="research-citation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: animationProgress > 0.9 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Sources: Microsoft/MIT (Peng et al., 2023), Microsoft/MIT/Wharton field research (Zhao et al., 2024), McKinsey Digital (2023)
                </motion.div>
            </div>

            {/* Note: The DialoguePlayer has been removed as it's now handled by the global SlideAwareDialoguePlayer */}
        </div>
    );
};

export default Slide03; 
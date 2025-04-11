import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { SlideContext } from '@/App';
import './Slide00.css';

/**
 * Slide00: Intro screen with a Press to Start button
 * First screen users see before starting the presentation
 */
const Slide00: React.FC = () => {
    const [hover, setHover] = useState(false);
    const [pulsate, setPulsate] = useState(false);
    const { navigateToSlide } = useContext(SlideContext);

    // Start pulsating animation after a short delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setPulsate(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Handle start button click
    const handleStart = () => {
        navigateToSlide(1); // Navigate to Slide 1
    };

    return (
        <div className="slide00-container">
            <div className="start-content">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="title-container"
                >
                    <h1 className="main-title">AI Coding Workshop</h1>
                </motion.div>

                <motion.button
                    className={`start-button ${pulsate ? 'pulsate' : ''} ${hover ? 'hover' : ''}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 1,
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={handleStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Press to Start
                    <div className="button-glow"></div>
                </motion.button>
            </div>
        </div>
    );
};

export default Slide00; 
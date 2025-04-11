import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Glass } from '../../../DESIGN_SYSTEM/components/Glass/Glass';
import { AudioContext } from '../../App';

interface RaceTrackProps {
    progress: number;
}

/**
 * RaceTrack component that displays a racing visualization comparing
 * traditional and AI-assisted development
 */
const RaceTrack: React.FC<RaceTrackProps> = ({ progress }) => {
    // Audio context for sound effects
    const audioEffects = useContext(AudioContext);

    // Play countdown sounds at the start
    useEffect(() => {
        if (progress < 0.02 && progress > 0 && audioEffects) {
            // Beginning of race - play countdown sounds
            setTimeout(() => audioEffects.playPopSound(), 0);
            setTimeout(() => audioEffects.playPopSound(), 1000);
            setTimeout(() => audioEffects.playPopSound(), 2000);
        }

        if (progress >= 1 && audioEffects) {
            // Race complete - play success sound
            audioEffects.playSuccessSound();
        }
    }, [progress, audioEffects]);

    // Calculate positions of the cars based on progress
    const aiCarPosition = progress * 80; // AI car moves faster (80% of track at full progress)
    const traditionalCarPosition = progress * 40; // Traditional car moves slower (40% of track at full progress)

    // Whether to show countdown (only during the first 10% of progress)
    const showCountdown = progress < 0.1;

    // Calculate which countdown number to show (3,2,1,GO)
    const countdownNumber = () => {
        if (progress < 0.02) return 3;
        if (progress < 0.04) return 2;
        if (progress < 0.06) return 1;
        return 'GO!';
    };

    return (
        <Glass hierarchy="container" level="secondary" className="race-track-container">
            {/* Race track */}
            <div className="race-track">
                {/* Countdown overlay */}
                {showCountdown && (
                    <motion.div
                        className="countdown"
                        data-testid="countdown"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                    >
                        {countdownNumber()}
                    </motion.div>
                )}

                {/* Finish line */}
                <div
                    className={`finish-line ${progress >= 1 ? 'active' : ''}`}
                    data-testid="finish-line"
                />

                {/* Traditional development car (red) */}
                <motion.div
                    className="car traditional"
                    data-testid="traditional-car"
                    initial={{ x: 0 }}
                    animate={{ x: `${traditionalCarPosition}%` }}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 100
                    }}
                >
                    <div className="car-label">Traditional</div>
                </motion.div>

                {/* AI-assisted development car (blue) */}
                <motion.div
                    className="car ai-assisted"
                    data-testid="ai-assisted-car"
                    initial={{ x: 0 }}
                    animate={{ x: `${aiCarPosition}%` }}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 100
                    }}
                >
                    <div className="car-label">AI-Assisted</div>
                </motion.div>
            </div>
        </Glass>
    );
};

export default RaceTrack; 
import React, { useContext, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioContext } from '../../App';

interface TimelineComparisonProps {
    raceProgress: number;
}

/**
 * TimelineComparison component that visualizes the time reduction
 * between traditional and AI-assisted development timelines
 */
const TimelineComparison: React.FC<TimelineComparisonProps> = ({ raceProgress }) => {
    // Audio context for sound effects
    const audioEffects = useContext(AudioContext);

    // Only show timeline comparison after race is 70% complete
    const showTimeline = raceProgress >= 0.7;

    // Play sound when timeline first appears
    React.useEffect(() => {
        if (raceProgress >= 0.7 && raceProgress < 0.72 && audioEffects) {
            audioEffects.playWhooshSound();
        }
    }, [raceProgress, audioEffects]);

    // Timeline data with durations for each phase
    const timelinePhases = [
        { name: 'Requirements', traditional: 1, aiAugmented: 0.5, color: '#4CAF50' },
        { name: 'Implementation', traditional: 3, aiAugmented: 1.5, color: '#2196F3' },
        { name: 'Integration', traditional: 2, aiAugmented: 1, color: '#9C27B0' },
        { name: 'Testing', traditional: 3, aiAugmented: 1.5, color: '#FF9800' },
        { name: 'Documentation', traditional: 1, aiAugmented: 0.3, color: '#607D8B' }
    ];

    // Calculate total durations
    const traditionalTotal = timelinePhases.reduce((sum, phase) => sum + phase.traditional, 0);
    const aiTotal = timelinePhases.reduce((sum, phase) => sum + phase.aiAugmented, 0);

    // Calculate how complete the timeline animation should be (from 0 to 1)
    // Maps 0.7-1.0 race progress to 0-1 timeline progress
    const timelineProgress = raceProgress >= 0.7
        ? Math.min(1, (raceProgress - 0.7) * (1 / 0.3))
        : 0;

    return (
        <AnimatePresence>
            {showTimeline && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="timeline-comparison">
                        <h2 className="timeline-title">Project Timeline Comparison</h2>

                        {/* Time reduction callout - moved to top right */}
                        <motion.div
                            className="time-reduction-highlight"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: timelineProgress >= 0.3 ? 1 : 0,
                                scale: timelineProgress >= 0.3 ? 1 : 0.8
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="reduction-text-container">
                                <span className="reduction-text">52% Time Reduction</span>
                                <span className="reduction-source">(McKinsey, 2023)</span>
                            </div>
                        </motion.div>

                        <div className="timeline-container">
                            {/* Traditional timeline */}
                            <div className="timeline traditional">
                                <h3 className="timeline-label">Traditional: 10 weeks</h3>
                                <div className="timeline-bar-container">
                                    {timelinePhases.map((phase, index) => (
                                        <motion.div
                                            key={`trad-${phase.name}`}
                                            className={`timeline-phase ${timelineProgress > 0.8 ? 'active' : ''}`}
                                            style={{
                                                width: `${(phase.traditional / traditionalTotal) * 100}%`,
                                                backgroundColor: phase.color
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(phase.traditional / traditionalTotal) * 100 * timelineProgress}%` }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* AI-Augmented timeline - scaled to be 48% of traditional width */}
                            <div className="timeline ai-augmented">
                                <h3 className="timeline-label">AI-Augmented: 4.8 weeks</h3>
                                <div className="timeline-bar-container">
                                    <div className="scale-container" style={{ width: `${(aiTotal / traditionalTotal) * 100}%` }}>
                                        {timelinePhases.map((phase, index) => (
                                            <motion.div
                                                key={`ai-${phase.name}`}
                                                className={`timeline-phase ${timelineProgress > 0.8 ? 'active' : ''}`}
                                                style={{
                                                    width: `${(phase.aiAugmented / aiTotal) * 100}%`,
                                                    backgroundColor: phase.color
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(phase.aiAugmented / aiTotal) * 100 * timelineProgress}%` }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.5 + index * 0.1
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Color-coded legend */}
                            <motion.div
                                className="timeline-legend"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: timelineProgress >= 0.6 ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {timelinePhases.map((phase) => (
                                    <div key={`legend-${phase.name}`} className="legend-item">
                                        <div className="legend-color" style={{ backgroundColor: phase.color }}></div>
                                        <div className="legend-info">
                                            <span className="legend-name">{phase.name}</span>
                                            <span className="legend-duration">
                                                <span className="trad-duration">{phase.traditional}w</span>
                                                <span className="duration-arrow">→</span>
                                                <span className="ai-duration">{phase.aiAugmented}w</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(TimelineComparison); 
import React, { useState, useContext, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '../../../DESIGN_SYSTEM/components/Glass/Glass';
import { AudioContext } from '../../App';

interface ProductivityMetricsProps {
    raceProgress: number;
}

/**
 * ProductivityMetrics component that displays productivity metrics
 * comparing traditional and AI-assisted development
 */
const ProductivityMetrics: React.FC<ProductivityMetricsProps> = ({ raceProgress }) => {
    // States for hover effects
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Audio context for sound effects
    const audioEffects = useContext(AudioContext);

    // Play success sound when a metric first appears
    useEffect(() => {
        if (raceProgress > 0.3 && raceProgress < 0.32 && audioEffects) {
            audioEffects.playPopSound();
        }
        if (raceProgress > 0.35 && raceProgress < 0.37 && audioEffects) {
            audioEffects.playPopSound();
        }
        if (raceProgress > 0.4 && raceProgress < 0.42 && audioEffects) {
            audioEffects.playPopSound();
        }
        if (raceProgress > 0.45 && raceProgress < 0.47 && audioEffects) {
            audioEffects.playPopSound();
        }
    }, [raceProgress, audioEffects]);

    // Metrics data with animations timed to different progress points
    const metrics = [
        {
            id: 'task-completion',
            label: 'Task Completion Speed',
            value: '+55.8%',
            description: 'Developers complete coding tasks faster with AI pair-programming (Microsoft/MIT)',
            showAt: 0.3,
            color: '#2196F3' // Blue
        },
        {
            id: 'weekly-tasks',
            label: 'Weekly Tasks Completed',
            value: '+126%',
            description: 'More than double the weekly output compared to traditional methods (Peng et al.)',
            showAt: 0.35,
            color: '#4CAF50' // Green
        },
        {
            id: 'prs-merged',
            label: 'Pull Requests Merged',
            value: '+26%',
            description: 'Increase in merged pull requests per week (Microsoft/MIT/Wharton field study)',
            showAt: 0.4,
            color: '#9C27B0' // Purple
        },
        {
            id: 'production-time',
            label: 'Production Time',
            value: '-50%',
            description: 'Cut time to production in half according to GitHub internal data',
            showAt: 0.45,
            color: '#FF9800' // Orange
        }
    ];

    return (
        <Glass hierarchy="container" level="secondary" className="productivity-metrics">
            <h2 className="metrics-title">Productivity Metrics</h2>

            <div className="metrics-grid">
                <AnimatePresence>
                    {metrics.map((metric) => (
                        // Only show metric if race has progressed enough
                        raceProgress >= metric.showAt && (
                            <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className={`metric-card ${hoveredCard === metric.id ? 'hovered' : ''}`}
                                data-testid={`metric-${metric.id}`}
                                onMouseEnter={() => setHoveredCard(metric.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Glass
                                    hierarchy="interactive"
                                    level={hoveredCard === metric.id ? 'primary' : 'secondary'}
                                    className="metric-card-inner"
                                >
                                    <h3 className="metric-label">{metric.label}</h3>

                                    <div
                                        className="metric-value"
                                        style={{
                                            color: metric.color,
                                            textShadow: `0 0 15px ${metric.color}80`
                                        }}
                                    >
                                        {metric.value}
                                    </div>

                                    <p className="metric-description">{metric.description}</p>

                                    {/* Simple gauge visualization */}
                                    <div className="gauge-container">
                                        <div
                                            className="gauge-fill"
                                            style={{
                                                width: `${Math.min(100, (raceProgress - metric.showAt) * 500)}%`,
                                                backgroundColor: metric.color
                                            }}
                                        />
                                    </div>
                                </Glass>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </Glass>
    );
};

export default memo(ProductivityMetrics); 
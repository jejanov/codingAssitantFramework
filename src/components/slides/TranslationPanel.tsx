import React from 'react';
import { motion } from 'framer-motion';

interface TranslationPanelProps {
    isVisible?: boolean;
    brandColors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
    };
}

/**
 * TranslationPanel component for displaying non-technical explanations
 */
const TranslationPanel: React.FC<TranslationPanelProps> = ({
    isVisible = false,
    brandColors = {
        primary: '#2196f3',   // Blue
        secondary: '#9c27b0', // Purple
        accent: '#00bcd4'     // Teal
    }
}) => {
    // Animation variants for bullet points
    const bulletVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.3,
                duration: 0.5,
                type: 'spring',
                stiffness: 100
            }
        })
    };

    return (
        <motion.div
            data-testid="translation-panel"
            className={`translation-panel glass-panel-emphasized ${isVisible ? 'visible' : 'hidden'}`}
            initial={{ x: 500, opacity: 0, rotateZ: 5 }}
            animate={isVisible ? {
                x: 0,
                opacity: 1,
                rotateZ: 2,
                transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 15
                }
            } : {}}
            style={{
                position: 'absolute',
                top: '10%',
                right: isVisible ? '5%' : '-50%',
                width: '40%',
                padding: '1.5rem',
                color: '#333',
                borderRadius: '0.8rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                backgroundColor: 'rgba(249, 243, 229, 0.85)',
                backdropFilter: 'blur(12px)',
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                backgroundImage: 'url("/images/paper-texture.png")',
                backgroundBlendMode: 'overlay',
                transform: isVisible ? 'rotate(2deg)' : 'rotate(5deg)',
                zIndex: 10,
                border: `1px solid ${brandColors.secondary}40`
            }}
        >
            <h2 style={{
                margin: '0 0 1rem 0',
                color: '#333',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: `0 1px 2px ${brandColors.primary}30`
            }}>
                WHAT THIS ACTUALLY MEANS (FOR THE NON-DEVELOPERS):
            </h2>

            <ul style={{
                listStyleType: 'none',
                padding: 0,
                margin: '1.5rem 0'
            }}>
                <motion.li
                    custom={0}
                    variants={bulletVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    style={{
                        margin: '0.8rem 0',
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}
                >
                    <span style={{
                        marginRight: '0.5rem',
                        color: brandColors.primary
                    }}>•</span>
                    Today, AI writes about 65% of code
                </motion.li>
                <motion.li
                    custom={1}
                    variants={bulletVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    style={{
                        margin: '0.8rem 0',
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}
                >
                    <span style={{
                        marginRight: '0.5rem',
                        color: brandColors.primary
                    }}>•</span>
                    By mid-2025, AI will write 90% of code
                </motion.li>
                <motion.li
                    custom={2}
                    variants={bulletVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    style={{
                        margin: '0.8rem 0',
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}
                >
                    <span style={{
                        marginRight: '0.5rem',
                        color: brandColors.primary
                    }}>•</span>
                    By early 2026, prepare for AI to write ALL the code
                </motion.li>
            </ul>

            <motion.h3
                custom={3}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{
                    margin: '1.5rem 0 0.5rem 0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: brandColors.secondary
                }}
            >
                THE BOTTOM LINE:
            </motion.h3>
            <motion.p
                custom={4}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{ margin: '0.5rem 0 0.5rem 1rem', fontSize: '0.9rem' }}
            >
                → With AI: We work 3x faster, have 50% fewer bugs, and deliver 2x more value
            </motion.p>
            <motion.p
                custom={5}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{ margin: '0.5rem 0 0.5rem 1rem', fontSize: '0.9rem' }}
            >
                → Without AI: ⚠️ We fall behind while competitors zoom ahead
            </motion.p>

            <motion.h3
                custom={6}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{
                    margin: '1.5rem 0 0.5rem 0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: brandColors.secondary
                }}
            >
                WHAT THIS MEANS FOR DEVELOPERS:
            </motion.h3>
            <motion.p
                custom={7}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{ margin: '0.5rem 0 0.5rem 1rem', fontStyle: 'italic', fontSize: '0.9rem' }}
            >
                You finally get to focus on the fun stuff - architecture and solving real problems -
                while AI handles the tedious bits that make you question your life choices.
            </motion.p>

            <motion.h3
                custom={8}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{
                    margin: '1.5rem 0 0.5rem 0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: brandColors.secondary
                }}
            >
                IN CONCLUSION:
            </motion.h3>
            <motion.p
                custom={9}
                variants={bulletVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{ margin: '0.5rem 0 0.5rem 1rem', fontSize: '0.9rem' }}
            >
                AI types the boring parts.
                We think about the interesting parts.
                <br />
                <span style={{ color: brandColors.accent }}>
                    (Yes, we're keeping our jobs. No, the robots aren't taking over... yet.)
                </span>
            </motion.p>
        </motion.div>
    );
};

export default TranslationPanel; 
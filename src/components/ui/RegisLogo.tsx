import React, { useEffect, useRef, useState } from 'react';

interface RegisLogoProps {
    className?: string;
    width?: number;
    height?: number;
    animated?: boolean;
}

/**
 * Enhanced Regis Company logo component with gradient fill and light trace animation
 */
const RegisLogo: React.FC<RegisLogoProps> = ({
    className = '',
    width = 240,
    height = 120,
    animated = true
}) => {
    const [lightPosition, setLightPosition] = useState({ x: 0, percent: 0 });
    const logoRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Light trace animation effect
    useEffect(() => {
        if (!animated) return;

        let startTime = Date.now();
        const animateLightTrace = () => {
            const elapsed = Date.now() - startTime;
            // Complete animation cycle in 3 seconds
            const cyclePosition = (elapsed % 3000) / 3000;

            setLightPosition({
                x: cyclePosition * 100,
                percent: cyclePosition * 100
            });

            animationRef.current = requestAnimationFrame(animateLightTrace);
        };

        animateLightTrace();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animated]);

    return (
        <div className={`flex items-center justify-center ${className}`} ref={logoRef}>
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Enhanced glow effect background */}
                <div
                    className="absolute inset-0 rounded-xl opacity-50 blur-md"
                    style={{
                        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.6) 0%, rgba(156, 39, 176, 0.4) 50%, rgba(0, 188, 212, 0.3) 100%)',
                    }}
                />

                {/* Light trace effect */}
                {animated && (
                    <div
                        className="absolute h-full w-20 blur-md opacity-70 pointer-events-none z-20"
                        style={{
                            left: `${lightPosition.percent}%`,
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.8) 50%, rgba(0,0,0,0) 100%)',
                            mixBlendMode: 'overlay'
                        }}
                    />
                )}

                {/* Logo with brand color gradient */}
                <div className="relative z-10 overflow-visible">
                    <img
                        src="/images/TRC_Logos_2022_horiz.svg"
                        alt="The Regis Company Logo"
                        width={width}
                        height={height}
                        className="object-contain transition-transform duration-300 hover:scale-105"
                        style={{
                            filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.5))',
                            WebkitMaskImage: 'url(/images/TRC_Logos_2022_horiz.svg)',
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(156, 39, 176, 0.9) 50%, rgba(0, 188, 212, 0.9) 100%)',
                            backgroundSize: '200% 200%',
                            animation: 'gradientFlow 15s ease infinite'
                        }}
                    />

                    {/* Subtle hover interactive effect - will be visible through transparent parts of logo */}
                    <div
                        className="absolute inset-0 bg-transparent opacity-0 hover:opacity-30 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                            mixBlendMode: 'overlay',
                        }}
                    />
                </div>
            </div>

            {/* Add keyframe animation for background gradients */}
            <style jsx>{`
                @keyframes gradientFlow {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
        </div>
    );
};

export default RegisLogo; 
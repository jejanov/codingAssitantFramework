import React, { useState, createContext, useEffect, useRef, useCallback } from 'react';
import Slide00 from '@/components/slides/Slide00';
import Slide01 from '@/components/slides/Slide01';
import Slide02 from '@/components/slides/Slide02';
import Slide03 from '@/components/slides/Slide03';
import useAudioEffects from '@/hooks/useAudioEffects';

// Import new audio system components
import { AudioProvider } from '@/contexts/AudioContext';
import SlideManager from '@/components/audio/SlideManager';
import SlideAwareDialoguePlayer from '@/components/audio/SlideAwareDialoguePlayer';

// Legacy audio context - keep for backward compatibility
// for components that still use the old system
export const AudioContext = createContext<ReturnType<typeof useAudioEffects> | null>(null);

// Create a slide context to share slide state and navigation
export interface SlideContextType {
    currentSlide: number;
    totalSlides: number;
    navigateToSlide: (slideNumber: number) => void;
    nextSlide: () => void;
    previousSlide: () => void;
    isLastSlide: boolean;
    isFirstSlide: boolean;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}

export const SlideContext = createContext<SlideContextType>({
    currentSlide: 1,
    totalSlides: 3,
    navigateToSlide: () => { },
    nextSlide: () => { },
    previousSlide: () => { },
    isLastSlide: false,
    isFirstSlide: true,
    isFullscreen: false,
    toggleFullscreen: () => { }
});

// Main application component
const App: React.FC = () => {
    // State for the current slide number
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    // State for showing debug panel
    const [showDebug, setShowDebug] = useState(false);
    // State for fullscreen mode
    const [isFullscreen, setIsFullscreen] = useState(false);
    // State for showing corner controls
    const [showControls, setShowControls] = useState(false);
    // State for content scaling
    const [contentScale, setContentScale] = useState(1);
    // Timeout for hiding controls
    const controlsTimeoutRef = useRef<number | null>(null);
    // Ref for fullscreen container
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);

    // Initialize audio effects
    const audioEffects = useAudioEffects();
    const {
        isSilentMode,
        toggleSilentMode,
        playBackgroundAmbience,
        playTypingSound,
        playWhooshSound,
        playPopSound,
        playSuccessSound
    } = audioEffects;

    // Total number of slides
    const totalSlides = 4;

    // Slide navigation functions
    const navigateToSlide = (slideNumber: number) => {
        if (slideNumber >= 0 && slideNumber <= totalSlides) {
            setCurrentSlide(slideNumber);
        }
    };

    const nextSlide = () => {
        if (currentSlide < totalSlides) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const previousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Fullscreen toggle function
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (fullscreenContainerRef.current?.requestFullscreen) {
                fullscreenContainerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);
    
    // Calculate responsive scale based on screen resolution
    const calculateResponsiveScale = useCallback(() => {
        // Base scale is 1 (designed for 1920x1080)
        let newScale = 1;
        
        // Get current screen dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Scale up for 4K and larger displays
        if (width >= 3000 || height >= 1600) {
            // 4K (3840x2160) gets 1.5x scale
            newScale = 1.5;
        } else if (width >= 2000 || height >= 1300) {
            // 1440p gets 1.2x scale
            newScale = 1.2;
        } else if (width <= 1366 || height <= 768) {
            // Smaller displays get 0.9x scale
            newScale = 0.9;
        }
        
        // Apply scale
        setContentScale(newScale);
        
        // Apply scale as CSS variable to document root
        document.documentElement.style.setProperty('--content-scale', newScale.toString());
    }, []);
    
    // Set up responsive scaling and update on window resize
    useEffect(() => {
        // Calculate initial scale
        calculateResponsiveScale();
        
        // Update scale on resize
        const handleResize = () => {
            calculateResponsiveScale();
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateResponsiveScale]);

    // Throttle function for mouse movement
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

    // Handle mouse movement to show/hide corner controls - optimized
    const handleMouseMove = useCallback(() => {
        // Only update state if controls aren't already visible
        if (!showControls) {
            setShowControls(true);
        }

        if (controlsTimeoutRef.current) {
            window.clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = window.setTimeout(() => {
            setShowControls(false);
        }, 2000);
    }, [showControls]);

    // Throttled version to reduce state updates
    const throttledMouseMove = useCallback(
        throttle(handleMouseMove, 100), // Only process every 100ms
        [handleMouseMove]
    );

    // Clear timeout when component unmounts
    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                window.clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    // Slide context value
    const slideContextValue: SlideContextType = {
        currentSlide,
        totalSlides,
        navigateToSlide,
        nextSlide,
        previousSlide,
        isLastSlide: currentSlide === totalSlides,
        isFirstSlide: currentSlide === 0,
        isFullscreen,
        toggleFullscreen
    };

    // Try to play background audio on initial load (but not on Slide00)
    useEffect(() => {
        // Skip automatic background audio on Slide00
        if (currentSlide === 0) return;

        // Try to start background audio for other slides
        const timer = setTimeout(() => {
            console.log('Initial background music start attempt');
            playBackgroundAmbience();
        }, 1000);

        return () => clearTimeout(timer);
    }, [currentSlide, playBackgroundAmbience]);

    // Function to render the current slide
    const renderCurrentSlide = () => {
        switch (currentSlide) {
            case 0:
                return <Slide00 key="slide-0" />;
            case 1:
                return <Slide01 key="slide-1" />;
            case 2:
                return <Slide02 key="slide-2" />;
            case 3:
                return <Slide03 key="slide-3" />;
            // Future slides will be added here
            default:
                return <div className="p-10 text-center">Slide {currentSlide} not found</div>;
        }
    };

    // Toggle debug panel with Shift+D
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'D' && e.shiftKey) {
                setShowDebug(prev => !prev);
            } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                previousSlide();
            } else if (e.key === 'F' && e.shiftKey) {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, totalSlides]);

    return (
        <AudioProvider>
            {/* Keep the legacy AudioContext for backward compatibility */}
            <AudioContext.Provider value={audioEffects}>
                <SlideContext.Provider value={slideContextValue}>
                    <div
                        ref={fullscreenContainerRef}
                        className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col"
                        onMouseMove={currentSlide !== 1 && currentSlide !== 3 ? throttledMouseMove : undefined}
                    >
                        {/* Header/Title bar - hide on Slide 0 or in fullscreen */}
                        {currentSlide > 0 && !isFullscreen && (
                            <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
                                <div className="container mx-auto flex justify-between items-center">
                                    <h1 className="text-2xl font-bold">
                                        AI Coding Workshop Presentation
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        {/* Sound toggle button */}
                                        <button
                                            onClick={toggleSilentMode}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 text-sm transition-colors"
                                            title={isSilentMode ? "Unmute sounds" : "Mute sounds"}
                                        >
                                            {isSilentMode ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                                                    </svg>
                                                    Unmute
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                                                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                                                        <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                                                    </svg>
                                                    Mute
                                                </>
                                            )}
                                        </button>
                                        <div className="text-gray-400">
                                            Slide {currentSlide} of {totalSlides - 1}
                                        </div>
                                        {/* Fullscreen toggle */}
                                        <button
                                            onClick={toggleFullscreen}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 text-sm transition-colors"
                                            title="Toggle fullscreen"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                            </svg>
                                            Fullscreen
                                        </button>
                                    </div>
                                </div>
                            </header>
                        )}

                        {/* Main content with SlideManager for audio coordination */}
                        <main className={`flex-1 flex flex-col items-center justify-center ${isFullscreen ? 'p-0' : 'p-6'} overflow-hidden`}>
                            <SlideManager currentSlideIndex={currentSlide} autoPlayBackgroundMusic={true}>
                                <div
                                    className={`${isFullscreen ? '' : 'w-full max-w-7xl'} aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl relative slide-container`}
                                    style={isFullscreen ? {
                                        aspectRatio: '16/9',
                                        width: 'calc(100vh * 16 / 9)',
                                        maxWidth: '100vw',
                                        height: 'calc(100vw * 9 / 16)',
                                        maxHeight: '100vh',
                                        margin: '0 auto'
                                    } : {}}
                                >
                                    {renderCurrentSlide()}

                                    {/* Global dialogue player that works for all slides */}
                                    {/* Dialogue player now positioned below the slide container */}
                                </div>
                                
                                {/* Dialogue player positioned below the slide container */}
                                <div className={`${isFullscreen ? 'absolute bottom-6 w-4/5 left-1/2 transform -translate-x-1/2' : 'w-full max-w-7xl mt-4'}`}>
                                    <SlideAwareDialoguePlayer 
                                        autoPlayOnSlideChange={true}
                                        floatingControls={isFullscreen}
                                        compact={true}
                                        showTranscript={true}
                                        showOnlyCurrent={true}
                                        // Force this to the value of the current slide
                                        slideIndex={currentSlide}
                                        // Add a custom style for appearance
                                        style={{
                                            position: 'relative',
                                            height: '100px',
                                            width: '100%',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(75, 85, 99, 0.5)'
                                        }}
                                    />

                                    {/* Corner controls that appear on hover in fullscreen mode */}
                                    {isFullscreen && showControls && (
                                        <div className="absolute top-4 right-4 flex gap-2 transition-opacity duration-300 opacity-70 hover:opacity-100">
                                            {/* Navigation controls */}
                                            <button
                                                onClick={previousSlide}
                                                disabled={currentSlide <= 0}
                                                className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-opacity-90 transition-all"
                                                title="Previous slide"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                disabled={currentSlide >= 3}
                                                className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-opacity-90 transition-all"
                                                title="Next slide"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                            </button>

                                            {/* Sound toggle */}
                                            <button
                                                onClick={toggleSilentMode}
                                                className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full hover:bg-opacity-90 transition-all"
                                                title={isSilentMode ? "Unmute sounds" : "Mute sounds"}
                                            >
                                                {isSilentMode ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                                                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                                                        <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* Exit fullscreen button */}
                                            <button
                                                onClick={toggleFullscreen}
                                                className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full hover:bg-opacity-90 transition-all"
                                                title="Exit fullscreen"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </SlideManager>
                        </main>

                        {/* Debug Panel - Press Shift+D to toggle */}
                        {showDebug && (
                            <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg z-50">
                                <h3 className="text-lg font-bold mb-2">Audio Debug</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => playTypingSound()}
                                        className="px-2 py-1 bg-blue-600 rounded-md text-sm"
                                    >
                                        Test Typing
                                    </button>
                                    <button
                                        onClick={() => playWhooshSound()}
                                        className="px-2 py-1 bg-blue-600 rounded-md text-sm"
                                    >
                                        Test Whoosh
                                    </button>
                                    <button
                                        onClick={() => playPopSound()}
                                        className="px-2 py-1 bg-blue-600 rounded-md text-sm"
                                    >
                                        Test Pop
                                    </button>
                                    <button
                                        onClick={() => playSuccessSound()}
                                        className="px-2 py-1 bg-blue-600 rounded-md text-sm"
                                    >
                                        Test Success
                                    </button>
                                    <button
                                        onClick={() => playBackgroundAmbience()}
                                        className="px-2 py-1 bg-green-600 rounded-md text-sm col-span-2"
                                    >
                                        Start Background
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-2 py-1 bg-red-600 rounded-md text-sm col-span-2"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                                
                                <h3 className="text-lg font-bold mt-4 mb-2">Display Scaling</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const newScale = 0.9;
                                            setContentScale(newScale);
                                            document.documentElement.style.setProperty('--content-scale', newScale.toString());
                                        }}
                                        className="px-2 py-1 bg-purple-600 rounded-md text-sm"
                                    >
                                        Smaller (0.9x)
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newScale = 1.0;
                                            setContentScale(newScale);
                                            document.documentElement.style.setProperty('--content-scale', newScale.toString());
                                        }}
                                        className="px-2 py-1 bg-blue-600 rounded-md text-sm"
                                    >
                                        Normal (1x)
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newScale = 1.2;
                                            setContentScale(newScale);
                                            document.documentElement.style.setProperty('--content-scale', newScale.toString());
                                        }}
                                        className="px-2 py-1 bg-green-600 rounded-md text-sm"
                                    >
                                        Larger (1.2x)
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newScale = 1.5;
                                            setContentScale(newScale);
                                            document.documentElement.style.setProperty('--content-scale', newScale.toString());
                                        }}
                                        className="px-2 py-1 bg-yellow-600 rounded-md text-sm"
                                    >
                                        4K (1.5x)
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newScale = 2.0;
                                            setContentScale(newScale);
                                            document.documentElement.style.setProperty('--content-scale', newScale.toString());
                                        }}
                                        className="px-2 py-1 bg-red-600 rounded-md text-sm"
                                    >
                                        Huge (2x)
                                    </button>
                                    <button
                                        onClick={() => {
                                            calculateResponsiveScale();
                                        }}
                                        className="px-2 py-1 bg-gray-600 rounded-md text-sm"
                                    >
                                        Auto
                                    </button>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-400">
                                    Press Shift+D to hide | Current Scale: {contentScale}x
                                </div>
                            </div>
                        )}

                        {/* Navigation controls - hide on Slide 0 or in fullscreen */}
                        {currentSlide > 0 && !isFullscreen && (
                            <div className="flex justify-center py-4 gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50"
                                    onClick={previousSlide}
                                    disabled={currentSlide <= 0}
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50"
                                    onClick={nextSlide}
                                    disabled={currentSlide >= 3}
                                >
                                    Next
                                </button>
                                {/* Fullscreen button */}
                                <button
                                    className="px-4 py-2 bg-blue-600 rounded-md"
                                    onClick={toggleFullscreen}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline-block mr-2">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                    </svg>
                                    Fullscreen
                                </button>
                            </div>
                        )}

                        {/* Footer - hide on Slide 0 or in fullscreen */}
                        {currentSlide > 0 && !isFullscreen && (
                            <footer className="bg-gray-800 border-t border-gray-700 p-3 text-center text-gray-400 text-sm">
                                <p>Built with React, TypeScript, and Tailwind CSS</p>
                            </footer>
                        )}
                    </div>
                </SlideContext.Provider>
            </AudioContext.Provider>
        </AudioProvider>
    );
};

export default App; 
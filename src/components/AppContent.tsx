import { observer } from 'mobx-react-lite';
import { useAudioStore, useSlideStore } from '../stores/StoreContext';
import Slide00 from './slides/Slide00';
import Slide01 from './slides/Slide01';
import Slide02 from './slides/Slide02';
import Slide03 from './slides/Slide03';
import Slide04Refactored from './slides/Slide04Refactored';
import SlideAwareDialoguePlayer from './audio/SlideAwareDialoguePlayer';
import { useEffect, useRef } from 'react';

const AppContent = observer(() => {
    const slideStore = useSlideStore();
    const audioStore = useAudioStore();
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);

    // Set up fullscreen change listener
    useEffect(() => {
        document.addEventListener('fullscreenchange', slideStore.handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', slideStore.handleFullscreenChange);
        };
    }, [slideStore]);

    // Set up responsive scaling
    useEffect(() => {
        // Calculate initial scale
        slideStore.calculateResponsiveScale();

        // Update scale on resize
        const handleResize = () => {
            slideStore.calculateResponsiveScale();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [slideStore]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'D' && e.shiftKey) {
                slideStore.toggleDebug();
            } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                slideStore.nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                slideStore.previousSlide();
            } else if (e.key === 'F' && e.shiftKey) {
                slideStore.toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [slideStore]);

    // Try to play background audio on initial load (but not on Slide00)
    useEffect(() => {
        // Skip automatic background audio on Slide00
        if (slideStore.currentSlide === 0) return;

        // Try to start background audio for other slides
        const timer = setTimeout(() => {
            console.log('Initial background music start attempt');
            audioStore.playBackgroundMusic();

            // Set slideChangeReason to 'next' for slides after the intro
            // This helps ensure dialogue will auto-play
            if (slideStore.currentSlide > 1 && slideStore.slideChangeReason !== 'next') {
                console.log('Setting slideChangeReason to next to enable auto-play');
                slideStore.slideChangeReason = 'next';
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [slideStore.currentSlide, audioStore, slideStore]);

    // Function to render the current slide
    const renderCurrentSlide = () => {
        switch (slideStore.currentSlide) {
            case 0:
                return <Slide00 key="slide-0" />;
            case 1:
                return <Slide01 key="slide-1" />;
            case 2:
                return <Slide02 key="slide-2" />;
            case 3:
                return <Slide03 key="slide-3" />;
            case 4:
                return <Slide04Refactored key="slide-4" />;
            default:
                return <div className="p-10 text-center">Slide {slideStore.currentSlide} not found</div>;
        }
    };

    return (
        <div
            ref={fullscreenContainerRef}
            data-fullscreen-container="true"
            className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col"
            onMouseMove={slideStore.currentSlide !== 1 && slideStore.currentSlide !== 3 ?
                () => slideStore.showControlsTemporarily() : undefined}
        >
            {/* Header/Title bar - hide on Slide 0 or in fullscreen */}
            {slideStore.currentSlide > 0 && !slideStore.isFullscreen && (
                <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            AI Coding Workshop Presentation
                        </h1>
                        <div className="flex items-center gap-4">
                            {/* Sound toggle button */}
                            <button
                                onClick={audioStore.toggleMute}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 text-sm transition-colors"
                                title={audioStore.isMuted ? "Unmute sounds" : "Mute sounds"}
                            >
                                {audioStore.isMuted ? "Unmute" : "Mute"}
                            </button>
                            <div className="text-gray-400">
                                Slide {slideStore.currentSlide} of {slideStore.totalSlides - 1}
                            </div>
                            {/* Fullscreen toggle */}
                            <button
                                onClick={slideStore.toggleFullscreen}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 text-sm transition-colors"
                                title="Toggle fullscreen"
                            >
                                Fullscreen
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Main content */}
            <main className={`flex-1 flex flex-col items-center justify-center ${slideStore.isFullscreen ? 'p-0' : 'p-6'} overflow-hidden`}>
                <div
                    className={`${slideStore.isFullscreen ? '' : 'w-full max-w-7xl'} aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl relative slide-container`}
                    style={slideStore.isFullscreen ? {
                        aspectRatio: '16/9',
                        width: 'calc(100vh * 16 / 9)',
                        maxWidth: '100vw',
                        height: 'calc(100vw * 9 / 16)',
                        maxHeight: '100vh',
                        margin: '0 auto'
                    } : {}}
                >
                    {renderCurrentSlide()}
                </div>

                {/* Dialogue player */}
                <SlideAwareDialoguePlayer
                    key={`dialogue-player-slide-${slideStore.currentSlide}`}
                    floatingControls={slideStore.isFullscreen}
                    compact={true}
                    showTranscript={true}
                    showOnlyCurrent={true}
                    className={`mt-4 ${slideStore.isFullscreen ? 'fullscreen-dialogue' : ''}`}
                    style={{
                        position: 'relative',
                        bottom: slideStore.isFullscreen ? 'auto' : '0',
                        left: slideStore.isFullscreen ? 'auto' : '0',
                        height: '160px',
                        width: slideStore.isFullscreen ? '800px' : '100%',
                        margin: slideStore.isFullscreen ? '0 auto' : '0',
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(75, 85, 99, 0.5)'
                    }}
                />

                {/* Corner controls */}
                {slideStore.isFullscreen && slideStore.showControls && (
                    <div className="absolute top-4 right-4 flex gap-2 transition-opacity duration-300 opacity-70 hover:opacity-100">
                        <button
                            onClick={slideStore.previousSlide}
                            disabled={slideStore.isFirstSlide}
                            className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-opacity-90 transition-all"
                            title="Previous slide"
                        >
                            Previous
                        </button>
                        <button
                            onClick={slideStore.nextSlide}
                            disabled={slideStore.isLastSlide}
                            className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-opacity-90 transition-all"
                            title="Next slide"
                        >
                            Next
                        </button>
                        <button
                            onClick={audioStore.toggleMute}
                            className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full hover:bg-opacity-90 transition-all"
                            title={audioStore.isMuted ? "Unmute sounds" : "Mute sounds"}
                        >
                            {audioStore.isMuted ? "Unmute" : "Mute"}
                        </button>
                        <button
                            onClick={slideStore.toggleFullscreen}
                            className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full hover:bg-opacity-90 transition-all"
                            title="Exit fullscreen"
                        >
                            Exit
                        </button>
                    </div>
                )}
            </main>

            {/* Debug panel */}
            {slideStore.showDebug && (
                <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg z-50">
                    <h3 className="text-lg font-bold mb-2">Debug Panel</h3>
                    {/* Debug content */}
                </div>
            )}

            {/* Navigation controls - hide on Slide 0 or in fullscreen */}
            {slideStore.currentSlide > 0 && !slideStore.isFullscreen && (
                <div className="flex justify-center py-4 gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50"
                        onClick={slideStore.previousSlide}
                        disabled={slideStore.isFirstSlide}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50"
                        onClick={slideStore.nextSlide}
                        disabled={slideStore.isLastSlide}
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 rounded-md"
                        onClick={slideStore.toggleFullscreen}
                    >
                        Fullscreen
                    </button>
                </div>
            )}

            {/* Footer - hide on Slide 0 or in fullscreen */}
            {slideStore.currentSlide > 0 && !slideStore.isFullscreen && (
                <footer className="bg-gray-800 border-t border-gray-700 p-3 text-center text-gray-400 text-sm">
                    <p>Built with React, TypeScript, and Tailwind CSS</p>
                </footer>
            )}
        </div>
    );
});

export default AppContent; 
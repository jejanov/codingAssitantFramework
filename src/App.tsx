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
import { StoreProvider } from '@/stores/StoreContext';
import AppContent from '@/components/AppContent';

const App: React.FC = () => {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
};

export default App; 
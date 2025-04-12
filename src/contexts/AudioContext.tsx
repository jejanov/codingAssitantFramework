import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode, useRef } from 'react';
import useAudioEffects from '../hooks/useAudioEffects';

// Define the interface for our context
interface AudioContextType {
  // Current slide tracking
  currentSlide: number;
  setCurrentSlide: (slideIndex: number) => void;
  
  // Dialogue playback
  playDialogueForSlide: (slideIndex: number) => void;
  isDialoguePlaying: boolean;
  stopDialogue: () => void;
  
  // Audio status
  isMusicPlaying: boolean;
  
  // Volume control
  duckBackgroundAudio: () => void;
  restoreBackgroundAudio: () => void;
  
  // Mute controls
  toggleMute: () => void;
  isMuted: boolean;
}

// Create the context with a default undefined value
const GlobalAudioContext = createContext<AudioContextType | undefined>(undefined);

// Props for the provider component
interface AudioProviderProps {
  children: ReactNode;
}

/**
 * AudioProvider component that manages global audio state and coordination
 */
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  // Get audio effects hook
  const audioEffects = useAudioEffects();
  
  // State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isDialoguePlaying, setIsDialoguePlaying] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  
  // Store original volume for ducking/undocking
  const [preDialogueVolume, setPreDialogueVolume] = useState<number>(0.2); // Default background volume
  
  // Setup on mount
  useEffect(() => {
    // Get initial background volume when context mounts
    if (audioEffects) {
      setPreDialogueVolume(audioEffects.getBackgroundVolume());
    }
  }, [audioEffects]);
  
  // Duck background audio during dialogue
  const duckBackgroundAudio = useCallback(() => {
    if (!audioEffects) return;
    
    // Store the current volume before ducking
    setPreDialogueVolume(audioEffects.getBackgroundVolume());
    
    // Duck to 15% of original volume
    audioEffects.fadeBackgroundVolume(0.15, 500);
    console.log('Ducking background audio for dialogue');
  }, [audioEffects]);
  
  // Restore background audio after dialogue
  const restoreBackgroundAudio = useCallback(() => {
    if (!audioEffects) return;
    
    // Restore to pre-dialogue volume
    audioEffects.fadeBackgroundVolume(preDialogueVolume, 800);
    console.log(`Restoring background audio to volume: ${preDialogueVolume}`);
  }, [audioEffects, preDialogueVolume]);
  
  // Track the reason for slide changes to control autoplay
  const slideChangeReasonRef = useRef<'next'|'prev'|'direct'|'other'>('other');
  
  // Handle slide transitions
  const handleSlideChange = useCallback((newSlideIndex: number) => {
    // Don't do anything if trying to set to the same slide
    if (newSlideIndex === currentSlide) return;
    
    console.log(`Changing active slide from ${currentSlide} to ${newSlideIndex}, change reason: ${slideChangeReasonRef.current}`);
    
    // Update the current slide
    setCurrentSlide(newSlideIndex);
    
    // If dialogue is playing, stop it before changing slides
    if (isDialoguePlaying) {
      // This will be handled by the dialogue player itself via its unmount cleanup
      setIsDialoguePlaying(false);
    }
    
    // The SlideAwareDialoguePlayer will detect the slide change and update its content
    
    // Reset the slide change reason immediately after handling
    setTimeout(() => {
      slideChangeReasonRef.current = 'other';
    }, 10);
  }, [currentSlide, isDialoguePlaying]);
  
  // Play dialogue for a specific slide
  const playDialogueForSlide = useCallback((slideIndex: number) => {
    console.log(`Request to play dialogue for slide ${slideIndex}`);
    
    // Ensure we're on the correct slide first
    if (slideIndex !== currentSlide) {
      console.log(`Changing slide from ${currentSlide} to ${slideIndex} before playing dialogue`);
      handleSlideChange(slideIndex);
    }
    
    // The actual playback will be handled by the SlideAwareDialoguePlayer
    // via its slide change detection
    console.log(`Marking dialogue as playing for slide ${slideIndex}`);
    
    // Mark that dialogue is now playing
    setIsDialoguePlaying(true);
    
    // Duck background audio to make dialogue more audible
    console.log(`Ducking background audio for dialogue on slide ${slideIndex}`);
    duckBackgroundAudio();
  }, [currentSlide, handleSlideChange, duckBackgroundAudio]);
  
  // Stop dialogue playback
  const stopDialogue = useCallback(() => {
    // Only take action if dialogue is actually playing
    if (isDialoguePlaying) {
      console.log('Stopping dialogue playback');
      setIsDialoguePlaying(false);
      
      // Restore background audio when dialogue stops
      restoreBackgroundAudio();
    }
  }, [isDialoguePlaying, restoreBackgroundAudio]);
  
  // Toggle mute status
  const toggleMute = useCallback(() => {
    if (audioEffects) {
      audioEffects.toggleSilentMode();
    }
  }, [audioEffects]);
  
  // Track background audio play status
  useEffect(() => {
    if (!audioEffects) return;
    
    // Set up event handlers or polling mechanism to track audio state
    // For now, we'll just set it based on our best guess
    setIsMusicPlaying(!audioEffects.isSilentMode);
    
    // In a real implementation, we would set up listeners on the audio elements
    // to get accurate playing state
  }, [audioEffects]);
  
  // Create the context value object
  const contextValue: AudioContextType = {
    currentSlide,
    setCurrentSlide: handleSlideChange,
    playDialogueForSlide,
    isDialoguePlaying,
    stopDialogue,
    isMusicPlaying,
    duckBackgroundAudio,
    restoreBackgroundAudio,
    toggleMute,
    isMuted: audioEffects?.isSilentMode || false
  };
  
  // Create a ref to store the context instance
  const contextInstanceRef = useRef<any>({
    slideChangeReasonRef,
    // Add any other refs that need to be accessed directly
  });
  
  return (
    <GlobalAudioContext.Provider value={contextValue}>
      {/* Use a hidden div to expose the context instance to imperative code */}
      <div 
        data-audio-context="true" 
        ref={(el) => {
          if (el) {
            (el as any).__AUDIO_CONTEXT__ = contextInstanceRef.current;
          }
        }}
        style={{ display: 'none' }}
      />
      {children}
    </GlobalAudioContext.Provider>
  );
};

/**
 * Custom hook to use the audio context
 */
export const useGlobalAudio = (): AudioContextType => {
  const context = useContext(GlobalAudioContext);
  
  if (context === undefined) {
    throw new Error('useGlobalAudio must be used within an AudioProvider');
  }
  
  return context;
};

export default GlobalAudioContext;
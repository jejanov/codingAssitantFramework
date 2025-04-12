import React, { useEffect } from 'react';
import { useGlobalAudio } from '../../contexts/AudioContext';

interface SlideManagerProps {
  // Current slide index (0-based)
  currentSlideIndex: number;
  
  // React children
  children: React.ReactNode;
  
  // Whether to automatically play background music
  autoPlayBackgroundMusic?: boolean;
  
  // Whether to automatically play dialogue for new slides
  autoPlayDialogue?: boolean;
}

/**
 * SlideManager component that manages slide transitions and audio coordination
 * This should wrap the slide display component to provide audio coordination
 */
const SlideManager: React.FC<SlideManagerProps> = ({ 
  currentSlideIndex, 
  children,
  autoPlayBackgroundMusic = true,
  autoPlayDialogue = false
}) => {
  // Get global audio context
  const { 
    setCurrentSlide, 
    currentSlide,
    playDialogueForSlide
  } = useGlobalAudio();
  
  // Track if we've already initiated auto-play for this slide
  const autoPlayTriggeredRef = React.useRef<boolean>(false);

  // Update global slide index when our prop changes
  useEffect(() => {
    // Always update to ensure synchronization
    console.log(`SlideManager: Updating global slide from ${currentSlide} to ${currentSlideIndex}`);
    
    // Only update if different, to prevent unnecessary re-renders
    if (currentSlide !== currentSlideIndex) {
      setCurrentSlide(currentSlideIndex);
      // Reset the auto-play tracking when slide changes
      autoPlayTriggeredRef.current = false;
    }
    
    // Auto-play dialogue if enabled and not already triggered for this slide
    if (autoPlayDialogue && !autoPlayTriggeredRef.current) {
      console.log(`SlideManager: Auto-playing dialogue for slide ${currentSlideIndex}`);
      // Mark that we've triggered auto-play for this slide
      autoPlayTriggeredRef.current = true;
      playDialogueForSlide(currentSlideIndex);
    }
  }, [currentSlideIndex, currentSlide, setCurrentSlide, autoPlayDialogue, playDialogueForSlide]);
  
  // Simply render children - this is just a coordination component
  return <>{children}</>;
};

export default SlideManager;
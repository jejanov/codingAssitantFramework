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
  
  // Update global slide index when our prop changes
  useEffect(() => {
    // Always update to ensure synchronization
    console.log(`SlideManager: Updating global slide from ${currentSlide} to ${currentSlideIndex}`);
    setCurrentSlide(currentSlideIndex);
    
    // Auto-play dialogue if enabled
    if (autoPlayDialogue) {
      console.log(`SlideManager: Auto-playing dialogue for slide ${currentSlideIndex}`);
      playDialogueForSlide(currentSlideIndex);
    }
  }, [currentSlideIndex, currentSlide, setCurrentSlide, autoPlayDialogue, playDialogueForSlide]);
  
  // Simply render children - this is just a coordination component
  return <>{children}</>;
};

export default SlideManager;
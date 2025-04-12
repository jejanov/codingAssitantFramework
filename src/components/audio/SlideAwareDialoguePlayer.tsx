import React, { useState, useEffect, useCallback } from 'react';
import DialoguePlayer from '../slides/DialoguePlayer';
import { useGlobalAudio } from '../../contexts/AudioContext';

interface SlideAwareDialoguePlayerProps {
  // Optional override for current slide
  slideIndex?: number;
  
  // Whether to automatically play when slide changes
  autoPlayOnSlideChange?: boolean;
  
  // Whether to show a floating control interface
  floatingControls?: boolean;
  
  // Visual style options
  compact?: boolean;
  showTranscript?: boolean;
  
  // Whether to show only the current dialogue line (not the full history)
  showOnlyCurrent?: boolean;
  
  // Other props from DialoguePlayer
  highlightCurrentLine?: boolean;
  maxLines?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A slide-aware dialogue player that automatically loads the correct dialogue
 * for the current slide and coordinates with background audio.
 */
const SlideAwareDialoguePlayer: React.FC<SlideAwareDialoguePlayerProps> = ({
  slideIndex,
  autoPlayOnSlideChange = true,
  floatingControls = true,
  compact = true,
  showTranscript = true,
  showOnlyCurrent = false,
  highlightCurrentLine = true,
  maxLines = 0,
  className = '',
  style = {}
}) => {
  // Get global audio context
  const { 
    currentSlide, 
    isDialoguePlaying, 
    playDialogueForSlide, 
    stopDialogue,
    duckBackgroundAudio,
    restoreBackgroundAudio 
  } = useGlobalAudio();
  
  // Track which slide we're actively showing dialogue for
  // If slideIndex is passed, use that, otherwise use currentSlide from context
  // We need to force the activeSlide to update when props change
  const activeSlide = slideIndex !== undefined ? slideIndex : currentSlide;
  
  // Track if dialogue is available for the current slide
  const [hasDialogue, setHasDialogue] = useState<boolean>(true);
  
  // Track if metadata is currently loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Track metadata path for current slide
  const [metadataPath, setMetadataPath] = useState<string>('');
  
  // Log when the current slide or slideIndex changes
  useEffect(() => {
    console.log(`SlideAwareDialoguePlayer: Slide tracking info - currentSlide from context: ${currentSlide}, slideIndex from props: ${slideIndex}, activeSlide: ${activeSlide}`);
  }, [currentSlide, slideIndex, activeSlide]);
  
  // Construct the metadata path based on active slide
  useEffect(() => {
    // Format the slide number with leading zero
    const formattedSlide = activeSlide.toString().padStart(2, '0');
    
    // Set the appropriate metadata path - consistent format for all slides
    const newPath = `/sounds/dialogue/slide${formattedSlide}/metadata.json`;
    
    console.log(`Setting metadata path for slide ${activeSlide} to: ${newPath}`);
    setMetadataPath(newPath);
    
    // Reset loading state
    setIsLoading(true);
    
    // Check if dialogue exists for this slide by trying to fetch metadata
    const fullUrl = `${window.location.origin}${newPath}`;
    console.log(`Checking for dialogue at: ${fullUrl}`);
    
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          console.error(`Failed to fetch metadata from ${fullUrl} - Status: ${response.status}`);
          throw new Error(`No dialogue available for slide ${activeSlide}`);
        }
        console.log(`Metadata found for slide ${activeSlide}`);
        return response.json();
      })
      .then(data => {
        // If we get here, dialogue exists
        console.log(`Dialogue data for slide ${activeSlide}:`, data);
        
        // Verify that we actually have audio files
        if (!data.audioFiles || data.audioFiles.length === 0) {
          console.warn(`Metadata exists but contains no audio files for slide ${activeSlide}`);
          setHasDialogue(false);
          setIsLoading(false);
          return;
        }
        
        setHasDialogue(true);
        setIsLoading(false);
        
        // Auto-play if enabled
        if (autoPlayOnSlideChange) {
          console.log(`Auto-play enabled for slide ${activeSlide}, initiating playback`);
          playDialogueForSlide(activeSlide);
        } else {
          console.log(`Auto-play disabled for slide ${activeSlide}, waiting for user to initiate playback`);
        }
      })
      .catch(error => {
        console.warn(`No dialogue found for slide ${activeSlide}:`, error);
        setHasDialogue(false);
        setIsLoading(false);
      });
  }, [activeSlide, autoPlayOnSlideChange, playDialogueForSlide]);
  
  // Handle dialogue play
  const handlePlay = useCallback(() => {
    console.log(`SlideAwareDialoguePlayer: Starting dialogue for slide ${activeSlide}`);
    
    // Notify global context that dialogue is playing
    playDialogueForSlide(activeSlide);
    
    // Duck background audio
    duckBackgroundAudio();
    
    // Debug log - confirm that the player is being triggered
    console.log('Dialogue playback triggered - ducking background audio');
  }, [activeSlide, playDialogueForSlide, duckBackgroundAudio]);
  
  // Handle dialogue pause
  const handlePause = useCallback(() => {
    console.log(`SlideAwareDialoguePlayer: Pausing dialogue for slide ${activeSlide}`);
    
    // We don't stop dialogue on pause, just let it stay in the paused state
    // Could modify this behavior if needed
  }, [activeSlide]);
  
  // Handle dialogue complete
  const handleComplete = useCallback(() => {
    console.log(`SlideAwareDialoguePlayer: Dialogue complete for slide ${activeSlide}`);
    
    // Notify global context that dialogue has finished
    stopDialogue();
    
    // Note: restoreBackgroundAudio is already called inside stopDialogue in the context
  }, [activeSlide, stopDialogue]);
  
  // Define container style based on props
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '120px',
    right: '40px',
    width: '800px',
    height: '300px', // Fixed height
    zIndex: 9999,
    overflow: 'hidden', // Prevent content from overflowing
    ...style
  };
  
  // Add an effect to manually trigger play if needed
  useEffect(() => {
    // Skip if we're still loading or have no dialogue
    if (isLoading || !hasDialogue) {
      return;
    }
    
    // For debugging - always show if we found dialogue
    console.log(`SlideAwareDialoguePlayer: Slide ${activeSlide} has dialogue and is ready!`);
    
    // Special case for slide 3 - always try to play
    if (activeSlide === 3) {
      console.log(`SlideAwareDialoguePlayer: Slide 3 detected, forcing playback!`);
      const timer = setTimeout(() => {
        console.log(`SlideAwareDialoguePlayer: Playing slide 3 dialogue now!`);
        handlePlay();
      }, 1000); // Short delay
      return () => clearTimeout(timer);
    }
    
    // This is a backup mechanism for cases where DialoguePlayer's autoPlay doesn't work
    if (autoPlayOnSlideChange) {
      console.log(`SlideAwareDialoguePlayer: Setting up fallback autoplay timer for slide ${activeSlide}`);
      
      const timer = setTimeout(() => {
        console.log(`SlideAwareDialoguePlayer: Attempting fallback autoplay for slide ${activeSlide}`);
        handlePlay();
      }, 1000); // Give the component time to mount and initialize
      
      return () => clearTimeout(timer);
    } else {
      console.log(`SlideAwareDialoguePlayer: Autoplay disabled for slide ${activeSlide} with dialogue`);
    }
  }, [hasDialogue, isLoading, autoPlayOnSlideChange, activeSlide, handlePlay]);

  console.log(`SlideAwareDialoguePlayer: Rendering with state - activeSlide: ${activeSlide}, isLoading: ${isLoading}, hasDialogue: ${hasDialogue}, metadataPath: ${metadataPath}`);
  
  return (
    <>
      {/* Only render DialoguePlayer if we have dialogue for this slide */}
      {hasDialogue && !isLoading && (
        <div style={containerStyle} className={className}>
          <DialoguePlayer
            metadataPath={metadataPath}
            autoPlay={autoPlayOnSlideChange}
            showTranscript={showTranscript}
            highlightCurrentLine={highlightCurrentLine}
            compact={compact}
            minPauseDuration={500}
            maxPauseDuration={1500}
            showTextOnlyLabel={false}
            floatingControls={floatingControls}
            maxLines={maxLines}
            onComplete={handleComplete}
            onPlay={handlePlay}
            onPause={handlePause}
            showOnlyCurrent={showOnlyCurrent}
          />
        </div>
      )}
      
      {/* Render placeholder for non-floating controls when dialogue isn't available */}
      {(!hasDialogue || isLoading) && !floatingControls && (
        <div className={`p-2 text-xs text-gray-400 ${className}`} style={style}>
          {isLoading ? "Loading dialogue..." : "No dialogue available for this slide."}
        </div>
      )}
    </>
  );
};

export default SlideAwareDialoguePlayer;
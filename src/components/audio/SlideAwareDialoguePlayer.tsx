import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useAudioStore, useSlideStore, useDialogueStore } from '../../stores/StoreContext';
import DialoguePlayerMobX from '../slides/DialoguePlayerMobX';

interface SlideAwareDialoguePlayerProps {
  floatingControls?: boolean;
  compact?: boolean;
  showTranscript?: boolean;
  showOnlyCurrent?: boolean;
  highlightCurrentLine?: boolean;
  maxLines?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SlideAwareDialoguePlayer = observer((props: SlideAwareDialoguePlayerProps) => {
  const slideStore = useSlideStore();
  const audioStore = useAudioStore();
  const dialogueStore = useDialogueStore();

  // Set metadata path when slide changes
  useEffect(() => {
    console.log(`Slide Change Detected - Loading metadata for slide ${slideStore.currentSlide}`);

    // Format the slide number with leading zero
    const formattedSlide = slideStore.currentSlide.toString().padStart(2, '0');

    // Construct the path for the current slide
    const path = `/sounds/dialogue/slide${formattedSlide}/slide${formattedSlide}-metadata.json`;

    console.log(`Setting metadata path for slide ${slideStore.currentSlide} to: ${path}`);

    // Set the new path - this will trigger the dialogue store to load the metadata
    dialogueStore.setMetadataPath(path);

  }, [slideStore.currentSlide, dialogueStore]);

  // Attempt auto-play when state changes
  useEffect(() => {
    dialogueStore.attemptAutoPlay();

    // Log auto-play conditions for debugging
    if (audioStore.shouldAutoPlayDialogue) {
      console.log('Auto-play conditions met:',
        'hasDialogue:', dialogueStore.hasDialogue,
        'isLoading:', dialogueStore.isLoading,
        'hasAutoPlayed:', dialogueStore.hasAutoPlayed,
        'slideChangeReason:', slideStore.slideChangeReason
      );
    }
  }, [
    dialogueStore,
    audioStore.shouldAutoPlayDialogue,
    dialogueStore.metadata,
    dialogueStore.hasAutoPlayed,
    slideStore.slideChangeReason
  ]);

  // Special effect to force dialogue playback when it becomes available
  useEffect(() => {
    // When dialogue becomes available but hasn't started playing yet
    if (dialogueStore.hasDialogue && !dialogueStore.isPlaying && !dialogueStore.hasAutoPlayed) {
      console.log('Dialogue is available but not playing - forcing playback');

      // Short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Force reason to 'next' to enable auto-play
        slideStore.slideChangeReason = 'next';

        // Reset auto-played flag and try again
        dialogueStore.hasAutoPlayed = false;
        dialogueStore.attemptAutoPlay();

        // As fallback, try direct playback after a moment
        setTimeout(() => {
          if (!dialogueStore.isPlaying) {
            console.log('Fallback: Directly starting dialogue playback');
            dialogueStore.playDialogue();
          }
        }, 500);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [dialogueStore.hasDialogue, dialogueStore.isPlaying, dialogueStore]);

  // Define container style with props
  const containerStyle: React.CSSProperties = {
    // Only use these defaults if position isn't specified in style
    ...(props.style?.position ? {} : {
      position: 'fixed',
      bottom: '120px',
      right: '40px',
    }),
    // Ensure we have width and height if not provided
    width: props.style?.width || '800px',
    height: props.style?.height || '160px',
    overflow: 'hidden',
    zIndex: props.style?.zIndex || 9999,
    // Merge with passed style
    ...props.style
  };

  console.log(`SlideAwareDialoguePlayer: Rendering with state - currentSlide: ${slideStore.currentSlide}, isLoading: ${dialogueStore.isLoading}, hasDialogue: ${dialogueStore.hasDialogue}`);

  return (
    <div style={containerStyle} className={props.className}>
      {dialogueStore.hasDialogue && !dialogueStore.isLoading ? (
        <DialoguePlayerMobX
          metadataPath={dialogueStore.metadataPath}
          autoPlay={audioStore.shouldAutoPlayDialogue}
          showTranscript={props.showTranscript}
          highlightCurrentLine={props.highlightCurrentLine}
          compact={props.compact}
          minPauseDuration={500}
          maxPauseDuration={1500}
          showTextOnlyLabel={false}
          floatingControls={props.floatingControls}
          maxLines={props.maxLines}
          onComplete={() => dialogueStore.completePlayback()}
          onPlay={() => dialogueStore.playDialogue()}
          onPause={() => { }} // Keep empty handler
          showOnlyCurrent={props.showOnlyCurrent}
        />
      ) : (
        !props.floatingControls && (
          <div className="p-2 text-xs text-gray-400">
            {dialogueStore.isLoading ? "Loading dialogue..." : (
              <>
                {dialogueStore.hasDialogue && !dialogueStore.isPlaying ? (
                  <div className="flex flex-col items-center">
                    <p className="mb-2">Dialogue ready but not playing.</p>
                    <button
                      onClick={() => dialogueStore.playDialogue()}
                      className="px-3 py-1 bg-blue-600 rounded text-white"
                    >
                      Play Dialogue Manually
                    </button>
                  </div>
                ) : "No dialogue available for this slide."}
              </>
            )}
          </div>
        )
      )}
    </div>
  );
});

export default SlideAwareDialoguePlayer;
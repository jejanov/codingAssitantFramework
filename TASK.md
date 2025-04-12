# Multi-Slide Audio System Improvement Plan

This document outlines the plan for improving the audio system to support dialogue across all slides with background music and sound effects playing simultaneously.

## Current Architecture Analysis

1. **Audio System Components**:
   - `useAudioEffects.ts` hook - Manages all audio (background, sound effects)
   - `DialoguePlayer.tsx` - Handles dialogue playback
   - `Slide03.tsx` - Currently has dialogue integration

2. **Current Limitations**:
   - Dialogue is only integrated with Slide03
   - Background audio stops when dialogue plays (mutually exclusive)
   - No slide awareness in DialoguePlayer
   - No automatic slide transition detection
   - Dialogue files organization doesn't support multiple slides

3. **Technical Challenges**:
   - Audio ducking not implemented (lowering background volume during dialogue)
   - No coordination between audio systems
   - Missing lifecycle management for audio across slide transitions

## Implementation Plan

### Phase 1: Infrastructure Setup

- [x] Create the AudioContext for global audio state
  - [x] Implement context provider with slide tracking
    - [x] Create AudioProvider component
    - [x] Implement useGlobalAudio hook
  - [x] Add audio state management (playing/paused/muted)
    - [x] Track dialogue playback state
    - [x] Add mute controls via existing useAudioEffects
    - [x] Track background music state
  - [x] Create slide transition detection logic
    - [x] Add slide change handling 
    - [x] Add dialogue start/stop functionality
    - [x] Implement background audio ducking during dialogue

- [ ] Update useAudioEffects with enhanced functionality
  - [x] Implement stopBackgroundAmbience function
  - [x] Add volume control functions
    - [x] Implement setBackgroundVolume function
    - [x] Implement getBackgroundVolume function
    - [x] Add volume state tracking with volumeSettingsRef
  - [x] Create audio ducking capabilities 
    - [x] Implement fadeBackgroundVolume function
    - [x] Support smooth transitions between volume levels
  - [x] Add audio fade in/out transitions
    - [x] Update toggleSilentMode to use fading
    - [x] Update playSpecificBackgroundAudio with cross-fading

- [x] Set up folder structure for multi-slide dialogue
  - [x] Create slide-specific dialogue folders
    - [x] Create folders for slide00, slide01, slide02, and slide03
  - [x] Define metadata structure for each slide
    - [x] Create metadata.json files with consistent format
    - [x] Update paths to use proper format with leading slashes
  - [x] Organize audio files by slide
    - [x] Create slide-specific dialogue references in metadata

### Phase 2: Enhanced Components

- [x] Build the SlideAwareDialoguePlayer
  - [x] Make DialoguePlayer work with any slide
    - [x] Create slide-aware component that wraps DialoguePlayer
    - [x] Add automatic slide-specific dialogue path construction
  - [x] Add slide change detection
    - [x] Listen to global slide context changes
    - [x] Update dialogue playback on slide change
  - [x] Implement proper metadata path construction
    - [x] Format slide numbers with padStart
    - [x] Build correct path to slide-specific metadata
  - [x] Handle missing dialogue gracefully
    - [x] Detect missing dialogue files
    - [x] Hide player when no dialogue is available

- [x] Implement the SlideManager component
  - [x] Create slide transition management
    - [x] Track current slide index
    - [x] Update global slide context
  - [x] Add audio coordination on slide change
    - [x] Connect to global audio context
    - [x] Support auto-play options
  - [x] Implement cleanup for previous slide audio
    - [x] Proper handling in global audio context

- [x] Update AudioProvider with advanced features
  - [x] Implement background audio ducking during dialogue
    - [x] Add duckBackgroundAudio function
    - [x] Add restoreBackgroundAudio function
  - [x] Add audio coordination
    - [x] Connect ducking with dialogue playback
    - [x] Track pre-ducking volume levels
  - [x] Create global mute/unmute functionality
    - [x] Connect to existing useAudioEffects
  - [x] Add audio state tracking
    - [x] Track current slide
    - [x] Track dialogue playing status

### Phase 3: Integration

- [x] Integrate with App.tsx
  - [x] Add AudioProvider at app root
    - [x] Wrap the app with AudioProvider
    - [x] Keep legacy AudioContext for backward compatibility
  - [x] Implement SlideManager
    - [x] Wrap slides with SlideManager
    - [x] Connect current slide state
  - [x] Add global SlideAwareDialoguePlayer
    - [x] Add component inside the slide container
    - [x] Configure with proper settings
  
- [ ] Refactor existing slides
  - [ ] Update Slide03 to use new system (instead of direct DialoguePlayer)
  - [ ] Add dialogue support to all slides
  - [ ] Implement proper audio coordination

- [ ] Test with multiple slides
  - [ ] Verify slide transitions
  - [ ] Test audio coordination
  - [ ] Validate background music continues during dialogue

### Phase 4: Dialogue Content Creation

- [ ] Create metadata and dialogue files for each slide
  - [ ] Slide00 dialogue content
  - [ ] Slide01 dialogue content
  - [ ] Slide02 dialogue content
  - [ ] Slide03 dialogue content (update existing)

- [ ] Final testing and refinement
  - [ ] Test slide transitions
  - [ ] Verify dialogue auto-playing
  - [ ] Ensure proper audio mixing
  - [ ] Validate performance

## Technical Details

### Global Audio Context Structure

```tsx
// src/contexts/AudioContext.tsx
interface AudioContextType {
  currentSlide: number;
  setCurrentSlide: (slideIndex: number) => void;
  playDialogueForSlide: (slideIndex: number) => void;
  isDialoguePlaying: boolean;
  isMusicPlaying: boolean;
  toggleMute: () => void;
  isMuted: boolean;
}
```

### SlideAwareDialoguePlayer Component

```tsx
// src/components/audio/SlideAwareDialoguePlayer.tsx
interface SlideAwareDialoguePlayerProps {
  slideIndex?: number;
  autoPlayOnSlideChange?: boolean;
  // Other props from original DialoguePlayer
}
```

### Enhanced useAudioEffects Hook

```tsx
// New functions to add to useAudioEffects
const setBackgroundVolume = useCallback((level: number) => {
  // Implement volume control with smooth transitions
});

// Return the new function in the interface
return {
  // Existing functions...
  setBackgroundVolume,
};
```

### Dialogue File Structure

```
public/
  sounds/
    dialogue/
      slide00/
        metadata.json
        dialogue-00.json
        dialogue-01.json
      slide01/
        metadata.json
        dialogue-00.json
        dialogue-01.json
      slide02/
        metadata.json
        dialogue-00.json
        dialogue-01.json
      slide03/
        metadata.json
        dialogue-00.json
        dialogue-01.json
```
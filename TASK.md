# MobX Integration Plan

## Phase 1: Setup and Initial Store Creation

### 1.1 Install MobX and Supporting Libraries
- [x] Install MobX core libraries
  ```bash
  npm install mobx mobx-react-lite
  ```
- [x] Install additional utilities (optional)
  ```bash
  npm install mobx-utils mobx-state-tree
  ```
- [x] Configure TypeScript decorators (if needed)
  - Update tsconfig.json with:
    ```json
    {
      "compilerOptions": {
        "experimentalDecorators": true,
        "useDefineForClassFields": true
      }
    }
    ```

### 1.2 Create Store Structure
- [x] Create `/src/stores` directory
- [x] Create root store file `/src/stores/RootStore.ts`
- [x] Create store context provider `/src/stores/StoreContext.tsx`
- [x] Create initial key stores:
  - `/src/stores/AudioStore.ts` - handles all audio-related state
  - `/src/stores/SlideStore.ts` - manages slide navigation and state
  - `/src/stores/DialogueStore.ts` - dialogue-specific functionality

## Phase 2: Store Implementation

### 2.1 Define AudioStore
- [x] Create centralized store for all audio-related state:
  ```typescript
  // src/stores/AudioStore.ts
  import { makeAutoObservable, runInAction } from 'mobx';

  export class AudioStore {
    // Background audio
    isMusicPlaying = false;
    isMuted = false;
    backgroundVolume = 0.2;
    defaultBackgroundVolume = 0.2;
    
    // Dialogue state
    isDialoguePlaying = false;
    currentDialoguePath = '';
    dialogueMetadata = null;
    isDialogueLoading = false;
    hasDialogueForCurrentSlide = false;
    playbackCompleted = false;
    
    // Audio refs (non-observable)
    audioRefs = {
      keyboardSound: null,
      panelSlideSound: null,
      popSound: null,
      successSound: null,
      ambienceSound: null
    };
    
    // Web Audio API context (non-observable)
    webAudioContext = null;
    fadeIntervalId = null;
    
    constructor(rootStore) {
      this.rootStore = rootStore;
      makeAutoObservable(this, { 
        rootStore: false,
        audioRefs: false,
        webAudioContext: false,
        fadeIntervalId: false,
        initializeAudio: false
      });
    }
    
    // Initialization - called once on component mount
    initializeAudio = () => {
      try {
        console.log('Initializing audio effects...');
        const baseUrl = window.location.origin;
        
        // Create audio elements
        this.audioRefs.keyboardSound = new Audio(`${baseUrl}/sounds/keyboard-typing.mp3`);
        this.audioRefs.keyboardSound.volume = 0.5;
        
        this.audioRefs.panelSlideSound = new Audio(`${baseUrl}/sounds/whoosh.mp3`);
        this.audioRefs.panelSlideSound.volume = 0.5;
        
        this.audioRefs.popSound = new Audio(`${baseUrl}/sounds/pop.mp3`);
        this.audioRefs.popSound.volume = 0.5;
        
        this.audioRefs.successSound = new Audio(`${baseUrl}/sounds/success.mp3`);
        this.audioRefs.successSound.volume = 0.5;
        
        // Background ambience
        this.audioRefs.ambienceSound = new Audio(`${baseUrl}/audio/cool-hip-hop-loop-275527.mp3`);
        this.audioRefs.ambienceSound.volume = this.backgroundVolume;
        this.audioRefs.ambienceSound.loop = true;
        
        // Preload all sounds
        this.audioRefs.keyboardSound.load();
        this.audioRefs.panelSlideSound.load();
        this.audioRefs.popSound.load();
        this.audioRefs.successSound.load();
        this.audioRefs.ambienceSound.load();
        
        console.log('✅ Audio elements created successfully');
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    }
    
    // Audio control actions
    toggleMute = () => {
      this.isMuted = !this.isMuted;
      
      if (this.isMuted) {
        // Save current volume before muting
        const currentVolume = this.backgroundVolume;
        
        // Fade out then pause
        this.fadeBackgroundVolume(0, 300);
        
        setTimeout(() => {
          if (this.audioRefs.ambienceSound) {
            this.audioRefs.ambienceSound.pause();
            // Restore volume setting but don't apply (audio is paused)
            runInAction(() => {
              this.backgroundVolume = currentVolume;
            });
          }
        }, 350);
      } else {
        // Unmuting - restart ambient sound with fade-in
        if (this.audioRefs.ambienceSound) {
          this.audioRefs.ambienceSound.volume = 0;
          
          this.audioRefs.ambienceSound.play()
            .then(() => {
              this.fadeBackgroundVolume(this.backgroundVolume, 500);
              console.log('Background ambience restarted with fade-in');
            })
            .catch(e => {
              console.warn('Could not autoplay ambient sound on unmute:', e);
              if (this.audioRefs.ambienceSound) {
                this.audioRefs.ambienceSound.volume = this.backgroundVolume;
              }
            });
        }
      }
    }
    
    playBackgroundMusic = () => {
      if (this.isMuted || !this.audioRefs.ambienceSound) return;
      
      // Reset in case it was stopped
      this.audioRefs.ambienceSound.currentTime = 0;
      
      // Set volume
      this.audioRefs.ambienceSound.volume = this.backgroundVolume;
      
      // Play with error handling
      this.audioRefs.ambienceSound.play()
        .then(() => {
          runInAction(() => {
            this.isMusicPlaying = true;
          });
          console.log('Background ambience started successfully');
        })
        .catch(e => {
          console.warn('Error playing background ambience:', e);
        });
    }
    
    stopBackgroundMusic = () => {
      try {
        if (this.audioRefs.ambienceSound) {
          this.audioRefs.ambienceSound.pause();
          this.audioRefs.ambienceSound.currentTime = 0;
          this.isMusicPlaying = false;
        }
      } catch (error) {
        console.error('Error in stopBackgroundAmbience:', error);
      }
    }
    
    duckBackgroundAudio = () => {
      // Store current volume before ducking
      const preDialogueVolume = this.backgroundVolume;
      
      // Duck to 15% of original volume
      this.fadeBackgroundVolume(0.15 * this.defaultBackgroundVolume, 500);
    }
    
    restoreBackgroundAudio = () => {
      // Restore to default volume
      this.fadeBackgroundVolume(this.defaultBackgroundVolume, 800);
    }
    
    // Volume control
    setBackgroundVolume = (volume) => {
      try {
        // Ensure volume is between 0 and 1
        const safeVolume = Math.max(0, Math.min(1, volume));
        
        // Set observable state
        this.backgroundVolume = safeVolume;
        
        // Apply to audio element
        if (this.audioRefs.ambienceSound) {
          this.audioRefs.ambienceSound.volume = safeVolume;
        }
      } catch (error) {
        console.error('Error in setBackgroundVolume:', error);
      }
    }
    
    fadeBackgroundVolume = (targetVolume, durationMs = 1000) => {
      try {
        // Clear any existing fade interval
        if (this.fadeIntervalId !== null) {
          window.clearInterval(this.fadeIntervalId);
          this.fadeIntervalId = null;
        }
        
        // Ensure target volume is between 0 and 1
        const safeTargetVolume = Math.max(0, Math.min(1, targetVolume));
        
        // If no ambience sound or muted, just update the state immediately
        if (!this.audioRefs.ambienceSound || this.isMuted) {
          this.backgroundVolume = safeTargetVolume;
          return;
        }
        
        // Get current volume
        const startVolume = this.audioRefs.ambienceSound.volume;
        
        // If the target is the same as current, no need to fade
        if (Math.abs(startVolume - safeTargetVolume) < 0.01) {
          return;
        }
        
        // Set up the fade
        const stepCount = Math.max(5, Math.floor(durationMs / 50));
        const volumeChangePerStep = (safeTargetVolume - startVolume) / stepCount;
        const intervalMs = Math.floor(durationMs / stepCount);
        
        let currentStep = 0;
        
        // Start the interval
        this.fadeIntervalId = window.setInterval(() => {
          if (!this.audioRefs.ambienceSound) {
            if (this.fadeIntervalId !== null) {
              window.clearInterval(this.fadeIntervalId);
              this.fadeIntervalId = null;
            }
            return;
          }
          
          currentStep++;
          
          // Calculate new volume
          const newVolume = startVolume + (volumeChangePerStep * currentStep);
          
          // Apply to audio element
          this.audioRefs.ambienceSound.volume = newVolume;
          
          // Update observable state
          runInAction(() => {
            this.backgroundVolume = newVolume;
          });
          
          // Check if we're done
          if (currentStep >= stepCount) {
            // Final adjustment to ensure we hit the exact target
            if (this.audioRefs.ambienceSound) {
              this.audioRefs.ambienceSound.volume = safeTargetVolume;
            }
            
            runInAction(() => {
              this.backgroundVolume = safeTargetVolume;
            });
            
            // Clear the interval
            if (this.fadeIntervalId !== null) {
              window.clearInterval(this.fadeIntervalId);
              this.fadeIntervalId = null;
            }
          }
        }, intervalMs);
      } catch (error) {
        console.error('Error in fadeBackgroundVolume:', error);
        if (this.fadeIntervalId !== null) {
          window.clearInterval(this.fadeIntervalId);
          this.fadeIntervalId = null;
        }
      }
    }
    
    // Sound effects
    playTypingSound = () => {
      if (this.isMuted || !this.audioRefs.keyboardSound) return;
      
      try {
        if (this.audioRefs.keyboardSound.readyState >= 2) {
          if (this.audioRefs.keyboardSound.ended || this.audioRefs.keyboardSound.paused) {
            this.audioRefs.keyboardSound.currentTime = 0;
            this.audioRefs.keyboardSound.play().catch(e => {
              console.warn('Could not play keyboard sound:', e);
            });
          }
        }
      } catch (error) {
        console.warn('Error in playTypingSound:', error);
      }
    }
    
    playWhooshSound = () => {
      if (this.isMuted || !this.audioRefs.panelSlideSound) return;
      
      try {
        if (this.audioRefs.panelSlideSound.readyState >= 2) {
          this.audioRefs.panelSlideSound.currentTime = 0;
          this.audioRefs.panelSlideSound.play().catch(e => {
            console.warn('Could not play whoosh sound:', e);
          });
        }
      } catch (error) {
        console.warn('Error in playWhooshSound:', error);
      }
    }
    
    playPopSound = () => {
      if (this.isMuted || !this.audioRefs.popSound) return;
      
      try {
        if (this.audioRefs.popSound.readyState >= 2) {
          this.audioRefs.popSound.currentTime = 0;
          this.audioRefs.popSound.play().catch(e => {
            console.warn('Could not play pop sound:', e);
          });
        }
      } catch (error) {
        console.warn('Error in playPopSound:', error);
      }
    }
    
    playSuccessSound = () => {
      if (this.isMuted || !this.audioRefs.successSound) return;
      
      try {
        if (this.audioRefs.successSound.readyState >= 2) {
          this.audioRefs.successSound.currentTime = 0;
          this.audioRefs.successSound.play().catch(e => {
            console.warn('Could not play success sound:', e);
          });
        }
      } catch (error) {
        console.warn('Error in playSuccessSound:', error);
      }
    }
    
    // Dialogue-specific actions
    loadDialogueForSlide = async (slideIndex) => {
      this.isDialogueLoading = true;
      this.hasDialogueForCurrentSlide = false;
      
      const formattedSlide = slideIndex.toString().padStart(2, '0');
      const path = `/sounds/dialogue/slide${formattedSlide}/slide${formattedSlide}-metadata.json`;
      
      try {
        const fullUrl = `${window.location.origin}${path}`;
        console.log(`Checking for dialogue at: ${fullUrl}`);
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`No dialogue available for slide ${slideIndex}`);
        }
        
        const data = await response.json();
        
        // Verify that we actually have audio files
        if (!data.audioFiles || data.audioFiles.length === 0) {
          console.warn(`Metadata exists but contains no audio files for slide ${slideIndex}`);
          runInAction(() => {
            this.hasDialogueForCurrentSlide = false;
            this.dialogueMetadata = null;
            this.isDialogueLoading = false;
          });
          return;
        }
        
        // Use runInAction for batch updates from async code
        runInAction(() => {
          this.dialogueMetadata = data;
          this.currentDialoguePath = path;
          this.hasDialogueForCurrentSlide = true;
          this.playbackCompleted = false;
          this.isDialogueLoading = false;
        });
        
        console.log(`Dialogue loaded for slide ${slideIndex}`);
      } catch (error) {
        console.warn(`No dialogue found for slide ${slideIndex}:`, error);
        runInAction(() => {
          this.hasDialogueForCurrentSlide = false;
          this.dialogueMetadata = null;
          this.isDialogueLoading = false;
        });
      }
    }
    
    playDialogue = () => {
      this.isDialoguePlaying = true;
      this.duckBackgroundAudio();
    }
    
    stopDialogue = () => {
      this.isDialoguePlaying = false;
      this.restoreBackgroundAudio();
    }
    
    completeDialogue = () => {
      this.playbackCompleted = true;
      this.stopDialogue();
    }
    
    // Cleanup function to be called on app unmount
    cleanup = () => {
      // Clear any running fade interval
      if (this.fadeIntervalId !== null) {
        window.clearInterval(this.fadeIntervalId);
        this.fadeIntervalId = null;
      }
      
      // Stop and clear all audio
      try {
        if (this.audioRefs.ambienceSound) {
          this.audioRefs.ambienceSound.pause();
          this.audioRefs.ambienceSound.src = '';
        }
        
        if (this.audioRefs.keyboardSound) {
          this.audioRefs.keyboardSound.pause();
          this.audioRefs.keyboardSound.src = '';
        }
        
        if (this.audioRefs.panelSlideSound) {
          this.audioRefs.panelSlideSound.pause();
          this.audioRefs.panelSlideSound.src = '';
        }
        
        if (this.audioRefs.popSound) {
          this.audioRefs.popSound.pause();
          this.audioRefs.popSound.src = '';
        }
        
        if (this.audioRefs.successSound) {
          this.audioRefs.successSound.pause();
          this.audioRefs.successSound.src = '';
        }
        
        console.log('Audio resources cleaned up');
      } catch (error) {
        console.error('Error cleaning up audio:', error);
      }
    }
    
    // Computed values
    get shouldAutoPlayDialogue() {
      return this.hasDialogueForCurrentSlide && 
             !this.isDialogueLoading && 
             !this.playbackCompleted &&
             this.rootStore.slideStore.slideChangeReason === 'next';
    }
  }
  ```

### 2.2 Define SlideStore
- [x] Create store for slide navigation:
  ```typescript
  // src/stores/SlideStore.ts
  import { makeAutoObservable, reaction } from 'mobx';

  export class SlideStore {
    currentSlide = 0;
    totalSlides = 3; // Update with actual count
    slideChangeReason = 'other'; // 'next', 'prev', 'direct', 'other'
    isFullscreen = false;
    showControls = false;
    contentScale = 1;
    showDebug = false;
    controlsTimeoutId = null;
    
    constructor(rootStore) {
      this.rootStore = rootStore;
      makeAutoObservable(this, { 
        rootStore: false,
        controlsTimeoutId: false
      });
      
      // Set up reaction to load dialogue when slide changes
      reaction(
        () => this.currentSlide,
        (newSlide) => {
          // Load dialogue for the new slide
          this.rootStore.audioStore.loadDialogueForSlide(newSlide);
        }
      );
    }
    
    // Actions
    navigateToSlide = (slideNumber, reason = 'direct') => {
      if (slideNumber >= 0 && slideNumber <= this.totalSlides) {
        // Update slide change reason first
        this.slideChangeReason = reason;
        
        // Then update current slide
        this.currentSlide = slideNumber;
      }
    }
    
    nextSlide = () => {
      if (this.currentSlide < this.totalSlides) {
        this.navigateToSlide(this.currentSlide + 1, 'next');
      }
    }
    
    previousSlide = () => {
      if (this.currentSlide > 0) {
        this.navigateToSlide(this.currentSlide - 1, 'prev');
      }
    }
    
    toggleFullscreen = () => {
      try {
        const container = document.querySelector('[data-fullscreen-container]');
        
        if (!document.fullscreenElement) {
          if (container && container.requestFullscreen) {
            container.requestFullscreen().catch(err => {
              console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      } catch (error) {
        console.error('Error toggling fullscreen:', error);
      }
    }
    
    handleFullscreenChange = () => {
      this.isFullscreen = !!document.fullscreenElement;
    }
    
    showControlsTemporarily = () => {
      // Only update state if controls aren't already visible
      if (!this.showControls) {
        this.showControls = true;
      }
      
      // Clear any existing timeout
      if (this.controlsTimeoutId) {
        window.clearTimeout(this.controlsTimeoutId);
      }
      
      // Set new timeout to hide controls
      this.controlsTimeoutId = window.setTimeout(() => {
        this.showControls = false;
      }, 2000);
    }
    
    toggleDebug = () => {
      this.showDebug = !this.showDebug;
    }
    
    // Scale management
    calculateResponsiveScale = () => {
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
      this.setContentScale(newScale);
    }
    
    setContentScale = (scale) => {
      this.contentScale = scale;
      
      // Apply scale as CSS variable to document root
      document.documentElement.style.setProperty('--content-scale', scale.toString());
    }
    
    // Cleanup function
    cleanup = () => {
      if (this.controlsTimeoutId) {
        window.clearTimeout(this.controlsTimeoutId);
        this.controlsTimeoutId = null;
      }
    }
    
    // Computed values
    get isFirstSlide() {
      return this.currentSlide === 0;
    }
    
    get isLastSlide() {
      return this.currentSlide === this.totalSlides;
    }
  }
  ```

### 2.3 Define DialogueStore
- [x] Create store for dialogue state and coordination:
  ```typescript
  // src/stores/DialogueStore.ts
  import { makeAutoObservable, reaction, runInAction } from 'mobx';

  export class DialogueStore {
    // Current line tracking
    currentLineIndex = -1;
    isPlaying = false;
    metadata = null;
    metadataPath = '';
    isLoading = true;
    error = null;
    playbackCompleted = false;
    hasAutoPlayed = false;
    
    // Audio elements
    audioRef = null;
    timeoutId = null;
    
    constructor(rootStore) {
      this.rootStore = rootStore;
      makeAutoObservable(this, { 
        rootStore: false,
        audioRef: false, 
        timeoutId: false,
        preloadAudioFiles: false
      });
      
      // Set up reaction to load metadata when path changes
      reaction(
        () => this.metadataPath,
        (newPath) => {
          if (newPath) {
            this.fetchMetadata(newPath);
          } else {
            // Reset state when path is cleared
            this.resetState();
          }
        }
      );
    }
    
    // Reset dialogue state
    resetState = () => {
      this.currentLineIndex = -1;
      this.isPlaying = false;
      this.error = null;
      this.playbackCompleted = false;
      this.hasAutoPlayed = false;
      
      // Clean up audio
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }
      
      // Clear timeouts
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      // Keep metadata and metadataPath as they are
    }
    
    // Set the metadata path (triggers metadata loading via reaction)
    setMetadataPath = (path) => {
      // First reset if we're changing paths
      if (path !== this.metadataPath) {
        this.resetState();
      }
      this.metadataPath = path;
    }
    
    // Fetch dialogue metadata
    fetchMetadata = async (path) => {
      this.isLoading = true;
      
      try {
        console.log(`Fetching dialogue metadata from: ${path}`);
        
        // Make sure we have a valid path
        if (!path) {
          throw new Error('No metadata path provided');
        }
        
        // Use absolute URL if path starts with /
        const isAbsolutePath = path.startsWith('/');
        const fullUrl = isAbsolutePath
          ? `${window.location.origin}${path}`
          : path;
        
        console.log(`Full metadata URL: ${fullUrl}`);
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to load dialogue metadata (${response.status})`);
        }
        
        const data = await response.json();
        console.log('Metadata loaded successfully:', data);
        
        // Validate metadata structure
        if (!data.audioFiles || !Array.isArray(data.audioFiles)) {
          throw new Error('Invalid metadata format: audioFiles property missing or not an array');
        }
        
        // Check if array is empty
        if (data.audioFiles.length === 0) {
          throw new Error('No dialogue available (empty audioFiles array)');
        }
        
        // Update state with loaded metadata
        runInAction(() => {
          this.metadata = data;
          this.isLoading = false;
          this.error = null;
          
          // Preload audio files
          this.preloadAudioFiles();
        });
      } catch (err) {
        console.error('Error loading metadata:', err);
        runInAction(() => {
          this.error = `Error loading metadata: ${err instanceof Error ? err.message : String(err)}`;
          this.isLoading = false;
          this.metadata = null;
        });
      }
    }
    
    // Preload audio files to improve playback
    preloadAudioFiles = () => {
      if (!this.metadata || !this.metadata.audioFiles.length) return;
      
      console.log('Preloading audio files...');
      
      // Attempt to preload the first few files
      const preloadCount = Math.min(3, this.metadata.audioFiles.length);
      for (let i = 0; i < preloadCount; i++) {
        const line = this.metadata.audioFiles[i];
        const filename = line.filename;
        const jsonPath = line.path;
        const fullPath = `${window.location.origin}${jsonPath}`;
        
        try {
          console.log(`Preloading JSON data: ${fullPath}`);
          
          // Fetch the JSON data
          fetch(fullPath)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch audio data: ${response.status}`);
              }
              return response.json();
            })
            .then(jsonData => {
              console.log(`Successfully preloaded JSON data for: ${filename}`);
            })
            .catch(error => {
              console.warn(`Failed to preload JSON data: ${error.message}`);
            });
        } catch (err) {
          console.warn(`Failed to initiate preload for: ${fullPath}`, err);
        }
      }
    }
    
    // Play dialogue from beginning
    playDialogue = () => {
      console.log('Starting dialogue playback...');
      
      // Make sure we have valid metadata with actual content
      if (!this.metadata || !this.metadata.audioFiles || this.metadata.audioFiles.length === 0) {
        console.log('Cannot play dialogue: No metadata or empty audioFiles array');
        return;
      }
      
      // Set as playing 
      this.isPlaying = true;
      
      // Notify audio store
      this.rootStore.audioStore.playDialogue();
      
      // Start with minimal delay to ensure browser is ready for audio
      this.timeoutId = window.setTimeout(() => {
        runInAction(() => {
          this.currentLineIndex = 0; // Start with the first line
        });
      }, 50);
    }
    
    // Stop dialogue playback
    stopDialogue = () => {
      this.isPlaying = false;
      
      // Notify audio store
      this.rootStore.audioStore.stopDialogue();
      
      // Clean up
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      if (this.audioRef) {
        this.audioRef.pause();
      }
    }
    
    // Pause/resume functionality
    togglePlayback = () => {
      if (this.isPlaying) {
        this.stopDialogue();
      } else {
        if (this.currentLineIndex === -1) {
          this.playDialogue();
        } else {
          this.isPlaying = true;
          this.rootStore.audioStore.playDialogue();
        }
      }
    }
    
    // Move to the next line
    playNextLine = () => {
      // Check for valid metadata with actual content
      if (!this.metadata || !this.metadata.audioFiles || !this.metadata.audioFiles.length) {
        console.log('No metadata or empty audioFiles array, cannot play next line');
        this.completePlayback();
        return;
      }
      
      const nextIndex = this.currentLineIndex + 1;
      
      // Check if we've reached the end
      if (nextIndex >= this.metadata.audioFiles.length) {
        console.log('Reached end of dialogue, stopping playback');
        this.completePlayback();
        return;
      }
      
      // Update the index - actual playback is handled by effect
      this.currentLineIndex = nextIndex;
    }
    
    // Complete dialogue playback
    completePlayback = () => {
      this.isPlaying = false;
      this.currentLineIndex = -1;
      this.playbackCompleted = true;
      
      // Notify audio store
      this.rootStore.audioStore.completeDialogue();
    }
    
    // Set auto-play flag to prevent multiple attempts
    markAutoPlayAttempted = () => {
      this.hasAutoPlayed = true;
    }
    
    // Play audio for current line
    playCurrentLineAudio = async (index) => {
      // Skip if we don't have what we need
      if (!this.metadata || !this.metadata.audioFiles || !this.isPlaying || 
          index < 0 || index >= this.metadata.audioFiles.length) {
        return;
      }
      
      console.log(`Playing audio for line index ${index}...`);
      
      // Get the current line
      const currentLine = this.metadata.audioFiles[index];
      
      // Stop any currently playing audio
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }
      
      // Construct path to the JSON file with Base64 audio data
      const jsonPath = currentLine.path;
      console.log(`Loading audio data from JSON: ${jsonPath}`);
      
      try {
        // Fetch and process JSON with audio data
        const baseUrl = window.location.origin;
        const jsonUrl = jsonPath.startsWith('/')
          ? `${baseUrl}${jsonPath}`
          : `${baseUrl}/${jsonPath}`;
        
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio data: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        // Extract the Base64 audio data
        let base64Audio = '';
        
        if (jsonData.request_id && jsonData.generations && Array.isArray(jsonData.generations)) {
          // Hume API structure
          const generation = jsonData.generations[0];
          
          if (generation.audio) {
            base64Audio = generation.audio;
          } else if (generation.audio_data) {
            base64Audio = generation.audio_data;
          } else if (generation.output && generation.output.audio) {
            base64Audio = generation.output.audio;
          } else {
            // Use a mock response
            base64Audio = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA=';
          }
        } else if (jsonData.output && jsonData.output.audio) {
          base64Audio = jsonData.output.audio;
        } else if (jsonData.audio) {
          base64Audio = jsonData.audio;
        } else {
          // Use a mock response
          base64Audio = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA=';
        }
        
        // Determine audio mime type based on the Base64 data
        const isWav = base64Audio.startsWith('UklGR');
        const mimeType = isWav ? 'audio/wav' : 'audio/mp3';
        
        // Convert Base64 to a Blob and create object URL
        const r = await fetch(`data:${mimeType};base64,${base64Audio}`);
        const audioBlob = await r.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create audio element with blob URL
        const audio = new Audio(audioUrl);
        this.audioRef = audio;
        
        // Set up event listeners
        audio.addEventListener('ended', () => {
          console.log(`Audio for line ${index} completed`);
          URL.revokeObjectURL(audioUrl);
          
          // Proceed to the next line
          runInAction(() => {
            this.playNextLine();
          });
        });
        
        audio.addEventListener('error', (e) => {
          console.error(`Audio error for line ${index}:`, audio.error);
          // Proceed to next line even on error
          runInAction(() => {
            this.playNextLine();
          });
        });
        
        // Play the audio
        await audio.play();
        
      } catch (error) {
        console.error('Error loading or playing audio:', error);
        // Proceed to next line even on error
        this.playNextLine();
      }
    }
    
    // Auto-play effect handler
    attemptAutoPlay = () => {
      // Only attempt if conditions are right and we haven't already tried
      if (this.metadata && 
          this.metadata.audioFiles && 
          this.metadata.audioFiles.length > 0 &&
          !this.isPlaying &&
          !this.hasAutoPlayed &&
          this.rootStore.audioStore.shouldAutoPlayDialogue) {
        
        console.log('Auto-play enabled, preparing to start playback...');
        
        // Set the flag immediately to prevent multiple attempts
        this.hasAutoPlayed = true;
        
        // Use minimal delay to ensure everything is ready
        setTimeout(() => {
          console.log('Now attempting to auto-play dialogue...');
          this.playDialogue();
        }, 50);
      }
    }
    
    // Cleanup function
    cleanup = () => {
      // Stop any playing audio
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }
      
      // Clear any timeouts
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
    
    // Computed values
    get progress() {
      return this.metadata && this.metadata.audioFiles.length > 0
        ? ((this.currentLineIndex + 1) / this.metadata.audioFiles.length) * 100
        : 0;
    }
    
    get hasDialogue() {
      return !!this.metadata && !!this.metadata.audioFiles && this.metadata.audioFiles.length > 0;
    }
  }
  ```

### 2.4 Create Root Store and Context
- [x] Implement root store:
  ```typescript
  // src/stores/RootStore.ts
  import { AudioStore } from './AudioStore';
  import { SlideStore } from './SlideStore';
  import { DialogueStore } from './DialogueStore';

  export class RootStore {
    audioStore;
    slideStore;
    dialogueStore;
    
    constructor() {
      this.audioStore = new AudioStore(this);
      this.slideStore = new SlideStore(this);
      this.dialogueStore = new DialogueStore(this);
    }
    
    // Initialize stores that need setup
    initialize = () => {
      // Initialize audio
      this.audioStore.initializeAudio();
    }
    
    // Global cleanup function
    cleanup = () => {
      this.audioStore.cleanup();
      this.slideStore.cleanup();
      this.dialogueStore.cleanup();
    }
  }

  export const rootStore = new RootStore();
  ```

- [x] Create store context provider:
  ```typescript
  // src/stores/StoreContext.tsx
  import React, { createContext, useContext, useEffect } from 'react';
  import { RootStore, rootStore } from './RootStore';

  const StoreContext = createContext<RootStore | null>(null);

  export const StoreProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    // Initialize stores on mount
    useEffect(() => {
      rootStore.initialize();
      
      // Cleanup on unmount
      return () => {
        rootStore.cleanup();
      };
    }, []);
    
    return (
      <StoreContext.Provider value={rootStore}>
        {children}
      </StoreContext.Provider>
    );
  };

  export const useStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('useStore must be used within a StoreProvider');
    }
    return store;
  };

  // Helper hooks for individual stores
  export const useAudioStore = () => useStore().audioStore;
  export const useSlideStore = () => useStore().slideStore;
  export const useDialogueStore = () => useStore().dialogueStore;
  ```

## Phase 3: Refactor Components

### 3.1 Update App Entry Point
- [x] Modify App.tsx to use MobX providers:
  ```typescript
  // src/App.tsx
  import { StoreProvider } from './stores/StoreContext';
  import AppContent from './components/AppContent';
  
  const App: React.FC = () => {
    return (
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    );
  };
  ```

### 3.2 Create MobX-based App Content Component
- [x] Move App logic to an observer component:
  ```typescript
  // src/components/AppContent.tsx
  import { observer } from 'mobx-react-lite';
  import { useAudioStore, useSlideStore } from '../stores/StoreContext';
  import Slide00 from './slides/Slide00';
  import Slide01 from './slides/Slide01';
  import Slide02 from './slides/Slide02';
  import Slide03 from './slides/Slide03';
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
      }, 1000);
      
      return () => clearTimeout(timer);
    }, [slideStore.currentSlide, audioStore]);
    
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
  ```

### 3.3 Refactor SlideAwareDialoguePlayer
- [x] Convert to MobX observer component:
  ```typescript
  // src/components/audio/SlideAwareDialoguePlayer.tsx
  import React, { useEffect } from 'react';
  import { observer } from 'mobx-react-lite';
  import { useAudioStore, useSlideStore, useDialogueStore } from '../../stores/StoreContext';
  import DialoguePlayer from '../slides/DialoguePlayer';
  
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
    }, [
      dialogueStore, 
      audioStore.shouldAutoPlayDialogue,
      dialogueStore.metadata,
      dialogueStore.hasAutoPlayed
    ]);
    
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
          <DialoguePlayer
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
            onPause={() => {}} // Keep empty handler
            showOnlyCurrent={props.showOnlyCurrent}
          />
        ) : (
          !props.floatingControls && (
            <div className="p-2 text-xs text-gray-400">
              {dialogueStore.isLoading ? "Loading dialogue..." : "No dialogue available for this slide."}
            </div>
          )
        )}
      </div>
    );
  });
  
  export default SlideAwareDialoguePlayer;
  ```

### 3.4 Refactor DialoguePlayer
- [ ] Update DialoguePlayer to work with MobX:
  ```typescript
  // src/components/slides/DialoguePlayer.tsx
  import React, { useEffect, useRef } from 'react';
  import { observer } from 'mobx-react-lite';
  import { useDialogueStore } from '../../stores/StoreContext';
  
  interface DialoguePlayerProps {
    metadataPath: string;
    autoPlay?: boolean;
    onComplete?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    minPauseDuration?: number;
    maxPauseDuration?: number;
    showTranscript?: boolean;
    highlightCurrentLine?: boolean;
    compact?: boolean;
    maxLines?: number;
    className?: string;
    style?: React.CSSProperties;
    floatingControls?: boolean;
    textOnly?: boolean;
    showTextOnlyLabel?: boolean;
    showOnlyCurrent?: boolean;
  }
  
  const DialoguePlayer = observer((props: DialoguePlayerProps) => {
    const dialogueStore = useDialogueStore();
    
    // Call onComplete and onPlay from props when store's state changes
    useEffect(() => {
      if (dialogueStore.playbackCompleted && props.onComplete) {
        props.onComplete();
      }
    }, [dialogueStore.playbackCompleted, props.onComplete]);
    
    useEffect(() => {
      if (dialogueStore.isPlaying && props.onPlay) {
        props.onPlay();
      }
    }, [dialogueStore.isPlaying, props.onPlay]);
    
    // Implementation follows the MobX store design - most state now comes from the DialogueStore
    // We still need rendering logic and UI interaction here
    
    // ... (Keep existing rendering logic from original DialoguePlayer)
  });
  ```

## Phase 4: Testing and Validation

### 4.1 Component Testing
- [ ] Test each refactored component individually
- [ ] Focus on state updates and side effects
- [ ] Verify that auto-play and other features work correctly

### 4.2 Integration Testing
- [ ] Test slide navigation with dialogue auto-play
- [ ] Validate that multiple rerendering issues are resolved
- [ ] Confirm that dialogue playback completes properly

### 4.3 Performance Testing
- [ ] Compare render counts before and after MobX integration
- [ ] Profile component updates to verify improvement

## Phase 5: Documentation and Cleanup

### 5.1 Update Documentation
- [ ] Document the new store architecture
- [ ] Add comments to stores explaining the state management approach
- [ ] Update README with MobX integration notes

### 5.2 Clean up Legacy Code
- [ ] Remove redundant state management code
- [ ] Delete any unused context providers
- [ ] Remove unnecessary props drilling

## Timeline and Milestones

1. **Setup (Day 1)**:
   - [ ] Install dependencies
   - [ ] Create basic store structure
   
2. **Core Stores (Days 2-3)**:
   - [ ] Implement AudioStore
   - [ ] Implement SlideStore
   - [ ] Implement DialogueStore
   - [ ] Create store context provider
   
3. **Component Refactoring (Days 4-6)**:
   - [x] Refactor App.tsx to use MobX providers
   - [x] Move App logic to an observer component
   - [x] Refactor SlideAwareDialoguePlayer
   - [ ] Refactor DialoguePlayer
   
4. **Testing and Validation (Days 7-8)**:
   - [ ] Test components individually
   - [ ] Integration testing
   - [ ] Performance validation
   
5. **Cleanup and Documentation (Days 9-10)**:
   - [ ] Remove legacy code
   - [ ] Document new architecture
   - [ ] Final testing and bug fixes

## Implementation Notes

### Key State Dependencies Identified During Code Review:

1. **Audio State Dependencies**:
   - Background audio playback (isMusicPlaying, isMuted, backgroundVolume)
   - Sound effect playback (playTypingSound, playWhooshSound, etc.)
   - Volume management (fadeBackgroundVolume, duckBackgroundAudio, restoreBackgroundAudio)
   - Audio element lifecycle management (initialization, cleanup)

2. **Slide State Dependencies**:
   - Current slide tracking (currentSlide, totalSlides)
   - Slide navigation (nextSlide, previousSlide, navigateToSlide)
   - Slide change reason tracking (slideChangeReason: 'next', 'prev', 'direct', 'other')
   - Fullscreen management (isFullscreen, toggleFullscreen)
   - UI control visibility (showControls, showDebug)
   - Content scaling (contentScale, calculateResponsiveScale)

3. **Dialogue State Dependencies**:
   - Metadata loading and processing (metadataPath, metadata, isLoading)
   - Playback control (isPlaying, playDialogue, stopDialogue, togglePlayback)
   - Line navigation (currentLineIndex, playNextLine)
   - Audio handling (audioRef, playCurrentLineAudio)
   - Auto-play coordination (hasAutoPlayed, attemptAutoPlay, shouldAutoPlayDialogue)
   - Playback completion (playbackCompleted, completePlayback)

### Critical Timing and Coordination Issues:

1. **SlideAwareDialoguePlayer Reset Pattern**:
   - The pattern of clearing the metadata path and then setting it after a timeout was causing unnecessary unmounting/remounting
   - Solution: In MobX, we manage this with a more controlled state flow where setMetadataPath handles proper cleanup

2. **Auto-Play Logic**:
   - Complex dependencies between slide change reason, playback completion, and auto-play state
   - Solution: Centralized in computed property shouldAutoPlayDialogue in AudioStore with clear dependencies

3. **Audio Control Coordination**:
   - Background audio ducking during dialogue needs careful timing
   - Solution: Clear action methods in AudioStore manage this sequence with proper state tracking

4. **Component Remounting Strategy**:
   - Using key={currentSlide} was forcing full remounts between slides
   - Solution: MobX's fine-grained reactivity handles this without requiring full remounts

### MobX Benefits for This Application:

1. **Centralized State Management**:
   - All audio state is now in one place (AudioStore) rather than spread across contexts and components
   - Dialogue state is centralized in DialogueStore instead of being duplicated across components

2. **Reduced Render Cycles**:
   - MobX's fine-grained updates only re-render components when their specific dependencies change
   - No unnecessary re-renders from context changes that don't affect a component

3. **Simplified Data Flow**:
   - Clean separation between state (stores) and UI (components)
   - Components simply respond to state changes rather than managing complex state interactions

4. **Better Debugging**:
   - Observable state makes it easier to track what's changing and why
   - Can use MobX Developer Tools for debugging state changes

5. **More Robust Auto-Play**:
   - Auto-play logic is now centralized and clearly defined
   - Computed properties ensure consistent evaluation of whether auto-play should occur
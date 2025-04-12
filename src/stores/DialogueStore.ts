import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { RootStore } from './RootStore';

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
    audioRef: HTMLAudioElement | null = null;
    timeoutId: number | null = null;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
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

        // Set up reaction to play audio when current line changes
        reaction(
            () => this.currentLineIndex,
            (lineIndex) => {
                if (lineIndex >= 0 && this.isPlaying) {
                    console.log(`Current line changed to ${lineIndex}, playing audio...`);
                    this.playCurrentLineAudio(lineIndex);
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
    setMetadataPath = (path: string) => {
        // First reset if we're changing paths
        if (path !== this.metadataPath) {
            this.resetState();
        }
        this.metadataPath = path;
    }

    // Fetch dialogue metadata
    fetchMetadata = async (path: string) => {
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
        if (!this.metadata || !(this.metadata as any).audioFiles.length) return;

        console.log('Preloading audio files...');

        // Attempt to preload the first few files
        const preloadCount = Math.min(3, (this.metadata as any).audioFiles.length);
        for (let i = 0; i < preloadCount; i++) {
            const line = (this.metadata as any).audioFiles[i];
            const filename = line.filename;
            const jsonPath = line.path;

            // Get base URL and construct proper path
            const baseUrl = window.location.origin;

            // The path format should be "/sounds/dialogue/slideXX/slideXX-NN.json" 
            // but in some cases it might have "public" already in it
            let fullPath;
            if (jsonPath.includes('public/')) {
                // Remove "public/" from path if it's already there
                const cleanPath = jsonPath.replace('public/', '');
                fullPath = `${baseUrl}/${cleanPath}`;
            } else {
                fullPath = jsonPath.startsWith('/')
                    ? `${baseUrl}${jsonPath}`
                    : `${baseUrl}/${jsonPath}`;
            }

            console.log(`Preloading JSON data: ${fullPath}`);

            try {
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
        if (!this.metadata || !(this.metadata as any).audioFiles || (this.metadata as any).audioFiles.length === 0) {
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
        if (!this.metadata || !(this.metadata as any).audioFiles || !(this.metadata as any).audioFiles.length) {
            console.log('No metadata or empty audioFiles array, cannot play next line');
            this.completePlayback();
            return;
        }

        const nextIndex = this.currentLineIndex + 1;

        // Check if we've reached the end
        if (nextIndex >= (this.metadata as any).audioFiles.length) {
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
    playCurrentLineAudio = async (index: number) => {
        // Skip if we don't have what we need
        if (!this.metadata || !(this.metadata as any).audioFiles || !this.isPlaying ||
            index < 0 || index >= (this.metadata as any).audioFiles.length) {
            return;
        }

        console.log(`Playing audio for line index ${index}...`);

        // Get the current line
        const currentLine = (this.metadata as any).audioFiles[index];

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

            // Fix path construction to match preloadAudioFiles method
            let jsonUrl;
            if (jsonPath.includes('public/')) {
                // Remove "public/" from path if it's already there
                const cleanPath = jsonPath.replace('public/', '');
                jsonUrl = `${baseUrl}/${cleanPath}`;
            } else {
                jsonUrl = jsonPath.startsWith('/')
                    ? `${baseUrl}${jsonPath}`
                    : `${baseUrl}/${jsonPath}`;
            }

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
            (this.metadata as any).audioFiles &&
            (this.metadata as any).audioFiles.length > 0 &&
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

        // Special case for slide 3 - force auto-play if dialogue is available but hasn't been played
        if (this.rootStore.slideStore.currentSlide === 3 &&
            this.metadata &&
            (this.metadata as any).audioFiles &&
            (this.metadata as any).audioFiles.length > 0 &&
            !this.isPlaying &&
            !this.hasAutoPlayed) {

            console.log('Special case: Auto-playing dialogue for Slide 3');

            // Set the flag immediately to prevent multiple attempts
            this.hasAutoPlayed = true;

            // Force slideChangeReason to 'next' temporarily for this auto-play
            const originalReason = this.rootStore.slideStore.slideChangeReason;
            this.rootStore.slideStore.slideChangeReason = 'next';

            // Use minimal delay to ensure everything is ready
            setTimeout(() => {
                console.log('Now attempting special auto-play for Slide 3...');
                this.playDialogue();

                // Restore original reason after auto-play triggered
                this.rootStore.slideStore.slideChangeReason = originalReason;
            }, 100);
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
        return this.metadata && (this.metadata as any).audioFiles?.length > 0
            ? ((this.currentLineIndex + 1) / (this.metadata as any).audioFiles.length) * 100
            : 0;
    }

    get hasDialogue() {
        return !!this.metadata && !!(this.metadata as any).audioFiles && (this.metadata as any).audioFiles.length > 0;
    }
} 
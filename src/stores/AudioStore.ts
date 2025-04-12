import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';

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
    audioRefs: Record<string, HTMLAudioElement | null> = {
        keyboardSound: null,
        panelSlideSound: null,
        popSound: null,
        successSound: null,
        ambienceSound: null
    };

    // Web Audio API context (non-observable)
    webAudioContext = null;
    fadeIntervalId: number | null = null;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
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
    setBackgroundVolume = (volume: number) => {
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

    fadeBackgroundVolume = (targetVolume: number, durationMs = 1000) => {
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
    loadDialogueForSlide = async (slideIndex: number) => {
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
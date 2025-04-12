import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioEffects {
    // Sound playback functions
    playTypingSound: () => void;
    playPanelSlideSound: () => void;
    playWhooshSound: () => void;
    playPopSound: () => void;
    playSuccessSound: () => void;
    playBackgroundAmbience: () => void;
    stopBackgroundAmbience: () => void;
    playSpecificBackgroundAudio: (audioFile: string) => void;
    
    // Volume control
    setBackgroundVolume: (volume: number) => void;
    getBackgroundVolume: () => number;
    fadeBackgroundVolume: (targetVolume: number, durationMs: number) => void;
    
    // Settings
    isSilentMode: boolean;
    toggleSilentMode: () => void;
}

// Add these outside the hook to ensure they're truly persistent
let webAudioInitialized = false;
let audioContext: AudioContext | null = null;

// Helper function for generating sounds with Web Audio API
const generateSound = (type: string): void => {
    try {
        if (!webAudioInitialized || !audioContext) {
            try {
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                webAudioInitialized = true;
                console.log('Created Web Audio API context');
            } catch (e) {
                console.error('Could not initialize Web Audio API:', e);
                return;
            }
        }

        // Create a sound based on the type
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        switch (type) {
            case 'typing':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;

            case 'whoosh':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;

            case 'pop':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
                break;

            case 'success':
                // Create a two-note success sound
                const osc1 = audioContext.createOscillator();
                const osc2 = audioContext.createOscillator();
                const gain1 = audioContext.createGain();
                const gain2 = audioContext.createGain();

                osc1.type = 'sine';
                osc2.type = 'sine';

                osc1.frequency.setValueAtTime(400, audioContext.currentTime);
                osc2.frequency.setValueAtTime(600, audioContext.currentTime + 0.15);

                gain1.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

                gain2.gain.setValueAtTime(0.0, audioContext.currentTime);
                gain2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.15);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                osc1.connect(gain1);
                osc2.connect(gain2);
                gain1.connect(audioContext.destination);
                gain2.connect(audioContext.destination);

                osc1.start();
                osc2.start();
                osc1.stop(audioContext.currentTime + 0.15);
                osc2.stop(audioContext.currentTime + 0.3);
                break;

            case 'ambient':
                // Create a simple looping ambient sound
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, audioContext.currentTime);

                gain.gain.setValueAtTime(0.05, audioContext.currentTime);

                osc.connect(gain);
                gain.connect(audioContext.destination);

                osc.start();
                // No stop time for ambient loop

                // Store the oscillator to stop it later
                (window as any).__ambientOsc = osc;
                (window as any).__ambientGain = gain;
                break;

            default:
                console.warn('Unknown sound type:', type);
        }

        console.log(`Generated Web Audio sound: ${type}`);
    } catch (e) {
        console.error('Error generating sound with Web Audio API:', e);
    }
};

/**
 * Simplified audio effects hook using native HTML5 Audio
 */
const useAudioEffects = (): AudioEffects => {
    // State for silent mode (can be toggled by user)
    const [isSilentMode, setIsSilentMode] = useState(false);

    // References to audio elements
    const keyboardSoundRef = useRef<HTMLAudioElement | null>(null);
    const panelSlideSoundRef = useRef<HTMLAudioElement | null>(null);
    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const successSoundRef = useRef<HTMLAudioElement | null>(null);
    const ambienceSoundRef = useRef<HTMLAudioElement | null>(null);

    // For throttling keyboard sound
    const lastKeyboardPlayTimeRef = useRef(0);
    const KEYBOARD_THROTTLE_MS = 550;
    
    // Track audio volume settings (outside of Audio element to maintain state)
    const defaultBackgroundVolume = 0.2;
    const volumeSettingsRef = useRef({
        background: defaultBackgroundVolume,
        effects: 0.5
    });
    
    // For volume transition animations
    const fadeIntervalRef = useRef<number | null>(null);

    // Initialize audio on mount
    useEffect(() => {
        console.log('Initializing audio effects...');

        try {
            // Get the base URL for audio files
            const baseUrl = window.location.origin;

            // Create audio elements with absolute URLs
            keyboardSoundRef.current = new Audio(`${baseUrl}/sounds/keyboard-typing.mp3`);
            keyboardSoundRef.current.volume = 0.5;

            panelSlideSoundRef.current = new Audio(`${baseUrl}/sounds/whoosh.mp3`);
            panelSlideSoundRef.current.volume = 0.5;

            popSoundRef.current = new Audio(`${baseUrl}/sounds/pop.mp3`);
            popSoundRef.current.volume = 0.5;

            successSoundRef.current = new Audio(`${baseUrl}/sounds/success.mp3`);
            successSoundRef.current.volume = 0.5;

            // Use the hip-hop loop for background ambience
            ambienceSoundRef.current = new Audio(`${baseUrl}/audio/cool-hip-hop-loop-275527.mp3`);
            ambienceSoundRef.current.volume = volumeSettingsRef.current.background; // Use stored volume setting
            ambienceSoundRef.current.loop = true;

            console.log('✅ Audio elements created with URLs:');
            console.log(`Keyboard sound: ${keyboardSoundRef.current.src}`);

            // Add error handlers
            keyboardSoundRef.current.onerror = (e) => {
                console.error('Error loading keyboard sound:', e);
            };

            // Preload the sounds
            keyboardSoundRef.current.load();
            panelSlideSoundRef.current.load();
            popSoundRef.current.load();
            successSoundRef.current.load();
            ambienceSoundRef.current.load();
        } catch (error) {
            console.error('Error initializing audio:', error);
        }

        // Clean up on unmount
        return () => {
            try {
                // Stop any playing sounds
                ambienceSoundRef.current?.pause();
                keyboardSoundRef.current?.pause();
                panelSlideSoundRef.current?.pause();
                popSoundRef.current?.pause();
                successSoundRef.current?.pause();

                // Set sources to empty to release resources
                if (keyboardSoundRef.current) keyboardSoundRef.current.src = '';
                if (panelSlideSoundRef.current) panelSlideSoundRef.current.src = '';
                if (popSoundRef.current) popSoundRef.current.src = '';
                if (successSoundRef.current) successSoundRef.current.src = '';
                if (ambienceSoundRef.current) ambienceSoundRef.current.src = '';

                console.log('Audio resources cleaned up');
            } catch (error) {
                console.error('Error cleaning up audio:', error);
            }
        };
    }, []);

    // Volume control functions need to be defined before toggleSilentMode since it depends on them
    
    // Get current background volume
    const getBackgroundVolume = useCallback(() => {
        return volumeSettingsRef.current.background;
    }, []);

    // Set background volume immediately
    const setBackgroundVolume = useCallback((volume: number) => {
        try {
            // Ensure volume is between 0 and 1
            const safeVolume = Math.max(0, Math.min(1, volume));
            
            // Update the stored volume setting
            volumeSettingsRef.current.background = safeVolume;
            
            // Apply to current audio element if it exists
            if (ambienceSoundRef.current) {
                ambienceSoundRef.current.volume = safeVolume;
                console.log(`Background volume set to ${safeVolume}`);
            }
            
            // Also update Web Audio API volume if using that fallback
            if (webAudioInitialized && (window as any).__ambientGain) {
                try {
                    (window as any).__ambientGain.gain.value = safeVolume * 0.25; // Adjust for Web Audio API (tends to be louder)
                } catch (e) {
                    console.warn('Error setting Web Audio API volume:', e);
                }
            }
        } catch (error) {
            console.error('Error in setBackgroundVolume:', error);
        }
    }, []);
    
    // Fade background volume over time (for ducking during dialogue)
    const fadeBackgroundVolume = useCallback((targetVolume: number, durationMs: number = 1000) => {
        try {
            // Clear any existing fade interval
            if (fadeIntervalRef.current !== null) {
                window.clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
            
            // Ensure target volume is between 0 and 1
            const safeTargetVolume = Math.max(0, Math.min(1, targetVolume));
            
            // If no ambience sound or silent mode, just update the reference immediately
            if (!ambienceSoundRef.current || isSilentMode) {
                volumeSettingsRef.current.background = safeTargetVolume;
                return;
            }
            
            // Get current volume
            const startVolume = ambienceSoundRef.current.volume;
            
            // If the target is the same as current, no need to fade
            if (Math.abs(startVolume - safeTargetVolume) < 0.01) {
                return;
            }
            
            console.log(`Fading background volume from ${startVolume} to ${safeTargetVolume} over ${durationMs}ms`);
            
            // Set up the fade
            const stepCount = Math.max(5, Math.floor(durationMs / 50)); // At least 5 steps, aim for steps of ~50ms
            const volumeChangePerStep = (safeTargetVolume - startVolume) / stepCount;
            const intervalMs = Math.floor(durationMs / stepCount);
            
            let currentStep = 0;
            
            // Start the interval
            fadeIntervalRef.current = window.setInterval(() => {
                // Safety check in case audio element is removed during fade
                if (!ambienceSoundRef.current) {
                    if (fadeIntervalRef.current !== null) {
                        window.clearInterval(fadeIntervalRef.current);
                        fadeIntervalRef.current = null;
                    }
                    return;
                }
                
                currentStep++;
                
                // Calculate new volume
                const newVolume = startVolume + (volumeChangePerStep * currentStep);
                
                // Apply to audio element
                ambienceSoundRef.current.volume = newVolume;
                
                // Also update stored value
                volumeSettingsRef.current.background = newVolume;
                
                // Update Web Audio API volume if that fallback is in use
                if (webAudioInitialized && (window as any).__ambientGain) {
                    try {
                        (window as any).__ambientGain.gain.value = newVolume * 0.25; // Adjust for Web Audio API
                    } catch (e) {
                        // Silently fail for Web Audio adjustments
                    }
                }
                
                // Check if we're done
                if (currentStep >= stepCount) {
                    // Final adjustment to ensure we hit the exact target
                    if (ambienceSoundRef.current) {
                        ambienceSoundRef.current.volume = safeTargetVolume;
                    }
                    volumeSettingsRef.current.background = safeTargetVolume;
                    
                    // Clear the interval
                    if (fadeIntervalRef.current !== null) {
                        window.clearInterval(fadeIntervalRef.current);
                        fadeIntervalRef.current = null;
                    }
                    
                    console.log(`Background volume fade complete: ${safeTargetVolume}`);
                }
            }, intervalMs);
        } catch (error) {
            console.error('Error in fadeBackgroundVolume:', error);
            // Ensure we don't leave a running interval if there's an error
            if (fadeIntervalRef.current !== null) {
                window.clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
        }
    }, [isSilentMode]);
    
    // Clean up fade interval on unmount
    useEffect(() => {
        return () => {
            if (fadeIntervalRef.current !== null) {
                window.clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
        };
    }, []);
    
    // Toggle silent mode - defined after fadeBackgroundVolume to avoid circular dependency
    const toggleSilentMode = useCallback(() => {
        setIsSilentMode(prevMode => {
            const newMode = !prevMode;
            console.log(`Sound ${newMode ? 'muted' : 'unmuted'}`);

            if (newMode) {
                // Muting - fade out and stop all sounds
                if (ambienceSoundRef.current && ambienceSoundRef.current.volume > 0) {
                    // Store current volume before fading
                    const currentVolume = ambienceSoundRef.current.volume;
                    
                    // Quick fade out (300ms) then pause
                    fadeBackgroundVolume(0, 300);
                    
                    // Schedule pause after fade completes
                    setTimeout(() => {
                        if (ambienceSoundRef.current) {
                            ambienceSoundRef.current.pause();
                            // Restore volume setting but don't apply (audio is paused)
                            volumeSettingsRef.current.background = currentVolume;
                        }
                    }, 350);
                } else {
                    // If no fade needed, just pause
                    ambienceSoundRef.current?.pause();
                }
            } else {
                // Unmuting - restart ambient sound with fade-in
                try {
                    if (ambienceSoundRef.current) {
                        // Start with volume 0
                        ambienceSoundRef.current.volume = 0;
                        
                        // Play the audio
                        ambienceSoundRef.current.play()
                            .then(() => {
                                // If successful, fade in to stored volume
                                fadeBackgroundVolume(volumeSettingsRef.current.background, 500);
                                console.log('Background ambience restarted with fade-in');
                            })
                            .catch(e => {
                                console.warn('Could not autoplay ambient sound on unmute:', e);
                                // Restore volume even if play fails
                                if (ambienceSoundRef.current) {
                                    ambienceSoundRef.current.volume = volumeSettingsRef.current.background;
                                }
                            });
                    }
                } catch (e) {
                    console.warn('Error playing ambient sound on unmute:', e);
                }
            }

            return newMode;
        });
    }, [fadeBackgroundVolume]);

    // Helper function to safely play a sound
    const safePlaySound = useCallback((audioRef: React.RefObject<HTMLAudioElement>) => {
        if (isSilentMode || !audioRef.current) return;

        try {
            // Check if the audio is ready to play
            if (audioRef.current.readyState < 2) { // HAVE_CURRENT_DATA
                console.warn('Audio not ready yet, waiting for it to load...');
                return;
            }

            // If the sound is already playing, create a new audio instance for overlapping sounds
            if (audioRef === keyboardSoundRef) {
                // For keyboard sound, throttle to avoid too many instances
                const now = Date.now();
                if (now - lastKeyboardPlayTimeRef.current < KEYBOARD_THROTTLE_MS) {
                    return;
                }
                lastKeyboardPlayTimeRef.current = now;

                // Instead of cloning, just play/reset the original sound
                // This avoids the "no supported source" error
                if (audioRef.current.ended || audioRef.current.paused) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => {
                        console.warn('Could not play keyboard sound:', e);
                    });
                }
            } else {
                // For other sounds, just play or restart them
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.warn(`Could not play sound:`, e));
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }, [isSilentMode]);

    // Update the playTypingSound function
    const playTypingSound = useCallback(() => {
        if (isSilentMode) return;

        // Try to play the sound using the regular HTML Audio first
        try {
            if (keyboardSoundRef.current && keyboardSoundRef.current.readyState >= 2) {
                safePlaySound(keyboardSoundRef);
            } else {
                // Fallback to Web Audio API if the sound file isn't ready
                // generateSound('typing');
            }
        } catch (error) {
            console.warn('Error in playTypingSound, using fallback:', error);
            generateSound('typing');
        }
    }, [isSilentMode, safePlaySound]);

    // Play individual sounds with fallbacks
    const playPanelSlideSound = useCallback(() => {
        if (isSilentMode) return;

        try {
            if (panelSlideSoundRef.current && panelSlideSoundRef.current.readyState >= 2) {
                safePlaySound(panelSlideSoundRef);
            } else {
                generateSound('whoosh');
            }
        } catch (error) {
            console.warn('Error in playPanelSlideSound, using fallback:', error);
            generateSound('whoosh');
        }
    }, [isSilentMode, safePlaySound]);

    const playWhooshSound = useCallback(() => {
        if (isSilentMode) return;

        try {
            if (panelSlideSoundRef.current && panelSlideSoundRef.current.readyState >= 2) {
                safePlaySound(panelSlideSoundRef);
            } else {
                generateSound('whoosh');
            }
        } catch (error) {
            console.warn('Error in playWhooshSound, using fallback:', error);
            generateSound('whoosh');
        }
    }, [isSilentMode, safePlaySound]);

    const playPopSound = useCallback(() => {
        if (isSilentMode) return;

        try {
            if (popSoundRef.current && popSoundRef.current.readyState >= 2) {
                safePlaySound(popSoundRef);
            } else {
                generateSound('pop');
            }
        } catch (error) {
            console.warn('Error in playPopSound, using fallback:', error);
            generateSound('pop');
        }
    }, [isSilentMode, safePlaySound]);

    const playSuccessSound = useCallback(() => {
        if (isSilentMode) return;

        try {
            if (successSoundRef.current && successSoundRef.current.readyState >= 2) {
                safePlaySound(successSoundRef);
            } else {
                generateSound('success');
            }
        } catch (error) {
            console.warn('Error in playSuccessSound, using fallback:', error);
            generateSound('success');
        }
    }, [isSilentMode, safePlaySound]);

    // Play background ambience with fallback
    const playBackgroundAmbience = useCallback(() => {
        if (isSilentMode) return;
        
        try {
            console.log('Playing background ambience...');
            
            if (ambienceSoundRef.current) {
                // Reset in case it was stopped
                ambienceSoundRef.current.currentTime = 0;
                
                // Play with error handling
                ambienceSoundRef.current.play()
                    .then(() => console.log('Background ambience started successfully'))
                    .catch(e => {
                        console.warn('Error playing background ambience:', e);
                        
                        // Fallback to Web Audio API if needed
                        if (webAudioInitialized && audioContext) {
                            console.log('Using Web Audio API fallback for background ambience');
                            generateSound('ambient');
                        }
                    });
            } else {
                console.warn('Background ambience audio not initialized');
                // Try Web Audio API fallback
                generateSound('ambient');
            }
        } catch (error) {
            console.error('Error in playBackgroundAmbience:', error);
        }
    }, [isSilentMode]);

    // Stop background ambience
    const stopBackgroundAmbience = useCallback(() => {
        try {
            console.log('Stopping background ambience...');
            
            // Stop the HTML5 Audio element if it exists
            if (ambienceSoundRef.current) {
                ambienceSoundRef.current.pause();
                ambienceSoundRef.current.currentTime = 0;
                console.log('Background ambience stopped successfully');
            }
            
            // Also stop the Web Audio API fallback if it was used
            if (webAudioInitialized && (window as any).__ambientOsc) {
                try {
                    (window as any).__ambientOsc.stop();
                    (window as any).__ambientOsc.disconnect();
                    (window as any).__ambientGain.disconnect();
                    console.log('Web Audio API ambient sound stopped');
                } catch (e) {
                    console.warn('Error stopping Web Audio API ambient sound:', e);
                }
            }
        } catch (error) {
            console.error('Error in stopBackgroundAmbience:', error);
        }
    }, []);

    // Play a specific background audio file
    const playSpecificBackgroundAudio = useCallback((audioFile: string) => {
        if (isSilentMode) return;

        try {
            console.log(`Playing specific background audio: ${audioFile}`);

            // Remember if we had a playing sound before
            const wasPlaying = ambienceSoundRef.current && 
                              !ambienceSoundRef.current.paused && 
                              !ambienceSoundRef.current.ended;
            
            // Store current volume for smooth transition if sound was playing
            const previousVolume = wasPlaying ? 
                                  ambienceSoundRef.current?.volume || volumeSettingsRef.current.background : 
                                  volumeSettingsRef.current.background;
            
            // If currently playing, fade out before switching
            if (wasPlaying) {
                // Quick fade out (150ms) then switch tracks
                if (ambienceSoundRef.current) {
                    // Use direct volume change for quick fade
                    const steps = 5;
                    const interval = 30; // 30ms
                    let step = 0;
                    
                    const fadeOutInterval = setInterval(() => {
                        if (step >= steps || !ambienceSoundRef.current) {
                            clearInterval(fadeOutInterval);
                            switchToNewTrack();
                            return;
                        }
                        
                        if (ambienceSoundRef.current) {
                            const newVol = previousVolume * (1 - ((step + 1) / steps));
                            ambienceSoundRef.current.volume = newVol;
                        }
                        
                        step++;
                    }, interval);
                } else {
                    switchToNewTrack();
                }
            } else {
                // No fade needed, switch directly
                switchToNewTrack();
            }
            
            // Helper function to switch tracks
            function switchToNewTrack() {
                // Stop any existing ambient sound first
                if (ambienceSoundRef.current) {
                    ambienceSoundRef.current.pause();
                    ambienceSoundRef.current.currentTime = 0;
                }
    
                // Create a new audio element for the specific file
                const baseUrl = window.location.origin;
                ambienceSoundRef.current = new Audio(`${baseUrl}${audioFile}`);
                
                // Start with lower volume if we'll be fading in
                ambienceSoundRef.current.volume = wasPlaying ? 0 : volumeSettingsRef.current.background;
                ambienceSoundRef.current.loop = true;
    
                // Play the audio
                ambienceSoundRef.current.play()
                    .then(() => {
                        console.log(`Now playing: ${audioFile}`);
                        // If we were previously playing, fade in the new track
                        if (wasPlaying) {
                            fadeBackgroundVolume(previousVolume, 500);
                        }
                    })
                    .catch(e => {
                        console.warn(`Could not play specific audio ${audioFile}:`, e);
                        // Make sure volume settings are consistent even on error
                        volumeSettingsRef.current.background = previousVolume;
                    });
            }
        } catch (error) {
            console.warn(`Error playing specific audio ${audioFile}:`, error);
        }
    }, [isSilentMode, fadeBackgroundVolume]);

    return {
        // Sound playback functions
        playTypingSound,
        playPanelSlideSound,
        playWhooshSound,
        playPopSound,
        playSuccessSound,
        playBackgroundAmbience,
        stopBackgroundAmbience,
        playSpecificBackgroundAudio,
        
        // Volume control
        setBackgroundVolume,
        getBackgroundVolume,
        fadeBackgroundVolume,
        
        // Settings
        isSilentMode,
        toggleSilentMode
    };
};

export default useAudioEffects; 
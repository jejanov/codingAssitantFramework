import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioEffects {
    playTypingSound: () => void;
    playPanelSlideSound: () => void;
    playWhooshSound: () => void;
    playPopSound: () => void;
    playSuccessSound: () => void;
    playBackgroundAmbience: () => void;
    stopBackgroundAmbience: () => void;
    playSpecificBackgroundAudio: (audioFile: string) => void;
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

            ambienceSoundRef.current = new Audio(`${baseUrl}/sounds/silent.mp3`);
            ambienceSoundRef.current.volume = 0;
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

    // Toggle silent mode
    const toggleSilentMode = useCallback(() => {
        setIsSilentMode(prevMode => {
            const newMode = !prevMode;
            console.log(`Sound ${newMode ? 'muted' : 'unmuted'}`);

            if (newMode) {
                // Muting - stop all sounds
                ambienceSoundRef.current?.pause();
            } else {
                // Unmuting - restart ambient sound
                try {
                    ambienceSoundRef.current?.play().catch(e => {
                        console.warn('Could not autoplay ambient sound:', e);
                    });
                } catch (e) {
                    console.warn('Error playing ambient sound:', e);
                }
            }

            return newMode;
        });
    }, []);

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
        // Completely disabled - do nothing
        console.log('Background ambience has been disabled');
        return;
    }, [isSilentMode]);

    // Stop background ambience
    const stopBackgroundAmbience = useCallback(() => {
        // Empty function - nothing to do as playback is disabled
        return;
    }, []);

    // Play a specific background audio file
    const playSpecificBackgroundAudio = useCallback((audioFile: string) => {
        if (isSilentMode) return;

        try {
            console.log(`Playing specific background audio: ${audioFile}`);

            // Stop any existing ambient sound first
            ambienceSoundRef.current?.pause();

            // Create a new audio element for the specific file
            const baseUrl = window.location.origin;
            ambienceSoundRef.current = new Audio(`${baseUrl}${audioFile}`);
            ambienceSoundRef.current.volume = 0.3;
            ambienceSoundRef.current.loop = true;

            // Play the audio
            ambienceSoundRef.current.play().catch(e => {
                console.warn(`Could not play specific audio ${audioFile}:`, e);
            });
        } catch (error) {
            console.warn(`Error playing specific audio ${audioFile}:`, error);
        }
    }, [isSilentMode]);

    return {
        playTypingSound,
        playPanelSlideSound,
        playWhooshSound,
        playPopSound,
        playSuccessSound,
        playBackgroundAmbience,
        stopBackgroundAmbience,
        playSpecificBackgroundAudio,
        isSilentMode,
        toggleSilentMode
    };
};

export default useAudioEffects; 
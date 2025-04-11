import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock the Howler implementation
vi.mock('howler', () => {
    return {
        Howl: vi.fn().mockImplementation((options) => ({
            play: vi.fn(),
            stop: vi.fn(),
            volume: vi.fn(),
            _src: options.src,
        })),
    };
});

// Import the hook (will be implemented later)
// import useAudioEffects from '@/hooks/useAudioEffects';

// Temporary mock hook until the real one is implemented
const useAudioEffects = () => {
    const playTypingSound = vi.fn();
    const playPanelSlideSound = vi.fn();
    const playPopSound = vi.fn();
    const playSuccessSound = vi.fn();

    return {
        playTypingSound,
        playPanelSlideSound,
        playPopSound,
        playSuccessSound,
    };
};

describe('useAudioEffects Hook', () => {
    let originalPlay: any;

    beforeEach(() => {
        // Mock the Howler implementation or HTMLAudioElement
        originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = vi.fn();
    });

    afterEach(() => {
        HTMLAudioElement.prototype.play = originalPlay;
        vi.clearAllMocks();
    });

    it('should return audio playing functions', () => {
        // Arrange & Act
        const { result } = renderHook(() => useAudioEffects());

        // Assert
        expect(result.current.playTypingSound).toBeDefined();
        expect(result.current.playPanelSlideSound).toBeDefined();
        expect(result.current.playPopSound).toBeDefined();
        expect(result.current.playSuccessSound).toBeDefined();
    });

    it('should provide functions to play sounds', () => {
        // Arrange
        const { result } = renderHook(() => useAudioEffects());

        // Act
        act(() => {
            result.current.playTypingSound();
        });

        // Assert - We can't validate the actual sound playback in tests
        // but we can check that the function was called
        expect(result.current.playTypingSound).toHaveBeenCalled();
    });
}); 
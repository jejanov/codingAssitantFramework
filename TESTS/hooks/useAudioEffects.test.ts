import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';

// Import the actual hook
import useAudioEffects from '../../src/hooks/useAudioEffects';

// Simple mocks needed for the hook to render
vi.mock('../../src/hooks/useAudioEffects', async () => {
  const actual = await vi.importActual('../../src/hooks/useAudioEffects');
  return {
    ...actual,
  };
});

// Simple test to check that the hook returns what we expect
describe('useAudioEffects Hook', () => {
  it('should provide volume control functions after enhancement', () => {
    // Call the hook
    const { result } = renderHook(() => useAudioEffects());
    
    // Check that it returns the expected API with volume control functions
    expect(typeof result.current.setBackgroundVolume).toBe('function');
    expect(typeof result.current.getBackgroundVolume).toBe('function');
    expect(typeof result.current.fadeBackgroundVolume).toBe('function');
  });
}); 
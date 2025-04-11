import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// Import the actual service
import { fetchSlideContent } from '@/services/slideService';

// Mock the global fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Define the Mock type helper if not globally available
// type Mock = ReturnType<typeof vi.fn>; // Already mocked via global.fetch

describe('slideService', () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        mockFetch.mockClear();
    });

    // Optional: Restore global fetch after all tests if needed elsewhere
    // afterEach(() => {
    //  vi.restoreAllMocks(); 
    // });

    it('should fetch and return slide content JSON for slide 1', async () => {
        // Arrange
        const mockSlideData = {
            title: 'Slide 1 Title',
            body: '# Slide 1 Body Content'
        };
        const mockResponse = {
            ok: true,
            status: 200,
            json: async () => mockSlideData,
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act
        const result = await fetchSlideContent(1);

        // Assert
        expect(mockFetch).toHaveBeenCalledWith('/api/slides/1');
        expect(result).toEqual(mockSlideData);
    });

    it('should throw an error if fetch fails (network error)', async () => {
        // Arrange
        const networkError = new Error('Network failed');
        mockFetch.mockRejectedValue(networkError);

        // Act & Assert
        await expect(fetchSlideContent(998)).rejects.toThrowError('Failed to fetch slide 998: Network failed');
        expect(mockFetch).toHaveBeenCalledWith('/api/slides/998');
    });

    it('should throw an error with backend message if fetch returns !ok status (e.g., 404)', async () => {
        // Arrange
        const errorPayload = { error: 'Slide 999 not found' };
        const mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => errorPayload, // Backend provides JSON error
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(fetchSlideContent(999)).rejects.toThrowError(`Failed to fetch slide 999: ${errorPayload.error}`);
        expect(mockFetch).toHaveBeenCalledWith('/api/slides/999');
    });

    it('should throw an error if the response is not valid JSON', async () => {
        // Arrange
        const jsonError = new SyntaxError('Unexpected token < in JSON at position 0');
        const mockResponse = {
            ok: true,
            status: 200,
            json: async () => { throw jsonError; }, // Simulate invalid JSON
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        // Since our implementation now wraps the specific error, expect the wrapped message
        await expect(fetchSlideContent(3)).rejects.toThrowError(`Failed to fetch slide 3: ${jsonError.message}`);
        expect(mockFetch).toHaveBeenCalledWith('/api/slides/3');
    });

    it('should throw an error if the JSON structure is invalid', async () => {
        // Arrange
        const invalidData = { title: 'Only title' }; // Missing body
        const mockResponse = {
            ok: true,
            status: 200,
            json: async () => invalidData,
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(fetchSlideContent(4)).rejects.toThrowError('Invalid slide data format received from server.');
        expect(mockFetch).toHaveBeenCalledWith('/api/slides/4');
    });
}); 
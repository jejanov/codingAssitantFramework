// Remove gray-matter import, no longer needed on frontend
// import matter from 'gray-matter';
// Remove node-fetch import, use browser fetch
// import fetch from 'node-fetch';

/**
 * Represents the structure of slide data returned by the API.
 */
interface SlideContent {
    title?: string;
    body: string;
    // Add other frontmatter fields if the backend provides them
}

/**
 * Fetches slide content JSON from the backend API.
 * 
 * @param slideNumber The number of the slide to fetch.
 * @returns A promise that resolves with the slide content JSON.
 * @throws An error if fetching or parsing the JSON fails.
 */
export const fetchSlideContent = async (slideNumber: number): Promise<SlideContent> => {
    try {
        // Use native browser fetch to call the backend API
        const response = await fetch(`/api/slides/${slideNumber}`);

        if (!response.ok) {
            // Attempt to get error message from backend response body
            let errorBody = `HTTP error! Status: ${response.status} ${response.statusText}`;
            try {
                const body = await response.json();
                errorBody = body.error || errorBody;
            } catch (e) {
                // Ignore if response body is not JSON
            }
            throw new Error(`Failed to fetch slide ${slideNumber}: ${errorBody}`);
        }

        // Backend now returns parsed JSON directly
        const data: SlideContent = await response.json();

        // Basic validation (optional but recommended)
        if (typeof data?.body !== 'string') {
            throw new Error(`Invalid slide data format received from server.`);
        }

        return data;
    } catch (error) {
        // Handle original network errors
        if (error instanceof Error) {
            // Re-throw our custom errors without modification
            if (error.message.startsWith('Failed to fetch slide') ||
                error.message.startsWith('Invalid slide data format')) {
                throw error;
            }
            // Wrap other errors with context
            throw new Error(`Failed to fetch slide ${slideNumber}: ${error.message}`);
        }
        // For non-Error objects
        throw new Error(`Error processing data for slide ${slideNumber}`);
    }
}; 
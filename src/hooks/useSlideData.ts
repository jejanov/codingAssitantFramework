import { useState, useEffect, useRef } from 'react';
import { fetchSlideContent } from '@/services/slideService';

/**
 * Represents the structure of slide data returned from the API
 * @interface SlideData
 */
interface SlideData {
    /** The slide title from frontmatter (optional) */
    title?: string;
    /** The slide body content (markdown) */
    body: string;
}

/**
 * Return type of the useSlideData hook
 * @interface UseSlideDataReturn
 */
interface UseSlideDataReturn {
    /** Whether data is currently being loaded */
    loading: boolean;
    /** The slide data (null if not loaded or error) */
    data: SlideData | null;
    /** Error object if fetch failed (null if successful or loading) */
    error: Error | null;
}

// Simple in-memory cache for slides
const slideCache = new Map<number, SlideData>();

/**
 * Custom hook to fetch and manage slide data for a given slide number.
 * Implements caching to avoid redundant fetches of the same slide.
 * 
 * @param slideNumber The number of the slide to fetch
 * @returns Object containing loading state, slide data, and error state
 */
const useSlideData = (slideNumber: number): UseSlideDataReturn => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SlideData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Use a ref to track if the component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        // Reset state for new slide number
        if (slideNumber !== undefined) {
            setLoading(true);
            setError(null);
        }

        // Don't fetch if no slide number
        if (slideNumber === undefined) {
            setLoading(false);
            setData(null);
            return;
        }

        // Check cache first
        if (slideCache.has(slideNumber)) {
            setData(slideCache.get(slideNumber) || null);
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const slideData = await fetchSlideContent(slideNumber);

                // Only update state if component is still mounted
                if (isMounted.current) {
                    setData(slideData);
                    // Cache the data for future use
                    slideCache.set(slideNumber, slideData);
                }
            } catch (err) {
                if (isMounted.current) {
                    setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        loadData();

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted.current = false;
        };
    }, [slideNumber]); // Re-run effect if slideNumber changes

    // Reset mounted ref when component re-mounts
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return { loading, data, error };
};

export default useSlideData; 
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the custom hook that the component will use
// The actual hook doesn't exist yet, so we mock its expected interface.
vi.mock('@/hooks/useSlideData', () => ({
    default: vi.fn(),
}));
import useSlideData from '@/hooks/useSlideData';

// Import the component (it doesn't exist yet, this will cause failure)
import SlideDisplay from '@/components/slides/SlideDisplay';

// Define the Mock type helper if not globally available
type Mock = ReturnType<typeof vi.fn>;

describe('SlideDisplay Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        (useSlideData as Mock).mockClear();
    });

    it('should display a loading indicator when loading', () => {
        // Arrange: Mock useSlideData hook to return loading state
        (useSlideData as Mock).mockReturnValue({
            loading: true,
            data: null,
            error: null,
        });

        // Act: Render the component
        render(<SlideDisplay slideNumber={1} />);

        // Assert: Check for loading text/element (will fail with dummy component)
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('should display an error message when an error occurs', () => {
        // Arrange: Mock useSlideData hook to return error state
        const errorMessage = 'Failed to load slide data';
        (useSlideData as Mock).mockReturnValue({
            loading: false,
            data: null,
            error: new Error(errorMessage),
        });

        // Act: Render the component
        render(<SlideDisplay slideNumber={1} />);

        // Assert: Check for error message (will fail with dummy component)
        expect(screen.queryByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    it('should display the slide title when data is loaded', () => {
        // Arrange: Mock useSlideData hook to return data state
        const slideTitle = 'Test Slide Title';
        (useSlideData as Mock).mockReturnValue({
            loading: false,
            data: { title: slideTitle, body: 'Body content' },
            error: null,
        });

        // Act: Render the component
        render(<SlideDisplay slideNumber={1} />);

        // Assert: Check for the title heading (will fail with dummy component)
        expect(screen.getByRole('heading', { name: slideTitle, level: 1 })).toBeInTheDocument();
    });

    it('should display the rendered markdown body when data is loaded', () => {
        // Arrange: Mock useSlideData hook to return data state
        const slideBodyMarkdown = '# Header\n\nParagraph content.';
        (useSlideData as Mock).mockReturnValue({
            loading: false,
            data: { title: 'Test Title', body: slideBodyMarkdown },
            error: null,
        });

        // Act: Render the component
        render(<SlideDisplay slideNumber={1} />);

        // Assert: Check for elements rendered by ReactMarkdown
        // Check for the heading rendered from markdown
        expect(screen.getByRole('heading', { name: 'Header', level: 1 })).toBeInTheDocument();
        // Check for the paragraph rendered from markdown
        expect(screen.getByText('Paragraph content.')).toBeInTheDocument();
    });

    it('should display only the body if title is missing in data', () => {
        // Arrange
        const slideBodyMarkdown = 'Content without title.';
        (useSlideData as Mock).mockReturnValue({
            loading: false,
            data: { body: slideBodyMarkdown }, // No title field
            error: null,
        });

        // Act
        render(<SlideDisplay slideNumber={1} />);

        // Assert
        // Ensure title heading is NOT present
        expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
        // Ensure body content is present
        expect(screen.getByText('Content without title.')).toBeInTheDocument();
    });
}); 
import React from 'react';
import useSlideData from '@/hooks/useSlideData';
import ReactMarkdown from 'react-markdown';

/**
 * Props for the SlideDisplay component
 * @interface SlideDisplayProps
 */
interface SlideDisplayProps {
    /** The slide number to display (1-based index) */
    slideNumber: number;
    /** Optional CSS class name to apply to the container */
    className?: string;
}

/**
 * Loading state component with simple animation
 */
const LoadingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-10 h-64">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-blue-300">Loading slide content...</p>
    </div>
);

/**
 * Error display component
 */
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-10 h-64 text-center">
        <div className="text-red-500 mb-4 text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Unable to load slide</h2>
        <p className="text-red-300 max-w-md">{message}</p>
    </div>
);

/**
 * Component to display a single slide's content.
 * Fetches data using the useSlideData hook and renders markdown content.
 * Handles loading and error states gracefully.
 */
const SlideDisplay: React.FC<SlideDisplayProps> = ({ slideNumber, className = '' }) => {
    const { loading, data, error } = useSlideData(slideNumber);

    // Loading state
    if (loading) {
        return <LoadingIndicator />;
    }

    // Error state
    if (error) {
        return <ErrorDisplay message={error.message} />;
    }

    // Empty state (should not happen with proper error handling, but included for safety)
    if (!data) {
        return <ErrorDisplay message="No slide data available. Please try a different slide." />;
    }

    // Content state
    return (
        <div className={`slide-container p-8 bg-gray-800 rounded-lg shadow-lg ${className}`}>
            {/* Slide title */}
            {data.title && (
                <h1 className="text-3xl font-bold mb-6 text-center text-white border-b border-gray-700 pb-4">
                    {data.title}
                </h1>
            )}

            {/* Slide content */}
            <div className="slide-body prose prose-invert max-w-none">
                <ReactMarkdown
                    components={{
                        // Customize headings
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-blue-300" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-green-300" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-yellow-300" {...props} />,
                        // Customize links
                        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
                        // Customize lists
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
                        // Customize code blocks
                        code: ({ node, ...props }) => <code className="bg-gray-900 px-1 rounded text-green-400" {...props} />,
                        // Customize block quotes
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4" {...props} />,
                    }}
                >
                    {data.body}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default SlideDisplay; 
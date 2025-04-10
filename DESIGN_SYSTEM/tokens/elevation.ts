/**
 * Shadow and Elevation Tokens
 */

// Shadow system for elevation and depth
export const elevation = {
    1: "0 2px 4px rgba(0, 0, 0, 0.05)",
    2: "0 4px 8px rgba(0, 0, 0, 0.08)",
    3: "0 8px 16px rgba(0, 0, 0, 0.1)",
    4: "0 16px 24px rgba(0, 0, 0, 0.12)",
    5: "0 24px 32px rgba(0, 0, 0, 0.15)"
};

// Enhanced shadow system for glassmorphism components
export const glassShadow = {
    1: "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.03)",
    2: "inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05)",
    3: "inset 0 1px 3px rgba(255, 255, 255, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
    4: "inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 8px 20px rgba(0, 0, 0, 0.1)",
    5: "inset 0 2px 6px rgba(255, 255, 255, 0.08), 0 12px 28px rgba(0, 0, 0, 0.12)"
};

// Shadow mapping based on component hierarchy and level
export const shadowDepth = {
    container: {
        primary: 2,    // Default container shadow
        secondary: 3,   // Emphasized containers
        tertiary: 4     // Highest prominence containers
    },
    interactive: {
        primary: 2,     // Standard interactive elements
        secondary: 3,    // Hovered/focused interactive elements
        tertiary: 4      // Active/pressed interactive elements
    },
    emphasized: {
        primary: 3,     // Moderately emphasized elements
        secondary: 4,    // Highly emphasized elements
        tertiary: 5      // Maximum emphasis elements
    },
    content: {
        primary: 1,     // Subtle content elements
        secondary: 2,    // Standard content elements
        tertiary: 3      // Important content elements
    }
}; 
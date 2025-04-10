/**
 * Transparency and Blur Tokens
 */

// Standardized transparency scale
export const transparency = {
    container: {
        primary: 0.4, // 80% transparent (0.2 opacity)
        secondary: 0.25, // 75% transparent
        tertiary: 0.3 // 70% transparent
    },
    interactive: {
        primary: 0.6, // 65% transparent
        secondary: 0.4, // 60% transparent
        tertiary: 0.45 // 55% transparent  
    },
    emphasized: {
        primary: 0.8, // 50% transparent
        secondary: 0.55, // 45% transparent
        tertiary: 0.6 // 40% transparent
    },
    content: {
        primary: 0.9, // 30% transparent
        secondary: 0.8, // 20% transparent
        tertiary: 0.9 // 10% transparent
    }
};

// Standardized blur intensities
export const blur = {
    light: "8px",
    medium: "12px",
    heavy: "16px",
    intense: "24px"
}; 
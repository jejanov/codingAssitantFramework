/**
 * Helper Functions for Tokens
 */

import { colors } from "./colors";

export const helpers = {
    // Adjust color opacity
    alpha: (color: string, opacity: number): string => {
        if (color.startsWith("#")) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        if (color.startsWith("rgb(")) {
            return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
        }
        if (color.startsWith("rgba(")) {
            return color.replace(/[\d.]+\)$/, `${opacity})`);
        }
        return color;
    },

    // Adjust color brightness
    adjustBrightness: (color: string, amount: number): string => {
        if (!color.startsWith("#")) return color;

        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);

        r = Math.min(255, Math.max(0, r + amount));
        g = Math.min(255, Math.max(0, g + amount));
        b = Math.min(255, Math.max(0, b + amount));

        return `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    },

    // Get contrasting text color for background
    getContrastText: (backgroundColor: string): string => {
        if (!backgroundColor || !backgroundColor.startsWith("#")) return colors.text.primary;

        const r = parseInt(backgroundColor.slice(1, 3), 16);
        const g = parseInt(backgroundColor.slice(3, 5), 16);
        const b = parseInt(backgroundColor.slice(5, 7), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? colors.text.primary : colors.text.inverse;
    }
}; 
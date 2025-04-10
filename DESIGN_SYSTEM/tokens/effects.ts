/**
 * Effects Tokens (Glassmorphism, Overlays)
 */

import { blur } from "./transparency";

export const effects = {
    glass: {
        light:
            "backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.2);",
        medium:
            "backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.35);",
        heavy:
            "backdrop-filter: blur(16px); background-color: rgba(255, 255, 255, 0.5);"
    },
    overlay: {
        light: "background-color: rgba(0, 0, 0, 0.05)",
        medium: "background-color: rgba(0, 0, 0, 0.2)",
        dark: "background-color: rgba(0, 0, 0, 0.5)"
    }
}; 
/**
 * Color Tokens
 */

export const colors = {
    // Primary colors
    primary: {
        50: "#e3f2fd",
        100: "#bbdefb",
        200: "#90caf9",
        300: "#64b5f6",
        400: "#42a5f5",
        500: "#2196f3", // Primary blue color
        600: "#1e88e5",
        700: "#1976d2",
        800: "#1565c0",
        900: "#0d47a1"
    },
    // Secondary colors - purple accent from Regis site
    secondary: {
        50: "#f3e5f5",
        100: "#e1bee7",
        200: "#ce93d8",
        300: "#ba68c8",
        400: "#ab47bc",
        500: "#9c27b0", // Secondary purple color
        600: "#8e24aa",
        700: "#7b1fa2",
        800: "#6a1b9a",
        900: "#4a148c"
    },
    // Accent color - teal/blue from Regis
    accent: {
        50: "#e0f7fa",
        100: "#b2ebf2",
        200: "#80deea",
        300: "#4dd0e1",
        400: "#26c6da",
        500: "#00bcd4", // Accent teal
        600: "#00acc1",
        700: "#0097a7",
        800: "#00838f",
        900: "#006064"
    },
    // Neutral grays
    neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#eeeeee",
        300: "#e0e0e0",
        400: "#bdbdbd",
        500: "#9e9e9e",
        600: "#757575",
        700: "#616161",
        800: "#424242",
        900: "#212121"
    },
    // Semantic status colors
    status: {
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
    },
    // Background colors
    background: {
        surface: "#ffffff",
        card: "rgba(255, 255, 255, 0.8)",
        modal: "rgba(255, 255, 255, 0.85)",
        app: "#f5f7fa",
        gradient: {
            primary: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            secondary: "linear-gradient(to right, #e3f2fd, #bbdefb)",
            accent: "linear-gradient(to bottom right, #00bcd4, #1976d2)"
        }
    },
    // Text colors
    text: {
        primary: "#212121",
        secondary: "#757575",
        disabled: "#9e9e9e",
        inverse: "#ffffff"
    },
    // Border colors
    border: {
        light: "rgba(0, 0, 0, 0.12)",
        medium: "rgba(0, 0, 0, 0.24)",
        dark: "rgba(0, 0, 0, 0.38)"
    },
    // Graph specific colors (Commented out for general template)
    /*
    graph: {
      nodeTypes: {
        person: "#e91e63", // Pink
        document: "#4caf50", // Green
        location: "#ff9800", // Orange
        organization: "#9c27b0", // Purple
        event: "#3f51b5", // Indigo
        concept: "#009688", // Teal
        default: "#2196f3" // Blue
      },
      edgeTypes: {
        related: "#9e9e9e", // Gray
        owns: "#673ab7", // Deep Purple
        created: "#00bcd4", // Cyan
        participated: "#ff5722", // Deep Orange
        default: "#757575" // Dark Gray
      },
      selection: "#2196f3", // Blue for selection highlighting
      hover: "rgba(33, 150, 243, 0.3)" // Light blue for hover state
    }
    */
}; 
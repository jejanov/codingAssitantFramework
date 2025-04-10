/**
 * Z-Index Tokens
 */

export const zIndex = {
    // Base layers
    background: -1,
    canvas: 0,
    base: 1,

    // Content layers
    content: 10,
    contentEmphasis: 15,

    // UI component layers
    controls: 20,
    header: 25,
    footer: 25,

    // Interactive elements
    dropdown: 30,
    tooltip: 35,
    popover: 40,

    // Overlay layers
    overlay: 50,
    modal: 60,
    toast: 70,

    // Top-level layers
    loading: 80,
    dialog: 90,
    notification: 95,

    // Maximum layer (reserved for critical UI)
    max: 100
}; 
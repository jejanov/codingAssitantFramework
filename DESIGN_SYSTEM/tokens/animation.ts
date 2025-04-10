/**
 * Animation Tokens
 */

import { glassShadow } from "./elevation";

// Define type constants for the animation system
type EasingType = 'standard' | 'decelerate' | 'accelerate' | 'sharp';
type DurationType = 'fastest' | 'fast' | 'normal' | 'slow' | 'slower';

export const animation = {
    easing: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
        accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
        sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
    },
    duration: {
        fastest: "100ms",
        fast: "150ms",
        normal: "300ms",
        slow: "450ms",
        slower: "600ms"
    },
    transition: {
        color: (duration: DurationType = 'fast', easing: EasingType = 'standard') =>
            `color ${animation.duration[duration]} ${animation.easing[easing]}`,
        background: (duration: DurationType = 'fast', easing: EasingType = 'standard') =>
            `background-color ${animation.duration[duration]} ${animation.easing[easing]}`,
        opacity: (duration: DurationType = 'fast', easing: EasingType = 'standard') =>
            `opacity ${animation.duration[duration]} ${animation.easing[easing]}`,
        transform: (duration: DurationType = 'normal', easing: EasingType = 'decelerate') =>
            `transform ${animation.duration[duration]} ${animation.easing[easing]}`,
        size: (duration: DurationType = 'normal', easing: EasingType = 'standard') =>
            `width ${animation.duration[duration]} ${animation.easing[easing]}, height ${animation.duration[duration]} ${animation.easing[easing]}`,
        border: (duration: DurationType = 'normal', easing: EasingType = 'standard') =>
            `border ${animation.duration[duration]} ${animation.easing[easing]}`,
        shadow: (duration: DurationType = 'normal', easing: EasingType = 'standard') =>
            `box-shadow ${animation.duration[duration]} ${animation.easing[easing]}`,
        hover: (duration: DurationType = 'fast') =>
            `background-color ${animation.duration[duration]} ${animation.easing.standard}, transform ${animation.duration[duration]} ${animation.easing.decelerate}, box-shadow ${animation.duration[duration]} ${animation.easing.standard}`,
        buttonHover: (duration: DurationType = 'fast') =>
            `background-color ${animation.duration[duration]} ${animation.easing.standard}, transform ${animation.duration[duration]} ${animation.easing.decelerate}, box-shadow ${animation.duration[duration]} ${animation.easing.standard}, color ${animation.duration[duration]} ${animation.easing.standard}`,
        cardHover: (duration: DurationType = 'normal') =>
            `transform ${animation.duration[duration]} ${animation.easing.decelerate}, box-shadow ${animation.duration[duration]} ${animation.easing.standard}`,
        fadeIn: (duration: DurationType = 'normal') =>
            `opacity ${animation.duration[duration]} ${animation.easing.decelerate}`,
        fadeOut: (duration: DurationType = 'fast') =>
            `opacity ${animation.duration[duration]} ${animation.easing.accelerate}`,
        all: (duration: DurationType = 'normal', easing: EasingType = 'standard') =>
            `all ${animation.duration[duration]} ${animation.easing[easing]}`
    },
    keyframes: {
        fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
        fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
        slideInUp: `
      @keyframes slideInUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
        slideInDown: `
      @keyframes slideInDown {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
        pulse: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `,
        spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    },
    preset: {
        fadeIn: {
            animation: 'fadeIn 0.3s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
        },
        fadeOut: {
            animation: 'fadeOut 0.15s cubic-bezier(0.4, 0.0, 1, 1) forwards',
        },
        messageIn: {
            animation: 'slideInUp 0.3s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
        },
        loading: {
            animation: 'spin 1s linear infinite',
        },
        buttonHover: {
            transform: 'translateY(-1px)',
            boxShadow: glassShadow[3],
        },
        buttonActive: {
            transform: 'translateY(0)',
            boxShadow: glassShadow[2],
        },
        cardHover: {
            transform: 'translateY(-2px) scale(1.01)',
            boxShadow: glassShadow[3],
        }
    }
}; 
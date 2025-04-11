# Slide 01: Title Slide

## Title
AI Dev Workshop: Revolutionizing Development with AI Coding Tools

## Purpose
To establish brand presence, set the tone for the presentation, and introduce the core concept of AI-powered development.

## Key Message
AI coding tools are transforming software development, and this workshop demonstrates their power through a meta-recursive approach.

## Content
- **Headline:** AI Dev Workshop
- **Tagline:** if (AI.codes) { engineer.thinkBigger(); }
- **Presented by:** The Regis Company
- **Date:** April 9, 2025

## Visual Elements
- "The Regis Company" logo using glassmorphism effect (GlassPanel with hierarchy="container", level="secondary")
- Frosted glass effect for title section using the design system's Glass components with gradient backdrop
- Neural network visualization with subtle purple and blue accent colors from the Regis brand palette
- Background with dark gradient using colors.background.gradient.primary with a subtle paper texture overlay
- Glowing accent borders using colors.accent.500 to highlight key elements
- Animated particles that respond to cursor movement (representing AI responsiveness)
- Use of brand colors: primary blue (#2196f3), secondary purple (#9c27b0), accent teal (#00bcd4)

## Interactive Elements
- Particle system animation in background that subtly responds to mouse movement
- Logo entrance with Glass component animation—fade in with slight zoom and elevation increase (using animation.preset.cardHover)
- Code snippet that types itself out with realistic cursor blink and keyboard sounds
- Subtle pulsing glow effect on main title (using animation.keyframes.pulse)
- Microinteractions: Subtle hover effects on interactive elements with elevation changes

## Animation Sequences
1. Background with particle system fades in first (animation.transition.fadeIn with duration="normal")
2. Logo appears with glassmorphism effect using animation.preset.cardHover (300ms fade in with slight elevation)
3. Headline types out letter by letter with typing sound effect (using useAudioEffects hook)
4. Tagline code snippet types itself out with cursor blink, highlighting syntax elements in brand colors
5. Code snippet completes, then "executes" with a subtle flash effect, triggering the pulsing glow on title
6. Presenter information slides in from bottom using animation.keyframes.slideInUp
7. Subtle continuous particle movement maintains visual interest throughout

## Audio Elements
- Tech ambient background sound (public/sounds/tech-ambience.mp3) at low volume to establish atmosphere
- Keyboard typing sound effects (public/sounds/keyboard-typing.mp3) precisely synced with code typing animation
- Subtle "whoosh" sound (public/sounds/whoosh.mp3) when logo appears with glassmorphism effect
- Soft success sound (public/sounds/success.mp3) when code "executes" and title begins pulsing
- All audio effects implemented using the useAudioEffects hook for better control and synchronization

## Code snippet to be displayed
```javascript
// AI Dev Workshop - The Regis Company
if (AI.codes) {
  engineer.thinkBigger();
  skills.practice.personalize();
  value.grow();
}
```

## Design Notes
- Use modern, clean sans-serif font for headlines with appropriate tokens.typography styles
- Implement glassmorphism consistently using the design system's Glass components
- Create clear visual hierarchy: Logo → Headline → Code → Presenter info
- Ensure high contrast for readability (WCAG AA compliance)
- Layer elements with proper z-index (according to tokens.zIndex) for depth perception
- Utilize brand colors for accents and highlights (blue #2196f3, purple #9c27b0, teal #00bcd4)
- Apply elevation through shadows (tokens.glassShadow) to create depth in UI elements
- Use the paper texture overlay (public/images/paper-texture.png) with low opacity for added visual richness

## User Interactions
- Subtle particle movement that follows cursor position to create a sense of AI responsiveness
- Mouse hover effects on key elements using animation.preset.buttonHover and animation.preset.cardHover
- Optional click interaction on logo that triggers a small pulse animation (animation.keyframes.pulse)
- Presentation automatically progresses after all animations complete, but can be advanced manually

## Transitions
- Enter: Elements appear using staggered animations with consistent easing (animation.easing.decelerate)
  * Background particles fade in first (animation.transition.fadeIn)
  * Logo appears with glassmorphism effect and subtle elevation
  * Title types out with synchronized audio
  * Code snippet appears with syntax highlighting in brand colors
  * Presenter information slides up (animation.keyframes.slideInUp)
- Exit: Coordinated transition using animation.transition.fadeOut with elements fading in reverse order
- Transition timing: Approximately 4 seconds for full entrance sequence

## Regis Company Brand Reference
- Website: [www.regiscompany.com](https://www.regiscompany.com)
- Brand tagline: "Get Skills. Gain Confidence. Grow Value."
- Brand mission: "We exist to ignite meaning and purpose within workers and the workplace."
- Brand beliefs:
  * "Learners should be captivated, not held captive."
  * "Personalized Skills Practice empowers you to adapt and maximize value."
- Brand positioning: Delivering the industry's most powerful Personalized Skills Practice solutions with AI-powered technology
- Key message alignment: Innovation, technology-forward, and transformative learning through interactive, brain-friendly approaches
# Slide 01: Title Slide

## Title
AI Dev Workshop: Revolutionizing Development with AI Coding Tools

## Purpose
To establish brand presence, set the tone for the presentation, and introduce the core concept of AI-powered development.

## Key Message
AI coding tools are transforming software development, and this workshop demonstrates their power through a meta-recursive approach.

## Content
- **Headline:** AI Dev Workshop
- **Subtitle:** Revolutionizing Development with AI Coding Tools
- **Code Snippet:** 
  ```javascript
  // AI Dev Workshop - The Regis Company
  if (AI.codes) {
    engineer.thinkBigger();
    skills.practice.personalize();
    value.grow();
  }
  ```

## Visual Elements
- "The Regis Company" logo using glassmorphism effect (GlassPanel with hierarchy="container", level="secondary")
- Frosted glass effect for title section using the design system's Glass components with gradient backdrop
- Neural network visualization with subtle purple and blue accent colors from the Regis brand palette
- Background with dark gradient using from-gray-900 via-blue-900 to-purple-900 with a subtle paper texture overlay
- Glowing accent borders to highlight key elements
- Animated particles that respond to cursor movement (representing AI responsiveness)
- Use of brand colors: primary blue (#2196f3), secondary purple (#9c27b0), accent teal (#00bcd4)

## Interactive Elements
- Particle system animation in background that subtly responds to mouse movement
- Logo entrance with Glass component animation—fade in with slight zoom
- Code snippet that types itself out with realistic keyboard sounds
- Subtle pulsing glow effect on main title when code typing completes
- Perspective effect on content that responds to mouse movement

## Animation Sequences
1. Background with particle system appears first
2. Logo appears with glassmorphism effect (800ms fade in)
3. Headline appears with glassmorphism effect (1800ms)
4. Code snippet appears and types itself out with syntax highlighting in brand colors (3000ms)
5. Code snippet completes, then triggers a subtle pulsing effect on the title
6. Empty presenter section is positioned at the bottom (7500ms)
7. Subtle continuous particle movement maintains visual interest throughout

## Audio Elements
- Background music (/audio/cool-hip-hop-loop-275527.mp3) at low volume to establish atmosphere
- Keyboard typing sound effects synchronized with code typing animation
- Panel slide sound effects when new elements appear
- Success sound when code typing completes
- All audio effects implemented through AudioContext

## Code snippet displayed
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
- Implement glassmorphism consistently using glass-panel-interactive and other glass classes
- Create clear visual hierarchy: Logo → Headline → Code
- Ensure high contrast for readability (WCAG AA compliance)
- Layer elements with proper z-index (according to tokens.zIndex) for depth perception
- Utilize brand colors for accents and highlights (blue #2196f3, secondary purple #9c27b0, accent teal #00bcd4)
- Apply elevation through shadows (tokens.glassShadow) to create depth in UI elements
- Use the paper texture overlay (public/images/paper-texture.png) with low opacity for added visual richness

## User Interactions
- Subtle particle movement that follows cursor position to create a sense of AI responsiveness
- Perspective container that creates 3D effect based on mouse position
- Throttled mouse movement handlers for performance optimization

## Transitions
- Enter: Elements appear using staggered animations
  * Background particles appear first
  * Logo appears with glassmorphism effect (800ms)
  * Title and subtitle appear (1800ms)
  * Code snippet appears and types out (3000ms)
- Exit: Coordinated transition implemented through cleanup in useEffect hook
- Animation is controlled through React useState and useEffect hooks with setTimeout
- Animation stages are tracked and elements are rendered conditionally

## Regis Company Brand Reference
- Website: [www.regiscompany.com](https://www.regiscompany.com)
- Brand tagline: "Get Skills. Gain Confidence. Grow Value."
- Brand mission: "We exist to ignite meaning and purpose within workers and the workplace."
- Brand beliefs:
  * "Learners should be captivated, not held captive."
  * "Personalized Skills Practice empowers you to adapt and maximize value."
- Brand positioning: Delivering the industry's most powerful Personalized Skills Practice solutions with AI-powered technology
- Key message alignment: Innovation, technology-forward, and transformative learning through interactive, brain-friendly approaches
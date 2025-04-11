# Slide 02: Introduction Code

## Title
AI Dev Workshop – A Story in Code

## Purpose
To metaphorically illustrate the transformation happening in software development through a narrative-driven code example, demonstrating live AI coding while setting expectations for the workshop.

## Key Message
AI is rapidly shifting how we develop software, enabling engineers to focus on higher-level thinking while increasing productivity and value delivery.

## Content
No traditional bullet points or text - the entire slide is initially a simulated IDE environment showing code being typed in real-time, followed by a translation panel for non-developers.

**Translation for Normal Humans Panel Content:**
```
WHAT THIS ACTUALLY MEANS (FOR THE NON-DEVELOPERS):

• Today, AI writes about 65% of code
• By mid-2025, AI will write 90% of code
• By early 2026, prepare for AI to write ALL the code

THE BOTTOM LINE:
→ With AI: We work 3x faster, have 50% fewer bugs, and deliver 2x more value
→ Without AI: *Warning siren emoji* We fall behind while competitors zoom ahead

WHAT THIS MEANS FOR DEVELOPERS:
You finally get to focus on the fun stuff - architecture and solving real problems -
while AI handles the tedious bits that make you question your life choices.

IN CONCLUSION:
AI types the boring parts.
We think about the interesting parts.
(Yes, we're keeping our jobs. No, the robots aren't taking over... yet.)
```

## Visual Elements
- Full-screen IDE environment with dark theme using the same color palette as slide_01
- Syntax highlighting for JavaScript with brand colors: 
  - Keywords in accent teal (#00bcd4)
  - Strings in secondary purple (#9c27b0)
  - Function calls in primary blue (#2196f3)
- GlassPanel with hierarchy="container" for main code editor background
- Line numbers with subtle accent color (#00bcd4)
- Animated cursor indicator with realistic blink timing
- Simulated status bar at bottom using GlassPanel with hierarchy="interactive" and "AI Assisted" indicator
- Mini-map on right side with subtle paper texture overlay (public/images/paper-texture.png)
- "Translation for Normal Humans" panel implemented as GlassPanel with hierarchy="emphasized":
  - Panel slides in from right after code animation completes
  - Uses frosted glass effect with gradient backdrop
  - Includes elevation through tokens.glassShadow[3] for depth
  - Small translator icon with brand colors
  - Tilted with slight rotation transform to contrast with the precise code editor

## Interactive Elements
- Typing animation that shows code being written in real-time (using the same CodeTyping component as slide_01)
- Cursor blinks realistically with animation.keyframes implementation
- Syntax highlighting applies in real-time as code is typed with smooth color transitions
- Particle system that subtly responds to cursor movements during typing pauses
- Simulated AI suggestions appearing with glassmorphism effect (using GlassPanel with hierarchy="interactive")
- Mouse hover effects on status bar elements using animation.preset.buttonHover
- Subtle elevation changes on hover for interactive elements using tokens.glassShadow

## Animation Sequences
1. IDE environment appears using animation.transition.fadeIn with duration="fast"
2. Status bar and minimap slide in from bottom and right using animation.keyframes.slideInUp
3. Code header comment types first with synchronized keyboard sounds
4. Variable declarations type with realistic speed and syntax highlighting applied in real-time
5. Console.log statement types with slight pause for emphasis
6. Conditional blocks type with animation.transition.transform between sections
7. Logic inside conditionals appears with proper indentation and syntax coloring
8. Final console.log statements type with dramatic pause before last line using animation.duration.slow
9. Cursor continues to blink with animation.keyframes implementation
10. "Translation for Normal Humans" panel slides in from right using animation.preset.cardHover with elevation increase
11. Plain English explanations fade in one by one with animation.keyframes.slideInUp and subtle glow effect
12. Bullet points appear with synchronized "pop" sound effects and slight bounce using animation.keyframes.pulse

## Audio Elements
- Realistic mechanical keyboard typing sounds (public/sounds/keyboard-typing.mp3) precisely synchronized with typing animation
- Tech ambient background sound (public/sounds/tech-ambience.mp3) continued from slide_01 for continuity
- "Success" sound effect (public/sounds/success.mp3) when final code line is completed
- "Whoosh" sound effect (public/sounds/whoosh.mp3) when translation panel slides in
- "Pop" sound effect (public/sounds/pop.mp3) for each translation bullet point appearance
- All audio implemented using the useAudioEffects hook for precise timing and volume control
- Volume levels matched with slide_01 for consistent audio experience
- Optional: brief silence before important sections to create audio emphasis

## Code Content
The following is the actual code content to be displayed in the simulated IDE, with syntax elements aligned to Regis brand colors:

```javascript
// AI Dev Workshop – A Story in Code
// The Regis Company - Get Skills. Gain Confidence. Grow Value.

const today = new Date("2025-04-09");
let codeWrittenByAI = 0.65; // 65% today
let engineers = ["us"];
let mission = null;
let skills = { practice: { personalize: () => "Learners captivated, not held captive" } };
let value = { grow: () => "Maximizing worker and workplace value" };

console.log("Bootstrapping the future...");

// Forecast
if (today >= new Date("2025-07-01")) {
  codeWrittenByAI = 0.90; // 90% by mid-2025
}
if (today >= new Date("2026-03-01")) {
  codeWrittenByAI = 1.00; // 100% by early 2026
}

// Business logic
if (AI.assist === true) {
  speed += 3;                 // Work 3x faster
  bugs -= 0.5;                // 50% fewer bugs
  valueDelivered *= 2;        // 2x more value
  engineers.forEach(dev => dev.focus("architecture", "product thinking"));
  skills.practice.personalize();
  value.grow();
  mission = "accelerate innovation";
} else {
  console.warn("Falling behind... competitors deploying updates without us.");
  mission = "catch up";
}

// Final state
console.log("AI writes the code.");
console.log("We engineer the future.");
// Let's get to work.
```

## Design Notes
- Use the same monospaced font from slide_01 for consistency
- Apply brand-based syntax highlighting using colors:
  - Keywords: accent teal (#00bcd4)
  - Strings: secondary purple (#9c27b0)
  - Functions: primary blue (#2196f3)
  - Comments: neutral.600 (#757575)
- Implement glassmorphism using GlassPanel components with proper hierarchy and levels
- Use proper layering with tokens.zIndex for depth perception
- Include subtle paper texture overlay (public/images/paper-texture.png) at low opacity
- Apply elevation through shadows (tokens.glassShadow) to create depth
- Typing speed calibrated to match animation.duration tokens

**Translation panel design:**
- Implement with GlassPanel using hierarchy="emphasized" for proper contrast
- Apply subtle rotation transform (3-5 degrees) for a less formal appearance
- Include brand colors for emphasis points and icons
- Use a readable sans-serif font that contrasts with the monospace code font
- Apply animation.preset.cardHover on hover for microinteractions
- Ensure WCAG AA compliance for text contrast against glass backgrounds

## User Interactions
- Subtle particle system response to cursor movements matching slide_01's interactive elements
- Mouse hover effects on translation panel using animation.preset.cardHover
- Optional click interaction on translation panel reveals additional "developer humor" content
- Subtle hover states on code snippets to indicate they are part of the narrative
- Consistent interactive behavior with slide_01 for cohesive presentation experience
- Presentation can be advanced manually, but will auto-advance after all animations complete

## Transitions
- Enter: Consistent with slide_01's exit transition using animation.transition.fadeIn
  * Background with particle system fades in first
  * IDE elements appear with staggered glassmorphism effects
  * Status bar and minimap slide in from bottom and right
  * Typing begins with synchronized audio
- Exit: Coordinated transition to next slide
  * Elements fade using animation.transition.fadeOut with staggered timing
  * Translation panel exits last with animation.keyframes.fadeOut
  * Brief pause after all animations complete before advancing
  * Optional zoom-out effect to reveal the broader context of the presentation

## Special Implementation Notes
- **Implementation Component Reuse:** Use the CodeTyping component from slide_01 for consistency
  - Reuse the same animation timing and settings for a cohesive presentation
  - Utilize the existing useAudioEffects hook for synchronized sound effects
  - Match glassmorphism implementation with slide_01's Glass components

- **Glassmorphism Implementation:**
  - Use GlassPanel components with appropriate hierarchy and level settings
  - Implement proper stacking context using tokens.zIndex
  - Apply consistent shadow depth with tokens.glassShadow
  - Ensure proper blur intensity and transparency for readability

- **Animation Coordination:**
  - Synchronize animation.transition timings between slides for smooth flow
  - Use staggered animations with consistent easing functions
  - Maintain consistent particle system behavior with slide_01
  - Calibrate typing speed to match with animation.duration tokens

- **Audio Implementation:**
  - Preload all sound files to prevent lag in playback
  - Use consistent volume levels with slide_01
  - Implement precise timing for synchronized typing sounds

- **Accessibility Considerations:**
  - Ensure sufficient contrast for text against glassmorphism backgrounds
  - Use animations that respect user preferences for reduced motion
  - Maintain readable font sizes throughout the presentation
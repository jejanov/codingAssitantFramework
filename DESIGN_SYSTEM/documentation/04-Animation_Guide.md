# Animation System Guide

This document outlines the animation system used across the application. Our animation system is designed to create consistent, smooth transitions that enhance the user experience while maintaining performance.

## Core Animation Principles

1. **Purposeful Motion**: Animations should have a clear purpose - guiding attention, providing feedback, or establishing spatial relationships.
2. **Consistent Timing**: Use standardized durations for similar types of animations to create a coherent feel.
3. **Appropriate Easing**: Different animations require different easing curves to feel natural.
4. **Performance Focused**: Animations should be optimized for performance, especially on lower-end devices.
5. **Hierarchical Movement**: Motion should reflect the component hierarchy.

## Animation Tokens

Our system utilizes a comprehensive set of animation tokens defined in `tokens/animation.ts` to ensure consistency:

### Duration Tokens

```js
duration: {
  fastest: "100ms", // Ultra quick micro-interactions
  fast: "150ms", // Quick transitions like hover states
  normal: "300ms", // Standard transition time
  slow: "450ms", // Slower transitions for emphasis
  slower: "600ms" // Very slow transitions for dramatic effect
}
```

### Easing Tokens

```js
easing: {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)", // Standard easing for most transitions
  decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)", // Deceleration at the end (entrances)
  accelerate: "cubic-bezier(0.4, 0.0, 1, 1)", // Acceleration at the beginning (exits)
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)" // Sharp movement for emphasis
}
```

### Transition Helpers

The system includes helper functions for common transition types:

```js
// Single property transitions
color: (duration = 'fast', easing = 'standard') => 
  `color ${duration} ${easing}`

background: (duration = 'fast', easing = 'standard') => 
  `background-color ${duration} ${easing}`

opacity: (duration = 'fast', easing = 'standard') => 
  `opacity ${duration} ${easing}`

transform: (duration = 'normal', easing = 'decelerate') => 
  `transform ${duration} ${easing}`

// Multi-property transitions
hover: (duration = 'fast') => 
  `background-color ${duration} standard,
   transform ${duration} decelerate,
   box-shadow ${duration} standard`

all: (duration = 'normal', easing = 'standard') => 
  `all ${duration} ${easing}`
```

### Keyframe Animations

For more complex animations, we provide keyframe definitions:

```js
keyframes: {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from { 
        transform: translateY(10px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  // ...and more (see tokens/animation.ts)
}
```

### Animation Presets

Ready-to-use animation configurations for common use cases:

```js
preset: {
  fadeIn: {
    animation: 'fadeIn 0.3s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
  },
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: tokens.glassShadow[3],
  },
  // ...and more (see tokens/animation.ts)
}
```

## Usage Examples

### Basic Transitions

```jsx
import { tokens } from '../tokens';
import styled from '@emotion/styled';

// Using the transition helper for all properties
const Container = styled.div`
  transition: ${tokens.animation.transition.all()};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

// Using property-specific transitions
const Button = styled.button`
  transition: ${tokens.animation.transition.background('fast')},
              ${tokens.animation.transition.transform('fast')};
  
  &:hover {
    background-color: ${tokens.colors.primary[400]};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
```

### Using Keyframes

```jsx
import { tokens } from '../tokens';
import styled from '@emotion/styled';

const FadeInElement = styled.div`
  animation: ${tokens.animation.keyframes.fadeIn}
  animation-duration: ${tokens.animation.duration.normal};
  animation-timing-function: ${tokens.animation.easing.decelerate};
  animation-fill-mode: forwards;
`;

// Or using the preset
const FadeInElementAlt = styled.div`
  ${tokens.animation.preset.fadeIn}
`;
```

### Component Transitions

```jsx
import { tokens } from '../tokens';
import styled from '@emotion/styled';

// Toast message that slides in and fades out
const Toast = styled.div`
  opacity: 0;
  transform: translateY(10px);
  transition: ${tokens.animation.transition.transform()},
              ${tokens.animation.transition.opacity()};
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  &.hiding {
    opacity: 0;
    transform: translateY(-10px);
    transition: ${tokens.animation.transition.transform('fast', 'accelerate')},
                ${tokens.animation.transition.opacity('fast', 'accelerate')};
  }
`;
```

## Timing Guidelines

Different UI elements should use appropriate timing based on their purpose and size:

1. **Micro-interactions** (hover states, button presses): `fastest` to `fast` (100-150ms)
2. **Standard transitions** (panels opening/closing, tooltips): `normal` (300ms)
3. **Large element animations** (modals, page transitions): `slow` (450ms)
4. **Dramatic reveals** (splash screens, celebrations): `slower` (600ms)

## Easing Guidelines

1. **Standard** easing: Most UI transitions
2. **Decelerate** easing: Elements entering the screen or becoming more prominent
3. **Accelerate** easing: Elements exiting the screen or becoming less prominent
4. **Sharp** easing: Emphasized interactions needing attention

## Performance Tips

1. **Animate GPU-accelerated properties** when possible: transform, opacity
2. **Avoid animating layout properties** when possible: width, height, padding, margin
3. **Use `will-change`** for complex animations, but use sparingly
4. **Use `transform: translateZ(0)`** to force GPU acceleration when needed
5. **Consider reduced motion** for accessibility

## Accessibility Considerations

1. **Honor user preferences**: Respect the `prefers-reduced-motion` media query
2. **Keep animations under 5 seconds**: Longer animations can cause discomfort
3. **Avoid rapid flashing**: Can cause seizures in susceptible individuals
4. **Provide alternative ways to access information**: Don't rely solely on animations 
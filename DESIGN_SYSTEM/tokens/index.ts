/**
 * Main Tokens Export
 */

import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { radius } from "./radius";
import { elevation, glassShadow, shadowDepth } from "./elevation";
import { animation } from "./animation";
import { transparency, blur } from "./transparency";
import { effects } from "./effects";
import { zIndex } from "./zIndex";
import { helpers } from "./helpers";

// Graph specific tokens (Commented out for general template)
/*
const nodeSize = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48
};
const edgeWidth = {
  thin: 0.5,
  normal: 1,
  thick: 2,
  extraThick: 3
};
const edgeLineStyle = {
  curved: "curved",
  straight: "straight"
};
const scaling = {
  hover: 1.1,
  select: 1.15
};
const layout = {
  forceDirected: {
    name: "forceDirected",
    simulationStopVelocity: 0.1
  },
  hierarchical: {
    name: "hierarchical",
    direction: "down",
    packing: "bin"
  },
  grid: {
    name: "grid"
  }
};
*/

// Export a combined tokens object
export const tokens = {
    colors,
    spacing,
    typography,
    radius,
    elevation,
    glassShadow,
    shadowDepth,
    animation,
    effects,
    transparency,
    blur,
    zIndex,
    // Commented out graph specific tokens
    /*
    nodeSize,
    edgeWidth,
    edgeLineStyle,
    scaling,
    layout,
    */
};

// Re-export individual token categories
export {
    colors,
    spacing,
    typography,
    radius,
    elevation,
    glassShadow,
    shadowDepth,
    animation,
    effects,
    transparency,
    blur,
    zIndex,
    helpers
};

// Re-export types if needed 
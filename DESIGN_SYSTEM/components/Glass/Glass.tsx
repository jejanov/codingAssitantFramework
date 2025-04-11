import styled from "@emotion/styled";
import { Box } from "@mui/material";
import {
  tokens,
  transparency,
  blur,
  glassShadow,
  shadowDepth,
  radius
} from "../../tokens";

// Define prop interfaces for type safety
export interface GlassProps {
  intensity?: 'light' | 'medium' | 'heavy' | 'intense';
  borderRadius?: string;
  shadow?: number;
  opacity?: number;
  hierarchy?: 'container' | 'interactive' | 'emphasized' | 'content';
  level?: 'primary' | 'secondary' | 'tertiary';
}

// Helper functions (moved to a separate utils file)
import {
  getOpacityFromHierarchy,
  getBlurFromHierarchy,
  getGlassShadowFromHierarchy,
  getBlurFromIntensity,
  getBorderRadius
} from './utils';

// Core Glass Container
export const ContainerGlass = styled(Box) <GlassProps>`
  position: relative;
  backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
    hierarchy && level
      ? getBlurFromHierarchy(hierarchy, level)
      : getBlurFromIntensity(intensity)
  });
  background-color: rgba(255, 255, 255, ${({ hierarchy, level, opacity }) =>
    opacity !== undefined
      ? opacity
      : hierarchy && level
        ? getOpacityFromHierarchy(hierarchy, level)
        : 0.2
  });
  border-radius: ${({ borderRadius }) => getBorderRadius(borderRadius)};
  box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy, level, shadow)
  };
  transition: ${tokens.animation.transition.all('normal')};
  will-change: transform, backdrop-filter, box-shadow;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
    opacity: 0.7;
  }
`;

// Interactive Glass
export const InteractiveGlass = styled(Box) <GlassProps>`
  position: relative;
  backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
    hierarchy && level
      ? getBlurFromHierarchy(hierarchy, level)
      : getBlurFromIntensity(intensity)
  });
  background-color: rgba(255, 255, 255, ${({ hierarchy, level, opacity }) =>
    opacity !== undefined
      ? opacity
      : hierarchy && level
        ? getOpacityFromHierarchy(hierarchy, level)
        : transparency.interactive.primary
  });
  border-radius: ${({ borderRadius }) => getBorderRadius(borderRadius)};
  box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy, level, shadow)
  };
  transition: ${tokens.animation.transition.all('fast')};
  will-change: transform, backdrop-filter, box-shadow;
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, ${({ hierarchy, level }) =>
    hierarchy && level
      ? getOpacityFromHierarchy(hierarchy, level) + 0.05
      : transparency.interactive.secondary
  });
    box-shadow: ${({ hierarchy, level, shadow }) =>
    shadow !== undefined && shadow >= 0 && shadow <= 4
      ? glassShadow[(shadow + 1) as keyof typeof glassShadow]
      : hierarchy && level
        ? glassShadow[(shadowDepth[hierarchy][level] + 1) as keyof typeof glassShadow]
        : glassShadow[shadowDepth.interactive.secondary as keyof typeof glassShadow]
  };
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy, level, shadow)
  };
    transition: ${tokens.animation.transition.all('fastest')};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
    opacity: 0.8;
  }
`;

// Emphasized Glass
export const EmphasizedGlass = styled(Box) <GlassProps>`
  position: relative;
  backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
    hierarchy && level
      ? getBlurFromHierarchy(hierarchy, level)
      : getBlurFromIntensity(intensity || 'heavy')
  });
  background-color: rgba(255, 255, 255, ${({ hierarchy, level, opacity }) =>
    opacity !== undefined
      ? opacity
      : hierarchy && level
        ? getOpacityFromHierarchy(hierarchy, level)
        : transparency.emphasized.primary
  });
  border-radius: ${({ borderRadius }) => getBorderRadius(borderRadius)};
  box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy, level, shadow || 3)
  };
  transition: ${tokens.animation.transition.all('normal')};
  will-change: transform, backdrop-filter, box-shadow;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
    opacity: 0.8;
  }
`;

// General purpose Glass Panel
export const GlassPanel = styled(Box) <GlassProps>`
  position: relative;
  backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
    hierarchy && level
      ? getBlurFromHierarchy(hierarchy, level)
      : getBlurFromIntensity(intensity)
  });
  background-color: rgba(255, 255, 255, ${({ hierarchy, level, opacity }) =>
    opacity !== undefined
      ? opacity
      : hierarchy && level
        ? getOpacityFromHierarchy(hierarchy, level)
        : 0.3
  });
  border-radius: ${({ borderRadius }) => getBorderRadius(borderRadius)};
  box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy, level, shadow)
  };
  overflow: hidden;

  padding: ${tokens.spacing.md};
  transition: ${tokens.animation.transition.all('normal')};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
    opacity: 0.7;
    pointer-events: none;
  }
`;

// Export a generic Glass component that uses the ContainerGlass style
// This allows components to import { Glass } directly instead of ContainerGlass
export const Glass = ContainerGlass; 
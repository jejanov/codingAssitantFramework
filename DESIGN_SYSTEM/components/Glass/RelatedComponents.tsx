import styled from "@emotion/styled";
import { Box } from "@mui/material";
import {
  tokens,
  transparency,
  blur,
  glassShadow
} from "../../tokens";
import { GlassProps } from "./Glass";
import { getBlurFromHierarchy, getBlurFromIntensity, getGlassShadowFromHierarchy, getOpacityFromHierarchy, getBorderRadius } from "./utils";

// Glass Tooltip with blur effect
export const GlassTooltip = styled(Box) <GlassProps>`
  position: relative;
  backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
    hierarchy && level
      ? getBlurFromHierarchy(hierarchy, level)
      : getBlurFromIntensity(intensity || 'medium')
  });
  background-color: rgba(255, 255, 255, ${({ hierarchy, level, opacity }) =>
    opacity !== undefined
      ? opacity
      : hierarchy && level
        ? getOpacityFromHierarchy(hierarchy, level)
        : transparency.emphasized.secondary // Tooltips default to emphasized.secondary level
  });
  border-radius: ${({ borderRadius }) => getBorderRadius(borderRadius || 'md')};
  box-shadow: ${({ hierarchy, level, shadow }) =>
    getGlassShadowFromHierarchy(hierarchy || 'emphasized', level || 'secondary', shadow || 2)
  };
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.text.primary};
  z-index: ${tokens.zIndex.tooltip};
  max-width: 200px;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
    opacity: 0.7;
    pointer-events: none;
  }
`; 
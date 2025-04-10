import styled from "@emotion/styled";
import { Dialog, DialogProps } from "@mui/material";
import { tokens, transparency, blur, radius, glassShadow } from "../../tokens";
import { GlassProps } from "./Glass";
import { getBlurFromHierarchy, getBlurFromIntensity, getGlassShadowFromHierarchy, getOpacityFromHierarchy } from "./utils";


// Glass Dialog component with background blur
export const GlassDialog = styled(Dialog) <
    DialogProps & {
        hierarchy?: 'container' | 'interactive' | 'emphasized' | 'content';
        level?: 'primary' | 'secondary' | 'tertiary';
        intensity?: 'light' | 'medium' | 'heavy' | 'intense';
    }
>`
  & .MuiDialog-paper {
    background-color: rgba(255, 255, 255, ${({ hierarchy, level }) =>
        hierarchy && level
            ? getOpacityFromHierarchy(hierarchy, level)
            : transparency.emphasized.primary // Dialogs default to emphasized.primary level
    });
    backdrop-filter: blur(${({ hierarchy, level, intensity }) =>
        hierarchy && level
            ? getBlurFromHierarchy(hierarchy, level)
            : getBlurFromIntensity(intensity || 'heavy')
    });
    border-radius: ${radius.lg};
    box-shadow: ${({ hierarchy, level }) =>
        getGlassShadowFromHierarchy(hierarchy || 'emphasized', level || 'primary', 4)
    };
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
      opacity: 0.8;
      pointer-events: none;
    }
  }

  & .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3); /* Slightly transparent backdrop */
    backdrop-filter: blur(${blur.light});
  }
`;

// Dropdown menu item components
export const GlassDropdownMenu = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, ${transparency.emphasized.primary});
  backdrop-filter: blur(${blur.medium});
  border-radius: ${tokens.radius.md};
  box-shadow: ${glassShadow[3]};
  z-index: ${tokens.zIndex.dropdown};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 200px;
`;

export const GlassMenuItem = styled.div`
  padding: ${tokens.spacing.md};
  cursor: pointer;
  transition: ${tokens.animation.transition.all('fast')};

  &:hover {
    background-color: rgba(255, 255, 255, ${transparency.interactive.primary});
    transform: translateY(-1px);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`; 
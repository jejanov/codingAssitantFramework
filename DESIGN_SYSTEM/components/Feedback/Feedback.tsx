import styled from "@emotion/styled";
import { tokens, transparency, blur, glassShadow } from "../../tokens";

// Error container with proper styling
export const ErrorContainer = styled.div<{ type?: 'error' | 'success' | 'warning' | 'info' }>`
  position: fixed;
  bottom: ${tokens.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => {
        switch (props.type) {
            case 'success': return `rgba(76, 175, 80, ${transparency.emphasized.primary})`;
            case 'warning': return `rgba(255, 152, 0, ${transparency.emphasized.primary})`;
            case 'info': return `rgba(33, 150, 243, ${transparency.emphasized.primary})`;
            default: return `rgba(244, 67, 54, ${transparency.emphasized.primary})`;
        }
    }};
  color: white;
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  border-radius: ${tokens.radius.md};
  backdrop-filter: blur(${blur.medium});
  box-shadow: ${glassShadow[3]};
  display: flex;
  align-items: center;
  z-index: ${tokens.zIndex.notification};
  max-width: 80%;
`;

export const ErrorCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: ${tokens.typography.fontSize.lg};
  cursor: pointer;
  padding: 0;
  margin-left: ${tokens.spacing.md};
  opacity: 0.8;
  transition: ${tokens.animation.transition.opacity('fast')};

  &:hover {
    opacity: 1;
  }
`;

// Upload progress container
export const UploadProgressContainer = styled.div`
  position: fixed;
  bottom: ${tokens.spacing.lg};
  right: ${tokens.spacing.lg};
  width: 300px;
  background-color: rgba(255, 255, 255, ${transparency.container.primary});
  backdrop-filter: blur(${blur.medium});
  border-radius: ${tokens.radius.md};
  padding: ${tokens.spacing.md};
  box-shadow: ${glassShadow[2]};
  z-index: ${tokens.zIndex.notification};
`;

export const UploadProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, ${transparency.interactive.primary});
  border-radius: ${tokens.radius.sm};
  margin-bottom: ${tokens.spacing.sm};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => `${props.progress}%`};
    background-color: ${tokens.colors.primary[500]};
    border-radius: ${tokens.radius.sm};
    transition: ${tokens.animation.transition.size('normal')};
  }
`;

export const UploadProgressText = styled.div`
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.text.primary};
`;

// Connection status text
export const ConnectionStatusText = styled.div`
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.text.secondary};
  margin-top: ${tokens.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`; 
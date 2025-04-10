import styled from "@emotion/styled";
import { tokens, transparency } from "../../tokens";
import { GlassPanel } from "../Glass/Glass"; // Import GlassPanel

// Avatar component
export const Avatar = styled.div<{
    variant?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
    size?: "sm" | "md" | "lg";
}>`
  width: ${props =>
        props.size === "sm" ? "28px" :
            props.size === "lg" ? "40px" :
                "32px"
    };

  height: ${props =>
        props.size === "sm" ? "28px" :
            props.size === "lg" ? "40px" :
                "32px"
    };

  border-radius: ${tokens.radius.circle};

  background-color: ${props =>
        props.variant === "secondary" ? tokens.colors.secondary[500] :
            props.variant === "success" ? tokens.colors.status.success :
                props.variant === "error" ? tokens.colors.status.error :
                    props.variant === "warning" ? tokens.colors.status.warning :
                        props.variant === "info" ? tokens.colors.status.info :
                            tokens.colors.primary[500]
    };

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.text.inverse};
  font-weight: ${tokens.typography.fontWeight.bold};
  flex-shrink: 0;
  box-shadow: ${tokens.elevation[2]};

  border: 2px solid ${props =>
        props.variant === "secondary" ? tokens.colors.secondary[100] :
            props.variant === "success" ? "rgba(76, 175, 80, 0.2)" :
                props.variant === "error" ? "rgba(244, 67, 54, 0.2)" :
                    props.variant === "warning" ? "rgba(255, 152, 0, 0.2)" :
                        props.variant === "info" ? "rgba(33, 150, 243, 0.2)" :
                            tokens.colors.primary[100]
    };

  position: relative;
  font-size: ${props =>
        props.size === "sm" ? tokens.typography.fontSize.xs :
            props.size === "lg" ? tokens.typography.fontSize.md :
                tokens.typography.fontSize.sm
    };

  /* Add subtle inner highlight */
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 6px;
    border-radius: 50% 50% 35% 35%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
    pointer-events: none;
  }
`;

// File attachment container
export const FileAttachmentsContainer = styled.div`
  margin-top: ${tokens.spacing.sm};
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${tokens.radius.sm};
  padding: ${tokens.spacing.xs};
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

// File attachment item
export const FileAttachment = styled.div`
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: ${tokens.radius.sm};
  font-size: ${tokens.typography.fontSize.xs};
  margin-bottom: ${tokens.spacing.xs};
  display: flex;
  align-items: center;
  transition: all ${tokens.animation.duration.fast} ${tokens.animation.easing.standard};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

// === Empty State Components ===

export const EmptyStateContainer = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${tokens.spacing.xl};
  min-height: 200px;
`;

export const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${tokens.radius.circle};
  background-color: rgba(255, 255, 255, ${transparency.interactive.tertiary});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${tokens.spacing.md};
`;

export const EmptyStateIconSymbol = styled.div`
  font-size: ${tokens.typography.fontSize.xxl};
  color: ${tokens.colors.text.secondary};
`;

export const EmptyStateTitle = styled.h3`
  margin: 0;
  margin-bottom: ${tokens.spacing.md};
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.semiBold};
  color: ${tokens.colors.text.primary};
`;

export const EmptyStateDescription = styled.p`
  margin: 0;
  margin-bottom: ${tokens.spacing.lg};
  font-size: ${tokens.typography.fontSize.md};
  color: ${tokens.colors.text.secondary};
  max-width: 400px;
`; 
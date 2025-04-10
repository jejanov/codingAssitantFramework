import styled from "@emotion/styled";
import { tokens } from "../../tokens";

// Base button styles
const baseButtonStyles = `
  position: relative;
  overflow: hidden;
  font-family: ${tokens.typography.fontFamily.primary};
  border: none;
  cursor: pointer;
  transition: all ${tokens.animation.duration.fast} ${tokens.animation.easing.standard};
  transform: translateZ(0);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity ${tokens.animation.duration.fast} ${tokens.animation.easing.standard};
  }

  &:hover:not(:disabled)::after {
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    transition-duration: ${tokens.animation.duration.fast};

    &::after {
      opacity: 0;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Primary button component
export const Button = styled.button<{
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}>`
  ${baseButtonStyles}

  padding: ${props =>
        props.size === "sm" ? `${tokens.spacing.xs} ${tokens.spacing.sm}` :
            props.size === "lg" ? `${tokens.spacing.md} ${tokens.spacing.xl}` :
                `${tokens.spacing.sm} ${tokens.spacing.lg}`
    };

  font-size: ${props =>
        props.size === "sm" ? tokens.typography.fontSize.xs :
            props.size === "lg" ? tokens.typography.fontSize.lg :
                tokens.typography.fontSize.sm
    };

  font-weight: ${tokens.typography.fontWeight.medium};
  border-radius: ${tokens.radius.md};
  box-shadow: ${tokens.elevation[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.xs};

  background-color: ${props =>
        props.variant === "secondary" ? tokens.colors.secondary[500] :
            props.variant === "danger" ? tokens.colors.status.error :
                props.variant === "ghost" ? "transparent" :
                    tokens.colors.primary[500]
    };

  color: ${props =>
        props.variant === "ghost" ? tokens.colors.text.primary :
            tokens.colors.text.inverse
    };

  border: ${props =>
        props.variant === "ghost" ? `1px solid ${tokens.colors.border.light}` : "none"
    };

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${tokens.elevation[2]};
    background-color: ${props =>
        props.variant === "secondary" ? tokens.colors.secondary[600] :
            props.variant === "danger" ? tokens.colors.status.error + "DD" :
                props.variant === "ghost" ? "rgba(0, 0, 0, 0.05)" :
                    tokens.colors.primary[600]
    };
  }
`;

// Icon button component
export const IconButton = styled.button<{
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isActive?: boolean;
}>`
  ${baseButtonStyles}

  display: flex;
  align-items: center;
  justify-content: center;

  width: ${props =>
        props.size === "sm" ? "28px" :
            props.size === "lg" ? "44px" :
                "36px"
    };

  height: ${props =>
        props.size === "sm" ? "28px" :
            props.size === "lg" ? "44px" :
                "36px"
    };

  padding: ${props =>
        props.size === "sm" ? tokens.spacing.xs :
            props.size === "lg" ? tokens.spacing.md :
                tokens.spacing.sm
    };

  border-radius: ${tokens.radius.circle};
  box-shadow: ${tokens.elevation[1]};

  background-color: ${props =>
        props.isActive ? tokens.colors.status.warning :
            props.variant === "secondary" ? tokens.colors.secondary[500] :
                props.variant === "danger" ? tokens.colors.status.error :
                    props.variant === "ghost" ? "rgba(255, 255, 255, 0.2)" :
                        tokens.colors.primary[500]
    };

  color: ${props =>
        props.variant === "ghost" ? tokens.colors.text.primary :
            tokens.colors.text.inverse
    };

  & svg {
    width: ${props =>
        props.size === "sm" ? "14px" :
            props.size === "lg" ? "20px" :
                "16px"
    };

    height: ${props =>
        props.size === "sm" ? "14px" :
            props.size === "lg" ? "20px" :
                "16px"
    };
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${tokens.elevation[2]};
    background-color: ${props =>
        props.isActive ? tokens.colors.status.warning + "DD" :
            props.variant === "secondary" ? tokens.colors.secondary[600] :
                props.variant === "danger" ? tokens.colors.status.error + "DD" :
                    props.variant === "ghost" ? "rgba(255, 255, 255, 0.3)" :
                        tokens.colors.primary[600]
    };
  }
`; 
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { tokens, blur } from "../../tokens";

// Animation keyframe for pulsing dots
const pulsingDot = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
`;

// Status indicator dot
export const StatusDot = styled.div<{
    status: "success" | "warning" | "error" | "info";
    pulsing?: boolean;
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props =>
        props.status === "success" ? tokens.colors.status.success :
            props.status === "warning" ? tokens.colors.status.warning :
                props.status === "error" ? tokens.colors.status.error :
                    tokens.colors.status.info
    };
  box-shadow: 0 0 8px ${props =>
        props.status === "success" ? tokens.colors.status.success + "80" :
            props.status === "warning" ? tokens.colors.status.warning + "80" :
                props.status === "error" ? tokens.colors.status.error + "80" :
                    tokens.colors.status.info + "80"
    };
  animation: ${props => props.pulsing ? css`${pulsingDot} 1.5s infinite ease-in-out` : "none"};
`;

// Status tag component
export const StatusTag = styled.div<{
    status: "success" | "warning" | "error" | "info";
    loading?: boolean;
}>`
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.radius.sm};
  background-color: ${props =>
        props.status === "success" ? "rgba(56, 142, 60, 0.25)" :
            props.status === "warning" ? "rgba(255, 152, 0, 0.25)" :
                props.status === "error" ? "rgba(244, 67, 54, 0.25)" :
                    "rgba(25, 118, 210, 0.25)"
    };
  color: ${props =>
        props.status === "success" ? tokens.colors.status.success :
            props.status === "warning" ? tokens.colors.status.warning :
                props.status === "error" ? tokens.colors.status.error :
                    tokens.colors.status.info
    };
  font-size: ${tokens.typography.fontSize.xs};
  font-weight: ${tokens.typography.fontWeight.semiBold};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  max-width: fit-content;
  height: 26px;
  backdrop-filter: blur(${blur.light});
  border: 1px solid ${props =>
        props.status === "success" ? "rgba(56, 142, 60, 0.4)" :
            props.status === "warning" ? "rgba(255, 152, 0, 0.4)" :
                props.status === "error" ? "rgba(244, 67, 54, 0.4)" :
                    "rgba(25, 118, 210, 0.4)"
    };
  margin-right: ${tokens.spacing.sm};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props =>
        props.status === "success" ? tokens.colors.status.success :
            props.status === "warning" ? tokens.colors.status.warning :
                props.status === "error" ? tokens.colors.status.error :
                    tokens.colors.status.info
    };
    box-shadow: 0 0 6px ${props =>
        props.status === "success" ? "rgba(56, 142, 60, 0.6)" :
            props.status === "warning" ? "rgba(255, 152, 0, 0.6)" :
                props.status === "error" ? "rgba(244, 67, 54, 0.6)" :
                    "rgba(25, 118, 210, 0.6)"
    };
    animation: ${props => props.loading ? css`${pulsingDot} 1.5s infinite ease-in-out` : "none"};}
  }
`;

// Loading indicator component with dots
const LoadingDot = styled.div<{ delay: string }>`
  width: 8px;
  height: 8px;
  background-color: ${tokens.colors.secondary[300]};
  border-radius: ${tokens.radius.circle};
  margin-right: 4px;
  display: inline-block;
  animation: ${css`${pulsingDot} 1.5s infinite ease-in-out`} ${props => props.delay};
`;

export const LoadingDots = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
        <LoadingDot delay="0s" />
        <LoadingDot delay="0.2s" />
        <LoadingDot delay="0.4s" />
    </div>
);

// Progress bar container
export const ProgressBarContainer = styled.div`
  position: relative;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${tokens.radius.sm};
  overflow: hidden;
  width: 100%;
`;

// Progress bar indicator
export const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => `${props.progress}%`};
  background-color: ${tokens.colors.primary[500]};
  border-radius: ${tokens.radius.sm};
  transition: width 0.3s ease;
`; 
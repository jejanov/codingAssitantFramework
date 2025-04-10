import styled from "@emotion/styled";
import { tokens } from "../../tokens";

// Tab component
export const Tab = styled.button<{
    active?: boolean;
    hasIndicator?: boolean;
}>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  background: ${props => props.active
        ? `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))`
        : 'transparent'} !important;
  border: none;
  color: ${props => props.active ? tokens.colors.text.primary : tokens.colors.text.secondary};
  font-weight: ${props => props.active ? tokens.typography.fontWeight.semiBold : tokens.typography.fontWeight.regular};
  font-size: ${tokens.typography.fontSize.md};
  cursor: pointer;
  transition: all ${tokens.animation.duration.fast} ${tokens.animation.easing.standard};
  position: relative;
  overflow: visible;

  /* Highlight on hover */
  &:hover:not([active="true"]) {
    color: ${tokens.colors.text.primary};
  }

  /* Updated underline indicator with consistent glow effect */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px; /* Thinner line */
    background: ${props => props.active
        ? `linear-gradient(to right, ${tokens.colors.primary[400]}, ${tokens.colors.primary[600]})`
        : tokens.colors.primary[400]};
    transition: all ${tokens.animation.duration.normal} ${tokens.animation.easing.standard};
    transform: translateX(-50%);
    box-shadow: ${props => props.active
        ? `0 0 6px rgba(33, 150, 243, 0.3)`
        : `0 0 4px rgba(33, 150, 243, 0.2)`}; /* Consistent glow effect */
    border-radius: 2px 2px 0 0;
    opacity: ${props => props.active ? 1 : 0};
  }

  &:hover:not([active="true"])::after {
    width: 30%; /* Shorter indicator on hover */
    opacity: 0.5; /* More transparent */
  }
`;

// Tab container
export const TabsContainer = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
`; 
import styled from "@emotion/styled";
import { tokens } from "../../tokens";

// Container for component sections
export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${tokens.spacing.lg};
`;

// Horizontal layout with spacing
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  flex-wrap: wrap;
`;

// Vertical layout with spacing
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
`;

// Flexible space element
export const Spacer = styled.div`
  flex: 1;
`;

// Grid layout container
export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: ${props => props.gap || tokens.spacing.md};
`; 
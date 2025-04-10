import styled from "@emotion/styled";
import { tokens, transparency, blur } from "../../tokens";

// Text input component
export const TextInput = styled.input`
  width: 100%;
  padding: ${tokens.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${tokens.radius.md};
  background-color: rgba(255, 255, 255, ${transparency.interactive.secondary});
  backdrop-filter: blur(${blur.medium});
  font-size: ${tokens.typography.fontSize.md};
  font-family: ${tokens.typography.fontFamily.primary};
  transition: all ${tokens.animation.duration.normal} ${tokens.animation.easing.standard};
  box-shadow: ${tokens.elevation[1]};
  transform: translateZ(0);

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[300]};
    box-shadow: ${tokens.elevation[2]};
    background-color: rgba(255, 255, 255, ${transparency.interactive.tertiary});
  }

  &::placeholder {
    color: ${tokens.colors.text.secondary};
  }
`;

// Textarea component
export const TextArea = styled.textarea`
  width: 100%;
  padding: ${tokens.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${tokens.radius.md};
  background-color: rgba(255, 255, 255, ${transparency.interactive.secondary});
  backdrop-filter: blur(${blur.medium});
  font-size: ${tokens.typography.fontSize.md};
  font-family: ${tokens.typography.fontFamily.primary};
  resize: none;
  transition: all ${tokens.animation.duration.normal} ${tokens.animation.easing.standard};
  box-shadow: ${tokens.elevation[1]};
  transform: translateZ(0);

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[300]};
    box-shadow: ${tokens.elevation[2]};
    background-color: rgba(255, 255, 255, ${transparency.interactive.tertiary});
  }

  &::placeholder {
    color: ${tokens.colors.text.secondary};
  }
`; 
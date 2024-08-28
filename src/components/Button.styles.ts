// src/components/Button.styles.ts
import styled from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success";

interface ButtonContainerProps {
  $variant?: ButtonVariant;
}

const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  border: 0;
  margin: 8px;
  background-color: ${(props) => props.theme["red-500"]};
  color: ${(props) => props.theme.white};
`;

export default ButtonContainer;

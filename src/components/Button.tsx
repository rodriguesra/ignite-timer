// src/components/Button.tsx
import ButtonContainer, { ButtonVariant } from "./Button.styles.ts";

interface ButtonProps {
  variant?: ButtonVariant;
}

const Button = ({ variant = "primary" }: ButtonProps) => {
  return <ButtonContainer $variant={variant}>Enviar</ButtonContainer>;
};
export default Button;

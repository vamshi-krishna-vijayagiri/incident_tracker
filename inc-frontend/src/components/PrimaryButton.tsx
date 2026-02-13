import React from "react";
import Button from "@mui/material/Button";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: object;
  type?: "button" | "submit" | "reset";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  variant = "contained",
  fullWidth = false,
  disabled = false,
  sx,
  type = "button",
}) => {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
      type={type}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;

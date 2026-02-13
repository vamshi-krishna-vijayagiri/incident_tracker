import React from "react";
import TextField from "@mui/material/TextField";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  placeholder?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  fullWidth = true,
  variant = "outlined",
  error = false,
  disabled = false,
  required = false,
  size = "medium",
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      name={name}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant={variant}
      error={error}
      disabled={disabled}
      required={required}
      size={size}
    />
  );
};

export default InputField;

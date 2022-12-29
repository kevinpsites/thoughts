import React from "react";
import { useState } from "react";
import { Input } from "../input";
import { InputProps } from "../input/input";
import { Label } from "../label";
import styles from "./LabelInput.module.css";
import { ReactComponent as SearchIcon } from "icons/search.svg";

interface LabelInputProps extends InputProps {
  label: string;
  For: string;
  children: any;
  labelPosition?: "top" | "bottom";
  InputWidth?: "large" | "medium" | "small";
  variant?: "primary" | "search";
  className?: string;
  classOverride?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  // leadingIcon?: JSX.Element;
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(
  (
    {
      label,
      placeholder,
      children,
      For = "",
      labelPosition = "top",
      InputWidth = "medium",
      variant = "primary",
      className = "",
      classOverride,
      helperText,
      required,
      error,
      type = "text",
      // leadingIcon,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(props.defaultValue ?? "");

    return (
      <div className={`${styles.inputContainer}`}>
        <Input
          // placeholder="Please enter a presentation PIN to join"
          // autoComplete="off"
          type={type}
          // value={value}
          width={InputWidth}
          ref={ref}
          {...props}
          required={required}
          name={For}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);

            if (props.onChange) {
              props.onChange(e);
            }
          }}
          error={error}
        />
        <Label
          For={For}
          classOverride={` ${styles.placeholderText} ${
            error && styles.errorLabel
          }  `}
          aria-labelledby="placeholder-fname"
        >
          {/* {leadingIcon ?? null} */}

          <div
            className={`${styles.text} ${value ? styles.filledText : ""} ${
              labelPosition === "bottom" ? styles.bottomLabel : ""
            }`}
          >
            {variant === "search" ? (
              <SearchIcon className={`${styles.iconColor}`} />
            ) : null}
            {placeholder ?? label}
          </div>
        </Label>
        {(helperText !== undefined || required) && (
          <div
            className={`${styles.helperText} ${
              labelPosition === "bottom" ? styles.bottomHelperText : ""
            } ${
              InputWidth === "large"
                ? styles.helperTextLarge
                : InputWidth === "small"
                ? styles.helperTextSmall
                : ""
            }`}
          >
            {helperText ? helperText : required ? "Required" : ""}
          </div>
        )}
      </div>
    );
  }
);

export default LabelInput;

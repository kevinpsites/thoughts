import React, { LegacyRef, RefObject } from "react";
import styles from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLElement> {
  name: string;
  width?: "large" | "medium" | "small";
  variant?: "primary" | "search";
  className?: string;
  classOverride?: string;
  error?: boolean;
  ref?: RefObject<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      width = "medium",
      variant = "primary",
      className = "",
      classOverride,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <input
        name={name}
        className={
          classOverride
            ? classOverride
            : `
      ${styles.inputMain}
      ${
        width === "large"
          ? styles.inputLarge
          : width === "small"
          ? styles.inputSmall
          : styles.inputMedium
      }

      ${error ? styles.errorInput : ""}
      `
        }
        ref={ref}
        {...props}
      />
    );
  }
);

// ${
//   variant === "search"
//     ? styles.secondaryinput
//     : styles.primaryinput
// }

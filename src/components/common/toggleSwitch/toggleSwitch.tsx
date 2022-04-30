import React from "react";
import styles from "./ToggleSwitch.module.css";

export interface ToggleSwitchProps
  extends React.LabelHTMLAttributes<HTMLElement> {
  initialValue?: boolean;
  htmlFor: string;
  className?: string;
  classOverride?: string;
}

const ToggleSwitch = ({
  initialValue = false,
  htmlFor,
  className = "",
  classOverride,
  ...props
}: ToggleSwitchProps) => {
  return (
    <label className={classOverride ?? `${styles.switch} ${className}`}>
      <input
        type={"checkbox"}
        name={htmlFor}
        defaultChecked={initialValue}
        {...props}
      />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default ToggleSwitch;

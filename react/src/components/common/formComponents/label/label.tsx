import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLElement> {
  children: any;
  For: string;
  width?: "large" | "medium" | "small";
  variant?: "primary" | "search";
  className?: string;
  classOverride?: string;
}

export const Label = ({
  children,
  For = "",
  width = "medium",
  variant = "primary",
  className = "",
  classOverride,
  ...props
}: LabelProps) => (
  <label
    htmlFor={For}
    className={classOverride ? classOverride : ``}
    {...props}
  >
    {children}
  </label>
);

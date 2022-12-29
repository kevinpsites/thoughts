import React from "react";
import { InputProps } from "../input/input";
import styles from "./LabelInput.module.css";
import { ReactComponent as UploadIcon } from "icons/fileUpload.svg";

interface LabelInputProps extends InputProps {
  fieldValue: File | string;
  label: string;
  For: string;
  children: any;
  uploadText?: string;
  labelPosition?: "top" | "bottom";
  InputWidth?: "large" | "medium" | "small";
  variant?: "primary" | "search";
  className?: string;
  classOverride?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  onFormSubmit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // fieldList: FormFieldEntry[];
  // leadingIcon?: JSX.Element;
}

const HiddenFileLabelInput = ({
  fieldValue,
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
  onFormSubmit,
  uploadText = "File to Upload",
  // fieldList,
  // leadingIcon,
  ...props
}: LabelInputProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormSubmit(e);

    // let validFields = true;
    // let fieldValues: FormFieldEntry[] = [];
    // fieldList.map((field) => {
    //   if (field.name === e.target.name && field.type === "file") {
    //     let fieldValuesDict = e.target;
    //     let newValue: string | File = "";
    //     if (fieldValuesDict.files !== null) {
    //       newValue = fieldValuesDict.files[0];
    //     }
    //     let invalidCheck = checkValidation(newValue, field.validation);
    //     fieldValues.push({
    //       ...field,
    //       value: invalidCheck ? "" : newValue ?? "",
    //       invalid: invalidCheck,
    //     } as FormFieldEntry);
    //     if (invalidCheck) {
    //       validFields = false;
    //       e.target.files = null;
    //     }
    //   } else {
    //     fieldValues.push({
    //       ...field,
    //     } as FormFieldEntry);
    //   }
    //   return field;
    // });
    // onFormSubmit(fieldValues, validFields, false);
  };

  return (
    <div className={`${styles.inputContainer} `}>
      <label
        className={`login-upload-label ${styles.hiddenInputContainer} ${
          error && styles.errorLabel
        } `}
        htmlFor={For}
        onClick={() => hiddenFileInput.current?.click()}
      >
        <UploadIcon />
        <span>
          {typeof fieldValue === "string" ? uploadText : fieldValue.name}
        </span>
        <input
          className={`${styles["hidden-upload"]}`}
          ref={hiddenFileInput}
          type={"file"}
          multiple={false}
          onChange={handleFileUpload}
          name={For}
          data-default={props.defaultValue}
        ></input>
      </label>

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
};

export default HiddenFileLabelInput;

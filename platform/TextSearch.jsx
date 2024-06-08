import React from "react";
import ReduxInputField from "../../../common/deprecated_redux/ReduxInputField";
import { FieldGroup, Label } from "../../../common/ui-components";

export default function TextSearch({
  updateQuery,
  field,
  query,
  label,
  placeholder,
  helpText,
  disabled,
}) {
  const value = query[field];

  function onChange(e) {
    updateQuery({
      [field]: e.target.value,
    });
  }

  return label !== undefined ? (
    <FieldGroup>
      <Label id={field} helpText={helpText}>
        {label}
      </Label>
      <ReduxInputField
        required
        disabled={disabled}
        classes="search-input"
        value={value}
        placeholder={placeholder}
        input={{
          onChange,
          value,
          name: field,
        }}
      />
    </FieldGroup>
  ) : (
    <ReduxInputField
      required
      disabled={disabled}
      classes="search-input"
      value={value}
      placeholder={placeholder}
      input={{
        onChange,
        value,
        name: field,
      }}
    />
  );
}

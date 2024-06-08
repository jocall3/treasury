import React from "react";
import { FieldGroup, Label, SelectField } from "../../../common/ui-components";

export default function ChoiceSearch({
  field,
  query,
  updateQuery,
  label,
  options,
  disabled,
  isClearable = true,
  defaultValue,
}) {
  const queryField = query[field];

  function onChange(value) {
    updateQuery({
      [field]: value,
    });
  }

  return (
    <FieldGroup direction="top-to-bottom">
      <Label id={field}>{label}</Label>
      <SelectField
        classes="w-72"
        isClearable={isClearable}
        required
        disabled={disabled}
        name={field}
        handleChange={onChange}
        options={options}
        selectValue={queryField || defaultValue}
      />
    </FieldGroup>
  );
}

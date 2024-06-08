import React from "react";
import { FieldGroup, Label, SelectField } from "../../../common/ui-components";

interface QueryType {
  page?: number;
  perPage?: number;
  paginationDirection?: "next" | "previous";
  startCursor?: string;
  endCursor?: string;
  [key: string]: unknown;
}

interface MultiChoiceSearchProps {
  classes?: string;
  field: string;
  label: string;
  query: QueryType;
  options: { value: string; label: string }[];
  updateQuery: (input: Record<string, unknown>) => void;
  disabled: boolean;
}

export default function MultiChoiceSearch({
  classes,
  field,
  query,
  updateQuery,
  label,
  options,
  disabled,
}: MultiChoiceSearchProps) {
  const queryField: Array<string> = query[field] as Array<string>;

  const onChoiceSelect = (
    _value: string,
    selectField: { value: string; label: string },
    actionName: string
  ) => {
    if (!selectField) return;

    let newValue: Array<string>;
    if (actionName === "remove-value") {
      newValue = queryField
        ? queryField.filter((v) => v !== selectField.value)
        : [];
    } else {
      newValue = !queryField
        ? [selectField.value]
        : [...queryField, selectField.value];
    }
    updateQuery({ [field]: newValue });
  };

  if (label) {
    return (
      <FieldGroup direction="top-to-bottom">
        <Label id={field}>{label}</Label>
        <SelectField
          classes={classes}
          isMulti
          isClearable={false}
          required
          disabled={disabled}
          name={field}
          handleChange={onChoiceSelect}
          options={options}
          selectValue={queryField}
        />
      </FieldGroup>
    );
  }

  return (
    <SelectField
      classes={classes}
      isMulti
      isClearable={false}
      required
      disabled={disabled}
      name={field}
      handleChange={onChoiceSelect}
      options={options}
      selectValue={queryField}
    />
  );
}

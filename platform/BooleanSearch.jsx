import React from "react";
import ReduxCheckbox from "../../../common/deprecated_redux/ReduxCheckbox";
import { FieldGroup, Label } from "../../../common/ui-components";

export default function BooleanSearch({
  field,
  query,
  updateQuery,
  label,
  labelId = "label-id",
  disabled,
}) {
  const checked = !!query[field] && query[field] !== "false";

  function onChange() {
    updateQuery({ [field]: !checked });
  }

  return (
    <div className="flex self-start">
      <FieldGroup direction="right-to-left">
        <Label id={labelId} disabled={disabled}>
          {label}
        </Label>
        <ReduxCheckbox
          id={labelId}
          input={{
            onChange,
            checked,
          }}
          disabled={disabled}
        />
      </FieldGroup>
    </div>
  );
}

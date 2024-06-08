import React from "react";

import sanitizeAmount from "../../../common/utilities/sanitizeAmount";
import {
  CurrencyInput,
  FieldGroup,
  Label,
} from "../../../common/ui-components";

function AmountSearch({
  field,
  disabled,
  query,
  updateQuery,
  operator,
  label,
  allowNegative,
  placeholder,
  exponent = 2,
}) {
  let value;
  const queryField = query[field];

  if (queryField && queryField[operator]) {
    value = queryField[operator] / 10 ** exponent;
  }

  function onChange(event) {
    let newValue;
    if (allowNegative && event.target.value === "-") {
      newValue = null;
    } else {
      newValue = event.target.value
        ? sanitizeAmount(event.target.value, exponent)
        : null;
    }

    updateQuery({
      [field]: {
        ...queryField,
        [operator]: newValue,
      },
    });
  }

  return (
    <FieldGroup>
      <Label id={`${field}[${operator}]`}>{label}</Label>
      <CurrencyInput
        required
        disabled={disabled}
        id="amount-field"
        input={{
          value,
          onChange,
          name: `${field}[${operator}]`,
        }}
        allowNegative={allowNegative}
        placeholder={placeholder}
        decimalScale={exponent}
      />
    </FieldGroup>
  );
}

export default AmountSearch;

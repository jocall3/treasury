import React from "react";
import { SelectField } from "../../../common/ui-components";
import {
  InputFieldProps,
  SingleFieldChangeFn,
} from "../../types/RuleConditionFieldValueInput";
import { PRETTY_PAYMENT_TYPE_MAPPING } from "../../constants";

function PaymentTypeFieldValueInput({
  id,
  dataIndex,
  operator,
  conditionKey,
  currentValue,
  onSingleFieldChange,
}: {
  onSingleFieldChange: SingleFieldChangeFn;
} & InputFieldProps) {
  const paymentTypeOptions = Object.entries(PRETTY_PAYMENT_TYPE_MAPPING).map(
    ([value, label]) => ({
      value,
      label,
      key: conditionKey,
      operator,
      id,
    })
  );

  return (
    <SelectField
      required
      options={paymentTypeOptions}
      handleChange={onSingleFieldChange}
      name={`value_${dataIndex}`}
      selectValue={currentValue}
    />
  );
}

export default PaymentTypeFieldValueInput;

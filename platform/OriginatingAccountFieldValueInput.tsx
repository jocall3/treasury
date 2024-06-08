import React from "react";
import { SelectField } from "../../../common/ui-components";
import {
  InputFieldProps,
  MultiFieldChangeFn,
} from "../../types/RuleConditionFieldValueInput";
import { InternalAccount } from "../../../generated/dashboard/graphqlSchema";

function OriginatingAccountFieldValueInput({
  id,
  dataIndex,
  operator,
  conditionKey,
  currentValue,
  internalAccountsById,
  onMultiFieldChange,
}: {
  internalAccountsById: { [s: string]: InternalAccount };
  onMultiFieldChange: MultiFieldChangeFn;
} & InputFieldProps) {
  const accountOptions = Object.values<InternalAccount>(
    internalAccountsById
  ).map((ia) => ({
    value: ia.id,
    label: ia.longName,
    key: conditionKey,
    operator,
    id,
  }));

  return (
    <SelectField
      isMulti
      isClearable={false}
      required
      options={accountOptions}
      handleChange={onMultiFieldChange}
      name={`value_${dataIndex}`}
      selectValue={currentValue}
    />
  );
}

export default OriginatingAccountFieldValueInput;

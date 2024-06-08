import React from "react";
import { RULE_VALUE_MAPPING } from "../../constants";
import { RulesFormQuery } from "../../../generated/dashboard/graphqlSchema";
import { SelectField } from "../../../common/ui-components";
import {
  InputFieldProps,
  SingleFieldChangeFn,
  MultiFieldChangeFn,
} from "../../types/RuleConditionFieldValueInput";

type OperatorFieldOption = {
  id: string | null;
  key: string;
  value: string;
  label: string;
  operator?: string;
};

function CreatedByUserFieldValueInput({
  id,
  dataIndex,
  operator,
  conditionKey,
  currentValue,
  userEntities,
  onSingleFieldChange,
  onMultiFieldChange,
}: {
  userEntities: RulesFormQuery["usersUnpaginated"];
  onSingleFieldChange: SingleFieldChangeFn;
  onMultiFieldChange: MultiFieldChangeFn;
} & InputFieldProps) {
  let options: Array<OperatorFieldOption>;
  let isMulti: boolean;
  let onChange: SingleFieldChangeFn | MultiFieldChangeFn;
  if (operator === "in" || operator === "not_in") {
    isMulti = true;
    onChange = onMultiFieldChange;
    options = Object.values(userEntities).map((user) => ({
      value: user.id,
      label: user.name || user.id,
      key: conditionKey,
      operator,
      id,
    }));
  } else {
    isMulti = false;
    onChange = onSingleFieldChange;
    options = Object.keys(RULE_VALUE_MAPPING).map((value) => ({
      value,
      label: RULE_VALUE_MAPPING.any === value ? "a user manually" : "API",
      key: conditionKey,
      operator,
      id,
    }));
  }

  return (
    <SelectField
      required
      isMulti={isMulti}
      options={options}
      handleChange={onChange}
      name={`value_${dataIndex}`}
      selectValue={currentValue}
    />
  );
}

export default CreatedByUserFieldValueInput;

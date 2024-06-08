import React from "react";
import isNil from "lodash/isNil";
import {
  DIRECTION_OPTIONS,
  RECEIVING_ENTITY_TYPE_OPTIONS,
  DECISION_SCORE_OPTIONS,
  DECISION_TYPE_OPTIONS,
  VERIFIED_BY_OPTIONS,
  CREATION_SOURCE_OPTIONS,
} from "../../constants";
import { RulesFormQuery } from "../../../generated/dashboard/graphqlSchema";
import ReduxInputField from "../../../common/deprecated_redux/ReduxInputField";
import { CurrencyInput, SelectField } from "../../../common/ui-components";
import CreatedByUserFieldValueInput from "./CreatedByUserFieldValueInput";
import OriginatingAccountFieldValueInput from "./OriginatingAccountFieldValueInput";
import MetadataFieldValueInput from "./MetadataFieldValueInput";
import PaymentTypeFieldValueInput from "./PaymentTypeFieldValueInput";
import {
  RuleValue,
  UIRuleData,
} from "../../types/RuleConditionFieldValueInput";
import { RuleFormValues } from "../../constants/rule_form";

const FIELD_TYPE_OPTIONS_MAPPING = {
  direction: DIRECTION_OPTIONS,
  creation_source: CREATION_SOURCE_OPTIONS,
  verified_by: VERIFIED_BY_OPTIONS,
  receiving_entity_type: RECEIVING_ENTITY_TYPE_OPTIONS,
  decision_score: DECISION_SCORE_OPTIONS,
  decision_type: DECISION_TYPE_OPTIONS,
};

/**
 * Component for a rule condition's value.
 */
function RuleConditionFieldValueInput({
  rule,
  id,
  dataIndex,
  operator,
  conditionKey,
  queryData,
  loading,
  setRule,
}: {
  id: string | null;
  conditionKey: string;
  dataIndex: number;
  operator: string;
  rule: RuleFormValues;
  queryData: RulesFormQuery | undefined;
  loading: boolean;
  setRule: (rule: RuleFormValues) => void;
}): JSX.Element {
  const userEntities = loading || !queryData ? [] : queryData.usersUnpaginated;
  const internalAccountsById =
    loading || !queryData
      ? []
      : queryData.internalAccountsUnpaginated.reduce(
          (acc, account) => ({ ...acc, [account.id]: account }),
          {}
        );

  function mapBasicOptions(
    optionsList: Record<string, string | null>[]
  ): Record<string, string | null>[] {
    return optionsList.map((opt) => ({
      ...opt,
      key: conditionKey,
      operator,
      id,
    }));
  }

  function onMetadataChange(data: Record<string, Record<string, string>>) {
    const metadata = data?.metadata
      ? Object.entries(data.metadata).map(([key, value]) => ({
          key,
          value,
        }))
      : undefined;
    const key = "metadata_keys_and_values";
    const newRule = {
      ...rule,
      data: {
        ...rule.data,
        [key]: {
          [operator]: metadata,
        },
      },
    };

    setRule(newRule);
  }

  function onMultiFieldChange(
    _value: string[],
    field: { key: string; operator: string; value: string },
    actionName: string
  ) {
    const { key } = field;
    const currentValue: Array<string> = (rule.data as UIRuleData)[key][
      operator
    ] as Array<string>;

    let newValue: Array<string>;
    if (actionName === "remove-value") {
      newValue = currentValue
        ? currentValue.filter((v) => v !== field.value)
        : [];
    } else {
      newValue = currentValue ? [...currentValue, field.value] : [field.value];
    }
    const newRule = {
      ...rule,
      data: {
        ...rule.data,
        [key]: {
          [operator]: newValue,
        },
      },
    };

    setRule(newRule);
  }

  function onSingleFieldChange(
    value: string,
    field: { key: string; operator: string }
  ) {
    const { key } = field;
    const newRule = {
      ...rule,
      data: {
        ...rule.data,
        [key]: {
          [operator]: value,
        },
      },
    };

    setRule(newRule);
  }

  function handleAmountChange(value: string, key: string) {
    const decimalValue = parseFloat(value.replace(/,/g, "")) * 100;
    const newRule = {
      ...rule,
      data: {
        ...rule.data,
        [key]: {
          [operator]: decimalValue,
        },
      },
    };

    setRule(newRule);
  }

  function getInputComponent(): JSX.Element {
    if (isNil(conditionKey) || isNil(operator)) {
      return <ReduxInputField placeholder="Value" disabled />;
    }

    const currentValue: RuleValue = (rule.data as UIRuleData)[conditionKey]?.[
      operator
    ];

    switch (conditionKey) {
      case "metadata_keys_and_values":
        return (
          <MetadataFieldValueInput
            currentValue={currentValue}
            onMetadataChange={onMetadataChange}
          />
        );
      case "payment_type":
        return (
          <PaymentTypeFieldValueInput
            id={id}
            dataIndex={dataIndex}
            operator={operator}
            conditionKey={conditionKey}
            currentValue={currentValue}
            onSingleFieldChange={onSingleFieldChange}
          />
        );
      case "originating_account_id":
        return (
          <OriginatingAccountFieldValueInput
            id={id}
            dataIndex={dataIndex}
            operator={operator}
            conditionKey={conditionKey}
            currentValue={currentValue}
            internalAccountsById={internalAccountsById}
            onMultiFieldChange={onMultiFieldChange}
          />
        );
      case "amount":
        return (
          <CurrencyInput
            id="amount-field"
            required
            input={{
              value:
                currentValue !== null ? (currentValue as number) / 100 : "",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleAmountChange(e.target.value, conditionKey),
              "data-id": id,
              "data-key": conditionKey,
              "data-operator": operator,
            }}
          />
        );
      case "created_by_user":
        return (
          <CreatedByUserFieldValueInput
            id={id}
            dataIndex={dataIndex}
            operator={operator}
            conditionKey={conditionKey}
            currentValue={currentValue}
            userEntities={userEntities}
            onSingleFieldChange={onSingleFieldChange}
            onMultiFieldChange={onMultiFieldChange}
          />
        );
      case "direction":
      case "creation_source":
      case "verified_by":
      case "receiving_entity_type":
      case "decision_score":
      case "decision_type":
        // fall through
        return (
          <SelectField
            required
            options={mapBasicOptions(FIELD_TYPE_OPTIONS_MAPPING[conditionKey])}
            name={`value_${dataIndex}`}
            selectValue={currentValue}
            handleChange={onSingleFieldChange}
          />
        );
      default:
        return <ReduxInputField placeholder="Value" disabled />;
    }
  }

  return getInputComponent();
}

export default RuleConditionFieldValueInput;

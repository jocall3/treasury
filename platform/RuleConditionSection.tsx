import React from "react";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";

import {
  RULE_KEY_MAPPING,
  RULE_OPERATOR_MAPPING,
  NEGATED_RULE_OPERATOR_MAPPING,
} from "../../constants";
import {
  RulePrimitivesEnum,
  RuleResourceTypeEnum,
  RulesFormQuery,
} from "../../../generated/dashboard/graphqlSchema";
import {
  UIRuleData,
  RuleValue,
} from "../../types/RuleConditionFieldValueInput";
import {
  Button,
  Heading,
  Icon,
  SelectField,
} from "../../../common/ui-components";
import RuleConditionFieldValueInput from "./RuleConditionFieldValueInput";
import { RuleFormValues } from "../../constants/rule_form";

type OperatorFieldOption = {
  id: string | null;
  key: string;
  value: string;
  label: string;
  operator?: string;
};

const NEW_CONDITION_KEY = "newCondition";

function RuleConditionSection({
  id,
  rule,
  queryData,
  resourceType,
  loading,
  setRule,
}: {
  id: string | null;
  rule: RuleFormValues;
  queryData: RulesFormQuery | undefined;
  resourceType: RuleResourceTypeEnum;
  loading: boolean;
  setRule: (rule: RuleFormValues) => void;
}): JSX.Element {
  const dataKeys = Object.keys(rule.data as Record<string, never>);
  if (isEmpty(dataKeys)) {
    dataKeys.push("");
  }

  function operatorFields(key: string): Array<OperatorFieldOption> {
    const options: Array<OperatorFieldOption> = [];

    function addOption(operator: string) {
      options.push({
        value: operator,
        label: RULE_OPERATOR_MAPPING[operator],
        id,
        key,
      });
      options.push({
        value: `not_${operator}`,
        label: NEGATED_RULE_OPERATOR_MAPPING[operator],
        id,
        key,
      });
    }

    switch (key) {
      case "metadata_keys_and_values":
        addOption(RulePrimitivesEnum.Contains);
        break;
      case "originating_account_id":
        addOption(RulePrimitivesEnum.In);
        break;
      case "amount":
        addOption(RulePrimitivesEnum.LessThan);
        addOption(RulePrimitivesEnum.GreaterThan);
        break;
      case "created_by_user":
        addOption(RulePrimitivesEnum.In);
        if (resourceType === "PaymentOrder") {
          addOption(RulePrimitivesEnum.Eql);
        }
        break;
      case "payment_type":
      case "direction":
      case "creation_source":
      case "verified_by":
      case "receiving_entity_type":
      case "decision_score":
      case "decision_type":
        // fall through
        addOption(RulePrimitivesEnum.Eql);
        break;
      default:
        break;
    }

    return options;
  }

  function getDataOperator(ruleInput: RuleFormValues, key: string) {
    if (isEmpty(ruleInput.data) || isNil(key)) {
      return "";
    }
    return Object.keys((ruleInput.data as UIRuleData)[key])[0] || "";
  }

  function onDataKeySelected(key: string, field: { currentValue: RuleValue }) {
    const { currentValue } = field;

    const newRule = {
      ...rule,
      data: {
        ...pickBy(rule.data, (v, k) => k !== currentValue),
        [key]: {},
      },
    };

    setRule(newRule);
  }

  function onOperatorSelected(operator, field: { key: string }) {
    const { key } = field;
    const newRule = {
      ...rule,
      data: {
        ...rule.data,
        [key]: {
          [operator]: undefined,
        },
      },
    };

    setRule(newRule);
  }

  function removeRuleCondition(key) {
    const newData = pickBy(rule.data, (v, k) => k !== key);
    const newRule = {
      ...rule,
      data: newData,
    };

    setRule(newRule);
  }

  function addNewRuleCondition() {
    const newData = {
      ...pickBy(rule.data, (v, k) => k !== NEW_CONDITION_KEY),
      [NEW_CONDITION_KEY]: {},
    };
    const newRule = {
      ...rule,
      data: newData,
    };
    setRule(newRule);
  }

  return (
    <div className="form-section">
      <Heading level="h3">Conditions</Heading>
      {dataKeys.map((key, dataIndex) => {
        const keyOptions = Object.entries(RULE_KEY_MAPPING[rule.resourceType])
          .map(([value, label]) => ({
            value,
            label,
            id,
            currentValue: key,
          }))
          .filter(
            (keyOption) =>
              !dataKeys.includes(keyOption.value) || key === keyOption.value
          );

        return (
          <div key={key} className="form-row flex">
            <SelectField
              required
              classes="key-field"
              name={`key_${dataIndex}`}
              handleChange={onDataKeySelected}
              options={keyOptions}
              selectValue={key}
              placeholder="Field"
            />
            <SelectField
              required
              name={`operator_${dataIndex}`}
              classes="operator-field"
              disabled={isNil(key) || key === "undefined"}
              handleChange={onOperatorSelected}
              selectValue={getDataOperator(rule, key)}
              placeholder="Operator"
              options={operatorFields(key)}
            />
            <RuleConditionFieldValueInput
              id={id}
              conditionKey={key}
              rule={rule}
              operator={getDataOperator(rule, key)}
              queryData={queryData}
              dataIndex={dataIndex}
              loading={loading}
              setRule={setRule}
            />

            <Button
              id="remove-rule-condition-btn"
              onClick={() => removeRuleCondition(key)}
            >
              <Icon
                iconName="clear"
                size="xs"
                color="currentColor"
                className="text-gray-300"
              />
            </Button>
          </div>
        );
      })}
      <Button
        onClick={() => addNewRuleCondition()}
        disabled={
          !Object.keys(rule.data).length ||
          Object.keys(rule.data).includes(NEW_CONDITION_KEY)
        }
      >
        <Icon iconName="add" />
        <span>Add Condition</span>
      </Button>
    </div>
  );
}

export default RuleConditionSection;

import { isEmpty } from "lodash";
import {
  RuleData,
  RuleValue,
  RuleValueField,
  UIRuleData,
} from "../../types/RuleConditionFieldValueInput";

const NEGATION_OPERATOR_PREFIX = "not_";

/**
 * Function for adding negation information to rule condition data before gql mutation
 * Negated operators need to be parsed from "not_${operator}": value to operator: { value, negate } form
 */
export function normalizeRuleData(data: UIRuleData): RuleData {
  // key is something like "metadata_keys_and_values", "amount", etc.
  return Object.keys(data as Record<string, unknown>).reduce(
    (normalizedData: RuleData, key) => {
      const fieldValue: Record<string, RuleValue> = data[key];

      // add negation information to condition value
      let [operator] = Object.keys(fieldValue);
      const value: RuleValue = fieldValue[operator];
      let negate = false;
      if (operator?.includes(NEGATION_OPERATOR_PREFIX)) {
        operator = operator.replace(NEGATION_OPERATOR_PREFIX, "");
        negate = true;
      }

      return {
        ...normalizedData,
        [key]: {
          [operator]: {
            value,
            negate,
          },
        },
      };
    },
    {}
  );
}

/**
 * Function for translating the rule data's operators for FE
 * Negated operators need to be parsed from operator: {value, negate} to "not_${operator}": value form
 */
export function normalizeOperatorOptions(data: string): UIRuleData {
  if (isEmpty(data)) return {};

  const dataJson = JSON.parse(data) as Record<
    string,
    Record<string, RuleValueField>
  >;

  return Object.keys(dataJson).reduce((normalizedData, key) => {
    const fieldValue = dataJson[key];

    let [operator] = Object.keys(fieldValue);
    const { value } = fieldValue[operator];
    operator = fieldValue[operator].negate
      ? `${NEGATION_OPERATOR_PREFIX}${operator}`
      : operator;

    return {
      ...normalizedData,
      [key]: {
        [operator]: value,
      },
    };
  }, {});
}

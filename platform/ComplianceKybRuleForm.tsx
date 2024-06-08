import React, { useState } from "react";
import { snakeCase } from "lodash";
import { Field, Form, Formik } from "formik";
import {
  Compliance__RuleActionEnum,
  RulePrimitivesEnum,
  useComplianceRuleViewQuery,
  useCreateComplianceRuleMutation,
  useDeleteComplianceRuleMutation,
  useUpdateComplianceRuleMutation,
} from "../../generated/dashboard/graphqlSchema";
import Button, {
  ButtonClickEventTypes,
} from "../../common/ui-components/Button/Button";
import {
  FieldGroup,
  FieldsRow,
  HorizontalRule,
  Label,
} from "../../common/ui-components";
import { FormikInputField, FormikSelectField } from "../../common/formik";
import { DECISION_SCORE_OPTIONS } from "../constants";
import ComplianceKybRuleConditionSection from "../containers/ComplianceKybRuleConditionSection";
import { useDispatchContext } from "../MessageProvider";
import { handleLinkClick } from "../../common/utilities/handleLinkClick";

type NormalizedRule = {
  field: string;
  operator: string;
  negate: string;
  value: string;
};

type DenormalizedRule = {
  field: string;
  operator: string;
  value: string;
};

type ConditionType = {
  operator: string;
  negate: boolean;
  value: NormalizedRule[];
};

type ComplianceKybRuleFormProps = {
  id: string;
  isEditForm: boolean;
};

type ComplianceKybFormValue = {
  name: string;
  conditions: DenormalizedRule[];
  operator: string;
  action: string;
};

function normalizeRules(conditions: DenormalizedRule[]) {
  return conditions?.map((condition) => {
    const { field, value, operator } = condition;
    return {
      field,
      operator: "equals",
      negate: !(operator === RulePrimitivesEnum.Eql),
      value,
    };
  });
}

function denormalizeRules(conditions: NormalizedRule[]) {
  return conditions?.map((condition) => {
    const { field, value, negate } = condition;
    return {
      field,
      operator: negate
        ? `not_${RulePrimitivesEnum.Eql}`
        : RulePrimitivesEnum.Eql,
      value,
    };
  });
}

function ComplianceKybRuleForm({ id, isEditForm }: ComplianceKybRuleFormProps) {
  const [disable, setDisable] = useState<boolean>(false);
  const rulesPath = `/settings/compliance/kyb/rules`;
  const { dispatchError, dispatchSuccess } = useDispatchContext();

  const { data: queryData } = useComplianceRuleViewQuery({
    variables: {
      id,
    },
  });

  const [createComplianceRule] = useCreateComplianceRuleMutation();
  const [updateComplianceRule] = useUpdateComplianceRuleMutation();
  const [deleteComplianceRule] = useDeleteComplianceRuleMutation();

  function cancelRuleEdit(event: ButtonClickEventTypes) {
    handleLinkClick(rulesPath, event);
  }

  const createRule = async (rule: ComplianceKybFormValue) => {
    setDisable(true);

    const conditions = {
      operator: rule?.operator,
      negate: false,
      value: normalizeRules(rule.conditions),
    };

    try {
      const response = await createComplianceRule({
        variables: {
          input: {
            input: {
              name: rule.name,
              conditions: JSON.stringify(conditions),
              action: rule.action as Compliance__RuleActionEnum,
            },
          },
        },
      });

      if (response?.data?.createComplianceRule?.errors) {
        dispatchError(response?.data?.createComplianceRule?.errors.toString());
      } else {
        dispatchSuccess("Success!");
        window.location.href = rulesPath;
      }
    } catch (error) {
      dispatchError("Sorry, but something went wrong.");
    } finally {
      setDisable(false);
    }
  };

  const updateRule = async (rule: ComplianceKybFormValue) => {
    setDisable(true);

    const conditions = {
      operator: rule?.operator,
      negate: false,
      value: normalizeRules(rule?.conditions),
    };

    try {
      const response = await updateComplianceRule({
        variables: {
          input: {
            input: {
              id: queryData?.complianceRule?.id,
              name: rule?.name,
              conditions: JSON.stringify(conditions),
              action: rule?.action as Compliance__RuleActionEnum,
            },
          },
        },
      });

      if (response?.data?.updateComplianceRule?.errors) {
        dispatchError(response?.data?.updateComplianceRule?.errors.toString());
      } else {
        dispatchSuccess("Success!");
        window.location.href = rulesPath;
      }
    } catch (error) {
      dispatchError("Sorry, but something went wrong.");
    } finally {
      setDisable(false);
    }
  };

  const deleteRule = async () => {
    setDisable(true);

    try {
      const response = await deleteComplianceRule({
        variables: {
          input: {
            input: {
              id,
            },
          },
        },
      });

      if (response?.data?.deleteComplianceRule?.errors?.length) {
        dispatchError(response?.data?.deleteComplianceRule?.errors.toString());
      } else {
        dispatchSuccess("Success!");
        window.location.href = rulesPath;
      }
    } catch (error) {
      dispatchError(
        "We were unable to delete the rule. Please contact us if this error persists."
      );
    } finally {
      setDisable(false);
    }
  };

  const initialValues = (): ComplianceKybFormValue => {
    const conditions = queryData?.complianceRule
      ?.conditions as unknown as string;

    if (conditions) {
      const parsedCondition = JSON.parse(conditions) as ConditionType;
      const value = denormalizeRules(parsedCondition?.value);
      return {
        name: queryData?.complianceRule?.name || "",
        conditions: value,
        operator: parsedCondition?.operator,
        action: snakeCase(queryData?.complianceRule?.action),
      };
    }
    return {
      name: "",
      conditions: [{ field: "", operator: "", value: "" }],
      operator: "",
      action: "",
    };
  };

  return (
    <Formik
      initialValues={initialValues()}
      onSubmit={async (values) => {
        if (isEditForm) {
          await updateRule(values);
        } else {
          await createRule(values);
        }
      }}
      enableReinitialize
    >
      <Form>
        <FieldsRow columns={3}>
          <FieldGroup>
            <Label>Rule Name</Label>
            <Field
              id="name"
              type="input"
              name="name"
              value
              component={FormikInputField}
              options={DECISION_SCORE_OPTIONS}
            />
          </FieldGroup>
        </FieldsRow>
        <HorizontalRule />
        <ComplianceKybRuleConditionSection />
        <HorizontalRule />
        <FieldsRow columns={2}>
          <FieldGroup>
            <Label className="pt-2">Action</Label>
            <Field
              id="action"
              type="select"
              name="action"
              value
              component={FormikSelectField}
              options={DECISION_SCORE_OPTIONS}
            />
          </FieldGroup>
        </FieldsRow>
        <div className="flex flex-row space-x-4">
          <Button buttonType="primary" isSubmit disabled={disable}>
            {isEditForm ? "Update" : "Create Rule"}
          </Button>
          {isEditForm && (
            <Button
              buttonType="destructive"
              onClick={() => {
                void deleteRule();
              }}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={(event: ButtonClickEventTypes) => cancelRuleEdit(event)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Formik>
  );
}

export default ComplianceKybRuleForm;

import React from "react";
import isNil from "lodash/isNil";

import {
  Button,
  Heading,
  Icon,
  Label,
  SelectField,
} from "../../../common/ui-components";
import { RuleFormValues } from "../../constants/rule_form";

import { RulesFormQuery } from "../../../generated/dashboard/graphqlSchema";

function RuleApproverSection({
  id,
  rule,
  queryData,
  loading,
  setRule,
}: {
  id: string | null;
  rule: RuleFormValues;
  queryData: RulesFormQuery | undefined;
  loading: boolean;
  setRule: (rule: RuleFormValues) => void;
}) {
  const { groups } = rule;
  const groupEntities =
    loading || !queryData ? [] : queryData.groupsUnpaginated;

  function handleGroupsChange(value, field: { index: number; value: string }) {
    const newGroups = rule.groups ? [...rule.groups] : [];
    newGroups[field.index] = field.value;

    const newRule = {
      ...rule,
      groups: newGroups,
    };

    setRule(newRule);
  }

  function removeRuleGroup(groupIndex: number) {
    groups?.splice(groupIndex, 1);

    const newRule = {
      ...rule,
      groups,
    };

    setRule(newRule);
  }

  function addRuleGroup() {
    const newRule = {
      ...rule,
      groups: groups ? [...groups, ""] : [],
    };

    setRule(newRule);
  }

  return (
    <div className="form-section pb-4">
      <Heading level="h3">Approvers</Heading>
      {groups?.map((groupId, groupIndex) => {
        const groupOptions = groupEntities.map((group) => ({
          value: group.id,
          label: group.name,
          id,
          index: groupIndex,
        }));

        return (
          <div>
            <Label>{`Approver ${groupIndex + 1}`}</Label>
            <div className="flex w-full flex-row space-x-4 pb-4" key={groupId}>
              <div className="w-1/4">
                <SelectField
                  required
                  isClearable={false}
                  name={`groups_${groupIndex}`}
                  handleChange={handleGroupsChange}
                  selectValue={groups[groupIndex]}
                  placeholder="Select a group"
                  options={groupOptions}
                />
              </div>
              <Button
                id="remove-approver-btn"
                disabled={groupIndex === 0 && groups?.length <= 1}
                onClick={() => removeRuleGroup(groupIndex)}
              >
                <Icon
                  iconName="clear"
                  size="xs"
                  color="currentColor"
                  className="text-gray-300"
                />
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        onClick={() => addRuleGroup()}
        disabled={rule?.groups?.some((g) => isNil(g))}
      >
        <Icon iconName="add" />
        <span>Add Approver</span>
      </Button>
    </div>
  );
}

export default RuleApproverSection;

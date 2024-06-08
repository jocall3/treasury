import React, { useEffect } from "react";
import {
  Group,
  useReviewAsGroupSelectQuery,
} from "../../../generated/dashboard/graphqlSchema";
import { FieldGroup, Label, SelectField } from "../../../common/ui-components";

const ADMIN_OVERRIDE = "ADMIN_OVERRIDE";
interface ReviewAsGroupSearchProps {
  field: string;
  updateQuery: (input: Record<string, unknown>) => void;
  placeholder: string;
  query: { [key: string]: unknown };
  label?: string;
  includeAdminOverride?: boolean;
}

function ReviewAsGroupSearch({
  field,
  updateQuery,
  placeholder,
  query,
  label,
  includeAdminOverride = false,
}: ReviewAsGroupSearchProps) {
  const queryField = query[field];
  const adminOverride = query.reviewAsAdminOverride === "true";
  const { data } = useReviewAsGroupSelectQuery();
  const groups = data?.currentUser.contextedGroupMemberships as Group[];
  const canAdminOverride = data?.currentOrganization.canReviewAll as boolean;

  const idToGroupName = new Map(groups?.map((group) => [group.id, group.name]));

  const options = groups?.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  const { scopeByPendingMyApproval } = query;

  if (includeAdminOverride && canAdminOverride) {
    options?.push({ value: ADMIN_OVERRIDE, label: "Admin Override" });
  }

  useEffect((): void => {
    if (!scopeByPendingMyApproval && (queryField || adminOverride)) {
      updateQuery({
        [field]: null,
        reviewAsAdminOverride: "false",
        reviewAsGroupSelectedLabel: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeByPendingMyApproval]);

  function setQuery(id?: string) {
    if (id === ADMIN_OVERRIDE) {
      updateQuery({
        [field]: null,
        reviewAsAdminOverride: "true",
        reviewAsGroupSelectedLabel: "Admin Override",
      });
    } else {
      updateQuery({
        [field]: id,
        reviewAsAdminOverride: "false",
        reviewAsGroupSelectedLabel: idToGroupName.get(id as string),
      });
    }
  }

  function onChange(id?: string) {
    setQuery(id);
  }

  function selectValue() {
    if (!adminOverride && !queryField && options?.length === 1) {
      const { value } = options[0];
      onChange(value);

      return value;
    }

    return adminOverride ? ADMIN_OVERRIDE : queryField;
  }

  return (
    <FieldGroup direction="top-to-bottom">
      <Label id={field}>{label}</Label>
      <SelectField
        isClearable
        required
        placeholder={placeholder}
        disabled={!options}
        name="reviewAsGroupSelect"
        id="reviewAsGroupSelect"
        handleChange={onChange}
        options={options || []}
        selectValue={selectValue()}
      />
    </FieldGroup>
  );
}

export default ReviewAsGroupSearch;

import React from "react";
import { OrganizationUser } from "../../../generated/dashboard/graphqlSchema";
import UserGroupSelect from "../UserGroupSelect";

interface UserGroupSearchProps {
  field: string;
  updateQuery: (input: Record<string, unknown>) => void;
  placeholder: string;
  query: { [key: string]: unknown };
  label?: string;
}

function UserGroupSearch({
  field,
  updateQuery,
  placeholder,
  query,
  label,
}: UserGroupSearchProps) {
  const queryField = query[field] as string;
  const labelField = query.userGroupSelectedLabel as string;

  function onChange(value?: OrganizationUser) {
    updateQuery({
      [field]: value?.user.id,
      userGroupSelectedLabel: value
        ? `${value.user.name ?? ""} (${value.user.email})`
        : undefined,
    });
  }

  return (
    <UserGroupSelect
      placeholder={placeholder}
      onChange={onChange}
      selectValue={
        queryField && labelField
          ? {
              value: { user: { id: queryField } },
              label: labelField,
            }
          : undefined
      }
      label={label}
    />
  );
}

export default UserGroupSearch;

import React from "react";

import { isEqual, without } from "lodash";

import { ALL_ACCOUNT_GROUPS_ID } from "../../constants";

import MultiChoiceSearch from "./MultiChoiceSearch";
import {
  SelectSimpleOption,
  useAccountGroupSelectOptionsQuery,
} from "../../../generated/dashboard/graphqlSchema";

interface QueryType {
  [key: string]: unknown;
}

interface MultiAccountGroupSearchProps {
  field: string;
  label: string;
  currencies?: Array<string>;
  query: QueryType;
  updateQuery: (input: Record<string, unknown>) => void;
  disabled: boolean;
}

function MultiAccountGroupSearch({
  field,
  label,
  currencies,
  query,
  updateQuery,
  disabled,
}: MultiAccountGroupSearchProps) {
  const currentAccountGroups: Array<string> = query[field] as Array<string>;

  const { data, loading, error } = useAccountGroupSelectOptionsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      ...(currencies && currencies.length > 0 && { currencies }),
    },
  });

  const options = (
    loading || error || !data ? [] : data?.accountGroupSelectOptions || []
  ) as SelectSimpleOption[];

  return (
    <MultiChoiceSearch
      field={field}
      label={label}
      query={query}
      options={options}
      updateQuery={(input: Record<string, unknown>) => {
        const newAccountGroupIds = input[field] as Array<string>;
        let updatedAccountGroupIds = isEqual(newAccountGroupIds, [
          ALL_ACCOUNT_GROUPS_ID,
        ])
          ? newAccountGroupIds
          : without(newAccountGroupIds, ALL_ACCOUNT_GROUPS_ID);
        if (
          !currentAccountGroups.includes(ALL_ACCOUNT_GROUPS_ID) &&
          newAccountGroupIds.includes(ALL_ACCOUNT_GROUPS_ID)
        ) {
          updatedAccountGroupIds = [ALL_ACCOUNT_GROUPS_ID];
        }
        updateQuery({ [field]: updatedAccountGroupIds });
      }}
      disabled={disabled}
    />
  );
}

export default MultiAccountGroupSearch;

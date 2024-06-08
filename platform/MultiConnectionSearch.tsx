import React from "react";

import { isEqual, without } from "lodash";

import { ALL_CONNECTIONS_ID } from "../../constants";

import MultiChoiceSearch from "./MultiChoiceSearch";
import {
  SelectSimpleOption,
  useMultiConnectionSelectQuery,
} from "../../../generated/dashboard/graphqlSchema";

interface QueryType {
  [key: string]: unknown;
}

interface MultiConnectionSearchProps {
  classes?: string;
  field: string;
  label: string;
  currencies?: Array<string>;
  query: QueryType;
  updateQuery: (input: Record<string, unknown>) => void;
  disabled: boolean;
}

function MultiConnectionSearch({
  classes,
  field,
  label,
  currencies,
  query,
  updateQuery,
  disabled,
}: MultiConnectionSearchProps) {
  const currentConnections: Array<string> = query[field] as Array<string>;

  const { data, loading, error } = useMultiConnectionSelectQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      ...(currencies && currencies.length > 0 && { currencies }),
    },
  });

  const options = (
    loading || error || !data ? [] : data?.connectionSelectOptions || []
  ) as SelectSimpleOption[];

  return (
    <MultiChoiceSearch
      classes={classes}
      field={field}
      label={label}
      query={query}
      options={options}
      updateQuery={(input: Record<string, unknown>) => {
        const newConnectionIds = input[field] as Array<string>;
        let updatedConnectionIds = isEqual(newConnectionIds, [
          ALL_CONNECTIONS_ID,
        ])
          ? newConnectionIds
          : without(newConnectionIds, ALL_CONNECTIONS_ID);
        if (
          !currentConnections.includes(ALL_CONNECTIONS_ID) &&
          newConnectionIds.includes(ALL_CONNECTIONS_ID)
        ) {
          updatedConnectionIds = [ALL_CONNECTIONS_ID];
        }
        updateQuery({ [field]: updatedConnectionIds });
      }}
      disabled={disabled}
    />
  );
}

export default MultiConnectionSearch;

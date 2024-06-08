import React, { useState } from "react";
import isNil from "lodash/isNil";
import { AsyncSelectField } from "~/common/ui-components";
import { SelectValue } from "~/common/ui-components/AsyncSelectField/AsyncSelectField";
import { useReconciliationRuleAsyncSelectQuery } from "~/generated/dashboard/graphqlSchema";

interface ReconciliationRuleAsyncSearchProps {
  updateQuery: (input: Record<string, unknown>) => void;
  query: { [key: string]: unknown };
  label: string;
  field: string;
  disabled: boolean;
}

function ReconciliationRuleAsyncSearch({
  query,
  updateQuery,
  label = "Reconciliation Rule",
  field,
  disabled = false,
}: ReconciliationRuleAsyncSearchProps) {
  const [options, setOptions] = useState<SelectValue[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const { refetch } = useReconciliationRuleAsyncSelectQuery({
    skip: true,
  });
  const selectValue = query[field] as string;
  const selectLabel = query[`${field}_label`] as string;

  const loadOptions = (input: string) =>
    new Promise((resolve, reject) => {
      if (isDataLoaded) {
        const filteredOptions = options.filter((option) =>
          option.label.includes(input.toUpperCase())
        );
        resolve({ options: filteredOptions });
      } else {
        refetch()
          .then(({ data }) => {
            const reconciliationRuleOptions =
              data?.reconciliationRules?.edges.map((edge) => ({
                value: edge?.node?.id,
                label: edge?.node?.name,
              }));
            setOptions(reconciliationRuleOptions);
            setIsDataLoaded(true);
            resolve({
              options: reconciliationRuleOptions,
            });
          })
          .catch((e) => reject(e));
      }
    });

  return (
    <AsyncSelectField
      isClearable
      defaultOptions={!isNil(selectValue)}
      loadOptions={loadOptions}
      handleChange={(option: SelectValue) =>
        updateQuery({
          [field]: option?.value,
          [`${field}_label`]: option?.label,
        })
      }
      selectValue={
        selectValue && selectLabel
          ? {
              value: selectValue,
              label: selectLabel,
            }
          : undefined
      }
      noOptionsMessage={(val) =>
        val.inputValue === "" ? "Type to see options" : "No options"
      }
      label={label}
      name={label}
      disabled={disabled}
    />
  );
}

export default ReconciliationRuleAsyncSearch;

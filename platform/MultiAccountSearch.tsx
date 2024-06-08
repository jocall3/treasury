import React from "react";
import MultiAccountSelect, {
  AllAccountsSelectionBehaviorEnum,
} from "../../containers/MultiAccountSelect";
import { ALL_ACCOUNTS_ID } from "../../constants/index";
import {
  MultiAccountSelectQuery,
  SelectGroupOption,
  SelectOption,
  SelectSimpleOption,
} from "../../../generated/dashboard/graphqlSchema";

interface QueryType {
  page?: number;
  perPage?: number;
  paginationDirection?: "next" | "previous";
  startCursor?: string;
  endCursor?: string;
  [key: string]: unknown;
}

interface MultiAccountSearchProps {
  field: string;
  label: string;
  query: QueryType;
  updateQuery: (input: Record<string, unknown>) => void;
  disabled: boolean;
  id?: string;
  showAllAccountsByDefault?: boolean;
  allAccountsSelectionBehavior?: AllAccountsSelectionBehaviorEnum;
  selectAllAccountsByDefault?: boolean;
}

// transforms array of nested select option objects into array of account ids
// type assertion is performed because value only exists on SelectSimpleOption and options only on SelectGroupOption
const selectAllValuesFromOptions: (
  selectOptions: SelectOption[]
) => string[] = (selectOptions) =>
  selectOptions.reduce((accountIds: string[], selectOption: SelectOption) => {
    if (Object.prototype.hasOwnProperty.call(selectOption, "value")) {
      const optionValue = (selectOption as SelectSimpleOption).value;
      return accountIds.concat(
        optionValue === ALL_ACCOUNTS_ID ? [] : [optionValue]
      );
    }
    return accountIds.concat(
      selectAllValuesFromOptions((selectOption as SelectGroupOption).options)
    );
  }, []);

const shouldChooseOnlyTheSelectedValue = (
  existingValues: string[],
  selectedValue: string
) =>
  !existingValues ||
  selectedValue === ALL_ACCOUNTS_ID ||
  existingValues.includes(ALL_ACCOUNTS_ID);

function MultiAccountSearch({
  field,
  label,
  query,
  updateQuery,
  disabled,
  id,
  showAllAccountsByDefault = false,
  allAccountsSelectionBehavior = AllAccountsSelectionBehaviorEnum.allAccountsKey,
  selectAllAccountsByDefault = true,
}: MultiAccountSearchProps) {
  const currentValue: Array<string> = query[field] as Array<string>;

  const onAccountSelect = (
    _value: string,
    selectField: { value: string; label: string },
    actionName: string,
    options: MultiAccountSelectQuery["multiAccountSelectOptions"]
  ) => {
    if (!selectField) return;

    let newValue: Array<string>;
    if (actionName === "remove-value") {
      newValue = currentValue
        ? currentValue.filter((v) => v !== selectField.value)
        : [];
    } else {
      /*
       * For actionName "select-option":
       * If no accounts are selected, select the one the user just picked.
       * 'All Accounts' is represented by ALL_ACCOUNTS_ID and is available when showAllAccountsByDefault is true.
       * If the All Accounts option is available....
       * If selectAllAccountsAsAllCurrentOptions is false:
       * Selecting 'All Accounts' will unselect any other already selected accounts.
       * If 'All Accounts' is currently selected, selecting another individual account will unselect it.
       * If selectAllAccountsAsAllCurrentOptions is true:
       * Selecting 'All Accounts' will act as if user selected all individual accounts
       */
      const shouldChooseAllValues =
        selectField.value === ALL_ACCOUNTS_ID &&
        allAccountsSelectionBehavior ===
          AllAccountsSelectionBehaviorEnum.selectAccounts;
      if (shouldChooseAllValues) {
        newValue = selectAllValuesFromOptions(options || []);
      } else {
        newValue = shouldChooseOnlyTheSelectedValue(
          currentValue,
          selectField.value
        )
          ? [selectField.value]
          : [...currentValue, selectField.value];
      }
    }
    updateQuery({ [field]: newValue });
  };

  return (
    <MultiAccountSelect
      disabled={disabled}
      onAccountSelect={onAccountSelect}
      accountIds={currentValue}
      label={label}
      id={id}
      showAllAccountsByDefault={showAllAccountsByDefault}
      allAccountsSelectionBehavior={allAccountsSelectionBehavior}
      selectAllAccountsByDefault={selectAllAccountsByDefault}
    />
  );
}

export default MultiAccountSearch;

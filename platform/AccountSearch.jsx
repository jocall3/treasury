import React from "react";
import AccountSelect from "../../containers/AccountSelect";
import { ALL_ACCOUNTS_ID } from "../../constants/index";

function AccountSearch({ field, label, query, updateQuery }) {
  const accountId = query[field];

  function onAccountSelect(newValue) {
    if (newValue === ALL_ACCOUNTS_ID) {
      updateQuery({ [field]: null });
    } else {
      updateQuery({ [field]: newValue });
    }
  }

  return (
    <AccountSelect
      onAccountSelect={onAccountSelect}
      accountId={accountId}
      label={label}
    />
  );
}

export default AccountSearch;

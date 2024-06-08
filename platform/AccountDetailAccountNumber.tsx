import React from "react";
import { useFullAccountNumberLazyQuery } from "../../../generated/dashboard/graphqlSchema";
import AuditableTextField from "../auditable_fields/AuditableTextField";

interface AccountNumberProps {
  accountDetailId: string;
  partialAccountNumber: string;
}

function AccountDetailAccountNumber({
  accountDetailId,
  partialAccountNumber,
}: AccountNumberProps): JSX.Element {
  const partialDisplayedAccountNumber = `•••• ${partialAccountNumber.slice(
    partialAccountNumber.length - 4,
    partialAccountNumber.length
  )}`;

  return (
    <AuditableTextField
      graphqlQuery={useFullAccountNumberLazyQuery}
      queryVariables={{
        accountDetailId,
      }}
      fieldName="fullAccountNumber"
      defaultText={partialDisplayedAccountNumber}
      allowCopy
    />
  );
}

export default AccountDetailAccountNumber;

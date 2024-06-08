import React from "react";
import { useFullPaymentOrderAttemptAccountNumberLazyQuery } from "../../../generated/dashboard/graphqlSchema";
import AuditableTextField from "../auditable_fields/AuditableTextField";

interface PaymentOrderAttemptAccountNumberProps {
  paymentOrderAttemptId: string;
  receivingEntityId: string;
  partialAccountNumber: string;
}

function PaymentOrderAttemptAccountNumber({
  paymentOrderAttemptId,
  receivingEntityId,
  partialAccountNumber,
}: PaymentOrderAttemptAccountNumberProps): JSX.Element {
  const partialDisplayedAccountNumber = `•••• ${partialAccountNumber.slice(
    partialAccountNumber.length - 4,
    partialAccountNumber.length
  )}`;

  return (
    <AuditableTextField
      graphqlQuery={useFullPaymentOrderAttemptAccountNumberLazyQuery}
      queryVariables={{
        currentPaymentOrderAttemptId: paymentOrderAttemptId,
        receivingEntityId,
      }}
      fieldName="fullPaymentOrderAttemptAccountNumber"
      defaultText={partialDisplayedAccountNumber}
      allowCopy
    />
  );
}

export default PaymentOrderAttemptAccountNumber;

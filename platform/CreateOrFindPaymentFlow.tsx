import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PaymentFlow } from "../../../generated/dashboard/graphqlSchema";
import CreatePaymentFlowForm from "./CreatePaymentFlowForm";

function CreateOrFindExternalAccountFlow() {
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <div className="grid grid-cols-2 gap-4 pt-8">
      <CreatePaymentFlowForm
        onSuccess={(paymentFlow: PaymentFlow) => {
          history.push(`${pathname}/${paymentFlow.id}`);
        }}
      />
      <div>{/* TODO(jlang):  Add Ability to enter PaymentFlow#id */}</div>
    </div>
  );
}

export default CreateOrFindExternalAccountFlow;

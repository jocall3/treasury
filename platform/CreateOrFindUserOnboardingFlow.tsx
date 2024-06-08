import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { UserOnboardingFlow } from "../../../generated/dashboard/graphqlSchema";
import CreateUserOnboardingFlowForm from "./CreateUserOnboardingFlowForm";

function CreateOrFindUserOnboardingFlow() {
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <div className="grid grid-cols-2 gap-4 pt-8">
      <CreateUserOnboardingFlowForm
        onSuccess={(userOnboardingFlow: UserOnboardingFlow) => {
          history.push(`${pathname}/${userOnboardingFlow.id}`);
        }}
      />
      <div>
        {/* TODO(jlang):  Add Ability to enter UserOnboardingFlow#ID */}
      </div>
    </div>
  );
}

export default CreateOrFindUserOnboardingFlow;

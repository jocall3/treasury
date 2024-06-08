import React from "react";
import { Route, Switch } from "react-router";
import { Heading } from "../../../common/ui-components";
import CreateOrFindUserOnboardingFlow from "./CreateOrFindUserOnboardingFlow";
import UserOnboardingEmbeddableFlowDemo from "./UserOnboardingEmbeddableFlowDemo";

function UserOnboardingFlowDemo() {
  return (
    <div>
      <Heading level="h1">Pre-Built UIs Demo - User Onboarding Flows</Heading>

      <Switch>
        <Route
          exact
          path="/workflows/demos/user_onboarding_flow"
          component={CreateOrFindUserOnboardingFlow}
        />
        <Route
          exact
          path="/workflows/demos/user_onboarding_flow/:id"
          component={UserOnboardingEmbeddableFlowDemo}
        />
      </Switch>
    </div>
  );
}

export default UserOnboardingFlowDemo;

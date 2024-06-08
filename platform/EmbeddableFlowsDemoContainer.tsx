import React from "react";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import AccountCollectionFlowDemo from "./account_collection_flow/AccountCollectionFlowDemo";
import PaymentFlowDemo from "./payment_flow/PaymentFlowDemo";
import UserOnboardingFlowDemo from "./user_onboarding_flow/UserOnboardingFlowDemo";
import { PageHeader } from "../../common/ui-components/PageHeader/PageHeader";

const ACCOUNT_COLLECTION_FLOW_DEMO_BASEPATH =
  "/workflows/demos/account_collection_flow";
const PAYMENT_FLOW_DEMO_BASEPATH = "/workflows/demos/payment_flow";
const USER_ONBOARDING_FLOW_DEMO_BASEPATH =
  "/workflows/demos/user_onboarding_flow";

function EmbeddableFlowsDemoContainer() {
  return (
    <Switch>
      <Route
        exact
        path={[
          ACCOUNT_COLLECTION_FLOW_DEMO_BASEPATH,
          `${ACCOUNT_COLLECTION_FLOW_DEMO_BASEPATH}/:id`,
        ]}
        component={AccountCollectionFlowDemo}
      />
      <Route
        exact
        path={[PAYMENT_FLOW_DEMO_BASEPATH, `${PAYMENT_FLOW_DEMO_BASEPATH}/:id`]}
        component={PaymentFlowDemo}
      />

      <Route
        exact
        path={[
          USER_ONBOARDING_FLOW_DEMO_BASEPATH,
          `${USER_ONBOARDING_FLOW_DEMO_BASEPATH}/:id`,
        ]}
        component={UserOnboardingFlowDemo}
      />
      <Route>
        <PageHeader hideBreadCrumbs title="Pre-Built UIs Demo">
          <div className="grid grid-flow-row gap-2">
            <Link to={ACCOUNT_COLLECTION_FLOW_DEMO_BASEPATH}>
              Account Collection Flow
            </Link>
            <Link to={PAYMENT_FLOW_DEMO_BASEPATH}>Payment Flow</Link>
            <Link to={USER_ONBOARDING_FLOW_DEMO_BASEPATH}>
              User Onboarding Flow
            </Link>
          </div>
        </PageHeader>
      </Route>
    </Switch>
  );
}

export default EmbeddableFlowsDemoContainer;

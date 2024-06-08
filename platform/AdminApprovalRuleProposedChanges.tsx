import React from "react";
import { ProposedChange } from "~/generated/dashboard/graphqlSchema";
import RuleConditionsList from "./RuleConditionsList";
import RuleApproversList from "./RuleApproversList";

function AdminApprovalRuleProposedChanges({
  proposedChange,
}: {
  proposedChange: ProposedChange;
}) {
  const { proposedName, proposedConditionsArray, proposedRequiredReviewers } =
    proposedChange;
  return (
    <>
      {proposedName && (
        <div className="mb-4 mt-2 font-medium">
          Proposed Name: {proposedName}
        </div>
      )}
      {proposedConditionsArray && proposedConditionsArray.length > 0 && (
        <>
          <div className="mb-2 mt-4 font-medium">Proposed Conditions</div>
          <div className="rounded border border-gray-100 p-6">
            <RuleConditionsList
              allRequiredConditions={proposedConditionsArray}
              operator="or"
            />
          </div>
        </>
      )}
      {proposedRequiredReviewers && proposedRequiredReviewers.length > 0 && (
        <>
          <div className="mb-2 mt-4 font-medium">Proposed Approvers</div>
          <div className="rounded border border-gray-100 p-6">
            <RuleApproversList requiredReviewers={proposedRequiredReviewers} />
          </div>
        </>
      )}
    </>
  );
}

export default AdminApprovalRuleProposedChanges;

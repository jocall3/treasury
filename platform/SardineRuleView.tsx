import React from "react";
import {
  Heading,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../../common/ui-components";
import { useSardineRuleViewQuery } from "../../../generated/dashboard/graphqlSchema";
import RiskLevelIndicator from "./RiskLevelIndicator";

const SARDINE_RULE_DATA_MAPPING = {
  ruleId: "Rule ID",
  name: "Rule Name",
  condition: "Rule Condition",
  action: "Action",
  description: "Description",
};

interface SardineRuleViewProps {
  ruleId: string;
}

function replaceRiskLevelStringWithNumber(action: string) {
  const updatedAction = action
    .split("=low ")
    .join("=1 ")
    .split("=medium ")
    .join("=2 ")
    .split("=very_high ")
    .join("=4 ")
    .split("=high ")
    .join("=3 ");

  return updatedAction;
}

function replaceWithRiskLevelIndicator(actionBits: string[]) {
  const riskLevelNumberToStringMapping = {
    "1": "low",
    "2": "medium",
    "3": "high",
    "4": "very_high",
  };
  const excludeActionNames = ["riskCount"];
  const updatedActionBits = actionBits.map((action) => {
    const [actionName, actionRiskValue] = action.split("=");

    const replaceWithIndicator =
      actionRiskValue in riskLevelNumberToStringMapping &&
      !excludeActionNames.includes(actionName);

    const actionRisk = !replaceWithIndicator ? (
      `${actionRiskValue} `
    ) : (
      <div className="mx-2 flex">
        <RiskLevelIndicator
          riskLevel={riskLevelNumberToStringMapping[actionRiskValue] as string}
        />
      </div>
    );

    return [`${actionName}=`, actionRisk];
  });

  const updatedAction = updatedActionBits.flatMap((item) => item);

  return updatedAction;
}

function formatAction(action: string) {
  const reformatAction = `${action} `;
  const actionBits =
    replaceRiskLevelStringWithNumber(reformatAction).split(" ");
  actionBits.pop();
  const updatedAction = replaceWithRiskLevelIndicator(actionBits);

  return updatedAction;
}

function SardineRuleView({ ruleId }: SardineRuleViewProps) {
  const { loading, data } = useSardineRuleViewQuery({
    variables: { ruleId },
  });
  return (
    <div id="payment-order-details-panel">
      <div className="w-full px-2 py-5">
        <Heading level="h1" size="l">
          {`Details of Rule #${ruleId}`}
        </Heading>
      </div>
      {(loading || !data) && (
        <KeyValueTableSkeletonLoader dataMapping={SARDINE_RULE_DATA_MAPPING} />
      )}
      {!loading && data && (
        <KeyValueTable
          dataMapping={SARDINE_RULE_DATA_MAPPING}
          data={{
            ...data?.sardineRule,
            ruleId: data?.sardineRule?.id,
            action: formatAction(data?.sardineRule?.action || ""),
          }}
          altRowClassNames="detail-panel-row"
          altTableClassNames="detail-panel p-6"
        />
      )}
    </div>
  );
}

export default SardineRuleView;

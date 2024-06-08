import React from "react";
import { ExpandableCard } from "../../../common/ui-components";
import RiskLevelIndicator from "./RiskLevelIndicator";
import Watchlists from "./Watchlists";
import {
  Decision,
  Verification,
} from "../../../generated/dashboard/graphqlSchema";

function WatchlistProfileView({
  decisionable,
  verification = null,
}: {
  decisionable: Decision;
  verification?: Verification | null;
}) {
  return (
    <ExpandableCard>
      <div className="px-6 py-1">
        <div className="mb-6 flex flex-col items-start">
          <div className="flex flex-row items-center">
            <h1 className="font-app mr-4 text-base font-medium">
              Overall Risk
            </h1>
            <RiskLevelIndicator riskLevel={decisionable.score} />
          </div>
        </div>

        <div className="mb-4 mt-8">
          <Watchlists verification={verification} />
        </div>
      </div>
    </ExpandableCard>
  );
}

export default WatchlistProfileView;

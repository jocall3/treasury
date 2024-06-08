import React from "react";
import { DECISIONS_SCORES } from "../../constants";
import { OverflowTip } from "../../../common/ui-components";

interface RiskLevelIndicatorProps {
  formatterOrText?: Record<string, string> | string;
  riskLevel?: string | null;
}

export type RiskLevel = "low" | "medium" | "high" | "very_high";

function RiskLevelIndicator({
  formatterOrText = DECISIONS_SCORES,
  riskLevel,
}: RiskLevelIndicatorProps) {
  let indicatorColor;
  let textColor;
  switch (riskLevel) {
    case "low":
      indicatorColor = "bg-green-400";
      textColor = "text-green-600";
      break;
    case "medium":
      indicatorColor = "bg-yellow-300";
      textColor = "text-yellow-400";
      break;
    case "high":
      indicatorColor = "bg-orange-400";
      textColor = "text-orange-600";
      break;
    case "very_high":
      indicatorColor = "bg-red-500";
      textColor = "text-red-700";
      break;
    default:
      indicatorColor = "bg-gray-500";
      textColor = "text-gray-800";
      break;
  }

  let label = "N/A";
  if (formatterOrText) {
    label =
      typeof formatterOrText === "string"
        ? formatterOrText
        : formatterOrText[riskLevel || ""] || "N/A";
  }

  return (
    <div className="flex items-center">
      <div className="mr-1">
        <div
          className={`${indicatorColor as string} h-1.5 w-1.5 rounded-full`}
        />
      </div>
      <OverflowTip
        id="risk-score"
        message={label}
        className={`truncate text-xs ${textColor as string}`}
      >
        {label}
      </OverflowTip>
    </div>
  );
}

export default RiskLevelIndicator;

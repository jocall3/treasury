import React from "react";
import { Badge, BadgeType } from "../../../common/ui-components";
import { Decision__StatusEnum } from "../../../generated/dashboard/graphqlSchema";
import { PRETTY_DECISION_STATUSES } from "../../constants";

interface ComplianceStatusBadgeProps {
  status?: Decision__StatusEnum;
}

function ComplianceStatusBadge({ status }: ComplianceStatusBadgeProps) {
  let badgeType;
  switch (status) {
    case Decision__StatusEnum.Approved:
      badgeType = BadgeType.Success;
      break;
    case Decision__StatusEnum.NeedsApproval:
      badgeType = BadgeType.Cool;
      break;
    case Decision__StatusEnum.Denied:
      badgeType = BadgeType.Critical;
      break;
    case Decision__StatusEnum.Cancelled:
      badgeType = BadgeType.Warning;
      break;
    case Decision__StatusEnum.Completed:
      badgeType = BadgeType.Cool;
      break;
    default:
      badgeType = BadgeType.Default;
      break;
  }

  return (
    <Badge
      text={(status && PRETTY_DECISION_STATUSES[status]) || "N/A"}
      type={badgeType as BadgeType}
      keepCaseFormat
      className="w-fit"
    />
  );
}

export default ComplianceStatusBadge;

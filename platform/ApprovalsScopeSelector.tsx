import React, { useCallback, useMemo } from "react";
import ReduxSelectBar from "../../common/deprecated_redux/ReduxSelectBar";
import { parse, stringify } from "../../common/utilities/queryString";
import { useMountEffect } from "../../common/utilities/useMountEffect";

export enum ReviewerScope {
  PendingMyApproval = "pending_my_approval",
  ViewAll = "view_all",
}

const REVIEWER_OPTIONS = [
  { value: ReviewerScope.PendingMyApproval, text: "Pending My Approval" },
  { value: ReviewerScope.ViewAll, text: "View All" },
];

interface ApprovalsScopeSelectorProps {
  scopeByPendingMyApproval?: boolean | null;
  onReviewerScopeChange: (scopeByPendingMyApproval: boolean | null) => void;
}

function ApprovalsScopeSelector({
  scopeByPendingMyApproval,
  onReviewerScopeChange,
}: ApprovalsScopeSelectorProps): JSX.Element {
  const reviewerScope = useMemo((): ReviewerScope => {
    if (scopeByPendingMyApproval) {
      return ReviewerScope.PendingMyApproval;
    }

    return ReviewerScope.ViewAll;
  }, [scopeByPendingMyApproval]);

  const onSelect = useCallback(
    (scope: ReviewerScope): void => {
      let scopeByPendingMyApprovalValue: boolean | null;

      if (scope === ReviewerScope.PendingMyApproval) {
        scopeByPendingMyApprovalValue = true;
      } else {
        scopeByPendingMyApprovalValue = null;
      }

      const parsedQueryString = parse(window.location.search);

      const newQuery = {
        ...parsedQueryString,
        status: "needs_approval",
        scopeByPendingMyApproval: scopeByPendingMyApprovalValue,
      };

      window.history.replaceState(null, "", `?${stringify(newQuery)}`);

      onReviewerScopeChange(scopeByPendingMyApprovalValue);
    },
    [onReviewerScopeChange]
  );

  useMountEffect((): void => {
    const { scopeByPendingMyApproval: initialScopeByPendingMyApproval } = parse(
      window.location.search
    );

    // Run once on initial render if neither param is included
    // This helps backwards compatability with MCB Mailers
    if (initialScopeByPendingMyApproval === undefined) {
      onSelect(ReviewerScope.PendingMyApproval);
    }
  });

  return (
    <div className="max-w-lg">
      <ReduxSelectBar
        required
        selectOptions={REVIEWER_OPTIONS}
        input={{
          onChange: onSelect,
          value: reviewerScope,
          name: "reviewer-search",
        }}
      />
    </div>
  );
}

export default ApprovalsScopeSelector;

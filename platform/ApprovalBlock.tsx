import React, { useState } from "react";
import { startCase } from "lodash";
import moment from "moment-timezone";
import { cn } from "~/common/utilities/cn";
import { Button, Icon, SelectField } from "../../common/ui-components";
import {
  Group,
  User,
  ReviewActionEnum,
  Reviewer,
  RequiredReviewer,
} from "../../generated/dashboard/graphqlSchema";

export enum RuleStatus {
  Pending,
  Approved,
  Denied,
}

export interface RuleInterface {
  id?: string;
  /** When `true`, sets the rule as the active rule needing approvals within the rule set. */
  activeRule?: boolean;
  /** Name of the rule */
  name?: string;
  /** Path to the rule */
  path?: string;
  /** States the kind of review required for the block.
   *
   * An example might be "Payment Review Required"
   */
  requiredReviewDescription: string;
  /** Reviewers associated with the given rule */
  reviewers?: Reviewer[];
  /** Required reviewers associated with triggered rule */
  requiredReviewers?: RequiredReviewer[];
}

interface SharedApprovalBlockProps {
  /** Allows you to pass custom styles to the outermost div of the component. */
  className?: string;
  /** Action fired when reviewing as a given group. */
  onReview?: (
    reviewAction: ReviewActionEnum,
    reviewAsGroupId: string | null,
    reviewerId: string | null,
    reviewAsAdminOverride: boolean
  ) => void;
}

interface ReviewedByProps {
  /** When `true`, the reviewer is an admin override */
  adminOverride?: boolean;
  /** Used with conditional approvers */
  approvalGroupsComponent?: React.ReactNode;
  /** Allows you to pass custom styles to the outermost div of the component. */
  className?: string;
  /** Review action the user reviewed with. */
  reviewAction?: ReviewActionEnum.Approve | ReviewActionEnum.Deny;
  /** Time the reviewer was reviewed at. */
  reviewedAt?: Date;
  /** Group associated with the review. */
  reviewedByGroup?: Group;
  /** Who approved/denied this reviewer. */
  reviewedByUser?: User;
}

/**
 * Renders the approval or denial received from a user.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-approvalstimeline-reviewedby--docs)
 */
function ReviewedBy({
  adminOverride = false,
  approvalGroupsComponent,
  className,
  reviewAction,
  reviewedAt,
  reviewedByUser,
  reviewedByGroup,
}: ReviewedByProps) {
  return (
    <div className={cn(className, "align-middle")}>
      <Icon
        alignment="baseline"
        className="mr-2.5 shrink-0 text-gray-400"
        color="currentColor"
        iconName="time_60_s"
        size="s"
      />
      {reviewAction === ReviewActionEnum.Approve ? "Approved" : "Denied"}
      {" by "}
      <Button
        buttonType="link"
        display="inline-block"
        onClick={(): void => {
          window.open(reviewedByUser?.path, "_blank");
        }}
      >
        {reviewedByUser?.name}
      </Button>
      {" as "}
      {adminOverride && !reviewedByGroup ? (
        <span className="font-medium">Admin Override</span>
      ) : (
        <Button
          buttonType="link"
          display="inline-block"
          onClick={(): void => {
            window.open(reviewedByGroup?.path, "_blank");
          }}
        >
          {reviewedByGroup?.name}
        </Button>
      )}
      {approvalGroupsComponent && (
        <span>
          {" to override "}
          {approvalGroupsComponent}
          review
        </span>
      )}
      {" on "}
      {moment(reviewedAt).format("MMMM Do YYYY, h:mm a")}
    </div>
  );
}

interface ApprovalNeededProps extends SharedApprovalBlockProps {
  /** Admin override reviewer, if it exists. */
  adminOverrideReviewer: Reviewer;
  /** Groups the item needs approval from.
   *
   * Uses the `Group` item props to build approval buttons. */
  approvalGroups?: Group[];
  /** A list of `Groups` the user can review as. */
  canReviewAsGroups?: Group[];
  /** When `true`, disables all actions. */
  disableActions?: boolean;
  /** The total number of approvals needed for row.
   *
   * Defaults to 1.
   */
  numberOfApprovals?: number;
  /** Current reviewer id needing approval */
  reviewerId?: string;
}

/**
 * Renders the number of approvals needed and who those approvals are needed from.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-approvalstimeline-approvalneeded--docs)
 */
function ApprovalNeeded({
  adminOverrideReviewer,
  approvalGroups = [],
  canReviewAsGroups = [],
  className,
  disableActions = false,
  numberOfApprovals = 1,
  onReview,
  reviewerId,
}: ApprovalNeededProps) {
  const [currentApproverId, setCurrentApproverId] = useState(
    canReviewAsGroups.length > 1 || canReviewAsGroups.length === 0
      ? null
      : canReviewAsGroups && canReviewAsGroups[0].id
  );

  const selectOptions = canReviewAsGroups.map((canReviewAsGroup) => ({
    label: canReviewAsGroup.name,
    value: canReviewAsGroup.id,
  }));

  const approvalGroupsComponent = approvalGroups?.map(
    (approvalGroup, index, array) => {
      const lastElement = array.length - 1 === index;
      return (
        <span key={`approval_groups_${approvalGroup.id}`}>
          <Button
            buttonType="link"
            className={cn("pr-1", !lastElement)}
            display="inline-block"
            onClick={(): void => {
              window.open(approvalGroup?.path, "_blank");
            }}
            disabled={disableActions}
          >
            {approvalGroup?.name}
          </Button>
          {!lastElement && "or "}
        </span>
      );
    }
  );

  if (adminOverrideReviewer) {
    return (
      <ReviewedBy
        adminOverride
        approvalGroupsComponent={approvalGroupsComponent}
        reviewAction={
          adminOverrideReviewer.action === ReviewActionEnum.Approve
            ? ReviewActionEnum.Approve
            : ReviewActionEnum.Deny
        }
        reviewedAt={new Date(adminOverrideReviewer.actionTime as string)}
        reviewedByUser={adminOverrideReviewer.user as User}
      />
    );
  }
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div>
        <Icon
          alignment="baseline"
          className="mr-2.5 shrink-0 text-gray-400"
          color="currentColor"
          iconName="time_40_s"
          size="s"
        />
        {numberOfApprovals} {numberOfApprovals > 1 ? "Approvals" : "Approval"}{" "}
        needed from {approvalGroupsComponent}
      </div>
      {canReviewAsGroups.length > 0 && (
        <div className="ml-7 flex flex-col gap-2">
          {canReviewAsGroups.length > 1 && (
            <SelectField
              name="multiRoleApproverSelect"
              selectValue={currentApproverId}
              options={selectOptions}
              handleChange={(value: string) => {
                setCurrentApproverId(value);
              }}
              placeholder="Select a role to make this approval from"
            />
          )}
          <div className="flex w-full flex-row gap-2">
            {[ReviewActionEnum.Approve, ReviewActionEnum.Deny].map((action) => (
              <Button
                buttonType="secondary"
                disabled={!currentApproverId || disableActions}
                fullWidth
                onClick={() => {
                  onReview?.(
                    action,
                    currentApproverId as string,
                    reviewerId as string,
                    false // reviewAsAdminOverride
                  );
                }}
              >
                {startCase(action)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ruleStatus(
  reviewers: Reviewer[],
  adminOverrideReviewer?: Reviewer
): RuleStatus {
  const actions = reviewers
    .filter((reviewer) => reviewer.action !== ReviewActionEnum.Create)
    .map((reviewer) => reviewer.action) as ReviewActionEnum[];

  if (actions.length === 0) {
    return RuleStatus.Pending;
  }

  if (
    actions.every((action) => action === ReviewActionEnum.Approve) ||
    adminOverrideReviewer?.action === ReviewActionEnum.Approve
  ) {
    return RuleStatus.Approved;
  }

  if (
    actions.includes(ReviewActionEnum.Deny) ||
    adminOverrideReviewer?.action === ReviewActionEnum.Deny
  ) {
    return RuleStatus.Denied;
  }

  return RuleStatus.Pending;
}

function renderIcon(reviewers: Reviewer[], adminOverrideReviewer?: Reviewer) {
  const currentRuleStatus = ruleStatus(reviewers, adminOverrideReviewer);

  switch (currentRuleStatus) {
    case RuleStatus.Pending:
      return (
        <Icon
          className="mr-2 shrink-0 text-orange-300"
          color="currentColor"
          iconName="error_outlined"
        />
      );
    case RuleStatus.Approved:
      return (
        <Icon
          className="mr-2 shrink-0 text-green-500"
          color="currentColor"
          iconName="checkmark_circle"
        />
      );
    case RuleStatus.Denied:
      return (
        <Icon
          className="mr-2 shrink-0 text-red-500"
          color="currentColor"
          iconName="clear_circle"
        />
      );
    default:
      return (
        <Icon
          className="mr-2 shrink-0 text-orange-300"
          color="currentColor"
          iconName="error_outlined"
        />
      );
  }
}

interface ApprovalBlockProps extends SharedApprovalBlockProps {
  /** Admin override reviewer, if it exists. */
  adminOverrideReviewer?: ApprovalNeededProps["adminOverrideReviewer"];
  /** When `true`, disables all actions. */
  disableActions?: ApprovalNeededProps["disableActions"];
  /** When `true`, shows any review actions the user can take and reviews that have already occurred. */
  renderReviewerDetails?: boolean;
  /** Rules triggered within the block.
   *
   * Each rule can have multiple approvals needed, or reviews already received.
   *
   * If there is more than one rule triggered, it will display the rules triggered in the order they exist in the array.
   */
  rules: RuleInterface[];
}

/**
 * Renders a block of approvals needed associated to a rule.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-approvalstimeline-approvalblock--docs)
 */
function ApprovalBlock({
  adminOverrideReviewer,
  children,
  className,
  disableActions = false,
  onReview,
  renderReviewerDetails,
  rules,
}: React.PropsWithChildren<ApprovalBlockProps>) {
  return (
    <div
      className={cn(
        "border-b border-gray-50 px-4 py-3 last:border-0",
        className
      )}
    >
      {rules?.map((rule, index) => (
        <div
          key={`approval_rule_row_${rule.id || rule.name || index}`}
          className="flex flex-col gap-3 pb-3 last:pb-0"
        >
          <div className="flex flex-row">
            {rules.length > 1 ? (
              <div
                className={cn(
                  "mr-2 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white",
                  rule.activeRule ? "bg-orange-300" : "bg-gray-400"
                )}
              >
                {index + 1}
              </div>
            ) : (
              renderIcon(rule.reviewers || [], adminOverrideReviewer)
            )}
            <div className="font-medium">
              {rule.requiredReviewDescription}
              {rule.path && (
                <>
                  {", "}
                  <Button
                    buttonType="link"
                    className="break-word !items-start !whitespace-normal text-left"
                    display="inline-block"
                    onClick={(): void => {
                      window.open(rule.path, "_blank");
                    }}
                  >
                    {rule.name}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div
            className={cn(
              "ml-2 pl-5",
              rules.length > 1 && "border-l border-gray-50"
            )}
          >
            {renderReviewerDetails && (
              <div className="flex flex-col gap-3">
                {rule.reviewers
                  ? rule.reviewers?.map((reviewer) => {
                      switch (reviewer.action) {
                        case ReviewActionEnum.Pending:
                        case ReviewActionEnum.Future:
                          return (
                            <ApprovalNeeded
                              key={`${reviewer.action}_${reviewer.id}`}
                              adminOverrideReviewer={
                                adminOverrideReviewer as Reviewer
                              }
                              approvalGroups={reviewer.groups as Group[]}
                              canReviewAsGroups={reviewer.canReviewAsGroups}
                              onReview={onReview}
                              disableActions={disableActions}
                              reviewerId={reviewer.id}
                            />
                          );
                        case ReviewActionEnum.Approve:
                        case ReviewActionEnum.Deny:
                          return (
                            <ReviewedBy
                              key={`${reviewer.action}_${reviewer.id}`}
                              reviewAction={
                                reviewer.action === ReviewActionEnum.Approve
                                  ? ReviewActionEnum.Approve
                                  : ReviewActionEnum.Deny
                              }
                              reviewedAt={
                                new Date(reviewer.actionTime as string)
                              }
                              reviewedByGroup={reviewer.group as Group}
                              reviewedByUser={reviewer.user as User}
                            />
                          );
                        default:
                          return null;
                      }
                    })
                  : rule.requiredReviewers &&
                    rule.requiredReviewers.map((requiredReviewer) => (
                      <ApprovalNeeded
                        approvalGroups={requiredReviewer.conditionalGroups}
                        numberOfApprovals={requiredReviewer.numberOfReviewers}
                        adminOverrideReviewer={
                          adminOverrideReviewer as Reviewer
                        }
                      />
                    ))}
              </div>
            )}
            {children}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AdminOverrideApprovalBlockProps extends SharedApprovalBlockProps {
  /** When `true`, disables buttons */
  disableActions?: boolean;
}

function AdminOverrideApprovalBlock({
  className,
  disableActions,
  onReview,
}: AdminOverrideApprovalBlockProps) {
  return (
    <ApprovalBlock
      className={className}
      renderReviewerDetails
      rules={[
        {
          activeRule: true,
          requiredReviewDescription: "Admin Override",
        },
      ]}
    >
      <div className="mb-4">
        As an admin, you can override required approvals for this payment order.
      </div>
      <div className="flex w-full flex-row gap-2 text-red-400">
        {[ReviewActionEnum.Approve, ReviewActionEnum.Deny].map((action) => (
          <Button
            key={action}
            buttonType="secondary"
            fullWidth
            onClick={() => {
              onReview?.(
                action,
                null, // reviewAsGroupId
                null, // reviewerId
                true // reviewAsAdminOverride
              );
            }}
            disabled={disableActions}
          >
            {startCase(action)}
          </Button>
        ))}
      </div>
    </ApprovalBlock>
  );
}

interface RulesListProps {
  className?: string;
}

/**
 * Renders a list of rules with appropriate spacing.
 */
function RulesList({
  children,
  className,
}: React.PropsWithChildren<RulesListProps>) {
  return (
    <div className={cn("flex flex-col gap-y-2", className)}>{children}</div>
  );
}

export {
  ApprovalNeeded,
  ApprovalNeededProps,
  ApprovalBlock,
  ApprovalBlockProps,
  ReviewedBy,
  ReviewedByProps,
  AdminOverrideApprovalBlock,
  AdminOverrideApprovalBlockProps,
  RulesList,
  RulesListProps,
};

import React from "react";
import {
  Drawer,
  ExpandableCard,
  IndexTable,
  IndexTableSkeletonLoader,
  LoadingLine,
  OverflowTip,
} from "../../../common/ui-components";
import SardineRuleView from "./SardineRuleView";
import RiskIndicator from "./RiskLevelIndicator";
import {
  VendorCheckEnum,
  Verification,
  VerificationStatusEnum,
  Verification__TypeEnum,
  Decision__ScoreEnum,
} from "../../../generated/dashboard/graphqlSchema";
import { VENDOR_CHECKS_DATA_MAPPING } from "./DeprecatedRiskProfileView";

const RISK_PROFILE_MAPPING = {
  categoryName: "Category",
  score: "Risk Level",
  reasonCodes: "Reason",
};

const PROCESSING_STATUSES = [
  VerificationStatusEnum.Processing,
  VerificationStatusEnum.Pending,
];

const SCORES = [
  Decision__ScoreEnum.Low,
  Decision__ScoreEnum.Medium,
  Decision__ScoreEnum.High,
  Decision__ScoreEnum.VeryHigh,
];

const OVERALL_RISK_CATEGORY = "overallRisk";

type OverallRisk = {
  score: Decision__ScoreEnum | undefined;
  reasonCodes: string[];
};

function getOverallRisk(verifications: Verification[]): OverallRisk {
  const overallResults = verifications
    .flatMap((verification) => verification.riskProfileVerificationResult)
    .filter(
      (verificationResult) =>
        verificationResult.categoryName === OVERALL_RISK_CATEGORY
    );

  const overallRiskScore = overallResults.sort(
    (resultA, resultB) =>
      SCORES.indexOf(resultB.score as Decision__ScoreEnum) -
      SCORES.indexOf(resultA.score as Decision__ScoreEnum)
  )[0]?.score as Decision__ScoreEnum;

  const reasonCodes = overallResults.flatMap(
    (verificationResult) => verificationResult.reasonCodes
  );

  return {
    score: overallRiskScore,
    reasonCodes,
  };
}

interface ReasonCodesProps {
  reasonCodes: string[];
}

function ReasonCodes({ reasonCodes }: ReasonCodesProps) {
  const formattedReasonCodes = reasonCodes.map((reasonCode: string) => {
    const ruleHasDescription = reasonCode.indexOf(":") !== -1;
    const [ruleName, ruleDescription] = reasonCode.split(":");
    const ruleId = ruleName.substring(5, ruleName.length);
    return {
      reasonCode,
      ruleHasDescription,
      ruleDescription,
      ruleName,
      ruleId,
    };
  });

  return (
    <div>
      {formattedReasonCodes?.map(
        ({
          reasonCode,
          ruleHasDescription,
          ruleDescription,
          ruleName,
          ruleId,
        }) => (
          <div className="h-fit w-full" key={reasonCode}>
            <OverflowTip message={reasonCode} className="truncate">
              {!ruleHasDescription ? (
                reasonCode
              ) : (
                <>
                  <Drawer
                    trigger={
                      <span className="cursor-pointer underline">
                        {ruleName}
                      </span>
                    }
                  >
                    <SardineRuleView ruleId={ruleId} />
                  </Drawer>
                  {`: ${ruleDescription || "No description provided"}`}
                </>
              )}
            </OverflowTip>
          </div>
        )
      )}
    </div>
  );
}

function getVerificationRows(
  verifications: Verification[],
  vendorChecks: VendorCheckEnum[]
) {
  const categoryNameByPermittedCheck: Record<string, string> =
    vendorChecks.reduce(
      (acc, vendorCheck) => ({
        ...acc,
        ...VENDOR_CHECKS_DATA_MAPPING[vendorCheck],
      }),
      {}
    );
  const results = verifications
    .filter(
      (verification) =>
        verification.verificationType !== Verification__TypeEnum.BeneficialOwner
    )
    .flatMap((verification) => verification.riskProfileVerificationResult)
    .filter(
      (verificationResult) =>
        verificationResult.categoryName !== OVERALL_RISK_CATEGORY
    )
    .filter(
      (verificationResult) =>
        verificationResult.categoryName in categoryNameByPermittedCheck
    )
    .sort(
      (verificationResultA, verificationResultB) =>
        SCORES.indexOf(verificationResultB.score as Decision__ScoreEnum) -
        SCORES.indexOf(verificationResultA.score as Decision__ScoreEnum)
    );

  return results.map(({ categoryName, score, reasonCodes }) => {
    const formattedReasonCodes =
      reasonCodes.length > 0 ? <ReasonCodes reasonCodes={reasonCodes} /> : "-";

    return {
      categoryName: categoryNameByPermittedCheck[categoryName],
      score: <RiskIndicator riskLevel={score} />,
      reasonCodes: formattedReasonCodes,
    };
  });
}

interface RiskProfileViewProps {
  verifications: Verification[] | undefined;
  vendorChecks: VendorCheckEnum[];
  loading: boolean;
  hideTitle?: boolean;
  expandable?: boolean;
}

function RiskProfileView({
  verifications,
  vendorChecks,
  loading,
  expandable = false,
  hideTitle = false,
}: RiskProfileViewProps) {
  const loadingContent = (
    <>
      <div className="mb-6 flex flex-col items-start">
        <div
          className={`flex flex-row items-center ${hideTitle ? "hidden" : ""}`}
        >
          <h1 className="font-app mr-4 text-base font-medium">Overall Risk</h1>
          <div className="w-12">
            <LoadingLine />
          </div>
        </div>
        <div className="mt-2 flex w-48 flex-col space-y-2">
          <LoadingLine />
          <LoadingLine />
          <LoadingLine />
          <LoadingLine />
        </div>
      </div>
      <div className="mb-4 mt-8">
        <IndexTableSkeletonLoader
          headers={Object.keys(RISK_PROFILE_MAPPING)}
          numRows={14}
        />
      </div>
    </>
  );

  if (loading || !verifications) {
    return expandable ? (
      <ExpandableCard expandable={expandable}>
        <div className={`px-6 py-1 ${hideTitle ? "-my-2" : ""}`}>
          {loadingContent}
        </div>
      </ExpandableCard>
    ) : (
      loadingContent
    );
  }

  if (!loading && verifications.length === 0) {
    return <h2 className="text-lg">No verification was requested</h2>;
  }

  const hasProcessingVerifications = verifications.some((verification) =>
    PROCESSING_STATUSES.includes(verification.status)
  );

  if (!loading && hasProcessingVerifications) {
    return (
      <h2 className="text-lg">Processing risk profile for this decision</h2>
    );
  }

  const overallRisk = getOverallRisk(verifications);
  const verificationDataRows = getVerificationRows(verifications, vendorChecks);

  const content = (
    <>
      <div className="mb-6 flex flex-col items-start">
        <div
          className={`flex flex-row items-center ${hideTitle ? "hidden" : ""}`}
        >
          <div className="mr-4 text-base font-medium">Overall Risk</div>
          <RiskIndicator riskLevel={overallRisk.score} />
        </div>
        {overallRisk.reasonCodes && (
          <div id="rules" className="mt-2 h-fit w-fit">
            <ReasonCodes reasonCodes={overallRisk.reasonCodes} />
          </div>
        )}
      </div>
      <div className="mb-4 mt-8">
        <IndexTable
          dataMapping={RISK_PROFILE_MAPPING}
          data={verificationDataRows}
          styleMapping={{ reason: "table-entry-wide" }}
        />
      </div>
    </>
  );

  return expandable ? (
    <ExpandableCard expandable={expandable}>
      <div className={`px-6 py-1 ${hideTitle ? "-my-2" : ""}`}>{content}</div>
    </ExpandableCard>
  ) : (
    content
  );
}

export default RiskProfileView;

import React, { useEffect, useState } from "react";
import { isEmpty, startCase, merge } from "lodash";
import {
  ExpandableCard,
  Drawer,
  IndexTable,
  IndexTableSkeletonLoader,
  OverflowTip,
} from "../../../common/ui-components";
import RiskIndicator from "./RiskLevelIndicator";
import {
  Decision,
  DecisionableTypeEnum,
  Flow__PartyTypeEnum,
  UserOnboarding,
  Verification__TypeEnum,
  VendorCheckEnum,
} from "../../../generated/dashboard/graphqlSchema";
import SardineRuleView from "./SardineRuleView";

const RISK_PROFILE_MAPPING = {
  category: "Category",
  riskLevel: "Risk Level",
  reason: "Reason",
};

const KYB_IDENTITY_CHECKS = {
  overallRisk: "Overall",
  watchlist: "Watchlist",
  addressVerification: "Address Verification",
  phone: "Phone",
  name: "Name",
  addressDeliverability: "Address Deliverability",
  addressPropertyType: "Address Property Type",
  sosMatch: "SOS Match",
  sosActive: "SOS Active",
  sosDomestic: "SOS Domestic",
  tin: "TIN",
  industry: "Industry",
  websiteStatus: "Website Status",
  websiteVerification: "Website Verification",
  bankruptcies: "Bankruptcies",
  beneficialOwners: "Beneficial Owners",
};

const KYC_EMAIL = {
  emailLevel: "Email",
  emailDomainLevel: "Email Domain",
};

const KYC_PHONE = {
  phoneLevel: "Phone",
};

const KYC_TAX_ID_VERIFICATION = {
  taxIdLevel: "Tax ID",
};

const KYC_SANCTIONS = {
  sanctionLevel: "Sanction",
};

const KYC_POLITICALLY_EXPOSED_PERSON = {
  pepLevel: "Politically Exposed Person",
};

const KYC_ADVERSE_MEDIA = {
  adverseMediaLevel: "Adverse Media",
};

const KYC_DEVICE_AND_BEHAVIOR = {
  OSAnomaly: "OS Anomaly",
  RemoteSoftwareLevel: "Remote Software",
  behaviorBiometricLevel: "Behavior Biometric",
  Proxy: "Proxy",
  VPN: "VPN",
};

const KYC_BANK_RISK_CHECK = {
  bankLevel: "Bank",
  nsfLevel: "Non-Sufficient Funds",
  amlLevel: "Anti-Money Laundering",
  riskLevel: "Transaction Risk",
};

export const VENDOR_CHECKS_DATA_MAPPING = {
  [VendorCheckEnum.KybIdentity]: KYB_IDENTITY_CHECKS,
  [VendorCheckEnum.Email]: KYC_EMAIL,
  [VendorCheckEnum.Phone]: KYC_PHONE,
  [VendorCheckEnum.TaxIdVerification]: KYC_TAX_ID_VERIFICATION,
  [VendorCheckEnum.Sanction]: KYC_SANCTIONS,
  [VendorCheckEnum.PoliticallyExposedPerson]: KYC_POLITICALLY_EXPOSED_PERSON,
  [VendorCheckEnum.AdverseMedia]: KYC_ADVERSE_MEDIA,
  [VendorCheckEnum.DeviceAndBehavior]: KYC_DEVICE_AND_BEHAVIOR,
  [VendorCheckEnum.BankRisk]: KYC_BANK_RISK_CHECK,
};

interface Signal {
  key?: string;
  value: string;
  rawValue: string;
  reasonCodes: [string];
}

interface OtherVerificationResult {
  website: {
    url: string;
    status: string;
    domainRegistrar: string;
    createdAt: string;
    registeredAt: string;
    risks: Risk[];
  };
  names: { name: string; sources: string[]; risks: Risk[] }[];
  tin: {
    tin: string;
    risks: Risk[];
  };
  addresses: {
    fullAddress: string;
    sources: string[];
    risks: Risk[];
  }[];
  formation: {
    formationDate: string;
    formationState: string;
    entityType: string;
  };
  phoneNumbers: {
    phoneNumbers: string[];
    risks: Risk[];
  };
}

interface ParsedSignal {
  other: OtherVerificationResult;
  overall: { overallRisk: Signal[] };
  signals: Signal[];
}

type RiskProfile = {
  category: string;
  riskLevel: React.ReactElement | string;
  reason: React.ReactElement[] | string;
};

interface Risk {
  overallProfile: RiskProfile;
  profiles: RiskProfile[];
}

interface RiskProfileTabProps {
  loading: boolean;
  data: Decision;
  expandable?: boolean;
  hideTitle?: boolean;
}

interface AdditionalSignals {
  [key: string]: Signal;
}

const RISK_LEVELS = ["low", "medium", "high", "very_high", "unknown"];

function formatReasonCodes(reasonCodes: string[]): JSX.Element[] {
  return reasonCodes.map((reasonCode: string) => {
    const ruleHasDescription = reasonCode.indexOf(":") !== -1;
    const [ruleName, ruleDescription] = reasonCode.split(":");
    const ruleId = ruleName.substring(5, ruleName.length);

    return (
      <div className="mt-1 h-fit w-full" key={reasonCode}>
        <OverflowTip message={reasonCode} className="truncate">
          {!ruleHasDescription ? (
            reasonCode
          ) : (
            <>
              <Drawer
                trigger={
                  <span className="cursor-pointer underline">{ruleName}</span>
                }
              >
                <SardineRuleView ruleId={ruleId} />
              </Drawer>
              {`: ${ruleDescription || "No description provided"}`}
            </>
          )}
        </OverflowTip>
      </div>
    );
  });
}

function formatSignals(
  signalsString: string | undefined,
  key: string,
  provider: string,
  additionalSignals?: AdditionalSignals, // Adds additional signal to list
  vendorChecks?: VendorCheckEnum[]
): RiskProfile[] {
  let riskProfile: RiskProfile[] = [];
  const parsedSignals: ParsedSignal = JSON.parse(
    signalsString || "{}"
  ) as ParsedSignal;
  const isMiddesk = provider === "middesk";

  const riskProfileDataMapping = {
    // overallRisk is used for Rule #'s
    overallRisk: "Overall",
  };

  vendorChecks?.forEach((checks) => {
    merge(riskProfileDataMapping, VENDOR_CHECKS_DATA_MAPPING[checks]);
  });

  // Adds additional signals to the list of checks
  if (additionalSignals) {
    Object.keys(additionalSignals).forEach((k) => {
      parsedSignals.signals[k] = additionalSignals[k];
    });
  }

  if (key in parsedSignals) {
    riskProfile = Object.entries(parsedSignals[key] as Signal[]).map(
      ([categoryName, categoryValue]) => {
        const { value, reasonCodes, rawValue } = categoryValue;
        const category =
          categoryName in riskProfileDataMapping
            ? (riskProfileDataMapping[categoryName] as string)
            : "-";

        const riskLevelRawValue = isMiddesk ? rawValue : undefined;
        const riskLevel = RISK_LEVELS.includes(value) ? (
          <RiskIndicator
            riskLevel={value || ""}
            formatterOrText={riskLevelRawValue}
          />
        ) : (
          "-"
        );

        let reason: string | JSX.Element[] = "-";
        if (reasonCodes && reasonCodes.length > 0) {
          // middesk only has one reason code in plain text with no need to format
          reason = isMiddesk ? reasonCodes[0] : formatReasonCodes(reasonCodes);
        }
        return { category, riskLevel, reason };
      }
    );
  }

  return riskProfile.filter(
    (riskSignal) =>
      riskSignal?.riskLevel !== "-" && riskSignal?.category !== "-"
  );
}

function DeprecatedRiskProfileView({
  loading,
  data,
  expandable = false,
  hideTitle = false,
}: RiskProfileTabProps) {
  const [risks, setRisks] = useState<Risk>();
  let signals = "";
  let provider = "";

  // default case is for checks with only 1 verification
  // add proper handling when specific check has more than 1 verification
  switch (data?.decisionableType) {
    case DecisionableTypeEnum.UserOnboarding:
      if (
        (data?.decisionable as UserOnboarding)?.partyType ===
        Flow__PartyTypeEnum.Business
      ) {
        const comprehensiveKybVerification = data.verifications.find(
          ({ verificationType }) =>
            verificationType === Verification__TypeEnum.ComprehensiveKyb
        );

        if (!comprehensiveKybVerification) {
          signals = data?.verifications[0]?.result;
          provider = data?.verifications[0]?.provider;
        }

        if (comprehensiveKybVerification?.result) {
          signals = comprehensiveKybVerification.result;
        }

        if (comprehensiveKybVerification?.provider) {
          provider = comprehensiveKybVerification?.provider;
        }
      } else {
        signals = data?.verifications[0]?.result;
        provider = data?.verifications[0]?.provider;
      }
      break;

    case DecisionableTypeEnum.Counterparty:
    case DecisionableTypeEnum.IncomingPaymentDetail:
    case DecisionableTypeEnum.PaymentOrder:
    default:
      signals = data?.verifications[0]?.result;
      provider = data?.verifications[0]?.provider;
      break;
  }

  let additionalSignals: AdditionalSignals;

  // additionalSignals keys need to be added to data map to show in list
  if (data?.highestBoScore) {
    additionalSignals = {
      beneficialOwners: {
        value: data.highestBoScore,
        rawValue: startCase(data.highestBoScore),
        reasonCodes: ["See People tab for more information"],
      },
    };
  }

  const parsedSignals = JSON.parse(signals || "{}") as Signal[];
  const noVerificationsRequested = data?.verifications?.length === 0;

  useEffect(() => {
    if (!isEmpty(parsedSignals)) {
      const overallSignal = formatSignals(signals, "overall", provider);
      const riskProfiles = formatSignals(
        signals,
        "signals",
        provider,
        additionalSignals,
        data?.decisionable?.vendorChecks
      );

      setRisks({
        overallProfile: overallSignal[0],
        profiles: riskProfiles,
      });
    }
    // mchaudhry05: parsedSignals causes unintended re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals]);

  if (noVerificationsRequested) {
    return <h2 className="text-lg">No verification was requested</h2>;
  }

  if (loading) {
    return (
      <IndexTableSkeletonLoader
        headers={Object.keys(RISK_PROFILE_MAPPING)}
        numRows={14}
      />
    );
  }

  if (isEmpty(parsedSignals)) {
    return (
      <h2 className="text-lg">Processing risk profile for this decision</h2>
    );
  }

  const content = (
    <>
      <div className="mb-6 flex flex-col items-start">
        <div
          className={`flex flex-row items-center ${hideTitle ? "hidden" : ""}`}
        >
          <h1 className="font-app mr-4 text-base font-medium">Overall Risk</h1>
          <RiskIndicator riskLevel={data.score} />
        </div>
        {risks?.overallProfile?.reason !== "-" && (
          <div id="rules" className="mt-2 h-fit w-fit">
            {risks?.overallProfile?.reason}
          </div>
        )}
      </div>
      <div className="mb-4 mt-8">
        <IndexTable
          dataMapping={RISK_PROFILE_MAPPING}
          data={risks?.profiles || []}
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

export default DeprecatedRiskProfileView;

import React from "react";
import {
  Verification,
  VerificationStatusEnum,
  Decision,
  UserOnboarding,
  BeneficialOwnersVendorCheckEnum,
} from "../../../generated/dashboard/graphqlSchema";
import {
  IndexTable,
  KeyValueTableSkeletonLoader,
} from "../../../common/ui-components";
import RiskIndicator from "./RiskLevelIndicator";
import DeprecatedRiskProfileView from "./DeprecatedRiskProfileView";

const PEOPLE_DATA_MAPPING = {
  name: "Name",
  title: "Title",
  sources: "Sources",
  risks: "Risk",
};

interface VerificationResult {
  other: OtherVerificationResult;
}

interface Risk {
  overall?: {
    overallRisk?: {
      value?: string;
    };
  };
}

interface OtherVerificationResult {
  people: {
    name: string;
    title: string;
    sources: string[];
    risks?: Risk;
  }[];
}

interface PeopleProps {
  data?: Decision;
  verification: Verification | null;
  boVerifications: Verification[] | null;
  userOnboarding?: UserOnboarding["data"];
  hasBeneficialOwnerCheck?: boolean;
}

interface Address {
  country: string;
  line1: string;
  line2: string;
  locality: string;
  postal_code: string;
  region: string;
}

interface BeneficialOwnersData {
  beneficial_owners: {
    address: Address;
    beneficial_owner_id: string;
    date_of_birth: string;
    email: string;
    first_name: string;
    last_name: string;
    is_control_person: boolean;
    phone_number: string;
    taxpayer_identifier: string;
  }[];
}

interface VerificationRiskObj {
  verifications: Verification[];
  decisionable: {
    vendorChecks: BeneficialOwnersVendorCheckEnum[];
  };
}

function People({
  data,
  verification,
  boVerifications,
  userOnboarding = "{}", // used to show BO's while middesk is processing
  hasBeneficialOwnerCheck = false, // determines whether to show "N/A" or "Pending"
}: PeopleProps) {
  const expandedData = {};
  if (!verification || !verification.result) {
    return <KeyValueTableSkeletonLoader />;
  }

  const userOnboardingData = JSON.parse(userOnboarding) as BeneficialOwnersData;

  const beneficialOwners = userOnboardingData?.beneficial_owners;

  const pendingBeneficialOwners = beneficialOwners?.map((bo) => ({
    name: `${bo.first_name} ${bo.last_name}`,
    sources: [],
    risk: [],
    title: [],
  }));

  const verificationResult = JSON.parse(
    verification.result
  ) as VerificationResult;

  const people = verificationResult?.other?.people || pendingBeneficialOwners;
  if (boVerifications?.length) {
    boVerifications?.forEach((boVerification, index) => {
      if (people?.length && people[index]?.risks) {
        people[index].risks = JSON.parse(boVerification.result) as Risk;
      }

      // Format data to be consumed by RiskProfileView
      const verificationRiskObj: VerificationRiskObj = {
        verifications: [boVerifications?.[index]],
        decisionable: {
          vendorChecks: (data?.decisionable as UserOnboarding)
            ?.beneficialOwnersVendorChecks,
        },
      };

      expandedData[index] = (
        <DeprecatedRiskProfileView
          loading={false}
          data={verificationRiskObj as unknown as Decision}
          expandable
          hideTitle
        />
      );
    });
  }

  const peoplesData = people?.map((person, index) => {
    const { name, sources, risks } = person;
    const title = person.title || "N/A";

    // If middesk verifications aren't done yet, show
    // "Pending" if BO checks are on, and "N/A" if not.
    const overallRisk = (
      <RiskIndicator
        riskLevel={
          risks?.overall?.overallRisk?.value ||
          (hasBeneficialOwnerCheck ? VerificationStatusEnum.Pending : "N/A")
        }
      />
    );

    const sourcesComponents = sources?.map((source) => <div>{source}</div>);

    return {
      id: index.toString(),
      name,
      title,
      sources: sourcesComponents,
      risks: overallRisk,
    };
  });

  return (
    <IndexTable
      enableActions
      data={peoplesData || []}
      dataMapping={PEOPLE_DATA_MAPPING}
      expandedData={
        verificationResult?.other?.people?.length ? expandedData : false
      }
    />
  );
}

export default People;

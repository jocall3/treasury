import React from "react";
import { Verification } from "../../../generated/dashboard/graphqlSchema";
import RiskLevelIndicator from "./RiskLevelIndicator";
import {
  IndexTable,
  KeyValueTableSkeletonLoader,
  OverflowTip,
} from "../../../common/ui-components";

const BUSINESS_REGISTRATION_DATA_MAPPING = {
  state: "State",
  businessName: "Business Name",
  addresses: "Address",
  type: "Type",
  registrationDate: "Registration Date",
  status: "Status",
};

interface VerificationResult {
  other: OtherVerificationResult;
}

type RiskLevel = "low" | "high";

interface Risk {
  level: RiskLevel;
  reason: string;
}

interface OtherVerificationResult {
  registrations: {
    state: string;
    name: string;
    addresses: string[];
    entityType: string;
    registrationDate: string;
    risks: Risk[];
  }[];
}

interface BusinessRegistrationProps {
  verification: Verification | null;
}

function BusinessRegistration({ verification }: BusinessRegistrationProps) {
  if (!verification || !verification.result) {
    return <KeyValueTableSkeletonLoader />;
  }

  const verificationResult = JSON.parse(
    verification.result
  ) as VerificationResult;
  const businessRegistrations = verificationResult?.other?.registrations || [];

  const businessRegistrationsData = businessRegistrations.map(
    (businessRegistration) => {
      const risk =
        businessRegistration.risks.length > 0
          ? businessRegistration.risks[0]
          : null;
      const status = risk?.reason || "Unknown";
      const statusRiskLevel = risk?.level || "N/A";

      const statusComponent = (
        <RiskLevelIndicator
          formatterOrText={status}
          riskLevel={statusRiskLevel}
        />
      );

      const addresses = businessRegistration.addresses.map((address) => (
        <OverflowTip message={address} className="truncate">
          {address}
        </OverflowTip>
      ));

      return {
        state: businessRegistration.state,
        businessName: businessRegistration.name,
        type: businessRegistration.entityType,
        registrationDate: businessRegistration.registrationDate,
        status: statusComponent,
        addresses,
      };
    }
  );

  return (
    <IndexTable
      data={businessRegistrationsData}
      dataMapping={BUSINESS_REGISTRATION_DATA_MAPPING}
      styleMapping={{ addresses: "table-entry-wide" }}
    />
  );
}

export default BusinessRegistration;

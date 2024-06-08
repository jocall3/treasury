import React from "react";
import {
  Clickable,
  Drawer,
  Icon,
  IndexTable,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
  OverflowTip,
} from "../../../common/ui-components";
import IdentityDetailsView from "./IdentityDetailsView";
import PaymentOrderView from "../../containers/payment_order_details/PaymentOrderView";
import IncomingPaymentDetailsView from "../../containers/IncomingPaymentDetailsView";
import {
  Decision,
  Verification,
  VerificationProviderEnum,
  Verification__TypeEnum,
} from "../../../generated/dashboard/graphqlSchema";
import RiskLevelIndicator, { RiskLevel } from "./RiskLevelIndicator";
import { DECISIONS_SCORES } from "../../constants";

const PAYMENT_ORDER_DETAILS_DATA_MAPPING = {
  id: "Payment Order ID",
};

const INCOMING_PAYMENT_DETAIL_DATA_MAPPING = {
  id: "Incoming Payment Detail ID",
};

const COUNTERPARTY_DETAILS_DATA_MAPPING = {
  id: "Counterparty ID",
  userOnboarding: "User Onboarding ID",
};

const WEBSITE_DATA_MAPPING = {
  website: "Website",
  status: "Status",
  domainRegistrar: "Domain Registrar",
  createdAt: "Created At",
  registeredAt: "Registered At",
};

interface ComplianceEntityDetailsProps {
  decision: Decision;
  showUserOnboardingOnly?: boolean;
}

interface MiddeskVerificationResult {
  other: OtherVerificationResult;
}

interface SardineVerificationResult {
  overall: {
    overallRisk: {
      value: RiskLevel;
    };
  };
}

interface Risk {
  level: RiskLevel;
  reason: string;
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

function getVerification(
  verifications: Decision["verifications"],
  provider: VerificationProviderEnum
) {
  return (
    verifications.find((verification) => verification.provider === provider) ||
    null
  );
}

function renderRiskLevel(risks: Risk[], addLeftRight?: boolean) {
  if (!risks || risks.length === 0) {
    return null;
  }

  const riskRows = risks.map((risk) => (
    <div className={`${addLeftRight ? " mr-6" : ""}`}>
      <RiskLevelIndicator
        riskLevel={risk.level}
        formatterOrText={risk.reason}
      />
    </div>
  ));

  return <div className="my-auto">{riskRows}</div>;
}

function parseOtherVerificationResults(
  decision: Decision
): OtherVerificationResult | null {
  const middeskVerification =
    decision.verifications.find(
      (verification) =>
        verification.provider === VerificationProviderEnum.Middesk
    ) || null;

  const middeskVerificationResult = middeskVerification?.result
    ? (JSON.parse(middeskVerification.result) as MiddeskVerificationResult)
    : null;
  return middeskVerificationResult?.other || null;
}

function parseAddresses(
  otherVerificationResult: OtherVerificationResult | null
) {
  if (!otherVerificationResult || !otherVerificationResult.addresses) {
    return null;
  }

  const { addresses } = otherVerificationResult;

  return addresses.reduce(
    (addressesRows, address, index) => {
      const risks = address.risks || [];

      addressesRows.push({
        id: `address-${index}`,
        address: (
          <>
            <OverflowTip message={address.fullAddress} className="truncate">
              {address.fullAddress}
            </OverflowTip>

            {address.sources?.length > 0 && (
              <div className="flex">
                <div className="mr-2">Sources:</div>
                <div>{address.sources.join(", ").replace("_", " ")}</div>
              </div>
            )}
          </>
        ),
        risks: <div>{renderRiskLevel(risks, true)}</div>,
      });

      return addressesRows;
    },
    [] as { id: string; address: JSX.Element; risks: JSX.Element }[]
  );
}

function parseWebPresence(
  otherVerificationResult: OtherVerificationResult | null
) {
  if (!otherVerificationResult || !otherVerificationResult.website) {
    return null;
  }

  const { website } = otherVerificationResult;
  const { risks } = website;

  return {
    website: (
      <div className="my-auto flex bg-white">
        {website.url}
        <Clickable
          onClick={() => {
            window.open(website.url, "_blank")?.focus();
          }}
        >
          <span className="ml-2">
            <Icon
              iconName="external_link"
              color="currentColor"
              className="text-gray-600"
              size="s"
            />
          </span>
        </Clickable>
      </div>
    ),
    status: (
      <div className="my-auto flex bg-white">{renderRiskLevel(risks)}</div>
    ),
    domainRegistrar: website.domainRegistrar || "N/A",
    createdAt: website.createdAt || "N/A",
    registeredAt: website.registeredAt || "N/A",
  };
}

function getBankAccountRisks(sardineVerification: Verification | null) {
  if (!sardineVerification) {
    return null;
  }

  const sardineVerificationResult = JSON.parse(
    sardineVerification.result
  ) as SardineVerificationResult;

  const kybBankVerification =
    sardineVerification.verificationType === Verification__TypeEnum.BankAccount;

  if (!kybBankVerification) {
    return null;
  }

  const bankRiskLevel = sardineVerificationResult.overall.overallRisk.value;
  const bankRiskReason = DECISIONS_SCORES[bankRiskLevel];

  return [
    {
      level: bankRiskLevel,
      reason: `${bankRiskReason} Risk`,
    },
  ];
}

function addressesComponent(
  otherVerificationResult: OtherVerificationResult | null
) {
  const addresses = parseAddresses(otherVerificationResult);

  if (!addresses) {
    return null;
  }

  return (
    <div>
      <IndexTable
        data={addresses}
        styleMapping={{
          address: "table-entry-wide",
          risks: "table-entry-wide",
        }}
        dataMapping={{
          address: "Address",
          risks: "Risks",
        }}
        renderHeader={false}
      />
    </div>
  );
}

function webPresenceComponent(
  otherVerificationResult: OtherVerificationResult | null
) {
  const website = parseWebPresence(otherVerificationResult);

  if (!website) {
    return null;
  }

  return (
    <div id="web-presence-table">
      <IndexTable data={[website]} dataMapping={WEBSITE_DATA_MAPPING} />
    </div>
  );
}

function ComplianceEntityDetails({
  decision,
  showUserOnboardingOnly,
}: ComplianceEntityDetailsProps) {
  if (!decision) {
    return null;
  }

  const { decisionable } = decision;

  const verifications = decision.verifications || [];

  switch (decisionable?.__typename) {
    case "UserOnboarding": {
      const userOnboarding = decisionable;
      const userOnboardingId = userOnboarding?.id;

      if (showUserOnboardingOnly) {
        return (
          <IdentityDetailsView
            loading={!userOnboarding}
            userOnboarding={userOnboarding}
            showUserOnboardingOnly
          />
        );
      }

      const sardineVerification = getVerification(
        verifications,
        VerificationProviderEnum.Sardine
      );

      const bankAccountRisks = getBankAccountRisks(sardineVerification);
      const otherVerificationResult = parseOtherVerificationResults(decision);
      const addressesTable = addressesComponent(otherVerificationResult);
      const webPresenceTable = webPresenceComponent(otherVerificationResult);

      const kybDetails = {
        names: otherVerificationResult?.names,
        formation: otherVerificationResult?.formation,
        addresses: otherVerificationResult?.addresses,
        tin: otherVerificationResult?.tin,
        phoneNumbers: otherVerificationResult?.phoneNumbers,
        bankAccountRisks: bankAccountRisks || undefined,
      };

      return (
        <>
          <IdentityDetailsView
            loading={!userOnboardingId}
            userOnboarding={userOnboarding}
            kybDetails={kybDetails}
          />
          {addressesTable && (
            <>
              <div className="font-app mb-8 mt-14 w-full text-base font-medium">
                Address
              </div>
              {addressesTable}
            </>
          )}
          {webPresenceTable && (
            <>
              <div className="font-app mb-8 mt-14 w-full text-base font-medium">
                Web Presence
              </div>
              {webPresenceTable}
            </>
          )}
        </>
      );
    }

    case "PaymentOrder": {
      const paymentOrder = decisionable;
      const paymentOrderPath = paymentOrder?.path;
      const paymentOrderId = paymentOrder?.id;

      const trigger = (
        <div className="cursor-pointer text-blue-500 hover:text-blue-600">
          {paymentOrderId}
        </div>
      );

      return (
        <>
          {!paymentOrderId && (
            <KeyValueTableSkeletonLoader
              dataMapping={PAYMENT_ORDER_DETAILS_DATA_MAPPING}
            />
          )}
          {paymentOrderId && (
            <KeyValueTable
              data={{
                id: paymentOrderPath ? (
                  <Drawer trigger={trigger} path={paymentOrderPath}>
                    <PaymentOrderView
                      match={{
                        params: {
                          payment_order_id: paymentOrderId,
                        },
                      }}
                    />
                  </Drawer>
                ) : null,
              }}
              dataMapping={PAYMENT_ORDER_DETAILS_DATA_MAPPING}
            />
          )}
        </>
      );
    }

    case "IncomingPaymentDetail": {
      const incomingPaymentDetail = decisionable;
      const incomingPaymentDetailPath = incomingPaymentDetail?.path;
      const incomingPaymentDetailId = incomingPaymentDetail?.id;

      const trigger = (
        <div className="cursor-pointer text-blue-500 hover:text-blue-600">
          {incomingPaymentDetailId}
        </div>
      );

      return (
        <>
          {!incomingPaymentDetailId && (
            <KeyValueTableSkeletonLoader
              dataMapping={INCOMING_PAYMENT_DETAIL_DATA_MAPPING}
            />
          )}
          {incomingPaymentDetailId && (
            <KeyValueTable
              data={{
                id: incomingPaymentDetailPath ? (
                  <Drawer trigger={trigger} path={incomingPaymentDetailPath}>
                    <IncomingPaymentDetailsView
                      match={{
                        params: {
                          incoming_payment_detail_id: incomingPaymentDetailId,
                        },
                      }}
                    />
                  </Drawer>
                ) : null,
              }}
              dataMapping={INCOMING_PAYMENT_DETAIL_DATA_MAPPING}
            />
          )}
        </>
      );
    }

    case "Counterparty": {
      const {
        path: counterpartyPath,
        id: counterpartyId,
        userOnboarding,
      } = decisionable;

      const userOnboardingPath = userOnboarding?.decision?.path;
      const userOnboardingId = userOnboarding?.id;

      return (
        <>
          {!counterpartyId && (
            <KeyValueTableSkeletonLoader
              dataMapping={COUNTERPARTY_DETAILS_DATA_MAPPING}
            />
          )}
          {counterpartyId && (
            <KeyValueTable
              data={{
                id: counterpartyPath ? (
                  <a href={counterpartyPath}>{counterpartyId}</a>
                ) : null,
                userOnboarding: userOnboardingPath ? (
                  <a href={userOnboardingPath}>{userOnboardingId}</a>
                ) : null,
              }}
              dataMapping={COUNTERPARTY_DETAILS_DATA_MAPPING}
            />
          )}
        </>
      );
    }

    default:
      return null;
  }
}

export default ComplianceEntityDetails;

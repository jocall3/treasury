import { LazyQueryExecFunction } from "@apollo/client";
import React from "react";
import {
  KeyValueTable,
  KeyValueTableSkeletonLoader,
  ShowableText,
} from "../../../common/ui-components";
import { counterpartyDrawer } from "../CounterpartyDrawer";
import {
  Exact,
  ShowUserOnboardingAccountNumberQuery,
  ShowUserOnboardingTaxpayerIdentifierQuery,
  UserOnboarding,
  Flow__PartyTypeEnum,
  useShowUserOnboardingAccountNumberLazyQuery,
  useShowUserOnboardingTaxpayerIdentifierLazyQuery,
} from "../../../generated/dashboard/graphqlSchema";
import RiskLevelIndicator, { RiskLevel } from "./RiskLevelIndicator";

const NOT_COLLECTED = "Not Collected";
const UNKNOWN = "N/A";

const IDENTITY_DETAILS_DATA_MAPPING: {
  [key: string]: string;
} = {
  counterpartyId: "Counterparty ID",
  name: "Name",
  names: "Names",
  formationDate: "Formation Date",
  formationState: "Formation State",
  entityType: "Entity Type",
  website: "Website",
  firstName: "First Name",
  lastName: "Last Name",
  birthdate: "Birthdate",
  phoneNumber: "Phone Number",
  phoneNumbers: "Phone Numbers",
  email: "Email",
  address: "Address",
  address2: "Address 2",
  city: "City",
  state: "State",
  zipCode: "Zip Code",
  ssn: "SSN",
  taxId: "Tax ID",
  routingNumber: "Routing Number",
  accountNumber: "Account Number",
};

interface UserOnboardingDetails {
  party_details: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
    date_of_birth?: string;
    phone_number: string;
    email: string;
    address: {
      line1: string;
      line2: string;
      locality: string;
      region: string;
      postal_code: string;
    };
  };
  taxpayer_identifier: string;
  external_account: {
    account_details: { account_number: string; account_number_type: string }[];
    routing_details: { routing_number: string; routing_number_type: string }[];
  };
}

interface Risk {
  level: RiskLevel;
  reason: string;
}

interface Name {
  name: string;
  sources: string[];
  risks: Risk[];
}

interface PhoneNumbers {
  phoneNumbers: string[];
  risks: Risk[];
}

interface Address {
  fullAddress: string;
  sources: string[];
  risks: Risk[];
}

interface Formation {
  formationDate: string;
  formationState: string;
  entityType: string;
}

interface Tin {
  tin: string;
  risks: Risk[];
}

interface KybDetails {
  names?: Name[];
  tin?: Tin;
  addresses?: Address[];
  formation?: Formation;
  phoneNumbers?: PhoneNumbers;
  bankAccountRisks?: Risk[];
}

interface IdentityDetailsTabProps {
  loading: boolean;
  userOnboarding?: UserOnboarding | null;
  kybDetails?: KybDetails | null;
  showUserOnboardingOnly?: boolean;
}

function renderRisks(risks: Risk[]) {
  if (!risks || risks.length === 0) {
    return null;
  }

  const riskIndicators = risks.map((risk) => (
    <RiskLevelIndicator riskLevel={risk.level} formatterOrText={risk.reason} />
  ));

  return <div className="ml-6 flex">{riskIndicators}</div>;
}

function taxpayerIdentifierComponent(
  getShowUserOnboardingTaxpayerIdentifier: LazyQueryExecFunction<
    ShowUserOnboardingTaxpayerIdentifierQuery,
    Exact<{ id: string }>
  >,
  userOnboardingId: string,
  redactedTaxpayerIdentifier: string,
  risks: Risk[]
) {
  if (redactedTaxpayerIdentifier === "") {
    return NOT_COLLECTED;
  }

  async function fetchTaxpayerIdentifier() {
    const result = await getShowUserOnboardingTaxpayerIdentifier({
      variables: { id: userOnboardingId },
    });

    return (
      result?.data?.userOnboardingShowTaxpayerIdentifier?.taxpayerIdentifier ||
      UNKNOWN
    );
  }

  return (
    <div className="flex">
      <ShowableText
        defaultText="•••-•••-••••"
        fullText="000000000"
        onClick={fetchTaxpayerIdentifier}
        allowCopy
      />
      {renderRisks(risks)}
    </div>
  );
}

function namesComponent(names?: Name[]) {
  if (!names || names.length === 0) {
    return null;
  }

  const namesRows = names.map((name, index) => (
    <div className="flex">
      <div>
        <div className={`flex ${index > 0 ? " mt-2" : ""}`} key={name.name}>
          {name.name}
        </div>
        <div className="flex">
          <div className="mr-2">Sources:</div>
          <div>{name.sources.join(", ").replace("_", " ")}</div>
        </div>
      </div>
      <div className="my-auto">{renderRisks(name.risks)}</div>
    </div>
  ));

  return <div>{namesRows}</div>;
}

function phoneNumberComponent(phoneNumbers?: PhoneNumbers) {
  if (!phoneNumbers) {
    return null;
  }

  const phoneNumbersList = phoneNumbers.phoneNumbers.join(", ");
  const { risks } = phoneNumbers;

  return (
    <div className="flex">
      <div>{phoneNumbersList}</div>
      {renderRisks(risks)}
    </div>
  );
}

function accountNumberComponent(
  getShowUserOnboardingAccountNumber: LazyQueryExecFunction<
    ShowUserOnboardingAccountNumberQuery,
    Exact<{ id: string }>
  >,
  accountNum: string,
  userOnboardingId: string,
  bankAccountRisks: Risk[] = []
) {
  if (accountNum === NOT_COLLECTED) {
    return NOT_COLLECTED;
  }

  async function accountNumber() {
    const result = await getShowUserOnboardingAccountNumber({
      variables: { id: userOnboardingId },
    });
    return (
      result?.data?.userOnboardingShowAccountNumber?.accountNumber || UNKNOWN
    );
  }

  return (
    <div className="flex">
      <ShowableText
        defaultText={`•••• ${accountNum?.slice(
          accountNum.length - 4,
          accountNum.length
        )}`}
        fullText={accountNum}
        onClick={accountNumber}
        allowCopy
      />
      {renderRisks(bankAccountRisks)}
    </div>
  );
}

function filterMissingDataInDataMapping(data: { [key: string]: unknown }) {
  const filteredDataMapping = {};

  Object.keys(IDENTITY_DETAILS_DATA_MAPPING).forEach((key) => {
    if (data[key]) {
      filteredDataMapping[key] = IDENTITY_DETAILS_DATA_MAPPING[key];
    }
  });

  return filteredDataMapping;
}

function IdentityDetailsView({
  loading,
  userOnboarding,
  kybDetails,
  showUserOnboardingOnly = false,
}: IdentityDetailsTabProps) {
  const [getShowUserOnboardingTaxpayerIdentifier] =
    useShowUserOnboardingTaxpayerIdentifierLazyQuery();
  const [getShowUserOnboardingAccountNumber] =
    useShowUserOnboardingAccountNumberLazyQuery();

  if (loading) {
    <KeyValueTableSkeletonLoader dataMapping={IDENTITY_DETAILS_DATA_MAPPING} />;
  }

  const userOnboardingData = userOnboarding?.data as string;
  const userOnboardingId = userOnboarding?.id;
  const uoDetails: UserOnboardingDetails = JSON.parse(
    userOnboardingData || "{}"
  ) as UserOnboardingDetails;
  const accountDetails = uoDetails?.external_account?.account_details;
  const accountNumber =
    accountDetails?.length > 0 && accountDetails[0].account_number
      ? accountDetails[0].account_number
      : NOT_COLLECTED;
  const routingDetails = uoDetails?.external_account?.routing_details;
  const routingNumber =
    routingDetails?.length > 0 && routingDetails[0].routing_number
      ? routingDetails[0].routing_number
      : NOT_COLLECTED;
  const redactedTaxpayerIdentifier = uoDetails?.taxpayer_identifier;

  const tinRisks = kybDetails?.tin?.risks || [];

  const bankAccountRisks = kybDetails?.bankAccountRisks;

  const showableAccountNumber = userOnboardingId
    ? accountNumberComponent(
        getShowUserOnboardingAccountNumber,
        accountNumber,
        userOnboardingId,
        bankAccountRisks
      )
    : null;
  const showableTaxpayerIdentifier = userOnboardingId
    ? taxpayerIdentifierComponent(
        getShowUserOnboardingTaxpayerIdentifier,
        userOnboardingId,
        redactedTaxpayerIdentifier,
        tinRisks
      )
    : null;

  const counterpartyId = userOnboarding?.counterpartyId;

  const isKyb = userOnboarding?.partyType === Flow__PartyTypeEnum.Business;
  const names = namesComponent(kybDetails?.names);
  const phoneNumbers = phoneNumberComponent(kybDetails?.phoneNumbers);
  const formation = kybDetails?.formation;
  const showAddressField = showUserOnboardingOnly || !isKyb;
  const showFormationField = !showUserOnboardingOnly && isKyb;

  const data = {
    counterpartyId: counterpartyId
      ? counterpartyDrawer(counterpartyId)
      : "Created upon case approval",
    names: isKyb && names,
    name: !isKyb && uoDetails?.party_details?.company_name,
    firstName: !isKyb && uoDetails?.party_details?.first_name,
    lastName: !isKyb && uoDetails?.party_details?.last_name,
    phoneNumbers: isKyb && phoneNumbers,
    phoneNumber: !isKyb && uoDetails?.party_details?.phone_number,
    email: !isKyb && uoDetails?.party_details?.email,
    address: showAddressField && uoDetails?.party_details?.address?.line1,
    address2: showAddressField && uoDetails?.party_details?.address?.line2,
    city: showAddressField && uoDetails?.party_details?.address?.locality,
    state: showAddressField && uoDetails?.party_details?.address?.region,
    zipCode: showAddressField && uoDetails?.party_details?.address?.postal_code,
    birthdate: !isKyb && uoDetails?.party_details?.date_of_birth,
    formationDate: showFormationField && formation?.formationDate,
    formationState: showFormationField && formation?.formationState,
    entityType: showFormationField && formation?.entityType,
    taxId: isKyb && showableTaxpayerIdentifier,
    ssn: !isKyb && showableTaxpayerIdentifier,
    routingNumber,
    accountNumber: showableAccountNumber,
  };

  const filteredDataMapping = filterMissingDataInDataMapping(data);

  return <KeyValueTable data={data} dataMapping={filteredDataMapping} />;
}

export default IdentityDetailsView;

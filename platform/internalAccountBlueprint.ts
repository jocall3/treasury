import { Flatfile } from "@flatfile/api";

const NUM_CAPABILITIES = 5;
const NUM_ACH_SETTINGS = 2;

const accountNumberFields = (): Flatfile.Property[] => [
  {
    label: "Account Number",
    key: "accountNumber1",
    type: "string",
  },
  {
    label: "Account Number Type",
    key: "accountNumber1Type",
    type: "string",
    description:
      "One of `iban`, `clabe`, `wallet_address`, `hk_number`, `nz_number` or `other`. Use `other` if the bank account number is in a generic format. For international payments, use `iban`.",
  },
  {
    label: "Account Number 2",
    key: "accountNumber2",
    type: "string",
    description: "If necessary, a additional account number.",
  },
  {
    label: "Account Number 2 Type",
    key: "accountNumber2Type",
    type: "string",
    description: "The type of the the additional account number.",
  },
];

const routingNumberFields = (): Flatfile.Property[] => [
  {
    label: "Routing Number",
    key: "routingNumber1",
    type: "string",
    description: "The routing number of the bank.",
  },
  {
    label: "Routing Number Type",
    key: "routingNumber1Type",
    type: "string",
    description:
      "The type of the routing number. One of `aba`, `swift`, `ca_cpa`, `au_bsb`, `gb_sort_code`, `in_ifsc`.",
  },
  {
    label: "Routing Number 2",
    key: "routingNumber2",
    type: "string",
    description:
      "There are some types of international bank accounts that require two routing numbers: one SWIFT code and one local routing number (e.g. `au_bsb`, `in_ifsc`, `ca_cpa`, etc.)",
  },
  {
    label: "Routing Number 2 Type",
    key: "routingNumber2Type",
    type: "string",
    description: "The type of the second routing number.",
  },
];

const partyAddressFields = (): Flatfile.Property[] => [
  {
    label: "Party Address Line1",
    key: "partyAddressLine1",
    type: "string",
  },
  {
    label: "Party Address Line2",
    key: "partyAddressLine2",
    type: "string",
  },
  {
    label: "Party Address Locality",
    key: "partyAddressLocality",
    type: "string",
    description:
      "The party address locality. A locality is typically a city or town",
  },
  {
    label: "Party Address Region",
    key: "partyAddressRegion",
    type: "string",
    description:
      "The party address region. For 'US' addresses, this is the state",
  },
  {
    label: "Party Address Postal Code",
    key: "partyAddressPostalCode",
    type: "string",
  },
  {
    label: "Party Address Country",
    key: "partyAddressCountry",
    type: "string",
    description: "A two-digit ISO country codes for the party address country",
  },
];

const capabilityFields = (capabilityNumber: number): Flatfile.Property[] => {
  const labelPrefix = `Account Capability ${capabilityNumber}`;
  const keyPrefix = `capability${capabilityNumber}`;

  return [
    {
      label: `${labelPrefix} Direction`,
      key: `${keyPrefix}Direction`,
      type: "string",
      description: "Must be 'credit' or 'debit'.",
    },
    {
      label: `${labelPrefix} Payment Type`,
      key: `${keyPrefix}PaymentType`,
      type: "string",
    },
    {
      label: `${labelPrefix} Identifier`,
      key: `${keyPrefix}Identifier`,
      type: "string",
      description: "For ACH, this is the ACH Company ID.",
    },
    {
      label: `${labelPrefix} Payment Subtypes`,
      key: `${keyPrefix}PaymentSubtypes`,
      type: "string",
      description:
        "A comma-separated list of payment subtypes to allow.  Leave blank for all subtypes.",
    },
    {
      label: `${labelPrefix} Any Currency`,
      key: `${keyPrefix}AnyCurrency`,
      type: "string",
      description:
        "When 'true', allows payments of this type for any currency.",
    },
    {
      label: `${labelPrefix} Currencies`,
      key: `${keyPrefix}Currencies`,
      type: "string",
      description:
        "A comma-separated list of currencies for which this type of payment can initiate.",
    },
    {
      label: `${labelPrefix} Connection ID`,
      key: `${keyPrefix}ConnectionId`,
      type: "string",
    },
    {
      label: `${labelPrefix} Party Name`,
      key: `${keyPrefix}PartyName`,
      type: "string",
      description:
        "Overrides the legal name of the entity which owns the account when initiating payments.",
    },
    {
      label: `${labelPrefix} Address Line 1`,
      key: `${keyPrefix}AddressLine1`,
      type: "string",
    },
    {
      label: `${labelPrefix} Address Line 2`,
      key: `${keyPrefix}AddressLine2`,
      type: "string",
    },
    {
      label: `${labelPrefix} Address Locality`,
      key: `${keyPrefix}AddressLocality`,
      type: "string",
      description:
        "The address locality. A locality is typically a city or town",
    },
    {
      label: `${labelPrefix} Address Region`,
      key: `${keyPrefix}AddressRegion`,
      type: "string",
      description: "The address region. For 'US' addresses, this is the state",
    },
    {
      label: `${labelPrefix} Address Postal Code`,
      key: `${keyPrefix}AddressPostalCode`,
      type: "string",
    },
    {
      label: `${labelPrefix} Address Country`,
      key: `${keyPrefix}AddressCountry`,
      type: "string",
      description: "A two-digit ISO country code for the address country",
    },
  ];
};

const achSettingFields = (achSettingNumber: number): Flatfile.Property[] => {
  const labelPrefix = `ACH Setting ${achSettingNumber}`;
  const keyPrefix = `achSetting${achSettingNumber}`;

  return [
    {
      label: `${labelPrefix} Immediate Origin`,
      key: `${keyPrefix}ImmediateOrigin`,
      type: "string",
    },
    {
      label: `${labelPrefix} Immediate Origin Name`,
      key: `${keyPrefix}ImmediateOriginName`,
      type: "string",
    },
    {
      label: `${labelPrefix} Immediate Destination`,
      key: `${keyPrefix}ImmediateDestination`,
      type: "string",
    },
    {
      label: `${labelPrefix} Immediate Destination Name`,
      key: `${keyPrefix}ImmediateDestinationName`,
      type: "string",
    },
    {
      label: `${labelPrefix} Direction`,
      key: `${keyPrefix}Direction`,
      type: "string",
      description: "Leave blank for both 'credit' and 'debit'",
    },
    {
      label: `${labelPrefix} Connection Endpoint Label`,
      key: `${keyPrefix}ConnectionEndpointLabel`,
      type: "string",
    },
  ];
};

export const internalAccountBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Internal Accounts",
  labels: [],
  sheets: [
    {
      name: "Internal Accounts",
      slug: "internal_accounts",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Name",
          key: "name",
          type: "string",
          description: "A nickname for the account.",
        },
        {
          label: "Currency",
          key: "currency",
          type: "string",
          description:
            "The currency of the account.  Must be three-letter ISO currency code.",
        },
        {
          label: "Party Name",
          key: "partyName",
          type: "string",
          description: "The legal name of the entity which owns the account.",
        },
        ...partyAddressFields(),
        ...accountNumberFields(),
        ...routingNumberFields(),
        ...[...Array(NUM_CAPABILITIES).keys()].flatMap((_, i) =>
          capabilityFields(i + 1)
        ),
        ...[...Array(NUM_ACH_SETTINGS).keys()].flatMap((_, i) =>
          achSettingFields(i + 1)
        ),
      ],
    },
  ],
  actions: [
    {
      operation: "submitActionFg",
      mode: "foreground",
      label: "Submit uploaded data",
      type: "string",
      description: "Submit this data to Modern Treasury",
      primary: true,
      constraints: [{ type: "hasData" }, { type: "hasAllValid" }],
    },
  ],
};

export const internalAccountBlueprintFields =
  internalAccountBlueprint.sheets?.[0].fields || [];

import { Flatfile } from "@flatfile/api";

export const accountCapabilityBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Account Capabilities",
  labels: [],
  sheets: [
    {
      name: "Account Capabilities",
      slug: "account_capabilities",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Internal Account ID",
          key: "internalAccountId",
          type: "string",
        },
        {
          label: "Direction",
          key: "direction",
          type: "string",
          description: "Must be 'credit' or 'debit'.",
        },
        {
          label: "Payment Type",
          key: "paymentType",
          type: "string",
        },
        {
          label: "Identifier",
          key: "identifier",
          type: "string",
          description: "For ACH, this is the ACH Company ID.",
        },
        {
          label: "Payment Subtypes",
          key: "paymentSubtypes",
          type: "string",
          description:
            "A comma-separated list of payment subtypes to allow.  Leave blank for all subtypes.",
        },
        {
          label: "Any Currency",
          key: "anyCurrency",
          type: "string",
          description:
            "When 'true', allows payments of this type for any currency.",
        },
        {
          label: "Currencies",
          key: "currencies",
          type: "string",
          description:
            "A comma-separated list of currencies for which this type of payment can initiate.",
        },
        {
          label: "Connection ID",
          key: "connectionId",
          type: "string",
        },
        {
          label: "Party Name",
          key: "partyName",
          type: "string",
          description:
            "Overrides the legal name of the entity which owns the account when initiating payments.",
        },
        {
          label: "Address Line 1",
          key: "addressLine1",
          type: "string",
        },
        {
          label: "Address Line 2",
          key: "addressLine2",
          type: "string",
        },
        {
          label: "Address Locality",
          key: "addressLocality",
          type: "string",
          description:
            "The address locality. A locality is typically a city or town",
        },
        {
          label: "Address Region",
          key: "addressRegion",
          type: "string",
          description:
            "The address region. For 'US' addresses, this is the state",
        },
        {
          label: "Address Postal Code",
          key: "addressPostalCode",
          type: "string",
        },
        {
          label: "Address Country",
          key: "addressCountry",
          type: "string",
          description: "A two-digit ISO country code for the address country",
        },
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

export const accountCapabilityBlueprintFields =
  accountCapabilityBlueprint.sheets?.[0].fields || [];

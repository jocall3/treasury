import { CreateWorkbookConfig } from "@flatfile/api/api";

export const counterpartyBlueprint: Pick<
  CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Counterparties",
  labels: [],
  sheets: [
    {
      name: "Counterparties",
      slug: "counterparties",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Name",
          key: "name",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The legal name that is attached to counterparty's bank account.",
        },
        {
          label: "Email",
          key: "email",
          type: "string",
          description: "The counterparty's email address.",
        },
        {
          label: "Account Number",
          key: "accountNumber",
          type: "string",
          description:
            "The last four digits of the account number for the bank account.",
        },
        {
          label: "Account Number Type",
          key: "accountNumberType",
          type: "string",
          description:
            "One of `iban`, `clabe`, `wallet_address`, `hk_number`, `nz_number` or `other`. Use `other` if the bank account number is in a generic format. For international payments, use `iban`.",
        },
        {
          label: "Routing Number",
          key: "routingNumber",
          type: "string",
          description: "The routing number of the bank.",
        },
        {
          label: "Routing Number Type",
          key: "routingNumberType",
          type: "string",
          description:
            "Should be one of `aba`, `swift`, `ca_cpa`, `au_bsb`, `gb_sort_code`, `in_ifsc`.",
        },
        {
          label: "Routing Number 2",
          key: "routingNumber2",
          type: "string",
          description:
            "There are some types of international bank accounts that require two routing numbers: one SWIFT code and one local routing number (e.g. `au_bsb`, `in_ifsc`, `ca_cpa`, etc.)",
        },
        {
          label: "Routing Type 2",
          key: "routingNumberType2",
          type: "string",
          description: "The type of the second routing number.",
        },
        {
          label: "Account Type",
          key: "accountType",
          type: "string",
          description: "Can be `checking`, `savings` or other.",
        },
        {
          label: "Party Name",
          key: "partyName",
          type: "string",
        },
        {
          label: "Party Type",
          key: "partyType",
          type: "string",
          description:
            "Either `individual` or `business`.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Address Line 1",
          key: "addressLine1",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Address Line 2",
          key: "addressLine2",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Address Locality",
          key: "addressLocality",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Address Region",
          key: "addressRegion",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Address Postal Code",
          key: "addressPostalCode",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Address Country",
          key: "addressCountry",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Metadata",
          key: "metadata",
          type: "string",
          description:
            "Additional data represented as key-value pairs separated by a `|` (pipe character). Do not include special characters outside of `:` and `|`.",
        },
        {
          label: "Send Remittance Advice",
          key: "sendRemittanceAdvice",
          type: "string",
          description:
            "If `true`, Modern Treasury will send an email to the counterparty whenever an associated payment order is sent to the bank.",
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

export const counterpartyBlueprintFields =
  counterpartyBlueprint.sheets?.[0].fields || [];

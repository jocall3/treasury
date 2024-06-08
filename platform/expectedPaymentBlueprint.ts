import { Flatfile } from "@flatfile/api";

export const expectedPaymentBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Expected Payments",
  labels: [],
  sheets: [
    {
      name: "Expected Payments",
      slug: "expected_payments",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Internal Account ID",
          key: "internalAccountId",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The ID for the account you expect the funds to land in.",
        },
        {
          label: "Amount Lower Bound",
          key: "amountLowerBound",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The lowest amount this expected payment may be equal to. The value is in the specified currency's smallest unit, e.g. $10 would be represented as 1000.",
        },
        {
          label: "Amount Upper Bound",
          key: "amountUpperBound",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The highest amount this expected payment may be equal to. The value is in the specified currency's smallest unit, e.g. $10 would be represented as 1000.",
        },
        {
          label: "Direction",
          key: "direction",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The direction of the expected payment.\n\nCase sensitive - either `credit` or `debit`.",
        },
        {
          label: "Type",
          key: "type",
          type: "string",
          description:
            "The expected payment type (eg. ACH, wire, check, etc.)\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Currency",
          key: "currency",
          type: "string",
          description:
            "The currency that the expected payment is denominated in. Must conform to ISO 4217.",
        },
        {
          label: "Date Lower Bound",
          key: "dateLowerBound",
          type: "string",
          description:
            "The earliest date the payment may come in.\n\nFormat: YYYY-MM-DD",
        },
        {
          label: "Date Upper Bound",
          key: "dateUpperBound",
          type: "string",
          description:
            "The latest date the payment may come in.\n\nFormat: YYYY-MM-DD",
        },
        {
          label: "Statement Descriptor",
          key: "statementDescriptor",
          type: "string",
          description:
            "This should reflect the statement description you expect to see on the transaction.",
        },
        {
          label: "Counterparty ID",
          key: "counterpartyId",
          type: "string",
          description:
            "The ID of the counterparty you expect for this payment.",
        },
        {
          label: "Description",
          key: "description",
          type: "string",
          description:
            "An optional description of the expected payment for internal usage. It does not affect how the expected payment is matched.",
        },
        {
          label: "Metadata",
          key: "metadata",
          type: "string",
          description:
            "Additional data represented as key-value pairs separated by a `|` (pipe character). Do not include special characters outside of `:` and `|`.",
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

export const expectedPaymentBlueprintFields =
  expectedPaymentBlueprint.sheets?.[0].fields || [];

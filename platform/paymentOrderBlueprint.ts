import { Flatfile } from "@flatfile/api";

export const paymentOrderBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Payment Orders",
  labels: [],
  sheets: [
    {
      name: "Payment Orders",
      slug: "payment_orders",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Ultimate Originating Party Name",
          key: "ultimateOriginatingPartyName",
          type: "string",
        },
        {
          label: "Ultimate Originating Party Address Line 1",
          key: "ultimateOriginatingPartyAddressLine1",
          type: "string",
        },
        {
          label: "Ultimate Originating Party Locality",
          key: "ultimateOriginatingPartyLocality",
          type: "string",
        },
        {
          label: "Ultimate Originating Party Region",
          key: "ultimateOriginatingPartyRegion",
          type: "string",
        },
        {
          label: "Ultimate Originating Party Postal Code",
          key: "ultimateOriginatingPartyPostalCode",
          type: "string",
        },
        {
          label: "Ultimate Originating Party Country",
          key: "ultimateOriginatingPartyCountry",
          type: "string",
        },
        {
          label: "Originating Account ID",
          key: "originatingAccountId",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "The ID of your organization's internal account that will originate this payment order.",
        },
        {
          label: "Type",
          key: "type",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "Designates the payment type you would like to request for the payment orders (e.g. ACH, wire, book, etc).\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Priority",
          key: "priority",
          type: "string",
          description:
            "Either `normal` or `high`. For ACH and EFT payments, `high` represents a same-day ACH or EFT transfer, respectively. For check payments, `high` can mean an overnight check rather than standard mail.\n\nDefault: `normal`",
        },
        {
          label: "Process After",
          key: "processAfter",
          type: "string",
          description:
            "If present, Modern Treasury will not process the payment until after this time. If `process_after` is past the cutoff for `effective_date`, `process_after` will take precedence and `effective_date` will automatically update to reflect the earliest possible sending date after `process_after`.\n\nFormat: ISO8601 timestamp",
        },
        {
          label: "Purpose",
          key: "purpose",
          type: "string",
          description:
            "For wires, this is usually the purpose which is transmitted via the `InstrForDbtrAgt` field in the ISO20022 file. For EFT, this field is the 3 digit CPA Code that will be attached to the payment.",
        },
        {
          label: "Amount",
          key: "amount",
          type: "string",
          description:
            "The payment order's value in specified currency's smallest unit. E.g. $10 USD would be represented as 1000. If you use this attribute, do not use the `dollar_amount` attribute.",
        },
        {
          label: "Dollar Amount",
          key: "dollarAmount",
          type: "string",
          description:
            "Alternate way to specify USD amounts only. E.g., $10 is represented as 10.00. If you use this attribute, do not use the `amount` attribute",
        },
        {
          label: "Currency",
          key: "currency",
          type: "string",
          description:
            "Must conform to ISO 4217. Defaults to the currency of the originating account.",
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
            "If `credit`, moves money from your account to someone else's. If `debit`, pulls money from someone else's account to your own. Note: wire and check payment types will always be `credit`.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Effective Date",
          key: "effectiveDate",
          type: "string",
          description:
            "The date transactions are to be posted to the counterparty's account. If you wish to future date a payment order, you will want to fill in this attribute. If this attribute is not filled, it will default to the next business date.\n\nFormat: YYYY-MM-DD",
        },
        {
          label: "Description",
          key: "description",
          type: "string",
          description:
            "An optional description for internal use only. This will not be visible to the counterparty.",
        },
        {
          label: "Statement Descriptor",
          key: "statementDescriptor",
          type: "string",
          description:
            "An optional descriptor which will appear in the receiver's statement. The bank statement description should be used for your counterparties to see more detail within their bank statement.",
        },
        {
          label: "Remittance Information",
          key: "remittanceInformation",
          type: "string",
          description:
            "Remittance information is typically another attribute that can be utilized to describe the money that is being sent. For ACH, this field will be passed through on an addenda record. For wire payments the field will be passed through as the `Originator to Beneficiary Information`. If this field is left blank then an addenda record will not be created.",
        },
        {
          label: "Counterparty Account ID",
          key: "counterpartyAccountId",
          type: "string",
          description:
            "The ID of an existing counterparty's account (internal or external) that will receive this payment order. Including this will override the other counterparty information you provide.",
        },
        {
          label: "Counterparty Name",
          key: "counterpartyName",
          type: "string",
        },
        {
          label: "Counterparty Routing Number",
          key: "counterpartyRoutingNumber",
          type: "string",
          description: "The routing number of the counterparty.",
        },
        {
          label: "Counterparty Routing Type",
          key: "counterpartyRoutingType",
          type: "string",
          description:
            "Either `aba`, `swift` or `ca_cpa`.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Counterparty Routing Number 2",
          key: "counterpartyRoutingNumber2",
          type: "string",
          description: "The counterparty's second routing number.",
        },
        {
          label: "Counterparty Routing Type 2",
          key: "counterpartyRoutingType2",
          type: "string",
          description:
            "Either `aba`, `swift` or `ca_cpa`.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Counterparty Account Number",
          key: "counterpartyAccountNumber",
          type: "string",
          description: "The account number of the counterparty.",
        },
        {
          label: "Counterparty Account Number Type",
          key: "counterpartyAccountNumberType",
          type: "string",
          description:
            "Supports `iban` and `clabe`. Leave blank if the bank account number is in a generic format.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Counterparty Account Type",
          key: "counterpartyAccountType",
          type: "string",
          description:
            "Can be `checking`, `savings`, or other.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Counterparty Party Type",
          key: "counterpartyPartyType",
          type: "string",
          description:
            "Either `individual` or `business`.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Counterparty Address Line 1",
          key: "counterpartyAddressLine1",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Counterparty Address Line 2",
          key: "counterpartyAddressLine2",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Counterparty Address Locality",
          key: "counterpartyAddressLocality",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Counterparty Address Region",
          key: "counterpartyAddressRegion",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Counterparty Address Postal Code",
          key: "counterpartyAddressPostalCode",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Counterparty Address Country",
          key: "counterpartyAddressCountry",
          type: "string",
          description: "Required for wire payment orders.",
        },
        {
          label: "Foreign Exchange Contract",
          key: "foreignExchangeContract",
          type: "string",
          description:
            "If present, indicates a specific foreign exchange contract number that has been generated by your financial institution.",
        },
        {
          label: "Foreign Exchange Indicator",
          key: "foreignExchangeIndicator",
          type: "string",
          description:
            "Indicates the type of FX transfer to initiate if the payment order currency matches the originating account currency. Can be either `variable_to_fixed`, `fixed_to_variable`, or null.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Charge Bearer",
          key: "chargeBearer",
          type: "string",
          description:
            "The party that will pay the fees for the payment order. Only applies to wire payment orders. Can be one of `SHA` (shared), `OUR` (sender), or `BEN` (beneficiary).\n\nCase sensitive - use uppercase.",
        },
        {
          label: "Subtype",
          key: "subtype",
          type: "string",
          description:
            "For ACH payment orders, the subtype represents the SEC code. We currently support `CCD`, `PPD`, `IAT`, `CTX`, `WEB`, `CIE`, and `TEL`. When Modern Treasury initiates an ACH payment on your behalf, the SEC Code is set automatically. When the receiving account's `party_type` is `individual`, the `PPD` code is used. When `party_type` is `business` or isn't set, `CCD` is used.\n\nCase sensitive - use uppercase.",
        },
        {
          label: "Metadata",
          key: "metadata",
          type: "string",
          description:
            "Additional data represented as key-value pairs separated by a `|` (pipe character). Do not include special characters outside of `:` and `|`.",
        },
        {
          label: "Accounting Class Name",
          key: "accountingClassName",
          type: "string",
          description:
            "These names can be found in the organization settings page. You should only use accounting class ID or accounting class name, not both.",
        },
        {
          label: "Accounting Account Name",
          key: "accountingAccountName",
          type: "string",
          description:
            "These names can be found in the organization settings page. You should only use accounting account ID or accounting account name, not both.",
        },
        {
          label: "Accounting Class ID",
          key: "accountingClassId",
          type: "string",
          description:
            "These IDs can be found in the organization settings page. You should only use accounting class ID or accounting class name, not both.",
        },
        {
          label: "Accounting Account ID",
          key: "accountingAccountId",
          type: "string",
          description:
            "These IDs can be found in the organization settings page. You should only use accounting account ID or accounting account name, not both.",
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

export const paymentOrderBlueprintFields =
  paymentOrderBlueprint.sheets?.[0].fields || [];

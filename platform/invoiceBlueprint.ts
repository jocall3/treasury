import { Flatfile } from "@flatfile/api";

export const invoiceBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Invoices",
  labels: [],
  sheets: [
    {
      name: "Invoices",
      slug: "invoices",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Invoice Identifier",
          key: "invoiceIdentifier",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "A string identifier to indicate which invoice the line items belong to. Can be used to verify correct creation of the invoice.",
        },
        {
          label: "Due Date",
          key: "dueDate",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "A date in the future when the invoice is due.\n\nFormat: YYYY-MM-DD",
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
            "The ID of the internal account the invoice amount should be paid to.",
        },
        {
          label: "Counterparty ID",
          key: "counterpartyId",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description: "The ID of the counterparty receiving the invoice.",
        },
        {
          label: "Currency",
          key: "currency",
          type: "string",
          description:
            "The currency that the invoice is denominated in. Must conform to ISO 4217.",
        },
        {
          label: "Description",
          key: "description",
          type: "string",
          description: "An optional free-form description of the invoice.",
        },
        {
          label: "Auto Advance",
          key: "autoAdvance",
          type: "string",
          description:
            "When true, the invoice will progress to `unpaid` automatically and cannot be edited after entering that state.",
        },
        {
          label: "Payment Method",
          key: "paymentMethod",
          type: "string",
          description:
            "When opening an invoice, whether to show the embedded payment UI, automatically create a payment, or rely on manual payment from the recipient.\n\nCase sensitive - one of `ui`, `automatic`, or `manual`.\n\nDefault: `manual`",
        },
        {
          label: "Fallback Payment Method",
          key: "fallbackPaymentMethod",
          type: "string",
          description:
            "When `payment_method` is `automatic`, the fallback `payment_method` to use when an automatic payment fails.\n\nCase sensitive - one of `ui` or `manual`.",
        },
        {
          label: "Payment Effective Date",
          key: "paymentEffectiveDate",
          type: "string",
          description:
            "When `payment_method` is` `automatic`, the date transactions are to be posted to the participants' account. Defaults to the current business day or the next business day if the current day is a bank holiday or weekend.",
        },
        {
          label: "Payment Type",
          key: "paymentType",
          type: "string",
          description:
            "When `payment_method` is `automatic`, the `payment_type` on the automatically created payment order.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Receiving Account ID",
          key: "receivingAccountId",
          type: "string",
          description:
            "When `payment_method` is `automatic`, one of the receiving counterparty's bank account IDs.",
        },
        {
          label: "Invoicer Email",
          key: "invoicerEmail",
          type: "string",
          description:
            "The email in the invoicer's contact details displayed at the top of the invoice.",
        },
        {
          label: "Invoicer Phone Number",
          key: "invoicerPhoneNumber",
          type: "string",
          description:
            "The phone number in the invoicer's contact details displayed at the top of the invoice.",
        },
        {
          label: "Invoicer Website",
          key: "invoicerWebsite",
          type: "string",
          description:
            "The website in the invoicer's contact details displayed at the top of the invoice.",
        },
        {
          label: "Notifications Enabled",
          key: "notificationsEnabled",
          type: "string",
          description:
            "If `true`, the invoice will send email notifications to the invoice recipients about invoice status changes.",
        },
        {
          label: "Notification Email Addresses",
          key: "notificationEmailAddresses",
          type: "string",
          description:
            "Emails (comma separated) in addition to the counterparty email to send invoice status notifications to. At least one email is required if notifications are enabled and the counterparty doesn't have an email.",
        },
        {
          label: "Recipient Name",
          key: "recipientName",
          type: "string",
          description:
            "The name of the recipient of the invoice. Leaving this value blank will fallback to using the counterparty's name.",
        },
        {
          label: "Recipient Email",
          key: "recipientEmail",
          type: "string",
          description:
            "The email of the recipient of the invoice. Leaving this value blank will fallback to using the counterparty's email.",
        },
        {
          label: "Metadata",
          key: "metadata",
          type: "string",
          description:
            "Additional data represented as key-value pairs separated by a `|` (pipe character). Do not include special characters outside of `:` and `|`.",
        },
        {
          label: "Invoicer Address Line 1",
          key: "invoicerAddressLine1",
          type: "string",
        },
        {
          label: "Invoicer Address Line 2",
          key: "invoicerAddressLine2",
          type: "string",
        },
        {
          label: "Invoicer Address Locality",
          key: "invoicerAddressLocality",
          type: "string",
        },
        {
          label: "Invoicer Address Region",
          key: "invoicerAddressRegion",
          type: "string",
        },
        {
          label: "Invoicer Address Postal Code",
          key: "invoicerAddressPostalCode",
          type: "string",
        },
        {
          label: "Invoicer Address Country",
          key: "invoicerAddressCountry",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Line 1",
          key: "counterpartyBillingAddressLine1",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Line 2",
          key: "counterpartyBillingAddressLine2",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Locality",
          key: "counterpartyBillingAddressLocality",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Region",
          key: "counterpartyBillingAddressRegion",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Postal Code",
          key: "counterpartyBillingAddressPostalCode",
          type: "string",
        },
        {
          label: "Counterparty Billing Address Country",
          key: "counterpartyBillingAddressCountry",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Line 1",
          key: "counterpartyShippingAddressLine1",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Line 2",
          key: "counterpartyShippingAddressLine2",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Locality",
          key: "counterpartyShippingAddressLocality",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Region",
          key: "counterpartyShippingAddressRegion",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Postal Code",
          key: "counterpartyShippingAddressPostalCode",
          type: "string",
        },
        {
          label: "Counterparty Shipping Address Country",
          key: "counterpartyShippingAddressCountry",
          type: "string",
        },
        {
          label: "Line Item Name",
          key: "lineItemName",
          type: "string",
          constraints: [
            {
              type: "required",
            },
          ],
          description:
            "Name of the line item, typically a product or SKU name.",
        },
        {
          label: "Line Item Description",
          key: "lineItemDescription",
          type: "string",
          description: "An optional free-form description of the line item.",
        },
        {
          label: "Line Item Quantity",
          key: "lineItemQuantity",
          type: "string",
          description:
            "The number of units of a product or service that this line item is for. Must be a whole number.\n\nDefault: 1",
        },
        {
          label: "Line Item Unit Amount",
          key: "lineItemUnitAmount",
          type: "string",
          description:
            "The cost per unit of the product or service that this line item is for, specified in the invoice currency's smallest unit.\n\nOnly use line item unit amount OR line item decimal unit amount.",
        },
        {
          label: "Line Item Decimal Unit Amount",
          key: "lineItemUnitAmountDecimal",
          type: "string",
          description:
            "The cost per unit of the product or service that this line item is for, specified in the invoice currency's smallest unit. Accepts decimal strings with up to 12 decimal places.\n\nOnly use line item unit amount OR line item decimal unit amount.",
        },
        {
          label: "Line Item Direction",
          key: "lineItemDirection",
          type: "string",
          description:
            "If `debit`, indicates that the counterparty owes the business money and increases the Invoice's `total_amount` due. If `credit`, has the opposite intention and effect.\n\nCase sensitive - use lowercase.",
        },
        {
          label: "Line Item Metadata",
          key: "lineItemMetadata",
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

export const invoiceBlueprintFields = invoiceBlueprint.sheets?.[0].fields || [];

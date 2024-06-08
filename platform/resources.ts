export const ACCOUNT_ACH_SETTING = "account_ach_setting";
export const ACCOUNT_CAPABILITY = "account_capability";
export const ACCOUNT_GROUP = "account_group";
export const ACH_SETTING = "ach_setting";
export const AUDIT_RECORD = "audit_record";
export const BALANCES_FEED_CONNECTION_CURRENCY =
  "balances_feed_connection_currency";
export const BALANCES_FEED_CURRENCY_TOTAL = "balances_feed_currency_total";
export const BULK_ERROR = "bulk_error";
export const BULK_IMPORT = "bulk_import";
export const BULK_REQUEST = "bulk_request";
export const BULK_RESULT = "bulk_result";
export const CASE = "case";
export const CATEGORIZATION_METADATA_KEY = "categorization_metadata_key";
export const CATEGORIZATION_METADATA_VALUE = "categorization_metadata_value";
export const COMPLIANCE_RULE = "compliance_rule";
export const CONNECTION = "connection";
export const CONNECTION_BULK_IMPORT = "connection_bulk_import";
export const CONNECTION_ENDPOINT = "connection_endpoint";
export const COUNTERPARTY = "counterparty";
export const CUSTOM_PROCESSING_WINDOW = "custom_processing_window";
export const DATA_INGESTION_BULK_IMPORT = "data_ingestion_bulk_import";
export const DATA_INGESTION_BULK_RESULT = "data_ingestion_bulk_result";
export const DECISION = "decision";
export const DESTINATION = "destination";
export const EVENT = "event";
export const EXPECTED_PAYMENT = "expected_payment";
export const EXPORT = "export";
export const EXTERNAL_ACCOUNT = "external_account";
export const EXTERNAL_EVENT = "external_event";
export const GROUP = "group";
export const INCOMING_PAYMENT_DETAIL = "incoming_payment_detail";
export const INTERNAL_ACCOUNT = "internal_account";
export const INTERNAL_ACCOUNT_BALANCE_RECON = "internal_account_balance_recon";
export const INVOICE = "invoice";
export const INVOICE_LINE_ITEM = "invoice_line_item";
export const LEDGER = "ledger";
export const LEDGERABLE_EVENT = "ledgerable_event";
export const LEDGER_ACCOUNT = "ledger_account";
export const LEDGER_ACCOUNT_CATEGORY = "ledger_account_category";
export const LEDGER_ACCOUNT_CATEGORY_CHILD = "ledger_account_category_child";
export const LEDGER_ACCOUNT_SETTLEMENT = "ledger_account_settlement";
export const LEDGER_ENTRY = "ledger_entry";
export const LEDGER_EVENT_HANDLER = "ledger_event_handler";
export const LEDGER_TRANSACTION = "ledger_transaction";
export const LEDGER_TRANSACTION_TEMPLATE = "ledger_transaction_template";
export const LINE_ITEM = "line_item";
export const ORGANIZATION = "organization";
export const ORGANIZATION_CUSTOMIZATION = "organization_customization";
export const ORGANIZATION_USER = "organization_user";
export const PAPER_ITEM = "paper_item";
export const PARTNER = "partner";
export const PARTNER_CONTACT = "partner_contact";
export const PARTNER_SEARCH = "partner_search";
export const PAYMENT_ORDER = "payment_order";
export const PENNY_TEST = "penny_test";
export const PERMISSION_SET = "permission_set";
export const PIPELINE_INVOCATION = "pipeline_invocation";
export const PROPOSED_CHANGE = "proposed_change";
export const PUBLISHABLE_KEY = "publishable_key";
export const QUOTE = "quote";
export const RECONCILIATION_RULE = "reconciliation_rule";
export const RECONCILIATION_RULE_PREVIEW_LINE_ITEM =
  "reconciliation_rule_preview_line_item";
export const RECONCILIATION_RULE_PREVIEW_TRANSACTION =
  "reconciliation_rule_preview_transaction";
export const REPORT = "report";
export const REQUEST_LOG = "request_log";
export const RETURN = "return";
export const REVERSAL = "reversal";
export const ROLE = "role";
export const RULE = "rule";
export const STEP_INVOCATION = "step_invocation";
export const SWEEP_RULE = "sweep_rule";
export const TRANSACTION = "transaction";
export const TRANSACTION_CATEGORIZATION_RULE =
  "transaction_categorization_rule";
export const TRANSACTION_LINE_ITEM = "transaction_line_item";
export const TRANSFER = "transfer";
export const USER = "user";
export const VENDOR_SUBSCRIPTION = "vendor_subscription";
export const VIRTUAL_ACCOUNT = "virtual_account";
export const VIRTUAL_ACCOUNT_SETTING = "virtual_account_setting";
export const WEBHOOK_DELIVERY_ATTEMPT = "webhook_delivery_attempt";
export const WEBHOOK_ENDPOINT = "webhook_endpoint";

export type ResourcesEnum =
  | "account_ach_setting"
  | "account_capability"
  | "account_group"
  | "ach_setting"
  | "audit_record"
  | "balances_feed_connection_currency"
  | "balances_feed_currency_total"
  | "bulk_error"
  | "bulk_import"
  | "bulk_request"
  | "bulk_result"
  | "case"
  | "categorization_metadata_key"
  | "categorization_metadata_value"
  | "compliance_rule"
  | "connection"
  | "connection_bulk_import"
  | "connection_endpoint"
  | "counterparty"
  | "custom_processing_window"
  | "data_ingestion_bulk_import"
  | "data_ingestion_bulk_result"
  | "decision"
  | "destination"
  | "event"
  | "expected_payment"
  | "export"
  | "external_account"
  | "external_event"
  | "group"
  | "incoming_payment_detail"
  | "internal_account"
  | "internal_account_balance_recon"
  | "invoice"
  | "invoice_line_item"
  | "ledger"
  | "ledger_account"
  | "ledger_account_category"
  | "ledger_account_category_child"
  | "ledger_account_settlement"
  | "ledger_entry"
  | "ledger_event_handler"
  | "ledger_transaction"
  | "ledger_transaction_template"
  | "ledgerable_event"
  | "line_item"
  | "organization"
  | "organization_customization"
  | "organization_user"
  | "paper_item"
  | "partner"
  | "partner_contact"
  | "partner_search"
  | "payment_order"
  | "penny_test"
  | "permission_set"
  | "pipeline_invocation"
  | "proposed_change"
  | "publishable_key"
  | "quote"
  | "reconciliation_rule"
  | "reconciliation_rule_preview_line_item"
  | "reconciliation_rule_preview_transaction"
  | "report"
  | "request_log"
  | "return"
  | "reversal"
  | "role"
  | "rule"
  | "step_invocation"
  | "sweep_rule"
  | "transaction"
  | "transaction_categorization_rule"
  | "transaction_line_item"
  | "transfer"
  | "user"
  | "vendor_subscription"
  | "virtual_account"
  | "virtual_account_setting"
  | "webhook_delivery_attempt"
  | "webhook_endpoint";

type ResourcesType = {
  [key in ResourcesEnum]: {
    model: string;
    redux_field: string | null;
    graphql_type: string;
    filter_schema: string | null;
    graphql_fields: {
      list_view: string;
      details_table: string;
      async_search: string;
    };
    finder: string | null;
  };
};

export const RESOURCES: ResourcesType = {
  account_ach_setting: {
    model: "account_ach_setting",
    graphql_type: "Types::AccountACHSettingType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "accountAchSettings",
      list_view: "accountAchSettings",
      details_table: "accountAchSetting",
    },
    finder: "FindAccountACHSettings",
  },
  account_capability: {
    model: "account_capability",
    graphql_type: "Types::AccountCapabilityType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "accountCapabilities",
      list_view: "accountCapabilities",
      details_table: "accountCapability",
    },
    finder: "FindAccountCapabilities",
  },
  account_group: {
    model: "account_group",
    graphql_type: "Types::AccountGroupType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "accountGroups",
      list_view: "accountGroups",
      details_table: "accountGroup",
    },
    finder: "FindAccountGroups",
  },
  ach_setting: {
    model: "ach_setting",
    graphql_type: "Types::ACHSettingType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "achSettings",
      list_view: "achSettings",
      details_table: "achSetting",
    },
    finder: "FindACHSettings",
  },
  audit_record: {
    model: "audit_record",
    graphql_type: "Types::AuditRecordType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "auditRecords",
      list_view: "auditRecords",
      details_table: "auditRecord",
    },
    finder: "FindAuditRecords",
  },
  balances_feed_connection_currency: {
    model: "balances_feed_connection_currency",
    graphql_type: "Types::BalancesFeedConnectionCurrencyType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "balancesFeedConnectionCurrencies",
      list_view: "balancesFeedConnectionCurrencies",
      details_table: "balancesFeedConnectionCurrency",
    },
    finder: null,
  },
  balances_feed_currency_total: {
    model: "balances_feed_currency_total",
    graphql_type: "Types::BalancesFeedCurrencyTotalType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "balancesFeedCurrencyTotals",
      list_view: "balancesFeedCurrencyTotals",
      details_table: "balancesFeedCurrencyTotal",
    },
    finder: null,
  },
  bulk_error: {
    model: "bulk/bulk_error",
    graphql_type: "Types::Bulk::BulkErrorType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "bulkErrors",
      list_view: "bulkErrors",
      details_table: "bulkError",
    },
    finder: null,
  },
  bulk_import: {
    model: "bulk_import",
    graphql_type: "Types::BulkImportType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "bulkImports",
      list_view: "bulkImports",
      details_table: "bulkImport",
    },
    finder: "FindBulkImports",
  },
  bulk_request: {
    model: "bulk_request",
    graphql_type: "Types::Bulk::BulkRequestType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "bulkRequests",
      list_view: "bulkRequests",
      details_table: "bulkRequest",
    },
    finder: null,
  },
  bulk_result: {
    model: "bulk_result",
    graphql_type: "Types::Bulk::BulkResultType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "bulkResults",
      list_view: "bulkResults",
      details_table: "bulkResult",
    },
    finder: null,
  },
  case: {
    model: "compliance/case",
    graphql_type: "Types::Compliance::CaseType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "cases",
      list_view: "cases",
      details_table: "case",
    },
    finder: null,
  },
  categorization_metadata_key: {
    model: "categorization_metadata_key",
    graphql_type: "Types::CategorizationMetadataKeyType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "categorizationMetadataKeys",
      list_view: "categorizationMetadataKeys",
      details_table: "categorizationMetadataKey",
    },
    finder: "FindCategorizationMetadataKeys",
  },
  categorization_metadata_value: {
    model: "categorization_metadata_value",
    graphql_type: "Types::CategorizationMetadataValueType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "categorizationMetadataValues",
      list_view: "categorizationMetadataValues",
      details_table: "categorizationMetadataValue",
    },
    finder: "FindCategorizationMetadataValues",
  },
  compliance_rule: {
    model: "compliance/rule",
    graphql_type: "Types::Compliance::RuleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "complianceRules",
      list_view: "complianceRules",
      details_table: "complianceRule",
    },
    finder: null,
  },
  connection: {
    model: "connection",
    graphql_type: "Types::ConnectionType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "connections",
      list_view: "connections",
      details_table: "connection",
    },
    finder: "FindConnections",
  },
  connection_bulk_import: {
    model: "connection_bulk_import",
    graphql_type: "Types::ConnectionBulkImportType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "connectionBulkImports",
      list_view: "connectionBulkImports",
      details_table: "connectionBulkImport",
    },
    finder: "FindConnectionBulkImports",
  },
  connection_endpoint: {
    model: "connection_endpoint",
    graphql_type: "Types::ConnectionEndpointType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "connectionEndpoints",
      list_view: "connectionEndpoints",
      details_table: "connectionEndpoint",
    },
    finder: "FindConnectionEndpoints",
  },
  counterparty: {
    model: "counterparty",
    graphql_type: "Types::CounterpartyType",
    redux_field: "counterparties",
    filter_schema: null,
    graphql_fields: {
      async_search: "counterparties",
      list_view: "counterparties",
      details_table: "counterparty",
    },
    finder: "FindCounterparties",
  },
  custom_processing_window: {
    model: "custom_processing_window",
    graphql_type: "Types::CustomProcessingWindowType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "customProcessingWindows",
      list_view: "customProcessingWindows",
      details_table: "customProcessingWindow",
    },
    finder: "FindCustomProcessingWindows",
  },
  data_ingestion_bulk_import: {
    model: "data_ingestion_bulk_import",
    graphql_type: "Types::DataIngestion::BulkImportType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "dataIngestionBulkImports",
      list_view: "dataIngestionBulkImports",
      details_table: "dataIngestionBulkImport",
    },
    finder: null,
  },
  data_ingestion_bulk_result: {
    model: "data_ingestion_bulk_result",
    graphql_type: "Types::DataIngestion::BulkResultType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "dataIngestionBulkResults",
      list_view: "dataIngestionBulkResults",
      details_table: "dataIngestionBulkResult",
    },
    finder: null,
  },
  decision: {
    model: "compliance/decision",
    graphql_type: "Types::Compliance::DecisionType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "decisions",
      list_view: "decisions",
      details_table: "decision",
    },
    finder: null,
  },
  destination: {
    model: "push_to_warehouse/destination",
    graphql_type: "Types::PushToWarehouse::DestinationType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "destinations",
      list_view: "destinations",
      details_table: "destination",
    },
    finder: null,
  },
  event: {
    model: "event",
    graphql_type: "Types::EventType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "events",
      list_view: "events",
      details_table: "event",
    },
    finder: "FindEvents",
  },
  expected_payment: {
    model: "expected_payment",
    graphql_type: "Types::ExpectedPaymentType",
    redux_field: "expected_payments",
    filter_schema: "LogicalForm::Schemas::Filters::ExpectedPaymentSchema",
    graphql_fields: {
      async_search: "expectedPayments",
      list_view: "expectedPayments",
      details_table: "expectedPayment",
    },
    finder: "FindExpectedPayments",
  },
  export: {
    model: "export",
    graphql_type: "Types::ExportType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "exports",
      list_view: "exports",
      details_table: "export",
    },
    finder: null,
  },
  external_account: {
    model: "external_account",
    graphql_type: "Types::ExternalAccountType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "externalAccounts",
      list_view: "externalAccounts",
      details_table: "externalAccount",
    },
    finder: "FindExternalAccounts",
  },
  external_event: {
    model: "external_event",
    graphql_type: "Types::ExternalEventType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "externalEvents",
      list_view: "externalEvents",
      details_table: "externalEvent",
    },
    finder: "FindExternalEvents",
  },
  group: {
    model: "group",
    graphql_type: "Types::GroupType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "groups",
      list_view: "groups",
      details_table: "group",
    },
    finder: "FindGroups",
  },
  incoming_payment_detail: {
    model: "incoming_payment_detail",
    graphql_type: "Types::IncomingPaymentDetailType",
    redux_field: "incoming_payment_details",
    filter_schema: null,
    graphql_fields: {
      async_search: "incomingPaymentDetails",
      list_view: "incomingPaymentDetails",
      details_table: "incomingPaymentDetail",
    },
    finder: "FindIncomingPaymentDetails",
  },
  internal_account: {
    model: "internal_account",
    graphql_type: "Types::InternalAccountType",
    redux_field: "internal_accounts",
    filter_schema: null,
    graphql_fields: {
      async_search: "internalAccounts",
      list_view: "balancesFeedInternalAccounts",
      details_table: "internalAccount",
    },
    finder: "FindInternalAccounts",
  },
  internal_account_balance_recon: {
    model: "internal_account_balance_recon",
    graphql_type: "Types::InternalAccountBalanceReconType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "internalAccountBalancesRecon",
      list_view: "internalAccountBalancesRecon",
      details_table: "internalAccountBalanceRecon",
    },
    finder: null,
  },
  invoice: {
    model: "invoices/invoice",
    graphql_type: "Types::Invoices::InvoiceType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "invoices",
      list_view: "invoices",
      details_table: "invoice",
    },
    finder: "FindInvoices",
  },
  invoice_line_item: {
    model: "invoice_line_item",
    graphql_type: "Types::Invoices::InvoiceLineItemType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "invoiceLineItems",
      list_view: "invoiceLineItems",
      details_table: "invoiceLineItem",
    },
    finder: "FindInvoiceLineItems",
  },
  ledger: {
    model: "ledger",
    graphql_type: "Types::LedgerType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgers",
      list_view: "ledgers",
      details_table: "ledger",
    },
    finder: "FindLedgers",
  },
  ledgerable_event: {
    model: "ledgerable_event",
    graphql_type: "Types::LedgerableEventType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerableEvents",
      list_view: "ledgerableEvents",
      details_table: "ledgerableEvent",
    },
    finder: "FindLedgerableEvents",
  },
  ledger_account: {
    model: "ledger_account",
    graphql_type: "Types::LedgerAccountType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerAccounts",
      list_view: "ledgerAccounts",
      details_table: "ledgerAccount",
    },
    finder: "FindLedgerAccounts",
  },
  ledger_account_category: {
    model: "ledger_account_category",
    graphql_type: "Types::LedgerAccountCategoryType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerAccountCategories",
      list_view: "ledgerAccountCategories",
      details_table: "ledgerAccountCategory",
    },
    finder: "FindLedgerAccountCategories",
  },
  ledger_account_category_child: {
    model: "ledger_account_category_child",
    graphql_type: "Types::LedgerAccountCategoryChildType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerAccountCategoryChildren",
      list_view: "ledgerAccountCategoryChildren",
      details_table: "ledgerAccountCategoryChild",
    },
    finder: "FindLedgerAccountCategoryChildren",
  },
  ledger_account_settlement: {
    model: "ledger_account_settlement",
    graphql_type: "Types::LedgerAccountSettlementType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerAccountSettlements",
      list_view: "ledgerAccountSettlements",
      details_table: "ledgerAccountSettlement",
    },
    finder: "FindLedgerAccountSettlements",
  },
  ledger_entry: {
    model: "ledger_entry",
    graphql_type: "Types::LedgerEntryType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerEntries",
      list_view: "ledgerEntries",
      details_table: "ledgerEntry",
    },
    finder: "FindLedgerEntries",
  },
  ledger_event_handler: {
    model: "ledger_event_handler",
    graphql_type: "Types::LedgerEventHandlerType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerEventHandlers",
      list_view: "ledgerEventHandlers",
      details_table: "ledgerEventHandler",
    },
    finder: "FindLedgerEventHandlers",
  },
  ledger_transaction: {
    model: "ledger_transaction",
    graphql_type: "Types::LedgerTransactionType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerTransactions",
      list_view: "ledgerTransactions",
      details_table: "ledgerTransaction",
    },
    finder: "FindLedgerTransactions",
  },
  ledger_transaction_template: {
    model: "ledger_transaction_template",
    graphql_type: "Types::LedgerTransactionTemplateType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "ledgerTransactionTemplates",
      list_view: "ledgerTransactionTemplates",
      details_table: "ledgerTransactionTemplate",
    },
    finder: null,
  },
  line_item: {
    model: "line_item",
    graphql_type: "Types::LineItemType",
    redux_field: "line_items",
    filter_schema: null,
    graphql_fields: {
      async_search: "lineItems",
      list_view: "lineItems",
      details_table: "lineItem",
    },
    finder: null,
  },
  organization: {
    model: "organization",
    graphql_type: "Types::OrganizationType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "organizations",
      list_view: "organizations",
      details_table: "organization",
    },
    finder: "FindOrganizations",
  },
  organization_customization: {
    model: "organization_customization",
    graphql_type: "Types::OrganizationCustomizationType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "organizationCustomizations",
      list_view: "organizationCustomizations",
      details_table: "organizationCustomization",
    },
    finder: null,
  },
  organization_user: {
    model: "organization_user",
    graphql_type: "Types::OrganizationUserType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "organizationUsers",
      list_view: "organizationUsers",
      details_table: "organizationUser",
    },
    finder: "FindOrganizationUsers",
  },
  paper_item: {
    model: "paper_item",
    graphql_type: "Types::PaperItemType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "paperItems",
      list_view: "paperItems",
      details_table: "paperItem",
    },
    finder: "FindPaperItems",
  },
  partner: {
    model: "onboarding/partner",
    graphql_type: "Types::Onboarding::PartnerType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "partners",
      list_view: "partners",
      details_table: "partner",
    },
    finder: null,
  },
  partner_contact: {
    model: "onboarding/partner_contact",
    graphql_type: "Types::Onboarding::PartnerContactType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "partnerContacts",
      list_view: "partnerContacts",
      details_table: "partnerContact",
    },
    finder: null,
  },
  partner_search: {
    model: "onboarding/partner_search",
    graphql_type: "Types::Onboarding::PartnerSearchType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "partnerSearches",
      list_view: "partnerSearches",
      details_table: "partnerSearch",
    },
    finder: "FindPartnerSearches",
  },
  payment_order: {
    model: "payment_order",
    graphql_type: "Types::PaymentOrderType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "paymentOrders",
      list_view: "paymentOrders",
      details_table: "paymentOrder",
    },
    finder: "FindPaymentOrders",
  },
  penny_test: {
    model: "penny_test",
    graphql_type: "Types::PennyTestType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "pennyTests",
      list_view: "pennyTests",
      details_table: "pennyTest",
    },
    finder: "FindPennyTests",
  },
  permission_set: {
    model: "authorization/permission_set",
    graphql_type: "Types::Authorization::PermissionSetType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "permissionSets",
      list_view: "permissionSets",
      details_table: "permissionSet",
    },
    finder: "FindPermissionSets",
  },
  pipeline_invocation: {
    model: "pipeline_engine/pipeline_invocation",
    graphql_type: "Admin::Types::PipelineEngine::PipelineInvocationType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "pipelineInvocations",
      list_view: "pipelineInvocations",
      details_table: "pipelineInvocation",
    },
    finder: null,
  },
  proposed_change: {
    model: "proposed_change",
    graphql_type: "Types::ProposedChangeType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "proposedChanges",
      list_view: "proposedChanges",
      details_table: "proposedChange",
    },
    finder: "FindProposedChanges",
  },
  publishable_key: {
    model: "publishable_key",
    graphql_type: "Types::PublishableKeyType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "publishableKeys",
      list_view: "publishableKeys",
      details_table: "publishableKey",
    },
    finder: "FindPublishableKeys",
  },
  quote: {
    model: "foreign_exchange/quote",
    graphql_type: "Types::ForeignExchange::QuoteType",
    redux_field: null,
    filter_schema:
      "LogicalForm::Schemas::Filters::ForeignExchange::QuoteSchema",
    graphql_fields: {
      async_search: "quotes",
      list_view: "quotes",
      details_table: "quote",
    },
    finder: null,
  },
  reconciliation_rule: {
    model: "reconciliation_rule",
    graphql_type: "Types::Reconciliation::ReconciliationRuleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "reconciliationRules",
      list_view: "reconciliationRules",
      details_table: "reconciliationRule",
    },
    finder: "FindReconciliationRules",
  },
  reconciliation_rule_preview_line_item: {
    model: "reconciliation_rule_preview_line_item",
    graphql_type:
      "Types::Reconciliation::ReconciliationRulePreviewLineItemType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "reconciliationRulePreviewLineItems",
      list_view: "reconciliationRulePreviewLineItems",
      details_table: "reconciliationRulePreviewLineItem",
    },
    finder: "FindReconciliationRulePreviewLineItems",
  },
  reconciliation_rule_preview_transaction: {
    model: "transactions",
    graphql_type:
      "Types::Reconciliation::ReconciliationRulePreviewTransactionType",
    redux_field: null,
    filter_schema:
      "LogicalForm::Schemas::Filters::ReconciliationRulePreviewTransactionSchema",
    graphql_fields: {
      async_search: "reconciliationRulePreviewTransactions",
      list_view: "reconciliationRulePreviewTransactions",
      details_table: "reconciliationRulePreviewTransaction",
    },
    finder: "FindReconciliationRulePreviewTransactions",
  },
  report: {
    model: "report",
    graphql_type: "Types::ReportType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "reports",
      list_view: "reports",
      details_table: "report",
    },
    finder: null,
  },
  request_log: {
    model: "request_log",
    graphql_type: "Types::RequestLogType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "requestLogs",
      list_view: "requestLogs",
      details_table: "requestLog",
    },
    finder: "FindRequestLogs",
  },
  return: {
    model: "return",
    graphql_type: "Types::ReturnType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "returns",
      list_view: "returns",
      details_table: "return",
    },
    finder: "FindReturns",
  },
  reversal: {
    model: "reversal",
    graphql_type: "Types::ReversalType",
    redux_field: "reversals",
    filter_schema: null,
    graphql_fields: {
      async_search: "reversals",
      list_view: "reversals",
      details_table: "reversal",
    },
    finder: "FindReversals",
  },
  role: {
    model: "authorization/role",
    graphql_type: "Types::Authorization::RoleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "roles",
      list_view: "roles",
      details_table: "role",
    },
    finder: "FindRoles",
  },
  rule: {
    model: "rule",
    graphql_type: "Types::RuleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "rules",
      list_view: "rules",
      details_table: "rule",
    },
    finder: "FindRules",
  },
  step_invocation: {
    model: "pipeline_engine/step_invocation",
    graphql_type: "Admin::Types::PipelineEngine::StepInvocationType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "stepInvocations",
      list_view: "stepInvocations",
      details_table: "stepInvocation",
    },
    finder: null,
  },
  sweep_rule: {
    model: "sweep_rule",
    graphql_type: "Types::SweepRuleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "sweepRules",
      list_view: "sweepRules",
      details_table: "sweepRule",
    },
    finder: "FindSweepRules",
  },
  transaction: {
    model: "transaction",
    graphql_type: "Types::TransactionType",
    redux_field: "transactions",
    filter_schema: "LogicalForm::Schemas::Filters::TransactionSchema",
    graphql_fields: {
      async_search: "transactions",
      list_view: "transactions",
      details_table: "transaction",
    },
    finder: "FindTransactions",
  },
  transaction_categorization_rule: {
    model: "transaction_categorization_rule",
    graphql_type: "Types::TransactionCategorizationRuleType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "transactionCategorizationRules",
      list_view: "transactionCategorizationRules",
      details_table: "transactionCategorizationRule",
    },
    finder: "FindTransactionCategorizationRules",
  },
  transaction_line_item: {
    model: "transaction_line_item",
    graphql_type: "Types::TransactionLineItemType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "transactionLineItems",
      list_view: "transactionLineItems",
      details_table: "transactionLineItem",
    },
    finder: "FindTransactionLineItems",
  },
  transfer: {
    model: "push_to_warehouse/transfer",
    graphql_type: "Types::PushToWarehouse::TransferType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "transfers",
      list_view: "transfers",
      details_table: "transfer",
    },
    finder: null,
  },
  user: {
    model: "user",
    graphql_type: "Types::UserType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "users",
      list_view: "users",
      details_table: "user",
    },
    finder: "FindUsers",
  },
  vendor_subscription: {
    model: "vendor_subscription",
    graphql_type: "Types::VendorSubscriptionType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "vendorSubscriptions",
      list_view: "vendorSubscriptions",
      details_table: "vendorSubscription",
    },
    finder: "FindVendorSubscriptions",
  },
  virtual_account: {
    model: "virtual_account",
    graphql_type: "Types::VirtualAccountType",
    redux_field: "virtual_accounts",
    filter_schema: null,
    graphql_fields: {
      async_search: "virtualAccounts",
      list_view: "virtualAccounts",
      details_table: "virtualAccount",
    },
    finder: "FindVirtualAccounts",
  },
  virtual_account_setting: {
    model: "virtual_account_setting",
    graphql_type: "Types::VirtualAccountSettingType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "virtualAccountSettings",
      list_view: "virtualAccountSettings",
      details_table: "virtualAccountSetting",
    },
    finder: "FindVirtualAccountSettings",
  },
  webhook_delivery_attempt: {
    model: "webhook_delivery_attempt",
    graphql_type: "Types::WebhookDeliveryAttemptType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "webhookDeliveryAttempts",
      list_view: "webhookDeliveryAttempts",
      details_table: "webhookDeliveryAttempt",
    },
    finder: "FindWebhookDeliveryAttempts",
  },
  webhook_endpoint: {
    model: "webhook_endpoint",
    graphql_type: "Types::WebhookEndpointType",
    redux_field: null,
    filter_schema: null,
    graphql_fields: {
      async_search: "webhookEndpoints",
      list_view: "webhookEndpoints",
      details_table: "webhookEndpoint",
    },
    finder: "FindWebhookEndpoints",
  },
};

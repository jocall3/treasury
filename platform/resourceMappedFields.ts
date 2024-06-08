/**********************************************************************
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!       This is a generated file, do not manually edit it!      !!!
  !!!       In order to modify this file, change the code in        !!!
  !!!       `app/models/transfer.rb`                                !!!
  !!!       or `lib/tasks/generate_js_constants.rake`               !!!
  !!!       and run `yarn generate-constants`.                      !!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ********************************************************************/

import { ResourcesEnum } from "../types/resources";

type ResourceMappedFields = {
  [key in ResourcesEnum]: Array<{
    id: string;
    label: string;
    required: boolean;
  }>;
};

const RESOURCE_MAPPED_FIELDS: ResourceMappedFields = {
  account_ach_setting: [],
  account_capability: [],
  account_group: [],
  ach_setting: [],
  audit_record: [],
  balances_feed_connection_currency: [],
  balances_feed_currency_total: [],
  bulk_error: [],
  bulk_import: [],
  bulk_request: [],
  bulk_result: [],
  case: [],
  categorization_metadata_key: [],
  categorization_metadata_value: [],
  compliance_rule: [],
  connection: [],
  connection_bulk_import: [],
  connection_endpoint: [],
  counterparty: [],
  custom_processing_window: [],
  data_ingestion_bulk_import: [],
  data_ingestion_bulk_result: [],
  decision: [],
  destination: [],
  event: [],
  expected_payment: [
    { id: "amount_lower_bound", required: true, label: "Amount Lower Bound" },
    { id: "amount_upper_bound", required: true, label: "Amount Upper Bound" },
    { id: "direction", required: true, label: "Direction" },
    { id: "counterparty_id", required: false, label: "Counterparty" },
    { id: "date_lower_bound", required: false, label: "Date Lower Bound" },
    { id: "date_upper_bound", required: false, label: "Date Upper Bound" },
    { id: "description", required: false, label: "Description" },
    {
      id: "remittance_information",
      required: false,
      label: "Remittance Information",
    },
    {
      id: "statement_descriptor",
      required: false,
      label: "Statement Descriptor",
    },
    { id: "type", required: false, label: "Type" },
  ],
  export: [],
  external_account: [],
  external_event: [],
  group: [],
  incoming_payment_detail: [],
  internal_account: [],
  internal_account_balance_recon: [],
  invoice: [],
  invoice_line_item: [],
  ledger: [],
  ledgerable_event: [],
  ledger_account: [],
  ledger_account_category: [],
  ledger_account_category_child: [],
  ledger_account_settlement: [],
  ledger_entry: [],
  ledger_event_handler: [],
  ledger_transaction: [],
  ledger_transaction_template: [],
  line_item: [],
  organization: [],
  organization_customization: [],
  organization_user: [],
  paper_item: [],
  partner: [],
  partner_contact: [],
  partner_search: [],
  payment_order: [],
  penny_test: [],
  permission_set: [],
  pipeline_invocation: [],
  proposed_change: [],
  publishable_key: [],
  quote: [],
  reconciliation_rule: [],
  reconciliation_rule_preview_line_item: [],
  reconciliation_rule_preview_transaction: [],
  report: [],
  request_log: [],
  return: [],
  reversal: [],
  role: [],
  rule: [],
  step_invocation: [],
  sweep_rule: [],
  transaction: [
    { id: "amount", required: true, label: "Amount" },
    { id: "as_of_date", required: true, label: "As Of Date" },
    { id: "direction", required: true, label: "Direction" },
    { id: "posted", required: true, label: "Posted" },
    { id: "type", required: false, label: "Type" },
    { id: "vendor_description", required: false, label: "Vendor Description" },
  ],
  transaction_categorization_rule: [],
  transaction_line_item: [],
  transfer: [],
  user: [],
  vendor_subscription: [],
  virtual_account: [],
  virtual_account_setting: [],
  webhook_delivery_attempt: [],
  webhook_endpoint: [],
};

export default RESOURCE_MAPPED_FIELDS;

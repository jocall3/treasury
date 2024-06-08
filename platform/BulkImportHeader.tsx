import React from "react";
import {
  Property as FlatfileProperty,
  CreateWorkbookConfig,
  CellValueUnion,
} from "@flatfile/api/api";
import { Button, Heading } from "../../common/ui-components";
import { BulkValidationError } from "../../generated/dashboard/graphqlSchema";
import FlatfileBulkUploadButton, {
  BulkResourceType,
} from "./FlatfileBulkUploadButton";
import { downloadCsvTemplate } from "../utilities/downloadCsvTemplate";

interface BulkImportHeaderProps {
  bulkImportType: string;
  submit: (
    resultsData: Array<Record<string, CellValueUnion | null>>,
    flatfileSheetId: string,
    flatfileSpaceId: string
  ) => Promise<Record<string, string | boolean>>;
  validate: (
    resultsData: Array<Record<string, CellValueUnion | null>>
  ) => Promise<Array<BulkValidationError> | undefined | null>;
  expectedFields: FlatfileProperty[];
  blueprint: Pick<
    CreateWorkbookConfig,
    "name" | "labels" | "sheets" | "actions"
  >;
  resource: BulkResourceType;
}

function BulkImportHeader({
  bulkImportType,
  submit,
  validate,
  expectedFields,
  blueprint,
  resource,
}: BulkImportHeaderProps) {
  let bulkImportTypeText = "";
  let bulkImportHelpLink = "";

  switch (bulkImportType) {
    case "Expected Payment":
      bulkImportTypeText = "Expected Payments";
      bulkImportHelpLink =
        "https://docs.moderntreasury.com/reconciliation/docs/create-expected-payments-in-bulk";
      break;
    case "Payment Order":
      bulkImportTypeText = "Payment Orders";
      bulkImportHelpLink =
        "https://docs.moderntreasury.com/payments/docs/create-payment-orders-in-bulk";
      break;
    case "Counterparty":
      bulkImportTypeText = "Counterparties";
      bulkImportHelpLink =
        "https://docs.moderntreasury.com/payments/docs/create-counterparties-in-bulk";
      break;
    case "Invoice":
      bulkImportTypeText = "Invoices";
      bulkImportHelpLink =
        "https://docs.moderntreasury.com/payments/docs/create-invoices-in-bulk";
      break;
    default:
      break;
  }

  const headers = expectedFields.map((field) => field.key);

  return (
    <div className="grid mint-xl:grid-cols-2">
      <div>
        {bulkImportType && (
          <div id="mt-container-header">
            <Heading level="h1" size="l">
              {`Bulk ${bulkImportType}`}
            </Heading>
            <div className="mb-4 mt-2 max-w-lg">
              {`Bulk ${bulkImportType.toLowerCase()} allows you to upload a maximum of 1,000 ${bulkImportTypeText} at one time. For help with uploading or using templates, `}
              <a
                href={bulkImportHelpLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                visit our guide.
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="mb-4 flex space-x-4 mint-xl:justify-self-end">
        <Button
          buttonType="secondary"
          onClick={() => downloadCsvTemplate(headers)}
        >
          Download Template CSV
        </Button>
        <FlatfileBulkUploadButton
          onValidate={validate}
          onSubmit={submit}
          expectedFields={expectedFields}
          blueprint={blueprint}
          resource={resource}
        />
      </div>
    </div>
  );
}

export default BulkImportHeader;

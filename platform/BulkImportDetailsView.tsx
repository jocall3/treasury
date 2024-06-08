import React from "react";
import { capitalize, startCase } from "lodash";
import ReactTooltip from "react-tooltip";
import { MutationFunction } from "@apollo/client/react/types/types";
import {
  BulkImportViewQuery,
  useBulkImportViewQuery,
  useCalculatePaymentOrderTotalsQuery,
  useCreateDownloadAuditRecordMutation,
  Exact,
  CreateDownloadAuditRecordMutation,
  CreateDownloadAuditRecordInput,
} from "../../generated/dashboard/graphqlSchema"; // Rename this query for this view
import formatDate from "../../common/utilities/formatDate";
import {
  DateTime,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
  Tooltip,
} from "../../common/ui-components";

const MAPPING = {
  id: "ID",
  createdAt: "Created At",
  resourceType: "Resource",
  liveMode: "Live Mode",
  status: "Status",
  createdBy: "Uploaded By",
  resourceCount: "Total Created Resources",
  csvDownload: "CSV",
};

interface CurrencyTotalType {
  amount: string;
  currency: string;
  direction;
  string;
}

type CustomBulkImportType = Pick<BulkImportViewQuery, "bulkImport"> & {
  createdAt: JSX.Element;
  liveMode: string;
  createdBy: JSX.Element;
  status: string;
  resourceType: string;
  resourceCount: React.ReactNode;
  csvDownload: JSX.Element;
};

function csvDownloadFormat(
  bulkImportData: NonNullable<BulkImportViewQuery["bulkImport"]>,
  createDownloadAuditRecord: MutationFunction<
    CreateDownloadAuditRecordMutation,
    Exact<{
      input: CreateDownloadAuditRecordInput;
    }>
  >
) {
  if (bulkImportData.fileUrl && bulkImportData.filename) {
    return (
      <a
        onClick={() => {
          void createDownloadAuditRecord({
            variables: { input: { id: bulkImportData.id } },
          });
        }}
        href={bulkImportData.fileUrl}
        download
      >
        {bulkImportData.filename}
      </a>
    );
  }
  if (bulkImportData.filename && !bulkImportData.fileUrl) {
    return (
      <>
        {bulkImportData.filename}
        <ReactTooltip
          multiline
          id="csv"
          data-place="top"
          data-type="dark"
          data-effect="float"
        />
        <Tooltip
          className="ml-1"
          data-for="csv"
          data-tip="You don't have permission to download"
        />
      </>
    );
  }
  return (
    <>
      <span>Unavailable</span>
      <ReactTooltip
        multiline
        id="download"
        data-place="top"
        data-type="dark"
        data-effect="float"
      />
      <Tooltip
        className="ml-1"
        data-for="download"
        data-tip="Check back later"
      />
    </>
  );
}

function buildPaymentOrderTotals(
  currencyTotals: CurrencyTotalType[],
  showCalculationTotal
) {
  return showCalculationTotal ? (
    <div className="row-value">
      {currencyTotals.map(({ amount, currency, direction }) => (
        <>
          <div>
            {capitalize(direction as string)}
            &nbsp;
            {amount}
            &nbsp;
            <b>{currency}</b>
          </div>
          <br />
        </>
      ))}
    </div>
  ) : (
    <>
      <span>Insufficient Permissions</span>
      <ReactTooltip
        multiline
        id="resources"
        data-place="top"
        data-type="dark"
        data-effect="float"
      />
      <Tooltip
        className="ml-1"
        data-for="resources"
        data-tip="You must have permissions to view all payment orders to see totals."
      />
    </>
  );
}

function formatBulkImport(
  bulkImportData: NonNullable<BulkImportViewQuery["bulkImport"]>,
  currencyTotals: CurrencyTotalType[],
  entitiesDate: string,
  totalsLoaded,
  showCalculationTotal,
  createDownloadAuditRecord: MutationFunction<
    CreateDownloadAuditRecordMutation,
    Exact<{
      input: CreateDownloadAuditRecordInput;
    }>
  >
): Record<string, unknown> {
  return {
    ...bulkImportData,
    createdAt: <DateTime timestamp={bulkImportData.createdAt} />,
    liveMode: bulkImportData.liveMode ? "True" : "False",
    createdBy: (
      <a href={`/settings/users/${bulkImportData.userId ?? ""}/edit`}>
        {bulkImportData.user.name}
      </a>
    ),
    status: bulkImportData.prettyStatus,
    resourceType: startCase(bulkImportData.prettyResourceType),
    resourceCount:
      bulkImportData.resourceCount === 0 &&
      new Date(bulkImportData.createdAt) <= new Date(entitiesDate) ? (
        <>
          <span>Unknown</span>
          <ReactTooltip
            multiline
            id="resources"
            data-place="top"
            data-type="dark"
            data-effect="float"
          />
          <Tooltip
            className="ml-1"
            data-for="resources"
            data-tip={`Unable to determine resources created for imports before ${
              formatDate(new Date(entitiesDate)) ?? ""
            }`}
          />
        </>
      ) : (
        bulkImportData.resourceCount
      ),
    csvDownload: csvDownloadFormat(bulkImportData, createDownloadAuditRecord),
    ...(totalsLoaded &&
      bulkImportData.resourceType === "PaymentOrder" && {
        totalAmounts: buildPaymentOrderTotals(
          currencyTotals,
          showCalculationTotal
        ),
      }),
  } as CustomBulkImportType;
}

interface BulkImportDetailsViewProps {
  bulkImportId: string;
  entitiesDate: string;
  showCalculationTotal: boolean;
}

function BulkImportDetailsView({
  bulkImportId,
  entitiesDate,
  showCalculationTotal,
}: BulkImportDetailsViewProps) {
  const { loading, data } = useBulkImportViewQuery({
    variables: { id: bulkImportId },
  });
  const bulkImport = data?.bulkImport;
  const [createDownloadAuditRecord] = useCreateDownloadAuditRecordMutation();
  const {
    data: calcData,
    loading: calcLoading,
    error: calcError,
  } = useCalculatePaymentOrderTotalsQuery({
    notifyOnNetworkStatusChange: true,
    variables: { bulkImportId },
  });
  const currencyTotals =
    calcLoading || !calcData || calcError
      ? []
      : (calcData.calculatePaymentOrderTotals
          .prettyTotals as CurrencyTotalType[]);

  const bulkImportLoaded = !!(!loading && bulkImport);
  const totalsLoaded = !!(
    !calcLoading &&
    calcData &&
    calcData.calculatePaymentOrderTotals.paymentOrdersTotalCount !== 0
  );

  return (
    <div className="mt-4">
      {bulkImportLoaded ? (
        <KeyValueTable
          data={formatBulkImport(
            bulkImport,
            currencyTotals,
            entitiesDate,
            showCalculationTotal,
            totalsLoaded,
            createDownloadAuditRecord
          )}
          dataMapping={{
            ...MAPPING,
            ...(bulkImport.resourceType === "PaymentOrder" &&
              totalsLoaded && { totalAmounts: "Total Payment Amounts" }),
          }}
        />
      ) : (
        <KeyValueTableSkeletonLoader dataMapping={MAPPING} />
      )}
    </div>
  );
}

export default BulkImportDetailsView;

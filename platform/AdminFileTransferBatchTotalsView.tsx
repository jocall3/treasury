import React from "react";
import {
  useAdminFileTransferBatchTotalsQuery,
  BatchTypeEnum,
  BatchSubtotal,
} from "../../generated/dashboard/graphqlSchema";
import {
  IndexTable,
  IndexTableSkeletonLoader,
} from "../../common/ui-components";

const MAPPING = {
  currency: "Currency",
  direction: "Direction",
  amount: "Amount",
  count: "Count",
};

interface FileTransferBatchTotalsViewProps {
  batchId: string;
  batchType: BatchTypeEnum;
  organizationId: string;
}

function formatBatchTotals(batchTotals: BatchSubtotal[]) {
  return batchTotals.map((batchSubtotal: BatchSubtotal) => ({
    ...batchSubtotal,
    count: <> {batchSubtotal.count} </>,
  }));
}

function AdminFileTransferBatchTotalsView({
  batchId,
  batchType,
  organizationId,
}: FileTransferBatchTotalsViewProps) {
  const { loading, data, error } = useAdminFileTransferBatchTotalsQuery({
    skip: !batchId || !batchType,
    variables: { batchId, batchType, organizationId },
  });

  const batchTotals =
    loading || !data || error
      ? []
      : data?.adminFileTransferCalculateBatchTotals;

  return loading || !data ? (
    <div className="mt-4">
      <IndexTableSkeletonLoader headers={Object.keys(MAPPING)} numRows={4} />
    </div>
  ) : (
    <IndexTable data={formatBatchTotals(batchTotals)} dataMapping={MAPPING} />
  );
}

export default AdminFileTransferBatchTotalsView;

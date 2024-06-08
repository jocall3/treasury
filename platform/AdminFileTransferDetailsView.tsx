import React from "react";
import ReactJson from "react-json-view";
import {
  AdminFileTransferDetailsViewQuery,
  useAdminFileTransferDetailsViewQuery,
  useAdminOrganizationViewQuery,
} from "../../generated/dashboard/graphqlSchema";
import {
  CopyableText,
  DateTime,
  Icon,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../common/ui-components";

const MAPPING = {
  id: "ID",
  organization: "Organization",
  fileName: "File Name",
  filePath: "Full Path",
  direction: "Direction",
  fileCreatedAt: "Created At",
  transferredAt: "Transferred At",
  processed: "Processed",
  batchId: "Batch ID",
  batchType: "Batch Type",
  vendorName: "Vendor",
  serviceId: "Service",
  receipt: "Receipt",
  extra: "Extra",
};

interface FileTransferDetailsViewProps {
  fileTransferId: string;
  organizationId: string;
}

function formatFileTransfer(
  fileTransferData: AdminFileTransferDetailsViewQuery["fileTransfer"],
  orgName: string
): Record<string, unknown> {
  return {
    ...fileTransferData,
    fileCreatedAt: fileTransferData.fileCreatedAt ? (
      <DateTime timestamp={fileTransferData.fileCreatedAt} />
    ) : null,
    transferredAt: fileTransferData.transferredAt ? (
      <DateTime timestamp={fileTransferData.transferredAt} />
    ) : null,
    processed: fileTransferData.processed ? (
      <Icon
        className="text-green-500"
        iconName="checkmark_circle"
        color="currentColor"
      />
    ) : (
      <Icon
        className="text-yellow-300"
        iconName="remove_circle"
        color="currentColor"
      />
    ),
    organization: orgName,
    receipt: fileTransferData.receipt ? (
      <ReactJson
        src={JSON.parse(fileTransferData.receipt) as Record<string, unknown>}
        name={null}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    ) : null,
    extra:
      fileTransferData.extra === "{}" ? (
        fileTransferData.extra
      ) : (
        <ReactJson
          src={JSON.parse(fileTransferData.extra) as Record<string, unknown>}
          name={null}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      ),
    // do the copyable text ourselves, otherwise KeyValueTable will render as a link
    fileName: (
      <CopyableText text={fileTransferData.fileName}>
        {fileTransferData.fileName}
      </CopyableText>
    ),
  };
}

function AdminFileTransferDetailsView({
  fileTransferId,
  organizationId,
}: FileTransferDetailsViewProps) {
  const { loading, data } = useAdminFileTransferDetailsViewQuery({
    variables: { fileTransferId, organizationId },
  });
  const { data: orgData, loading: orgLoading } = useAdminOrganizationViewQuery({
    variables: { organizationId },
  });
  const organization = orgData?.organization;
  const fileTransfer = data?.fileTransfer;
  return loading || orgLoading || !fileTransfer || !organization ? (
    <div className="mt-4">
      <KeyValueTableSkeletonLoader dataMapping={MAPPING} />
    </div>
  ) : (
    <KeyValueTable
      key={fileTransferId}
      data={formatFileTransfer(fileTransfer, organization.name)}
      dataMapping={MAPPING}
      copyableData={["id", "filePath", "batchId"]}
    />
  );
}

export default AdminFileTransferDetailsView;

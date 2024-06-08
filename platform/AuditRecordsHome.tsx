import React from "react";
import { useAuditRecordsHomeQuery } from "../../generated/dashboard/graphqlSchema";
import EntityTableView, { INITIAL_PAGINATION } from "./EntityTableView";
import { CursorPaginationInput } from "../types/CursorPaginationInput";
import { DateTime } from "../../common/ui-components";
import { ExportDataParams } from "./ExportDataButton";
import AuditRecordView from "../containers/AuditRecordView";
import { AUDIT_RECORD } from "../../generated/dashboard/types/resources";
import ArchivedRecordsBanner from "./exporting/ArchivedRecordsBanner";

interface AuditRecordsHomeProps {
  title?: string;
  hideHeadline?: boolean;
  showIP?: boolean;
  hideSource?: boolean;
  hideLinks?: boolean;
  showDisabledPagination?: boolean;
  perPage?: number;
  queryArgs: {
    entityId?: string;
    entityType?: string;
    actorId?: string;
    actorType?: string;
    eventName?: string;
    includeAssociations?: boolean;
    includeAdminActions?: boolean;
  };
}

function AuditRecordsHome({
  title,
  hideHeadline,
  showIP,
  hideSource,
  hideLinks,
  showDisabledPagination = true,
  perPage,
  queryArgs,
}: AuditRecordsHomeProps) {
  const { loading, data, error, refetch } = useAuditRecordsHomeQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: perPage ?? INITIAL_PAGINATION.perPage,
      ...queryArgs,
    },
  });

  const exportDataParams: ExportDataParams = {
    params: {
      entity_id: queryArgs.entityId,
      entity_type: queryArgs.entityType,
      actor_id: queryArgs.actorId,
      actor_type: queryArgs.actorType,
      event_name: queryArgs.eventName,
    },
  };

  const auditRecords =
    loading || !data || error
      ? []
      : data.auditRecords.edges.map(({ node }) => ({
          ...node,
          source: node.actorName,
          eventTime: <DateTime timestamp={node.eventTime} />,
        }));

  const handleRefetch = async (options: {
    cursorPaginationParams: CursorPaginationInput;
  }) => {
    const { cursorPaginationParams } = options;
    await refetch({
      ...cursorPaginationParams,
    });
  };

  return (
    <div>
      {!loading && data?.relatedRecordsAreArchived && (
        <ArchivedRecordsBanner
          className="mb-4"
          liveMode={!!data?.currentOrganization.currentLiveMode}
          resourceType="AuditRecord"
        />
      )}
      <EntityTableView
        data={auditRecords}
        title={hideHeadline ? undefined : title ?? "Audit Trail"}
        dataMapping={{
          prettyEventName: "Event",
          eventTime: "Time",
          ...(hideSource ? {} : { source: "Source" }),
          ...(showIP
            ? { ipAddress: "IP Address", geoLocation: "Location" }
            : {}),
        }}
        loading={loading}
        onQueryArgChange={handleRefetch}
        cursorPagination={data?.auditRecords?.pageInfo}
        defaultPerPage={perPage}
        showDisabledPagination={showDisabledPagination}
        resource={AUDIT_RECORD}
        enableExportData={!hideLinks && !data?.relatedRecordsAreArchived}
        exportDataParams={exportDataParams}
        renderDrawerContent={(_, id) => (
          <AuditRecordView
            match={{
              params: {
                auditRecordId: id,
              },
            }}
          />
        )}
        disableMetadata
      />
    </div>
  );
}

export default AuditRecordsHome;

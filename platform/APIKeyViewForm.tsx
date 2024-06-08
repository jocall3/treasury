import React from "react";
import {
  ApiKeyViewQuery,
  SafeInternalAccount,
  Permission,
} from "../../generated/dashboard/graphqlSchema";
import {
  CopyableText,
  DateTime,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../common/ui-components";
import APIKeySecret from "./APIKeySecret";
import { APIKeyRolesForm } from "./APIKeyRolesForm";
import PermissionsTable from "../containers/user_management/PermissionsTable";

interface APIKeyViewFormProps {
  apiKey?: ApiKeyViewQuery["apiKey"];
  onShowApiKeySecret: (id: string) => void;
  loading: boolean;
  apiKeyMapping: Record<string, string>;
  roles: Array<string>;
  internalAccounts: SafeInternalAccount[];
  fullApiKey?: string | null;
  permissions?: Permission[];
  showPermissions?: boolean;
}

function formatAPIKey(
  apiKey: ApiKeyViewQuery["apiKey"],
  onShowKeySecret: (id: string) => void,
  keySecretLoading: boolean,
  fullApiKey?: string | null
) {
  // Using the generated graphql type is convenient, but it can evaluate to null.
  // This function should never get called with a null apiKey.
  if (!apiKey) {
    return {};
  }
  return {
    ...apiKey,
    createdAtPrettyTime: <DateTime timestamp={apiKey.createdAt} />,
    decommissionedAtPrettyTime: apiKey.decommissionedAt ? (
      <DateTime timestamp={apiKey.decommissionedAt} />
    ) : null,
    liveMode: apiKey.liveMode ? "True" : "False",
    creator: apiKey.creator ? (
      <a href={apiKey.creator.path}>{apiKey.creator.name}</a>
    ) : (
      "Default"
    ),
    prettyIpAllowlist:
      apiKey.ipAllowlist && apiKey.ipAllowlist.length > 0 ? (
        apiKey.ipAllowlist.join(", ")
      ) : (
        <span className="text font-italic">All IP Addresses</span>
      ),
    secret: (
      <APIKeySecret
        key={apiKey.id}
        secret={fullApiKey || apiKey.keySecret}
        onShowApiKeySecret={() => onShowKeySecret(apiKey.id)}
        loading={keySecretLoading}
      />
    ),
    organizationId: (
      <CopyableText text={apiKey.organizationId}>
        <code>{apiKey.organizationId}</code>
      </CopyableText>
    ),
    rateLimit: <span>{apiKey.rateLimit} requests per second</span>,
  };
}

export default function APIKeyViewForm({
  apiKey,
  onShowApiKeySecret,
  loading,
  apiKeyMapping,
  roles,
  internalAccounts,
  fullApiKey,
  permissions,
  showPermissions,
}: APIKeyViewFormProps) {
  return (
    <>
      <div>
        {!apiKey && <KeyValueTableSkeletonLoader dataMapping={apiKeyMapping} />}
        {!!apiKey && (
          <>
            {apiKey.default && (
              <div className="mb-6 mt-4 text-xs">
                This is a default API key. Permissions for new products will be
                automatically added to this key.
              </div>
            )}
            <KeyValueTable
              data={formatAPIKey(
                apiKey,
                onShowApiKeySecret,
                loading,
                fullApiKey
              )}
              dataMapping={apiKeyMapping}
            />
          </>
        )}
      </div>

      {showPermissions ? (
        <>
          <h1 className="h1 mb-4 mt-8">Permissions</h1>
          <PermissionsTable permissions={permissions || []} />
        </>
      ) : (
        <div className="mt-8">
          <APIKeyRolesForm
            roles={roles ?? []}
            internalAccounts={internalAccounts}
            enabled={false}
          />
        </div>
      )}
    </>
  );
}

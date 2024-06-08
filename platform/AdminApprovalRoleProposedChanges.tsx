import React from "react";
import TruncateString from "react-truncate-string";
import ReactTooltip from "react-tooltip";
import {
  ProposedChange,
  Group,
  SafeInternalAccount,
} from "~/generated/dashboard/graphqlSchema";
import { KeyValueTable, Icon } from "~/common/ui-components";
import {
  ROLE_ORGANIZATION_MAPPING,
  ROLE_DEVELOPER_MAPPING,
  ROLE_COUNTERPARTY_MAPPING,
  ROLE_EXTERNAL_ACCOUNT_MAPPING,
  ROLE_LEDGER_MAPPING,
  ACCOUNT_PERMISSIONS_MAPPING,
  ROLE_COMPLIANCE_MAPPING,
  ROLE_PARTNER_SEARCH_MAPPING,
  ROLE_API_KEYS_MAPPING,
  ROLE_CUSTOMER_ADMIN_TOOLS_MAPPING,
  ROLE_PARTNER_ADMIN_TOOLS_MAPPING,
  ROLE_ENGINEERING_DEBUG_TOOLS_MAPPING,
  PER_ACCOUNT_PERMISSIONS_MAPPING,
} from "~/app/constants/index";
import { renderPermission } from "../containers/groups/renderPermission";

const TABLE_MAPPING = {
  customer_admin_tools: "Customer Admin Tools",
  partner_admin_tools: "Partner Admin Tools",
  engineering_debug_tools: "Engineering Debug Tools",
  organization: "Organization",
  developer: "Developer Settings",
  api_keys: "API Keys",
  ledgers: "Ledgers",
  compliance: "Compliance",
  partner_search: "Partner Search",
  external_accounts: "External Accounts",
  counterparties: "Counterparties",
  accounts: "Accounts",
};

const ROLE_MAPPING = {
  ...ROLE_CUSTOMER_ADMIN_TOOLS_MAPPING,
  ...ROLE_PARTNER_ADMIN_TOOLS_MAPPING,
  ...ROLE_ENGINEERING_DEBUG_TOOLS_MAPPING,
  ...ROLE_ORGANIZATION_MAPPING,
  ...ROLE_DEVELOPER_MAPPING,
  ...ROLE_COUNTERPARTY_MAPPING,
  ...ROLE_EXTERNAL_ACCOUNT_MAPPING,
  ...ROLE_LEDGER_MAPPING,
  ...ACCOUNT_PERMISSIONS_MAPPING,
  ...ROLE_COMPLIANCE_MAPPING,
  ...ROLE_PARTNER_SEARCH_MAPPING,
  ...ROLE_API_KEYS_MAPPING,
};

const NO_ACCOUNT_ACCESS = "accounts:none";
const PARTIAL_ACCOUNT_ACCESS = "accounts:partial";

const isAccountPermission = (permission: string) =>
  permission.startsWith("accounts") && permission.split(":").length > 2;

const getOverallAccountPermission = (
  permission: string,
  permissions: string[]
) => {
  if (permissions?.some(isAccountPermission)) {
    return PARTIAL_ACCOUNT_ACCESS;
  }
  return permission;
};

function getRoleRows(
  currentPermissions: string[],
  proposedPermissions: string[]
) {
  const dataMapping: Record<string, string> = {};
  const rows = Object.keys(TABLE_MAPPING).reduce((acc, permissionType) => {
    let currentPermission =
      currentPermissions.find((p) => p.startsWith(permissionType)) ||
      `${permissionType}:none`;
    let proposedPermission =
      proposedPermissions.find((p) => p.startsWith(permissionType)) ||
      `${permissionType}:none`;

    if (permissionType === "accounts") {
      currentPermission = getOverallAccountPermission(
        currentPermission,
        currentPermissions
      );
      proposedPermission = getOverallAccountPermission(
        proposedPermission,
        proposedPermissions
      );
    }

    if (currentPermission === proposedPermission) {
      return acc;
    }

    dataMapping[permissionType] = TABLE_MAPPING[permissionType] as string;

    return {
      ...acc,
      [permissionType]: (
        <div className="flex items-center gap-2">
          <span className="hidden gap-2 mint-2xl:flex mint-2xl:items-center">
            {renderPermission(ROLE_MAPPING[currentPermission])}
            <Icon iconName="arrow_forward" size="s" />
          </span>
          {renderPermission(ROLE_MAPPING[proposedPermission])}
        </div>
      ),
    };
  }, {});
  return [rows, dataMapping];
}

function getPerAccountRows(
  currentPermissions: string[],
  proposedPermissions: string[],
  accounts?: SafeInternalAccount[]
) {
  if (!accounts) {
    return [];
  }
  const currentAccountPermissions =
    currentPermissions.filter(isAccountPermission);
  const proposedAccountPermissions =
    proposedPermissions.filter(isAccountPermission);

  if (!currentAccountPermissions && !proposedAccountPermissions) {
    return [];
  }

  const accountIds = new Set([
    ...currentAccountPermissions.map((acc) => acc.split(":")[2]),
    ...proposedAccountPermissions.map((acc) => acc.split(":")[2]),
  ]);
  const accountMapping = {};
  const accountRows = {};
  accountIds.forEach((id) => {
    const current = currentAccountPermissions.find(
      (acc) => acc.split(":")[2] === id
    );
    const proposed = proposedAccountPermissions.find(
      (acc) => acc.split(":")[2] === id
    );

    const currPermission =
      current?.split(":").slice(0, -1).join(":") || NO_ACCOUNT_ACCESS;
    const propPermission =
      proposed?.split(":").slice(0, -1).join(":") || NO_ACCOUNT_ACCESS;

    if (currPermission !== propPermission) {
      const accountName = accounts.find((a) => a.id === id)?.longName;

      accountRows[id] = (
        <div className="flex items-center gap-2">
          <span className="hidden gap-2 mint-2xl:flex mint-2xl:items-center">
            {renderPermission(PER_ACCOUNT_PERMISSIONS_MAPPING[currPermission])}
            <Icon iconName="arrow_forward" size="s" />
          </span>
          {renderPermission(PER_ACCOUNT_PERMISSIONS_MAPPING[propPermission])}
        </div>
      );
      accountMapping[id] = (
        <>
          <div data-tip={accountName}>
            <TruncateString text={accountName} />
          </div>
          <ReactTooltip
            className="break-word max-w-md"
            data-place="top"
            data-effect="float"
            multiline
          />
        </>
      );
    }
  });

  return [accountRows, accountMapping];
}

function AdminApprovalRoleProposedChanges({
  proposedChange,
  group,
  accounts,
}: {
  proposedChange: ProposedChange | undefined;
  group: Group;
  accounts: SafeInternalAccount[] | undefined;
}) {
  const currentPermissions = group?.deprecatedRoles || [];
  const proposedPermissions = proposedChange?.proposedPermissions || [];

  if (!currentPermissions.length && !proposedPermissions.length) {
    return null;
  }

  const [rows, dataMapping] = getRoleRows(
    currentPermissions,
    proposedPermissions
  );

  const [accountRows, accountMapping] = getPerAccountRows(
    currentPermissions,
    proposedPermissions,
    accounts
  );

  return (
    <div className="space-y-8">
      {rows && Object.keys(rows).length > 0 && (
        <div className="mt-2">
          <KeyValueTable data={rows} dataMapping={dataMapping} />
        </div>
      )}
      {accountRows && Object.keys(accountRows).length > 0 && (
        <div>
          Per-Account Permissions ({Object.keys(accountRows).length})
          <div className="my-2 max-h-96 overflow-auto rounded border border-gray-100 p-4">
            <KeyValueTable data={accountRows} dataMapping={accountMapping} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApprovalRoleProposedChanges;

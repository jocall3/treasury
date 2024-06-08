import React, { Dispatch, ReactNode, SetStateAction } from "react";
import filter from "lodash/filter";
import ReactTooltip from "react-tooltip";
import PermissionSelector from "../containers/roles/PermissionSelector";
import {
  ROLE_DEVELOPER_OPTIONS,
  ROLE_COUNTERPARTY_OPTIONS,
  ROLE_LEDGER_OPTIONS,
  ROLE_EXTERNAL_ACCOUNT_API_OPTIONS,
  ROLE_COMPLIANCE_API_OPTIONS,
} from "../constants/index";

import AccountPermissionsTable from "../containers/roles/AccountPermissionsTable";
import {
  SafeInternalAccount,
  useActiveComplianceQuery,
} from "../../generated/dashboard/graphqlSchema";

export function APIKeyRolesForm({
  roles,
  setRoles,
  enabled,
  internalAccounts,
  children,
}: {
  roles: string[];
  setRoles?: Dispatch<SetStateAction<string[]>>;
  enabled: boolean;
  internalAccounts: SafeInternalAccount[];
  children?: ReactNode;
}) {
  const counterpartiesRole = roles.find((r) => r.includes("counterparties"));
  const developersRole = roles.find((r) => r.includes("developer"));
  const ledgersRole = roles.find((r) => r.includes("ledgers"));
  const externalAccountsRole = roles.find((r) =>
    r.includes("external_accounts")
  );
  const complianceRole = roles.find((r) => r.includes("compliance"));

  const { data: activeComplianceData } = useActiveComplianceQuery();
  const activeCompliance = activeComplianceData?.products.totalCount === 1;

  function onRoleSelect(prefix: string, newRole: string) {
    if (!setRoles) {
      return;
    }

    setRoles(() => {
      const filteredRoles = filter(roles, (id) => !id.includes(prefix));
      return [...filteredRoles, newRole];
    });
  }

  function onAccountPermissionSelect(newRole: string) {
    if (!setRoles) {
      return;
    }

    const parts = newRole.split(":");

    let newRoles = [...roles];

    setRoles(() => {
      if (
        ["accounts:none", "accounts:read", "accounts:manage"].includes(newRole)
      ) {
        newRoles = newRoles.filter((role) => !role.startsWith("accounts:"));
      } else if (newRole === "accounts:partial") {
        // clear previous global account permissions, retain any account specific roles
        newRoles = newRoles.filter(
          (role) =>
            !(role.startsWith("accounts:") && role.split(":").length === 2)
        );
      } else {
        // remove old account specific permission
        newRoles = newRoles.filter((role) => !role.includes(parts[2]));
      }
      return [...newRoles, newRole];
    });
  }

  return (
    <div className="form-section">
      <h3 className="h3-no-bottom-border">
        <span>Permissions</span>
        {children}
      </h3>
      <ReactTooltip
        multiline
        data-place="top"
        data-type="dark"
        data-effect="float"
      />
      <div className="index-table table-permissions table w-full">
        <div className="table-body">
          <PermissionSelector
            role={counterpartiesRole || "counterparties:none"}
            onRoleSelect={(value: string) =>
              onRoleSelect("counterparties", value)
            }
            options={ROLE_COUNTERPARTY_OPTIONS}
            title="Counterparties"
            tooltipHint="Retrieve counterparties."
            select={{
              placeholder: "Counterparty Permissions",
              name: "counterparties-permission-select",
            }}
            editable={enabled}
          />
          <PermissionSelector
            role={externalAccountsRole || "external_accounts:none"}
            onRoleSelect={(value: string) =>
              onRoleSelect("external_accounts", value)
            }
            options={ROLE_EXTERNAL_ACCOUNT_API_OPTIONS}
            title="External Accounts"
            tooltipHint="Retrieve external accounts."
            select={{
              placeholder: "External Account Permissions",
              name: "external-account-permission-select",
            }}
            editable={enabled}
          />
          <PermissionSelector
            role={developersRole || "developer:none"}
            onRoleSelect={(value: string) => onRoleSelect("developer", value)}
            options={ROLE_DEVELOPER_OPTIONS}
            title="Developer Resources"
            tooltipHint="Retrieve events, view and edit webhook endpoints, and create webhook events"
            select={{
              placeholder: "Developer Permissions",
              name: "developer-permission-select",
            }}
            editable={enabled}
          />
          <AccountPermissionsTable
            roles={roles}
            onAccountRoleSelect={onAccountPermissionSelect}
            internalAccounts={internalAccounts}
            canEditGroup={enabled}
          />
          <PermissionSelector
            role={ledgersRole || "ledgers:none"}
            onRoleSelect={(value: string) => onRoleSelect("ledgers", value)}
            options={ROLE_LEDGER_OPTIONS}
            title="Ledgers"
            tooltipHint="View and edit ledgers data."
            select={{
              placeholder: "Ledgers Permissions",
              name: "ledgers-permission-select",
            }}
            editable={enabled}
          />
          {activeCompliance && (
            <PermissionSelector
              role={complianceRole || "compliance:none"}
              onRoleSelect={(value: string) =>
                onRoleSelect("compliance", value)
              }
              options={ROLE_COMPLIANCE_API_OPTIONS}
              title="Compliance Resources"
              tooltipHint="Access Compliance endpoints such as User Onboardings, Decisions, and more."
              select={{
                placeholder: "Compliance Permissions",
                name: "compliance-permission-select",
              }}
              editable={enabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

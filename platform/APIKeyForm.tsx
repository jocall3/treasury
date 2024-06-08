import React, { useState } from "react";
import { APIKeyRolesForm } from "./APIKeyRolesForm";
import { IPAllowlistForm } from "./IPAllowlistForm";
import ReduxInputField from "../../common/deprecated_redux/ReduxInputField";
import { Button } from "../../common/ui-components";
import { ApiKeyFormQuery } from "../../generated/dashboard/graphqlSchema";

function APIKeyForm({
  id,
  internalAccounts,
  ipAllowlist: initialIpAllowlist,
  roles: initialRoles,
  name: initialName,
  onSubmit,
}: {
  id?: string;
  internalAccounts: Pick<
    ApiKeyFormQuery["internalAccountsUnpaginated"][0],
    "id" | "longName"
  >[];
  ipAllowlist?: string[] | null;
  roles?: string[];
  name?: string;
  onSubmit: ({ name, roles, ipAllowlist }) => void;
}) {
  const [ipAllowlist, setIpAllowlist] = useState(initialIpAllowlist || []);
  const [roles, setRoles] = useState(initialRoles || []);
  const [name, setName] = useState(initialName || "");

  const updating = !!id;

  return (
    <div>
      <div className="form-row flex">
        <ReduxInputField
          input={{
            onChange: (e) => setName(e.target.value),
            value: name,
            name: "name",
          }}
          type="text"
          label="Name"
        />
      </div>

      <div className="form-section">
        <IPAllowlistForm
          ipAllowlist={ipAllowlist}
          setIpAllowlist={setIpAllowlist}
          enabled
        />
      </div>
      <div className="form-section">
        <APIKeyRolesForm
          roles={roles}
          setRoles={setRoles}
          internalAccounts={internalAccounts}
          enabled={!updating}
        >
          <div className="header-hint">
            You cannot edit the permissions assigned to a key once it has been
            created.
            {updating && (
              <div>
                If you need different permissions, create a new API key.
              </div>
            )}
          </div>
        </APIKeyRolesForm>
      </div>

      <div className="form-group">
        <Button
          buttonType="primary"
          onClick={() =>
            onSubmit({
              name,
              roles,
              ipAllowlist,
            })
          }
        >
          {updating ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default APIKeyForm;

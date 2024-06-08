import React from "react";
import ReactTooltip from "react-tooltip";
import { Button } from "../../common/ui-components";

interface EnableScimOrganizationButtonProps {
  domainName: string;
  scimEnabled: boolean;
  onClick: () => void;
}

function EnableScimOrganizationButton({
  domainName,
  scimEnabled,
  onClick,
}: EnableScimOrganizationButtonProps) {
  return (
    <>
      {scimEnabled && (
        <Button buttonType="primary" disabled>
          SCIM Enabled for this Organization
        </Button>
      )}
      {!scimEnabled && (
        <Button buttonType="primary" disabled={!domainName} onClick={onClick}>
          {!domainName ? (
            <span data-tip="Organization domain is required to enable SCIM">
              Enable SCIM for this Organization
              <ReactTooltip className="whitespace-pre-wrap" multiline />
            </span>
          ) : (
            "Enable SCIM for this Organization"
          )}
        </Button>
      )}
    </>
  );
}

export default EnableScimOrganizationButton;

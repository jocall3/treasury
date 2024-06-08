import React from "react";
import InternalToolsToggle from "~/app/containers/InternalToolsToggle";
import { Button, Icon, Stack } from "~/common/ui-components";

export interface InternalToolsSectionProps {
  onClickGhostLogout: () => void;
  collapsed: boolean;
}

export default function InternalToolsSection({
  onClickGhostLogout,
  collapsed,
}: InternalToolsSectionProps) {
  return (
    <Stack className="mb-2 gap-1">
      {collapsed ? (
        <Button iconOnly buttonType="destructive" onClick={onClickGhostLogout}>
          <Icon iconName="undo" color="currentColor" className="text-white" />
        </Button>
      ) : (
        <Button
          className="!rounded"
          fullWidth
          buttonType="destructive"
          onClick={onClickGhostLogout}
        >
          Stop Customer View
        </Button>
      )}

      <InternalToolsToggle collapsed={collapsed} />
    </Stack>
  );
}

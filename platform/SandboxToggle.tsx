import React from "react";
import { cn } from "~/common/utilities/cn";
import { useReadLiveMode } from "~/common/utilities/useReadLiveMode";
import { Clickable, Icon } from "../../../common/ui-components";

type SandboxToggleProps = {
  isOrganizationLive: boolean;
  toggleLiveMode: () => void;
  visitGoLive: () => void;
  collapsed?: boolean;
  setCollapsedPreviewSection: (section: string | null) => void;
};

function SandboxText({
  isLiveMode,
  collapsed,
}: {
  isLiveMode: boolean;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return null;
  }
  return isLiveMode ? (
    <span className="pl-2">View Sandbox</span>
  ) : (
    <span className="pl-2">Viewing Sandbox</span>
  );
}

function SandboxToggle({
  isOrganizationLive,
  toggleLiveMode,
  visitGoLive,
  collapsed,
  setCollapsedPreviewSection,
}: SandboxToggleProps) {
  const isLiveMode = useReadLiveMode();
  return (
    <Clickable onClick={isOrganizationLive ? toggleLiveMode : visitGoLive}>
      <div
        className="flex rounded px-2 py-1.5 hover:bg-mist-700"
        onMouseEnter={() => {
          if (collapsed) {
            setCollapsedPreviewSection(null);
          }
        }}
      >
        <div
          id="live-mode-toggle"
          className={cn(
            "flex items-center",
            isLiveMode ? "text-gray-200" : "text-orange-300a"
          )}
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <Icon
              className={cn(isLiveMode ? "text-gray-200" : "text-orange-300a")}
              color="currentColor"
              iconName={isLiveMode ? "toggle_off" : "toggle_on"}
              size="s"
            />
          </div>
          <SandboxText isLiveMode={isLiveMode} collapsed={collapsed} />
        </div>
      </div>
    </Clickable>
  );
}

export default SandboxToggle;

import React from "react";
import {
  ButtonClickEventTypes,
  Clickable,
  Icon,
  Stack,
} from "~/common/ui-components";
import { useHandleLinkClick } from "~/common/utilities/handleLinkClick";
import { cn } from "~/common/utilities/cn";
import NavigationLink, { LinkType } from "../NavigationLink";
import NavigationBarLayout from "./NavigationBarLayout";
import SandboxToggle from "./SandboxToggle";
import { visitGoLive } from "./RootNavigationMenu";
import SpaceBetweenContainer from "./SpaceBetweenContainer";
import InternalToolsSection from "./InternalToolsSection";

interface SettingsNavigationMenuProps {
  organizationName: string;
  navigationLinks: {
    settings_links: Array<LinkType>;
  };
  isOrganizationLive: boolean;
  toggleLiveMode: () => void;
  isGhosting: boolean;
  onGhostLogoutClick: () => void;
  collapsed: boolean;
  setCollapsedPreviewSection: (section: string | null) => void;
  collapsedPreviewSection: string | null;
}

function SettingsNavigationMenu(props: SettingsNavigationMenuProps) {
  const {
    organizationName,
    navigationLinks: { settings_links: settingsLinks },
    isOrganizationLive,
    toggleLiveMode,
    isGhosting,
    onGhostLogoutClick,
    collapsed,
    setCollapsedPreviewSection,
    collapsedPreviewSection,
  } = props;
  const handleLinkClick = useHandleLinkClick();

  const clearAndSetNavBar = (e: ButtonClickEventTypes) => {
    setCollapsedPreviewSection(null);
    handleLinkClick("/", e);
  };

  return (
    <NavigationBarLayout
      header={
        collapsed ? (
          <div className="px-1">
            <Clickable onClick={clearAndSetNavBar}>
              <div className="mb-2 mt-4 flex w-full justify-center rounded-md pb-2 pt-2 transition-colors duration-150 ease-in-out hover:bg-gray-800">
                <Icon
                  className="text-gray-200"
                  iconName="chevron_left"
                  color="currentColor"
                  size="l"
                />
              </div>
            </Clickable>
          </div>
        ) : (
          <div className="pb-2 pt-4">
            <div className="flex">
              <div className="flex w-[220px] flex-col whitespace-nowrap">
                <div className="organization-name text-left text-xs">
                  <button
                    type="button"
                    onClick={clearAndSetNavBar}
                    className="w-50"
                  >
                    <div className="flex items-center pl-2">
                      <Icon
                        className="text-gray-400"
                        iconName="chevron_left"
                        size="s"
                        color="currentColor"
                      />
                      <span className="overflow-hidden overflow-ellipsis whitespace-nowrap pl-1 font-medium text-gray-300">
                        {organizationName}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="pl-3 text-base font-medium text-gray-50a">
              Settings
            </div>
          </div>
        )
      }
    >
      <SpaceBetweenContainer
        mainContent={
          <Stack className="navbar-mouseleave-target gap-1 pt-2">
            {isGhosting ? (
              <InternalToolsSection
                onClickGhostLogout={onGhostLogoutClick}
                collapsed={collapsed}
              />
            ) : null}
            <Stack
              className={cn(
                "navbar-mouseleave-target",
                collapsed ? "gap-1" : "gap-6"
              )}
            >
              {settingsLinks.map((link) => (
                <Stack className="gap-1" key={link.path}>
                  <NavigationLink
                    key={link.text}
                    link={link}
                    alwaysExpanded
                    collapsed={collapsed}
                    srOnly={collapsed}
                    setCollapsedPreviewSection={setCollapsedPreviewSection}
                    collapsedPreviewSection={collapsedPreviewSection}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        }
        bottomContent={
          <SandboxToggle
            isOrganizationLive={isOrganizationLive}
            toggleLiveMode={toggleLiveMode}
            visitGoLive={visitGoLive}
            collapsed={collapsed}
            setCollapsedPreviewSection={setCollapsedPreviewSection}
          />
        }
      />
    </NavigationBarLayout>
  );
}

export default SettingsNavigationMenu;

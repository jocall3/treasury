import React from "react";
import { cn } from "~/common/utilities/cn";
import NavigationLink from "../NavigationLink";
import OrgSwitcher from "../OrgSwitcher";
import {
  Icon,
  Popover,
  PopoverPanel,
  PopoverTrigger,
  Stack,
} from "../../../common/ui-components";
import Gon from "../../../common/utilities/gon";
import QuickSwitchNavigationLink from "../../containers/quick_switch/QuickSwitchNavigationLink";
import SandboxToggle from "./SandboxToggle";
import SpaceBetweenContainer from "./SpaceBetweenContainer";
import NavigationBarLayout from "./NavigationBarLayout";
import InternalToolsSection from "./InternalToolsSection";

export function visitGoLive() {
  window.location.href = "/partner_searches/new?newnav=true";
}

function RootNavigationMenu({
  collapsed,
  organizationName,
  navigationLinks,
  setNavBar,
  isGhosting,
  onGhostLogoutClick,
  setCollapsedPreviewSection,
  collapsedPreviewSection,
  ...props
}) {
  const {
    ui: { userEmail },
  } = Gon.gon;
  const {
    primary_links: primaryLinks,
    tools_links: toolsLinks,
    additional_links: additionalLinks,
    products_links: productsLinks,
    footer_links: footerLinks,
  } = navigationLinks;

  // Used to build the org icon in the sidebar when collapsed
  const shortname = organizationName.substring(0, 2);

  return (
    <NavigationBarLayout
      header={
        <Popover>
          <div className="flex">
            <PopoverTrigger
              as="div"
              className={cn(
                "flex w-full cursor-pointer items-center justify-center",
                !collapsed &&
                  "mx-1 mb-2 mt-4 h-10 justify-between rounded-md hover:bg-gray-800 active:bg-gray-700",
                collapsed && "h-16 !px-0.5"
              )}
              role="button"
              id="headlessui-popover-button-1"
            >
              {collapsed ? (
                <div className="pt-2.5">
                  <div className="flex items-start justify-between gap-1 rounded-md px-0.5 py-2 hover:bg-gray-800 active:bg-gray-700">
                    <div className="flex w-8 justify-center rounded-[3px] bg-white px-1 py-2 text-center text-xxs font-medium uppercase">
                      {shortname}
                    </div>
                    <div className="sr-only">{organizationName}</div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between gap-1 rounded-md px-2 py-1.5 hover:bg-gray-800 active:bg-gray-700">
                  <div className="flex max-w-[172px] flex-col gap-0.5 whitespace-nowrap">
                    <div className="organization-name overflow-hidden overflow-ellipsis whitespace-nowrap text-left text-sm font-medium text-gray-50a">
                      {organizationName}
                    </div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-left text-xs font-medium text-gray-300">
                      {userEmail}
                    </div>
                  </div>
                  <Icon
                    className="shrink-0 text-gray-400"
                    iconName="expand_all"
                    color="currentColor"
                    size="m"
                  />
                </div>
              )}
            </PopoverTrigger>
          </div>
          <PopoverPanel className="!mt-1 !border-none !bg-transparent !py-0">
            {({ close }) => <OrgSwitcher onClose={close} />}
          </PopoverPanel>
        </Popover>
      }
    >
      <SpaceBetweenContainer
        mainContent={
          <Stack
            id="application-sidebar-products"
            className={cn(
              "navbar-mouseleave-target gap-8 pt-2",
              collapsed && "w-fit"
            )}
          >
            <Stack
              className={cn(
                "navbar-mouseleave-target gap-1",
                collapsed && "w-fit"
              )}
            >
              {isGhosting ? (
                <InternalToolsSection
                  onClickGhostLogout={onGhostLogoutClick}
                  collapsed={collapsed}
                />
              ) : null}
              <NavigationLink
                srOnly={collapsed}
                collapsed={collapsed}
                key="Home"
                link={{
                  text: "Home",
                  icon: "mt_home",
                  path: "/",
                }}
                alwaysExpanded={false}
                setCollapsedPreviewSection={setCollapsedPreviewSection}
                collapsedPreviewSection={collapsedPreviewSection}
              />
              <QuickSwitchNavigationLink
                key="quickSwitch"
                defaultFocus
                collapsed={collapsed}
                srOnly={collapsed}
                setCollapsedPreviewSection={setCollapsedPreviewSection}
                collapsedPreviewSection={collapsedPreviewSection}
              />
              {primaryLinks.map((l) => (
                <NavigationLink
                  srOnly={collapsed}
                  collapsed={collapsed}
                  link={l}
                  alwaysExpanded={false}
                  setCollapsedPreviewSection={setCollapsedPreviewSection}
                  collapsedPreviewSection={collapsedPreviewSection}
                />
              ))}
            </Stack>
            <Stack
              className={cn(
                "navbar-mouseleave-target gap-1",
                collapsed && "w-fit"
              )}
            >
              {productsLinks.map((l) => (
                <NavigationLink
                  collapsed={collapsed}
                  srOnly={collapsed}
                  key={l.text}
                  link={l}
                  alwaysExpanded={false}
                  setCollapsedPreviewSection={setCollapsedPreviewSection}
                  collapsedPreviewSection={collapsedPreviewSection}
                />
              ))}

              {toolsLinks.map((t) => (
                <NavigationLink
                  srOnly={collapsed}
                  collapsed={collapsed}
                  key={t.text}
                  link={t}
                  alwaysExpanded={false}
                  setCollapsedPreviewSection={setCollapsedPreviewSection}
                  collapsedPreviewSection={collapsedPreviewSection}
                />
              ))}
            </Stack>
            <Stack className={cn("gap-1", collapsed && "w-fit")}>
              <SandboxToggle
                {...props}
                visitGoLive={visitGoLive}
                collapsed={collapsed}
                srOnly={collapsed}
                setCollapsedPreviewSection={setCollapsedPreviewSection}
              />
              {additionalLinks.map((l) => (
                <NavigationLink
                  srOnly={collapsed}
                  collapsed={collapsed}
                  key={l.text}
                  link={l}
                  alwaysExpanded={false}
                  setCollapsedPreviewSection={setCollapsedPreviewSection}
                  collapsedPreviewSection={collapsedPreviewSection}
                />
              ))}
            </Stack>
          </Stack>
        }
        bottomContent={
          <Stack className={cn("gap-1", collapsed && "w-fit")}>
            {footerLinks.map((l) => (
              <NavigationLink
                srOnly={collapsed}
                collapsed={collapsed}
                key={l.text}
                link={l}
                alwaysExpanded={false}
                setCollapsedPreviewSection={setCollapsedPreviewSection}
                collapsedPreviewSection={collapsedPreviewSection}
              />
            ))}
          </Stack>
        }
      />
    </NavigationBarLayout>
  );
}

export default RootNavigationMenu;

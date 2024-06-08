import React from "react";

interface SettingsNavigationMenuProps {
  mainContent: JSX.Element | Array<JSX.Element>;
  bottomContent: JSX.Element;
}

function SpaceBetweenContainer({
  mainContent,
  bottomContent,
}: SettingsNavigationMenuProps) {
  return (
    <div className="no-scrollbar navbar-mouseleave-target flex h-full w-full grow flex-col justify-between gap-4 overflow-y-auto pb-6 pt-2">
      <div className="navbar-mouseleave-target flex-grow">{mainContent}</div>
      <div>{bottomContent}</div>
    </div>
  );
}

export default SpaceBetweenContainer;

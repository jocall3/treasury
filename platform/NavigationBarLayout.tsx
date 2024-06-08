import React, { ReactNode } from "react";

interface NavigationBarProps {
  header: ReactNode;
  children: ReactNode;
}
function NavigationBarLayout({ header, children }: NavigationBarProps) {
  return (
    <div className="no-scrollbar flex h-full w-full flex-col justify-between text-sm">
      <div>{header}</div>
      <div className="no-scrollbar flex w-full grow overflow-y-auto pr-1">
        {/* Replaces 1px padding with an empty div. This acts as a target to check if the user's mouse
        enters this area. We use it to close the popover when the navbar is collapsed */}
        <div className="navbar-mouseleave-target flex h-full w-1" />
        {children}
      </div>
    </div>
  );
}

export default NavigationBarLayout;

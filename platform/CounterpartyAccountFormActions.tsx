import React from "react";

import {
  ActionItem,
  Icon,
  Popover,
  PopoverPanel,
  PopoverTrigger,
} from "../../common/ui-components";

function CounterpartyAccountFormActions({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Icon iconName="more_horizontal" />
      </PopoverTrigger>
      <PopoverPanel anchorOrigin={{ horizontal: "right" }}>
        <ActionItem type="danger" onClick={() => onDelete()}>
          Delete
        </ActionItem>
      </PopoverPanel>
    </Popover>
  );
}

export default CounterpartyAccountFormActions;

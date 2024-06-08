import React, { forwardRef, Ref } from "react";
import moment from "moment-timezone";
import { Button, Icon } from "../../common/ui-components";

const asOfButton = forwardRef(
  (
    { value, onClick }: { value: string; onClick: () => void },
    ref: Ref<HTMLButtonElement>
  ) => (
    <Button onClick={onClick} ref={ref}>
      <div className="flex h-4 self-center">
        <Icon
          className="text-gray-600"
          iconName="calendar_month"
          color="currentColor"
        />
      </div>
      <span className="font-medium">
        Balances as of {moment(value).format("YYYY-MM-DD")}
      </span>
    </Button>
  )
);

export default asOfButton;

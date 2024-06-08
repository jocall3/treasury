import React from "react";
import { Clickable, Drawer } from "../../common/ui-components";

import CounterpartyView from "../containers/CounterpartyView";

export function counterpartyDrawer(counterpartyId: string) {
  const trigger = (
    <Clickable onClick={() => {}}>
      <div className="text-blue-500 hover:text-blue-600">{counterpartyId}</div>
    </Clickable>
  );
  const counterpartyPath = `/counterparties/${counterpartyId}`;

  return (
    <Drawer trigger={trigger} path={counterpartyPath}>
      <CounterpartyView
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        match={{
          params: {
            counterparty_id: counterpartyId,
          },
        }}
      />
    </Drawer>
  );
}

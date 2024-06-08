import requestApi from "../../common/utilities/requestApi";
import { stringify } from "../../common/utilities/queryString";

import { LOAD_LEDGER_ENTITIES } from "../reducers/ledgerEntities";

export function loadLedgerEntities(query, ledgerId, dispatchError) {
  return (dispatch) => {
    const fullQuery = { ...query, ledger_id: ledgerId };

    const queryStringForUrl = stringify(fullQuery);

    const requestUrl = `/accounting/ledger_entities?${queryStringForUrl}`;

    return requestApi(requestUrl, null, "GET")
      .json((jsonData) => {
        dispatch({
          type: LOAD_LEDGER_ENTITIES,
          data: jsonData.ledger_entities,
        });
      })
      .catch(() => dispatchError("Could not load ledger entities"));
  };
}

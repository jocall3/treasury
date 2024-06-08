import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import reduce from "lodash/reduce";
import requestApi from "../../common/utilities/requestApi";
import { stringify } from "../../common/utilities/queryString";
import { actions as counterpartyActions } from "../slices/counterparties";
import { actions as paymentOrderActions } from "../slices/paymentOrders";
import { ALL_ACCOUNTS_ID } from "../constants/index";

export const QUERY_UPDATE = "QUERY_UPDATE";
export const ENTITIES_LOAD = "ENTITIES_LOAD";
export const BEGIN_LOAD = "TRANSACTIONS_BEGIN_LOAD";
export const FINISH_LOAD = "TRANSACTIONS_FINISH_LOAD";
export const ENTITY_UPDATE = "ENTITY_UPDATE";

export function updateQuery(entity, queryUpdates) {
  return {
    type: QUERY_UPDATE,
    queryUpdates,
    entity,
  };
}

export function loadEntities(payload, entity) {
  return {
    type: ENTITIES_LOAD,
    payload,
    entity,
  };
}

export function updateEntity(payload, entity, id) {
  return {
    type: ENTITY_UPDATE,
    payload,
    entity,
    id,
  };
}

export function stringifyQuery(entity, query) {
  const metadata = query.metadata || [];
  const reducedMetadata = reduce(
    metadata,
    (acc, curr) => {
      if (!isNil(curr.key) && !isNil(curr.value)) {
        acc[curr.key] = curr.value;
      }
      return acc;
    },
    {}
  );

  const searchableQuery = {
    ...query,
    ...(!isEmpty(reducedMetadata)
      ? { metadata: reducedMetadata }
      : { metadata: null }),
    resource: entity,
  };

  if (searchableQuery.originating_account_id === ALL_ACCOUNTS_ID) {
    delete searchableQuery.originating_account_id;
  }

  return stringify(searchableQuery);
}

export function searchApi(entity, query) {
  const queryString = stringifyQuery(entity, query);
  return requestApi(`/search?${queryString}`, null, "GET").json(
    (jsonData) => jsonData
  );
}

function searchAndLoadEntities(dispatch, entity, query, dispatchError) {
  return searchApi(entity, query)
    .then((jsonData) => {
      Object.entries(jsonData).forEach(([key, value]) => {
        switch (key) {
          case "counterparties":
            dispatch(counterpartyActions.setAll(value.entities));
            break;
          case "paymentOrders":
            dispatch(paymentOrderActions.setAll(value.entities));
            break;
          default:
            dispatch(loadEntities(value, key));
        }
      });
      return jsonData;
    })
    .catch(() => {
      dispatchError(
        "We're sorry, but we had trouble with your search. Please make sure what you entered was valid"
      );
    });
}

function pushNewUrl(query) {
  const queryStringForUrl = stringify(query);
  const newUrl = `${window.location.pathname}?${queryStringForUrl}`;
  window.history.replaceState(null, null, newUrl);
}

export function searchEntity(
  entity,
  page = null,
  updateUrl = true,
  dispatchError
) {
  return (dispatch, getState) => {
    const queryPage = getState()[entity].initialLoad
      ? getState()[entity].query.page
      : null;
    const newPage = page || queryPage || 1;
    dispatch(updateQuery(entity, { page: newPage }));
    const originalQuery = getState()[entity].query;
    if (updateUrl) {
      pushNewUrl(originalQuery);
    }

    return searchAndLoadEntities(
      dispatch,
      entity,
      originalQuery,
      dispatchError
    );
  };
}

export function loadPage(
  entity,
  isNext,
  skipSearch,
  skipScroll,
  dispatchError
) {
  return (dispatch, getState) => {
    const currentPage = getState()[entity].query.page;
    const pageCountChange = isNext ? 1 : -1;
    const newPage = currentPage + pageCountChange;

    if (skipSearch) {
      dispatch(updateQuery(entity, { page: newPage }));
    } else {
      dispatch(searchEntity(entity, newPage, true, dispatchError));
    }

    if (!skipScroll) {
      window.scrollTo(0, 0);
    }
  };
}

import reduce from "lodash/reduce";
import isNil from "lodash/isNil";
import sanitizeAmount from "../../common/utilities/sanitizeAmount";

export function sanitizeMetadata(metadata) {
  return reduce(
    metadata,
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {}
  );
}

export function sanitizeLineItems(lineItems) {
  return reduce(
    lineItems,
    (acc, curr) => {
      acc.push({
        ...curr,
        amount: sanitizeAmount(curr.amount),
      });
      return acc;
    },
    []
  );
}

// Depecrated when switching to ISO formated dates in GQL
export function sanitizeDate(date) {
  if (isNil(date)) {
    return undefined;
  }

  const [month, day, year] = date.split("/");

  return `${year}-${month}-${day}`;
}

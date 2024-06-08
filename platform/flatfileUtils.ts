import { CellValueUnion, RecordsWithLinks } from "@flatfile/api/api";

type FlatfileRecord = Record<string, CellValueUnion | null>;

const metadataRegex = /^metadata\[(?<metadataKey>.+)\]$/i;

export const numericRegex = "^[0-9]+$";
export const decimalStringRegex = "^[0-9]+\\.[0-9]+$";
export const dateRegex = "^\\d{4}-[01]\\d-[0-3]\\d$";
export const dateTimeRegex =
  "^2\\d{3}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2]\\d|[3][01])T([01]\\d|[2][0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(([+-]([01]\\d|[2][0-3]):[0-5]\\d)|Z)?$";
export const metadataLegacyRegex = "^([\\w ]+:[\\w\\- ]+\\|?)*$";
export const booleanRegex = "^\\s*(true|false|TRUE|FALSE)\\s*$";

// Maps resource columns to data format validators (resources have different columns to validate)
export const RESOURCE_FLATFILE_FIELDS: Record<
  string,
  Record<string, string[]>
> = {
  NUMERICAL: {
    payment_orders: ["amount"],
    expected_payments: ["amountLowerBound", "amountUpperBound"],
    counterparties: [],
    invoices: ["lineItemUnitAmount", "lineItemQuantity"],
  },
  DECIMAL_STRING: {
    payment_orders: [],
    expected_payments: [],
    counterparties: [],
    invoices: ["lineItemUnitAmountDecimal"],
  },
  DATE: {
    payment_orders: ["effectiveDate"],
    expected_payments: ["dateLowerBound", "dateUpperBound"],
    counterparties: [],
    invoices: ["dueDate", "paymentEffectiveDate"],
  },
  DATETIME: {
    payment_orders: ["processAfter"],
    expected_payments: [],
    counterparties: [],
    invoices: [],
  },
  METADATA: {
    payment_orders: ["metadata"],
    expected_payments: ["metadata"],
    counterparties: ["metadata"],
    invoices: ["metadata", "lineItemMetadata"],
  },
  BOOLEAN: {
    payment_orders: [],
    expected_payments: [],
    counterparties: ["sendRemittanceAdvice"],
    invoices: ["autoAdvance", "notificationsEnabled"],
  },
};

// Basic validation needed for GraphQL types.
export const numericValidatorError = "Must be only numerical values";
export const decimalStringValidatorError =
  "Must be only numerical decimal values";
export const dateValidatorError = "Must be in ISO 8601, YYYY-MM-DD format";
export const dateTimeValidatorError =
  "Must be in ISO 8601, YYYY-MM-DDThh:mm:ssTZD format";
export const metadataLegacyValidatorError = "Must be in k1:v1|k2:v2 format";
export const booleanValidatorError = "Must be true or false";

/** Flattens the record values into one simple object */
export const flattenFlatfileData = (records: RecordsWithLinks) => {
  const normalizedList: Array<FlatfileRecord> = [];
  if (records.length) {
    for (let i = 0; i < records.length; i += 1) {
      const record = records[i];
      const data = record.values;
      const normalized: FlatfileRecord = {};
      Object.keys(data).forEach((key) => {
        normalized[key] = data[key].value || null;
      });
      normalizedList.push(normalized);
    }
  }

  return normalizedList;
};

/**
 * We allow custom fields from the user to support metadata[key] inputs.
 * Because any field can be inputed, we should restrict it to only
 * the fields we have defined and the custom metadata fields,
 * returning helpful errors if the custom columns are malformed.
 *
 */
export const sanitizeRecordMetadata = (
  recordData: FlatfileRecord[],
  expectedFields: Set<string>
): {
  sanitizedRecordData: Array<Record<string, CellValueUnion | null>>;
  errors?: Array<string>;
} => {
  const errors: Array<string> = [];
  const sanitizedRecordData = recordData.map((record) => {
    const sanitizedRecord: FlatfileRecord = {};
    const recordKeys = Object.keys(record);
    const specifiedKeySet = new Set(recordKeys);

    recordKeys.forEach((key: string) => {
      if (key === "metadata" || key === "lineItemMetadata") {
        const unparsedMetadata = record[key] as string;
        if (!unparsedMetadata) {
          sanitizedRecord[key] = null;
        } else {
          // Parse k1:v1|k2:v2 into json object
          const metadataObj = unparsedMetadata
            .split("|")
            .reduce((acc, keyValue) => {
              const keyValuePair = keyValue.split(":");
              return {
                ...acc,
                [keyValuePair[0]?.trim()]: keyValuePair[1]?.trim(),
              };
            }, {});
          sanitizedRecord[key] = JSON.stringify(metadataObj);
        }
      } else if (key === "$custom") {
        const metadataObj = Object.keys(record[key] || {}).reduce(
          (acc, customKey) => {
            const m = metadataRegex.exec(customKey);
            // If the custom key matches the metadata regex and there is a value for that metadata key, parse it.
            if (m?.groups?.metadataKey && record[key]?.[customKey]) {
              // Cannot have both custom and legacy metadata formats.
              if (specifiedKeySet.has("metadata")) {
                errors.push(
                  "Cannot use both legacy metadata field and custom metadata[key] fields"
                );
              }
              return {
                ...acc,
                [m.groups.metadataKey]: record[key]?.[customKey] as string,
              };
            }

            // If the custom key does not match the metadata regex, record error to show.
            if (!m?.groups?.metadataKey) {
              errors.push(
                `Custom field ${customKey} is not in format: metadata[key]`
              );
            }
            return acc;
          },
          {}
        );
        sanitizedRecord.metadata = JSON.stringify(metadataObj);
      } else if (expectedFields.has(key)) {
        sanitizedRecord[key] = record[key] === "" ? null : record[key];
      }
    });
    return sanitizedRecord;
  });

  return { sanitizedRecordData, errors: Array.from(new Set(errors)) };
};

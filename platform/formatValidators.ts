import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord, bulkRecordHook } from "@flatfile/plugin-record-hook";
import {
  numericRegex,
  decimalStringRegex,
  dateRegex,
  dateTimeRegex,
  metadataLegacyRegex,
  booleanRegex,
  numericValidatorError,
  decimalStringValidatorError,
  dateValidatorError,
  dateTimeValidatorError,
  metadataLegacyValidatorError,
  booleanValidatorError,
  RESOURCE_FLATFILE_FIELDS,
} from "./utils/flatfileUtils";

export const numericValidator = (
  listener: FlatfileListener,
  resource: string
) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validNumber = new RegExp(numericRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.NUMERICAL[resource].forEach((amountType) => {
          const amount = record.get(amountType) as string;
          if (!!amount && !validNumber.test(amount)) {
            record.addError(amountType, numericValidatorError);
          }
        });
        return record;
      });
    })
  );

export const decimalStringValidator = (
  listener: FlatfileListener,
  resource: string
) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validDecimalString = new RegExp(decimalStringRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.DECIMAL_STRING[resource].forEach(
          (decimalStringType) => {
            const amount = record.get(decimalStringType) as string;
            if (!!amount && !validDecimalString.test(amount)) {
              record.addError(decimalStringType, decimalStringValidatorError);
            }
          }
        );
        return record;
      });
    })
  );

export const dateValidator = (listener: FlatfileListener, resource: string) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validDate = new RegExp(dateRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.DATE[resource].forEach((dateType) => {
          const date = record.get(dateType) as string;
          if (!!date && !validDate.test(date)) {
            record.addError(dateType, dateValidatorError);
          }
        });
        return record;
      });
    })
  );

export const dateTimeValidator = (
  listener: FlatfileListener,
  resource: string
) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validDateTime = new RegExp(dateTimeRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.DATETIME[resource].forEach((dateTimeType) => {
          const date = record.get(dateTimeType) as string;
          if (!!date && !validDateTime.test(date)) {
            record.addError(dateTimeType, dateTimeValidatorError);
          }
        });
        return record;
      });
    })
  );

export const metadataValidator = (
  listener: FlatfileListener,
  resource: string
) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validMetadata = new RegExp(metadataLegacyRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.METADATA[resource].forEach((metadataType) => {
          const metadata = record.get(metadataType) as string;

          if (!!metadata && !validMetadata.test(metadata)) {
            record.addError(metadataType, metadataLegacyValidatorError);
          }
        });
        return record;
      });
    })
  );

export const booleanValidator = (
  listener: FlatfileListener,
  resource: string
) =>
  listener.use(
    bulkRecordHook(resource, (records: FlatfileRecord[]) => {
      const validBoolean = new RegExp(booleanRegex);

      records.forEach((record) => {
        RESOURCE_FLATFILE_FIELDS.BOOLEAN[resource].forEach((booleanType) => {
          const boolean = record.get(booleanType) as string;

          if (!!boolean && !validBoolean.test(boolean)) {
            record.addError(booleanType, booleanValidatorError);
          }
        });
        return record;
      });
    })
  );

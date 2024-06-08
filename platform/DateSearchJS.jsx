import React from "react";
import moment from "moment-timezone";
import {
  formatLocalDate,
  formatISODateTime,
  parseISOLocalDate,
  parseISODateTime,
} from "../../../common/utilities/formatDate";

import useUserTimezone from "../../../common/utilities/useUserTimezone";
import { DatePicker as ModernDatePicker } from "../../../common/ui-components";

function DateSearchJS({
  field,
  query,
  updateQuery,
  operator,
  label,
  minDate,
  maxDate,
  dateType,
  dateTimeType,
  disabled,
  prefix,
}) {
  let value;
  const queryField = query[field] || {};
  const userTimeZone = useUserTimezone();

  if (queryField[operator]) {
    value = queryField[operator];
  }

  function onChange(newDate) {
    updateQuery({
      [field]: {
        ...queryField,
        [operator]: newDate,
      },
    });
  }

  const minimumDate = maxDate ? null : queryField[minDate];
  const maximumDate = minDate ? null : queryField[maxDate];

  function formatISODateTimeInclusive(dateTimeValue) {
    // set to the end of the day if lte and dateTime
    // so we include times in the current day.
    let eodDateTime = dateTimeValue;
    if (eodDateTime && operator === "lte" && dateTimeType) {
      eodDateTime = moment
        .tz(dateTimeValue, userTimeZone)
        .endOf("day")
        .toDate();
    }
    return formatISODateTime(eodDateTime);
  }

  return (
    <ModernDatePicker
      required
      disabled={disabled}
      label={label}
      minDate={minimumDate}
      maxDate={maximumDate}
      input={{
        value,
        onChange,
        name: `${field}[${operator}]`,
      }}
      dateFormatter={
        (dateType && formatLocalDate) ||
        (dateTimeType && formatISODateTimeInclusive) ||
        null
      }
      dateParser={
        (dateType && parseISOLocalDate) ||
        (dateTimeType && parseISODateTime) ||
        null
      }
      prefix={prefix}
    />
  );
}

export default DateSearchJS;

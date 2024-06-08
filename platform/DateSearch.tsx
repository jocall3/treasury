import React, { useState } from "react";
import moment from "moment";
import { isEqual } from "lodash";
import useUserTimezone from "../../../common/utilities/useUserTimezone";
import {
  DateFilterInput,
  TimeUnitEnum,
} from "../../../generated/dashboard/graphqlSchema";
import DateRangeSelectField, {
  DateRangeFormValues,
  DateRangeSelectFieldProps,
  Option,
} from "../../../common/ui-components/DateRangeSelectField/DateRangeSelectField";
import { format } from "../../../common/ui-components/DateRangePicker/DateRangePicker";

const ALL_TIME = {
  value: "allTime",
  label: "All Time",
  dateRange: {
    inTheLast: null,
    inTheNext: null,
  },
};

const NEXT_WEEK = {
  value: "nextWeek",
  label: "Next Week",
  dateRange: {
    inTheLast: null,
    inTheNext: { unit: TimeUnitEnum.Weeks, amount: "1" },
  },
};

const PAST_WEEK = {
  value: "pastWeek",
  label: "Past Week",
  dateRange: {
    inTheLast: { unit: TimeUnitEnum.Weeks, amount: "1" },
    inTheNext: null,
  },
};

const PAST_MONTH = {
  value: "pastMonth",
  label: "Past Month",
  dateRange: {
    inTheLast: { unit: TimeUnitEnum.Months, amount: "1" },
    inTheNext: null,
  },
};

const PAST_QUARTER = {
  value: "pastQuarter",
  label: "Past Quarter",
  dateRange: {
    inTheLast: { unit: TimeUnitEnum.Months, amount: "3" },
    inTheNext: null,
  },
};

const PAST_YEAR = {
  value: "pastYear",
  label: "Past Year",
  dateRange: {
    inTheLast: { unit: TimeUnitEnum.Years, amount: "1" },
    inTheNext: null,
  },
};

const PAST_DAY = {
  value: "pastDay",
  label: "Past Day",
  dateRange: {
    inTheLast: { unit: TimeUnitEnum.Days, amount: "1" },
    inTheNext: null,
  },
};

export const DATE_SEARCH_FILTER_OPTIONS = [
  ALL_TIME,
  NEXT_WEEK,
  PAST_DAY,
  PAST_WEEK,
  PAST_MONTH,
  PAST_QUARTER,
  PAST_YEAR,
];

export const DATE_SEARCH_FILTER_OPTIONS_WITHOUT_FUTURE = [
  ALL_TIME,
  PAST_WEEK,
  PAST_MONTH,
  PAST_QUARTER,
  PAST_YEAR,
];

interface DateSearchProps {
  anchorOrigin?: DateRangeSelectFieldProps["anchorOrigin"];
  field: string;
  updateQuery: (input: Record<string, DateRangeFormValues>) => void;
  options: Option[];
  minDate?: string;
  maxDate?: string;
  label?: string;
  disabled?: boolean;
  validateRange?: boolean;
  dateTimeType?: boolean;
  query?: Record<string, DateRangeFormValues>;
  /** allows for ability change label without changing the date range
   *  used for global filter, when a child filter changes, change the label
   */
  defaultLabel?: string;
  setGlobalDateFilterLabel?: () => void;
  showIcon?: boolean;
  autoWidth?: boolean;
  showStartAndEndDateArrow?: boolean;
}

const toLocalTimestamp = (
  date: string | undefined,
  dateRange: "start" | "end"
) => {
  if (date === undefined) return date;

  return dateRange === "start"
    ? moment(date).startOf("day").format()
    : moment(date).endOf("day").format();
};

export function dateSearchMapper(
  dateRange: DateRangeFormValues | undefined,
  transformToTimestamp = false
): DateFilterInput {
  if (!dateRange) return {};
  const inTheLast = {
    unit: dateRange.inTheLast?.unit,
    amount: parseInt(dateRange.inTheLast?.amount || "", 10),
  };
  const inTheNext = {
    unit: dateRange.inTheNext?.unit,
    amount: parseInt(dateRange.inTheNext?.amount || "", 10),
  };
  if (dateRange.inTheLast) {
    return {
      gte: transformToTimestamp
        ? toLocalTimestamp(dateRange.gte, "start")
        : dateRange.gte,
      lte: transformToTimestamp
        ? toLocalTimestamp(dateRange.lte, "end")
        : dateRange.lte,
      inTheLast,
      format: dateRange.format,
    };
  }
  if (dateRange.inTheNext) {
    return {
      gte: transformToTimestamp
        ? toLocalTimestamp(dateRange.gte, "start")
        : dateRange.gte,
      lte: transformToTimestamp
        ? toLocalTimestamp(dateRange.lte, "end")
        : dateRange.lte,
      inTheNext,
      format: dateRange.format,
    };
  }
  return {
    gte: transformToTimestamp
      ? toLocalTimestamp(dateRange.gte, "start")
      : dateRange.gte,
    lte: transformToTimestamp
      ? toLocalTimestamp(dateRange.lte, "end")
      : dateRange.lte,
    format: dateRange.format,
  };
}
// Extract selected relative date option from the query (inTheLast or inTheNext must be populated).
function matchingOption(
  option: Option,
  query: Record<string, DateRangeFormValues>,
  field: string
) {
  if (query && query[field] && option.value !== "allTime") {
    const relativeOperator = option.dateRange.inTheLast
      ? "inTheLast"
      : "inTheNext";

    return (
      option.dateRange[relativeOperator]?.amount ===
        query[field][relativeOperator]?.amount &&
      option.dateRange[relativeOperator]?.unit ===
        query[field][relativeOperator]?.unit
    );
  }
  return false;
}

function DateSearch({
  anchorOrigin,
  field,
  updateQuery,
  minDate,
  maxDate,
  options,
  disabled,
  validateRange,
  dateTimeType,
  label,
  query,
  defaultLabel,
  setGlobalDateFilterLabel,
  showIcon = false,
  autoWidth = false,
  showStartAndEndDateArrow = true,
}: DateSearchProps) {
  /** value is used to detect if there have been changes in the input that require a requery, it is initialized from
  query string if there is one */
  const [value, setValue] = useState(
    query
      ? {
          gte: format(query[field]?.gte),
          lte: format(query[field]?.lte),
          inTheLast: query[field]?.inTheLast,
          inTheNext: query[field]?.inTheNext,
        }
      : { gte: "", lte: "", inTheLast: null, inTheNext: null }
  );
  let initialSelected: string | undefined;
  const userTimeZone = useUserTimezone();

  if (query && (query[field]?.inTheLast || query[field]?.inTheNext)) {
    initialSelected = options.find((option) =>
      matchingOption(option, query, field)
    )?.label;
  }
  // The onChange updatesQuery when the fields have changed
  function onChange(dateRange: DateRangeFormValues): void {
    let startDate: Date | string | undefined = dateRange.gte;
    let endDate: Date | string | undefined = dateRange.lte;
    // Allows timestamps
    if (dateTimeType) {
      startDate = startDate
        ? moment
            .tz(startDate, userTimeZone)
            .startOf("day")
            .toDate()
            .toISOString()
        : undefined;
      endDate = endDate
        ? moment.tz(endDate, userTimeZone).endOf("day").toDate().toISOString()
        : undefined;
    }
    if (
      value.gte !== dateRange.gte ||
      value.lte !== dateRange.lte ||
      (dateRange.inTheLast && !isEqual(value.inTheLast, dateRange.inTheLast)) ||
      (dateRange.inTheNext && !isEqual(value.inTheNext, dateRange.inTheNext))
    ) {
      if (Object.keys(dateRange).length > 0) {
        updateQuery({
          [field]: {
            ...dateRange,
            gte: startDate || undefined,
            lte: endDate || undefined,
          },
        });
      }
    }
    if (setGlobalDateFilterLabel) setGlobalDateFilterLabel();
    setValue({
      gte: dateRange.gte || "",
      lte: dateRange.lte || "",
      inTheLast: dateRange.inTheLast || null,
      inTheNext: dateRange.inTheNext || null,
    });
  }

  return (
    <DateRangeSelectField
      anchorOrigin={anchorOrigin}
      fieldLabel={label}
      options={options}
      initialSelected={initialSelected}
      onChange={onChange}
      initialValues={{ gte: value.gte, lte: value.lte }}
      minDate={minDate}
      validateRange={validateRange}
      maxDate={maxDate}
      disabled={disabled}
      defaultLabel={defaultLabel}
      showIcon={showIcon}
      autoWidth={autoWidth}
      showStartAndEndDateArrow={showStartAndEndDateArrow}
    />
  );
}

export default DateSearch;

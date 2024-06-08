import React from "react";
import DatePicker from "~/common/ui-components/DatePicker/DatePicker";
import { Label, SelectField } from "../../common/ui-components";

interface DateOffsetReconciliationMatchResultProps {
  selectField: string | null | undefined;
  selectFieldOptions: {
    value: string;
    label: string;
  }[];
  matcher: string;
  startOffset: number | null | undefined;
  endOffset: number | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  callback: (
    matchResultType: string | null | undefined,
    matcher: string | null | undefined,
    parser: string | null | undefined,
    showParser: boolean | null | undefined,
    transactionField: string | null | undefined,
    startDate: string | null | undefined,
    endDate: string | null | undefined
  ) => void;
}

function DateOffsetReconciliationMatchResult({
  selectField,
  selectFieldOptions,
  matcher,
  startOffset,
  endOffset,
  startDate,
  endDate,
  callback,
}: DateOffsetReconciliationMatchResultProps) {
  return (
    <div className="flex w-full">
      <div className="min-w-44">
        <div className="mt-6" />
        <SelectField
          className="justify-left flex"
          handleChange={(e) =>
            callback(e as string, matcher, null, null, null, startDate, endDate)
          }
          id="select-id"
          name="select-name"
          selectValue={selectField}
          options={selectFieldOptions}
        />
        <Label className="text-sm text-gray-500">
          Offset (In Business Days)
        </Label>
      </div>

      <div className="flex w-full">
        <div>
          <DatePicker
            label="Start Date"
            placeholder="YYYY-MM-DD"
            input={{
              onChange: (e) => {
                callback(selectField, matcher, null, null, null, e, endDate);
              },
              value: startDate || "",
            }}
          />
          <Label className="ml-14 text-sm text-gray-500">{startOffset}</Label>
        </div>

        <div>
          <DatePicker
            label="End Date"
            placeholder="YYYY-MM-DD"
            input={{
              onChange: (e) => {
                callback(selectField, matcher, null, null, null, startDate, e);
              },
              value: endDate || "",
            }}
          />
          <Label className="ml-14 text-sm text-gray-500">{endOffset}</Label>
        </div>
      </div>
    </div>
  );
}
export default DateOffsetReconciliationMatchResult;

import React from "react";
import { SelectField } from "~/common/ui-components";

interface BooleanReconciliationMatchResultProps {
  selectField: string;
  selectFieldOptions: {
    value: string;
    label: string;
  }[];
  callback: (
    matchResultType: string | null | undefined,
    matcher: string | null | undefined,
    parser: string | null | undefined,
    showParser: boolean | null | undefined,
    transactionField: string | null | undefined,
    startDate: string | null,
    endDate: string | null
  ) => void;
}

function BooleanReconciliationMatchResult({
  selectField,
  selectFieldOptions,
  callback,
}: BooleanReconciliationMatchResultProps) {
  return (
    <div className="min-w-36">
      <SelectField
        className="justify-left flex"
        handleChange={(e) => {
          if (e === "Is True") {
            callback(e as string, "true", null, null, null, null, null);
          } else if (e === "Is False") {
            callback(e as string, "false", null, null, null, null, null);
          } else {
            callback(e as string, "", null, null, null, null, null);
          }
        }}
        id="select-id"
        name="select-name"
        selectValue={selectField}
        options={selectFieldOptions}
      />
    </div>
  );
}

export default BooleanReconciliationMatchResult;

import React from "react";
import MetadataInput from "../MetadataInput";
import {
  RuleValue,
  MetadataKeyValue,
} from "../../types/RuleConditionFieldValueInput";
import { PAYMENT_ORDER } from "../../../generated/dashboard/types/resources";

function MetadataFieldValueInput({
  currentValue,
  onMetadataChange,
}: {
  currentValue: RuleValue;
  onMetadataChange: (data: Record<string, Record<string, string>>) => void;
}) {
  const metadata = ((currentValue as MetadataKeyValue) || []).reduce(
    (memo: MetadataKeyValue[number], { key = "", value = "" }) => ({
      ...memo,
      [key]: value,
    }),
    {}
  );

  return (
    <div className="form-group">
      <MetadataInput
        initialValues={metadata}
        resource={PAYMENT_ORDER}
        hideLabel
        onChange={(data) =>
          onMetadataChange(
            Object.keys(data).length ? { metadata: { ...data } } : {}
          )
        }
        multiLines
        noInitialEmptyEntry={Object.keys(metadata).length > 0}
        allowNoEntries={false}
      />
    </div>
  );
}

export default MetadataFieldValueInput;

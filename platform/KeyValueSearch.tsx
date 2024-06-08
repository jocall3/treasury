import React from "react";
import KeyValueInput from "../KeyValueInput";

interface KeyValueSearchProps {
  updateQuery: (query: unknown) => void;
  query: { [key: string]: unknown };
  field: string;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
  multiLines?: boolean;
}

/**
 * A Text Search that has basic autosuggest based on given static array of suggestions.
 */
function KeyValueSearch({
  updateQuery,
  query,
  field,
  label,
  hideLabel,
  disabled,
  multiLines,
}: KeyValueSearchProps) {
  const onChange = (metadata: Record<string, string>) => {
    updateQuery({
      [field]: Object.keys(metadata).length ? { ...metadata } : undefined,
    });
  };

  return (
    <KeyValueInput
      initialValues={query[field] as Record<string, string>}
      label={label}
      onChange={onChange}
      hideLabel={hideLabel}
      disabled={disabled}
      multiLines={multiLines}
      allowNoEntries={false}
      inlineAddButton
    />
  );
}

export default KeyValueSearch;

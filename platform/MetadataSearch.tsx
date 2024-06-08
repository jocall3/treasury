import React from "react";
import MetadataInput from "../MetadataInput";
import { ResourcesEnum } from "../../../generated/dashboard/types/resources";

interface MetadataSearchProps {
  updateQuery: (query: unknown) => void;
  query: { [key: string]: unknown };
  field: string;
  resource: ResourcesEnum;
  hideLabel?: boolean;
  disabled?: boolean;
  multiLines?: boolean;
}

/**
 * A Text Search that has basic autosuggest based on given static array of suggestions.
 */
function MetadataSearch({
  updateQuery,
  query,
  field,
  resource,
  hideLabel,
  disabled,
  multiLines,
}: MetadataSearchProps) {
  const onChange = (metadata: Record<string, string>) => {
    updateQuery({
      [field]: Object.keys(metadata).length ? { ...metadata } : undefined,
    });
  };

  return (
    <MetadataInput
      initialValues={query[field] as Record<string, string>}
      onChange={onChange}
      resource={resource}
      hideLabel={hideLabel}
      disabled={disabled}
      multiLines={multiLines}
      allowNoEntries={false}
      alwaysDeleteOnRemove
      inlineAddButton
    />
  );
}

export default MetadataSearch;

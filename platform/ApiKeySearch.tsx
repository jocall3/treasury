import React from "react";
import ApiKeySelect, { ALL_API_KEYS_ID } from "../../containers/ApiKeySelect";

interface ApiKeySearchProps {
  updateQuery: (input: Query) => void;
  field: string;
  query: Query;
  disabled?: boolean;
}

function ApiKeySearch({
  updateQuery,
  field,
  query,
  disabled = false,
}: ApiKeySearchProps) {
  const apiKeyId = query[field] as string;

  function onApiKeySelect(newValue: string) {
    if (newValue === ALL_API_KEYS_ID) {
      updateQuery({ [field]: null });
    } else {
      updateQuery({ [field]: newValue });
    }
  }

  return (
    <ApiKeySelect
      overrideOnApiKeySelect={onApiKeySelect}
      overrideCurrentApiKeyId={apiKeyId}
      hideLabel={false}
      disabled={disabled}
    />
  );
}

export default ApiKeySearch;

import React from "react";
import {
  Autosuggest,
  Suggestion,
  FieldGroup,
  Label,
} from "../../../common/ui-components";

interface AutosuggestTextSearchProps {
  updateQuery: (query: unknown) => void;
  query: { [key: string]: unknown };
  field: string;
  suggestions: Array<Suggestion>;
  label?: string;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

/**
 * A Text Search that has basic autosuggest based on given static array of suggestions.
 */
function AutosuggestTextSearch({
  updateQuery,
  query,
  field,
  suggestions,
  label,
  placeholder,
  helpText,
  disabled,
}: AutosuggestTextSearchProps) {
  const matchingSuggestion = suggestions.find(
    (suggestion) => suggestion.value === query[field]
  );
  const value = matchingSuggestion?.label || (query[field] as string) || "";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery({
      [field]: e.target.value,
    });
  };

  const onSuggestionSelect = (
    _event,
    selection: { suggestionValue: string }
  ) => {
    updateQuery({
      [field]: selection.suggestionValue,
    });
  };

  return (
    <FieldGroup>
      <Label id={label} helpText={helpText}>
        {label}
      </Label>
      <div>
        <Autosuggest
          onChange={onChange}
          className="mr-3"
          onSuggestionSelect={onSuggestionSelect}
          value={value}
          field={field}
          suggestions={suggestions}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </FieldGroup>
  );
}

export default AutosuggestTextSearch;

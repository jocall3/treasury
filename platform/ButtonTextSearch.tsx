import React, { useCallback, useState, useRef } from "react";
import { Button, Icon, Input } from "../../../common/ui-components";

interface QueryType {
  page?: number;
  perPage?: number;
  paginationDirection?: "next" | "previous";
  startCursor?: string;
  endCursor?: string;
  [key: string]: unknown;
  placeHolderTextSize?: "text-xs" | "text-sm";
}

interface ButtonTextSearchProps {
  updateQuery: (input: Record<string, unknown>) => void;
  field: string;
  query: QueryType;
  buttonText?: string;
  placeholder?: string;
  disabled?: boolean;
  showSearchBarAtStart?: boolean;
  hideSearchBarOnClear?: boolean;
  placeHolderTextSize?: QueryType["placeHolderTextSize"];
}

function ButtonTextSearch({
  updateQuery,
  field,
  query,
  buttonText,
  placeholder,
  disabled,
  showSearchBarAtStart = false,
  hideSearchBarOnClear = true,
  placeHolderTextSize = "text-sm",
}: ButtonTextSearchProps) {
  const value = query[field] as string;
  const [showSearchBar, setShowSearchBar] = useState<boolean>(
    Boolean(value) || showSearchBarAtStart
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  function setSearchValue(searchValue: string) {
    updateQuery({
      [field]: searchValue,
    });
  }

  // We need to wait one tick for the input to be visible in the DOM
  const handleSearchButtonClick = useCallback(
    () =>
      setTimeout(() => {
        setShowSearchBar(true);
        searchInputRef.current?.focus();
      }),
    []
  );

  return (
    <div className="flex flex-wrap justify-between">
      <div className="flex">
        {showSearchBar ? (
          <div className="relative w-96">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              prefixIconName="search"
              ref={searchInputRef}
              suffixIconName="clear"
              onSuffixIconClick={
                disabled
                  ? undefined
                  : () => {
                      if (value) {
                        setSearchValue("");
                      }
                      if (hideSearchBarOnClear) {
                        setShowSearchBar(false);
                      }
                    }
              }
              className={`placeholder:${placeHolderTextSize}`}
              name={field}
              disabled={disabled}
            />
          </div>
        ) : (
          <Button onClick={handleSearchButtonClick} disabled={disabled}>
            <Icon
              iconName="search"
              color="currentColor"
              className="text-gray-600"
            />
            <span className="font-medium">{buttonText}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ButtonTextSearch;

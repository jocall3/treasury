import React, { useEffect, useState } from "react";
import { debounce, uniq } from "lodash";
import { cn } from "~/common/utilities/cn";
import MultiSelectDropdownPanel from "~/common/ui-components/MultiSelectDropdown/MultiSelectDropdownPanel";
import { CUSTOM_COLUMN_EVENTS } from "../../common/constants/analytics";
import trackEvent from "../../common/utilities/trackEvent";
import {
  DisplayColumn,
  useColumnSelectorDropdownQuery,
} from "../../generated/dashboard/graphqlSchema";
import {
  RESOURCES,
  ResourcesEnum,
} from "../../generated/dashboard/types/resources";
import {
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverPanel,
} from "../../common/ui-components";

export type Column = {
  id: string;
  label: string;
};

export interface ColumnSelectorDropdownProps {
  disableMetadata?: boolean;
  displayColumns?: Array<DisplayColumn | Column>;
  displayColumnsLoading?: boolean;
  /** When `true`, changes styling to accomodate being in the filter area. */
  inFilters?: boolean;
  onColumnSelectionChange?: (change: Record<string, Array<string>>) => void;
  resource?: ResourcesEnum;
  selectedColumns?: Array<string>;
  selectedMetadataColumns?: Array<string>;
}

const METADATA_PAGINATION_SIZE = 10;
const METADATA_KEYS_LIMIT = 50;

const currentRecordCount = (page: number) => page * METADATA_PAGINATION_SIZE;

const showLoadMore = (
  page: number,
  metadataKeys: Array<unknown>,
  searchValue: string
) =>
  currentRecordCount(page) < METADATA_KEYS_LIMIT &&
  currentRecordCount(page) < metadataKeys.length &&
  !searchValue;

const showEndOfListMessage = (
  page: number,
  metadataKeys: Array<unknown>,
  searchValue: string,
  hasNextPage: boolean
) =>
  !!metadataKeys.length &&
  currentRecordCount(page) >= METADATA_KEYS_LIMIT &&
  hasNextPage &&
  !searchValue;

const debouncedTrackSearch = debounce((searchValue: string, path: string) => {
  trackEvent(null, CUSTOM_COLUMN_EVENTS.CUSTOM_COLUMN_SEARCHED, {
    searchValue,
    path,
  });
}, 500);

const shouldQueryForMetadata = (
  disableMetadata: boolean,
  resource?: ResourcesEnum
) => resource && !disableMetadata;

/* Track when the column selector dropdown is opened */
function ColumnSelectorDropdownTracker(props) {
  useEffect(() => {
    trackEvent(null, CUSTOM_COLUMN_EVENTS.CUSTOM_COLUMN_CLICKED, {
      path: window.location.pathname,
    });
  }, []);

  return <MultiSelectDropdownPanel {...props} />;
}

function ColumnSelectorDropdown({
  disableMetadata = false,
  displayColumns,
  displayColumnsLoading,
  inFilters,
  onColumnSelectionChange,
  resource,
  selectedColumns = [],
  selectedMetadataColumns = [],
}: ColumnSelectorDropdownProps) {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const { loading, data, error, refetch } = useColumnSelectorDropdownQuery({
    variables: {
      // Typescript can't detect that this wont get executed if
      // resource is not defined. Need to pass a dummy string
      resource: resource ? RESOURCES[resource].model : "",
      first: METADATA_KEYS_LIMIT,
    },
    skip: !shouldQueryForMetadata(disableMetadata, resource),
  });

  const { hasNextPage = false } =
    loading || !data || error ? {} : data.resourceMetadataKeys.pageInfo;
  // We must concatenate the metadatakeys with selected metadata columns
  // to make sure deleted metadata keys that are persisted as columns
  // show up on the dropdown for customers to be able to remove them.
  const metadataKeys =
    loading || !data || error
      ? []
      : uniq(
          data.resourceMetadataKeys.edges
            .map(({ node }) => node.metadataKey)
            .concat(selectedMetadataColumns)
        );

  const handleSearchValueChange = (newSearchValue: string) => {
    setSearchValue(newSearchValue);
    debouncedTrackSearch(newSearchValue, window.location.pathname);
    if (shouldQueryForMetadata(disableMetadata, resource)) {
      refetch({
        resource,
        first: METADATA_KEYS_LIMIT,
        key: newSearchValue,
      }).catch(() => {});
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        buttonHeight={inFilters ? "extra-small" : undefined}
        className={cn(inFilters && "h-4 py-[6px]")}
        disabled={displayColumnsLoading}
        iconOnly={inFilters}
      >
        <Icon
          iconName="table"
          className="text-gray-700"
          size={inFilters ? "s" : undefined}
        />
        <span className={cn(inFilters && "text-sm", "sr-only")}>Customize</span>
      </PopoverTrigger>
      <PopoverPanel
        className="max-h-96 overflow-y-auto"
        anchorOrigin={
          inFilters
            ? {
                horizontal: "right",
              }
            : {}
        }
      >
        {(panelProps: { close: () => void }) => (
          <>
            <ColumnSelectorDropdownTracker
              onClose={panelProps.close}
              categories={[
                {
                  label: "Columns",
                  items: (displayColumns || []).map((column) => ({
                    id: column.id,
                    label: column.label,
                  })),
                  id: "selectedColumns",
                },
                {
                  label: "Metadata",
                  items: metadataKeys
                    .slice(0, currentRecordCount(page))
                    .map((key) => ({
                      id: key,
                      label: key,
                      icon: "label",
                    })),
                  id: "selectedMetadataColumns",
                },
              ]}
              onChange={onColumnSelectionChange && onColumnSelectionChange}
              initialValues={{
                selectedColumns,
                selectedMetadataColumns,
              }}
              onSearchValueChange={handleSearchValueChange}
              searchValue={searchValue}
            />
            {showLoadMore(page, metadataKeys, searchValue) && (
              <div className="px-3 pb-4">
                <Button onClick={() => setPage(page + 1)} fullWidth>
                  Load More
                </Button>
              </div>
            )}
            {showEndOfListMessage(
              page,
              metadataKeys,
              searchValue,
              hasNextPage
            ) && (
              <div className="max-w-xs pb-4 pl-6 pr-3 text-sm text-gray-800">
                Not all metadata keys are shown. Use the search box to narrow
                down the results.
              </div>
            )}
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}

export default ColumnSelectorDropdown;

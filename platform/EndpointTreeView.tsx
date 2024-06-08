import React, { useCallback, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import ReactJson from "react-json-view";
import { ClipLoader } from "react-spinners";
import debounce from "lodash/debounce";
import { stringify } from "qs";
import { useEndpointTreeQuery } from "../../generated/dashboard/graphqlSchema";
import { parse } from "../../common/utilities/queryString";
import { Input, Tooltip } from "../../common/ui-components";

const DEFAULT_DEBOUNCE_MS = 900;

type QueryArgs = {
  path?: string;
  pattern?: string;
};

interface EndpointTreeViewProps {
  endpointId: string;
}

function EndpointTreeView({ endpointId }: EndpointTreeViewProps) {
  const params = parse(window.location.search);
  const [pathSearchValue, setPathSearchValue] = useState(params.path as string);
  const [patternSearchValue, setPatternSearchValue] = useState(
    params.pattern as string
  );
  const [isFirstQuery, setIsFirstQuery] = useState(true);

  const { data, error, loading, refetch } = useEndpointTreeQuery({
    // necessary for `loading` to be updated on refetch
    notifyOnNetworkStatusChange: true,
    variables: { endpointId, ...params },
  });

  const handleRefetch = async (query: QueryArgs) => {
    await refetch({ ...query });
    window.history.replaceState(
      null,
      "",
      `?${stringify({ ...params, ...query })}`
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncer = useCallback(
    debounce(handleRefetch, DEFAULT_DEBOUNCE_MS),
    []
  );

  useEffect(
    () => {
      if (isFirstQuery) {
        // refetch every time **except** after the first query (to avoid a double-query on first render)
        setIsFirstQuery(false);
      } else {
        void debouncer({ path: pathSearchValue, pattern: patternSearchValue });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathSearchValue, patternSearchValue]
  );

  return (
    <div>
      <div className="mb-6 flex gap-6">
        <div>
          <div className="form-label-container">
            <div className="form-label">
              Directory
              <Tooltip
                className="tooltip-holder"
                data-tip="The directory in which you'd like to search for files"
              />
              <ReactTooltip
                multiline
                data-place="top"
                data-type="dark"
                data-effect="float"
              />
            </div>
          </div>
          <Input
            disabled={error != null}
            prefixIconName="search"
            placeholder="/foo/bar"
            value={pathSearchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPathSearchValue(e.target.value)
            }
            name="path"
          />
        </div>
        <Input
          disabled={error != null}
          prefixIconName="search"
          placeholder="\.txt$"
          value={patternSearchValue}
          label="File Pattern"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPatternSearchValue(e.target.value)
          }
          name="pattern"
        />
      </div>
      {!loading && !error ? (
        <ReactJson
          src={
            JSON.parse(data?.endpointTree as string) as Record<string, unknown>
          }
          name={null}
          displayDataTypes={false}
          indentWidth={2}
        />
      ) : (
        !error && <ClipLoader />
      )}
    </div>
  );
}

export default EndpointTreeView;

import { LazyQueryExecFunction, OperationVariables } from "@apollo/client";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import {
  ButtonClickEventTypes,
  Clickable,
} from "../../../common/ui-components";

interface AuditableJsonFieldProps {
  graphqlQuery: unknown;
  queryVariables: object;
  fieldName: string;
}

type LazyQueryFunctionType = (
  queryArgs: Record<string, unknown>
) => [getFullField: LazyQueryExecFunction<ResponseType, OperationVariables>];

type ResponseType = { [key: string]: string };

function AuditableJsonField({
  graphqlQuery,
  queryVariables,
  fieldName,
}: AuditableJsonFieldProps) {
  const [showFullField, setShowFullField] = useState<boolean>(false);
  const [displayedFullField, setDisplayedFullField] = useState<string>("");

  const [getFullField] = (graphqlQuery as LazyQueryFunctionType)({
    variables: queryVariables,
  });

  async function handleClick(event: ButtonClickEventTypes) {
    event.stopPropagation();

    if (showFullField) {
      setDisplayedFullField("");
    } else {
      await getFullField().then((result) => {
        if (result.data === undefined) {
          setDisplayedFullField("");
        } else {
          setDisplayedFullField(result.data[fieldName]);
        }
      });
    }
    setShowFullField(!showFullField);
  }

  return showFullField && displayedFullField ? (
    <ReactJson
      src={JSON.parse(displayedFullField) as Record<string, unknown>}
      name={null}
      displayObjectSize={false}
      displayDataTypes={false}
    />
  ) : (
    <>
      <div className="mr-2">{`{ •••• }`}</div>
      <Clickable
        onClick={(e) => {
          handleClick(e).catch(() => {});
        }}
        id="show-pii-field-btn"
      >
        <span
          className="text-green-500 hover:text-green-600"
          data-dd-action-name="show/hide action"
        >
          {showFullField ? "Hide" : "Show"}
        </span>
      </Clickable>
    </>
  );
}

export default AuditableJsonField;

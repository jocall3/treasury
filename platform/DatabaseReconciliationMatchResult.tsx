import React, { useState } from "react";
import {
  MatchResult,
  useMatchResultQuery,
} from "../../generated/dashboard/graphqlSchema";
import {
  Label,
  Icon,
  Modal,
  ModalContainer,
  ModalFooter,
  Button,
  Stack,
  Chip,
  Clickable,
} from "../../common/ui-components";
import StringReconciliationMatchResult from "./StringReconciliationMatchResult";
import DateOffsetReconciliationMatchResult from "./DateOffsetReconciliationMatchResult";
import PaymentReferenceReconciliationMatchResult from "./PaymentReferenceReconciliationMatchResult";
import FromTransactionReconciliationMatchResult from "./FromTransactionReconciliationMatchResult";
import GroupByReconciliationMatchResult from "./GroupByReconciliationMatchResult";
import BooleanReconciliationMatchResult from "./BooleanReconciliationMatchResult";
import { cn } from "~/common/utilities/cn";

interface DatabaseReconciliationMatchResultProps {
  matchResult: MatchResult;
  strategyName: string;
  matcherType: string;
  transactionId: string;
  callback: (
    id: string,
    matcher: string,
    parser: string,
    transactionField: string,
    matchResultType: string,
    modified: boolean,
    tentative: boolean
  ) => void;
  clickable: boolean;
  modalOpen?: boolean;
  removable?: boolean;
}

function DatabaseReconciliationMatchResult({
  matchResult,
  strategyName,
  matcherType,
  transactionId,
  callback,
  clickable,
  modalOpen = false,
  removable = true,
}: DatabaseReconciliationMatchResultProps) {
  const matcherId = strategyName + matcherType + matchResult.field;
  const [initialMatcherValue] = useState(matchResult.matcher);
  const [currentMatcherValue, setCurrentMatcherValue] = useState<string | null>(
    initialMatcherValue
  );
  const [tempMatcherValue, setTempMatcherValue] = useState(
    initialMatcherValue || null
  );
  const [updatedMatcherValue, setUpdatedMatcherValue] = useState(
    initialMatcherValue || null
  );
  const [offsetStart, setOffsetStart] = useState(matchResult.startOffset);
  const [offsetEnd, setOffsetEnd] = useState(matchResult.endOffset);
  const [currentMatched, setCurrentMatched] = useState(matchResult.match);
  const [expectedValue, setExpectedValue] = useState(matchResult.expected);
  const [actualValue, setActualValue] = useState(matchResult.actual);
  const selectFieldLabelMap = {
    equals: "Equals",
    matches_regex: "Matches",
    date_offset: "Between",
    payment_reference: "Payment Reference",
    short_id: "Short ID",
    from_transaction: "From Transaction",
    is_true: "Is True",
    is_false: "Is False",
    is_null: "Is Null",
    any: "Any",
    group_by: "Group By",
  };
  const selectFieldReverseLabelMap = {
    Equals: "equals",
    Matches: "matches_regex",
    Between: "date_offset",
    "Payment Reference": "payment_reference",
    "Short ID": "short_id",
    "From Transaction": "from_transaction",
    "Is True": "is_true",
    "Is False": "is_false",
    "Is Null": "is_null",
    Any: "any",
    "Group By": "group_by",
  };
  const [isModalOpen, setIsModalOpen] = useState(modalOpen);
  const [wasTentative] = useState(modalOpen);
  const [isTentative, setIsTentative] = useState(modalOpen);
  const newMatcher = matchResult.suggestedMatcher === "-new matcher-";
  const [hoverState, setHoverState] = useState(false);
  const [isRemovable] = useState(removable);
  const [openRemoveMatcherModal, setOpenRemoveMatcherModal] = useState(false);
  const [currentSelectField, setCurrentSelectField] = useState(
    matchResult.matchResultType
      ? (selectFieldLabelMap[matchResult.matchResultType] as string)
      : null
  );
  const [tempMatchResultType, setTempMatchResultType] = useState(
    matchResult.matchResultType
  );
  const [updatedMatchResultType, setUpdatedMatchResultType] = useState(
    matchResult.matchResultType
  );
  const [tempSelectField, setTempSelectField] = useState(currentSelectField);
  const [parserValue, setParserValue] = useState(matchResult.parser);
  const [updatedParserValue, setUpdatedParserValue] = useState(
    matchResult.parser
  );
  const [showParserValue, setShowParserValue] = useState(!!matchResult.parser);
  const [tempPaymentReferenceTypeValue, setTempPaymentReferenceTypeValue] =
    useState<string | undefined>(matchResult.matcher);
  const [transactionFieldValue, setTransactionFieldValue] = useState(
    matchResult.transactionField
  );
  const [updatedTransactionFieldValue, setUpdatedTransactionFieldValue] =
    useState(matchResult.transactionField);
  const [tempTransactionField, setTempTransactionField] = useState(
    matchResult.transactionField
  );
  const [startDateValue, setStartDateValue] = useState(matchResult.startDate);
  const [updatedStartDateValue, setUpdatedStartDateValue] = useState(
    matchResult.startDate
  );
  const [endDateValue, setEndDateValue] = useState(matchResult.endDate);
  const [updatedEndDateValue, setUpdatedEndDateValue] = useState(
    matchResult.endDate
  );
  const selectFieldOptions = [
    {
      label: "Equals",
      value: "Equals",
    },
    {
      label: "Matches Regex",
      value: "Matches",
    },
    {
      label: "Within Date Range",
      value: "Between",
    },
    {
      label: "Payment Reference",
      value: "Payment Reference",
    },
    {
      label: "Short ID",
      value: "Short ID",
    },
    {
      label: "From Transaction",
      value: "From Transaction",
    },
    {
      label: "Is True",
      value: "Is True",
    },
    {
      label: "Is False",
      value: "Is False",
    },
    {
      label: "Is Null",
      value: "Is Null",
    },
    {
      label: "Is Anything",
      value: "Any",
    },
  ];

  const { data: matchResultData } = useMatchResultQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      transactionId,
      matcherInput: {
        id: matcherId,
        strategyName,
        field: matchResult.field,
        matcherType,
        matcher: tempMatcherValue,
        transactionField: transactionFieldValue,
        parser: parserValue,
        matchResultType: tempMatchResultType,
        startDate: startDateValue,
        endDate: endDateValue,
      },
    },
  });

  const matchResultCallback = (
    matchResultType: string | null | undefined,
    matcher: string | null | undefined,
    parser: string | null | undefined,
    showParser: boolean | null | undefined,
    transactionField: string | null | undefined,
    startDate: string | null | undefined,
    endDate: string | null | undefined
  ) => {
    setExpectedValue(matchResultData?.matchResult?.expected || "");
    setActualValue(matchResultData?.matchResult?.actual || "");

    if (matchResultType) {
      setTempMatchResultType(
        selectFieldReverseLabelMap[matchResultType] as string
      );
      setTempSelectField(matchResultType);
    }
    setTempMatcherValue(matcher || null);
    setParserValue(parser);
    setShowParserValue(showParser || false);
    setTransactionFieldValue(transactionField);
    setStartDateValue(startDate);
    setEndDateValue(endDate);
  };

  const matchResultHasChanged = () => {
    if (!matchResultData) {
      return false;
    }

    return (
      matchResult.matchResultType !==
        matchResultData.matchResult.matchResultType ||
      matchResult.matcher !== matchResultData.matchResult.matcher ||
      (matchResult.parser || null) !== matchResultData.matchResult.parser ||
      (matchResult.transactionField || null) !==
        matchResultData.matchResult.transactionField ||
      matchResult.startDate !== matchResultData.matchResult.startDate ||
      matchResult.endDate !== matchResultData.matchResult.endDate
    );
  };

  const matchResultIsEdited = () => {
    if (!matchResultData) {
      return false;
    }

    return (
      selectFieldReverseLabelMap[currentSelectField || ""] !==
        tempMatchResultType ||
      currentMatcherValue !== tempMatcherValue ||
      matchResultData.matchResult.parser !== parserValue ||
      matchResultData.matchResult.transactionField !== transactionFieldValue ||
      matchResultData.matchResult.startDate !== startDateValue ||
      matchResultData.matchResult.endDate !== endDateValue
    );
  };

  const matchResultIsUpdated = () => {
    if (!matchResultData) {
      return false;
    }

    return (
      matchResult.matchResultType !== updatedMatchResultType ||
      (matchResult.matcher !== updatedMatcherValue &&
        matchResult.matcher !== "" &&
        updatedMatcherValue !== null) ||
      matchResult.parser !== updatedParserValue ||
      matchResult.transactionField !== updatedTransactionFieldValue ||
      matchResult.startDate !== updatedStartDateValue ||
      matchResult.endDate !== updatedEndDateValue
    );
  };

  const updateDisabled = () => {
    if (matcherType === "payment_reference") {
      return !tempMatcherValue || !transactionFieldValue;
    }
    if (matcherType === "group_by") {
      const matchers =
        tempMatcherValue &&
        tempMatcherValue
          .slice(1, -1)
          .split(", ")
          .map((p) => p.slice(1));

      return Boolean(matchers && matchers.length === 1 && matchers[0] === "");
    }

    return false;
  };

  const groupByMatchers =
    currentSelectField === "Group By"
      ? currentMatcherValue
          ?.slice(1, -1)
          .split(", ")
          .map((p) => p.slice(1))
      : null;

  const matcherChips = (classNames: string, matched, hover) => {
    const rightChipClass = `${matched ? "rounded-r" : ""}`;
    let contentClasses = "";

    if (matched) {
      if (hover && clickable) {
        contentClasses = "bg-gray-500 text-white hover:cursor-pointer";
      } else {
        contentClasses = "";
      }
    } else if (hover && clickable) {
      contentClasses = "bg-red-500 text-white hover:cursor-pointer";
    } else {
      contentClasses = "bg-red-300 text-gray-900";
    }

    return (
      <Stack className={cn("overflow-hidden", classNames)}>
        {currentSelectField === "Equals" || currentSelectField === "Matches" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={contentClasses}>{currentSelectField}</Chip>
            <Chip
              className="whitespace-nowrap"
              contentClassName={`${contentClasses} ${rightChipClass}`}
            >
              {currentMatcherValue}
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Any" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              Is Anything
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Between" && offsetStart === offsetEnd && (
          <div className={`flex gap-px `}>
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={contentClasses}>Is </Chip>
            <Chip contentClassName={contentClasses}>{offsetStart}</Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              Business Days
            </Chip>
          </div>
        )}
        {currentSelectField === "Between" && offsetStart !== offsetEnd && (
          <div className={`flex gap-px `}>
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={contentClasses}>Is Between</Chip>
            <Chip contentClassName={contentClasses}>
              {offsetStart}..{offsetEnd}
            </Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              Business Days
            </Chip>
          </div>
        )}
        {currentSelectField === "Is Null" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              {currentSelectField}
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Payment Reference" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {tempPaymentReferenceTypeValue}
            </Chip>
            <Chip contentClassName={contentClasses}>Parsed From</Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              {tempTransactionField}
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Short ID" ||
        currentSelectField === "From Transaction" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={contentClasses}>From Transaction</Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              {currentMatcherValue}
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Is True" ||
        currentSelectField === "Is False" ? (
          <div className="flex gap-px">
            <Chip contentClassName={`${contentClasses} rounded-l`}>
              {matchResult.field}
            </Chip>
            <Chip contentClassName={`${contentClasses} ${rightChipClass}`}>
              {currentSelectField}
            </Chip>
          </div>
        ) : null}
        {currentSelectField === "Group By" ? (
          <div className="flex gap-px overflow-x-scroll">
            {groupByMatchers?.map((m, i) => (
              <Chip
                contentClassName={`${i === 0 ? "rounded-l" : ""} ${
                  i === (groupByMatchers?.length || 1) - 1 ? "rounded-r" : ""
                } ${contentClasses}`}
              >
                {m}
              </Chip>
            ))}
          </div>
        ) : null}
      </Stack>
    );
  };

  return (
    <div className="pr-2">
      <Modal
        isOpen={clickable && isModalOpen}
        title={matchResult.field}
        onRequestClose={() => {
          if (!isTentative) setIsModalOpen(false);
        }}
      >
        <ModalContainer>
          <div className="p-2">
            <div className="flex">
              <Label className="flex pb-2 pl-4 text-base font-medium">
                {matchResult.field}
              </Label>

              <div className="ml-auto flex pl-2 pr-2">
                {matchResultHasChanged() && !wasTentative ? (
                  <Clickable
                    onClick={() => {
                      matchResultCallback(
                        matchResult.matchResultType
                          ? (selectFieldLabelMap[
                              matchResult.matchResultType
                            ] as string)
                          : currentSelectField,
                        matchResult.matcher,
                        matchResult.parser,
                        !!matchResult.parser,
                        matchResult.transactionField,
                        matchResult.startDate || null,
                        matchResult.endDate || null
                      );
                    }}
                  >
                    <div className="mb-2 flex rounded-sm  border px-2">
                      <Icon
                        className="self-center text-gray-500"
                        iconName="sync"
                        color="currentColor"
                        size="s"
                      />
                      <Label className="flex self-center p-1 text-xs hover:cursor-pointer">
                        Reset Change
                      </Label>
                    </div>
                  </Clickable>
                ) : null}
              </div>
              {matchResultData?.matchResult.match ? (
                <Icon
                  className="justify-right flex pb-2 text-green-500"
                  iconName="checkmark_circle"
                  color="currentColor"
                  size="l"
                />
              ) : (
                <Icon
                  className="justify-right flex pb-2 text-red-500"
                  iconName="remove_circle"
                  color="currentColor"
                  size="l"
                />
              )}
            </div>

            <div className="border-mt-gray-200 border-t p-2" />
            <div className="form-row flex w-full border-b-2 border-gray-50">
              {tempSelectField === "Equals" ||
              tempSelectField === "Matches" ||
              tempSelectField === "Any" ||
              tempSelectField === "Is Null" ? (
                <StringReconciliationMatchResult
                  selectField={tempSelectField}
                  selectFieldOptions={selectFieldOptions.filter(
                    (op) =>
                      matchResultData?.matchResult?.matchResultTypeOptions
                        ?.map((o) => selectFieldLabelMap[o] as string)
                        ?.includes(op.value)
                  )}
                  matcher={tempMatcherValue}
                  suggestedMatcher={
                    matchResultData?.matchResult?.suggestedMatcher
                  }
                  callback={matchResultCallback}
                />
              ) : null}
              {tempSelectField === "Between" ? (
                <DateOffsetReconciliationMatchResult
                  selectField={tempSelectField}
                  selectFieldOptions={selectFieldOptions.filter(
                    (op) =>
                      matchResultData?.matchResult?.matchResultTypeOptions
                        ?.map((o) => selectFieldLabelMap[o] as string)
                        ?.includes(op.value)
                  )}
                  matcher={tempMatcherValue || ""}
                  startOffset={matchResultData?.matchResult?.startOffset}
                  endOffset={matchResultData?.matchResult?.endOffset}
                  startDate={matchResultData?.matchResult?.startDate}
                  endDate={matchResultData?.matchResult?.endDate}
                  callback={matchResultCallback}
                />
              ) : null}
              {tempSelectField === "Payment Reference" ? (
                <PaymentReferenceReconciliationMatchResult
                  selectFieldOptions={
                    matchResultData?.matchResult?.matchResultTypeOptions?.map(
                      (e) => ({ label: e, value: e })
                    ) || []
                  }
                  matcher={tempMatcherValue}
                  referenceValue={matchResultData?.matchResult?.expected}
                  parser={parserValue}
                  showParser={showParserValue}
                  transactionField={transactionFieldValue}
                  transactionFieldString={
                    matchResultData?.matchResult?.transactionFieldValue
                  }
                  suggestedMatcher={
                    matchResultData?.matchResult?.suggestedMatcher
                  }
                  callback={matchResultCallback}
                />
              ) : null}
              {tempSelectField === "Short ID" ||
              tempSelectField === "From Transaction" ? (
                <FromTransactionReconciliationMatchResult
                  selectField={tempSelectField}
                  selectFieldOptions={selectFieldOptions.filter(
                    (op) =>
                      matchResultData?.matchResult?.matchResultTypeOptions
                        ?.map((o) => selectFieldLabelMap[o] as string)
                        ?.includes(op.value)
                  )}
                  matcher={tempMatcherValue}
                  parser={parserValue}
                  showParser={showParserValue}
                  transactionField={transactionFieldValue}
                  transactionFieldString={
                    matchResultData?.matchResult?.transactionFieldValue
                  }
                  suggestedMatcher={
                    matchResultData?.matchResult?.suggestedMatcher
                  }
                  callback={matchResultCallback}
                />
              ) : null}
              {tempSelectField === "Is True" ||
              tempSelectField === "Is False" ? (
                <BooleanReconciliationMatchResult
                  selectField={tempSelectField}
                  selectFieldOptions={selectFieldOptions.filter(
                    (op) =>
                      matchResultData?.matchResult?.matchResultTypeOptions
                        ?.map((o) => selectFieldLabelMap[o] as string)
                        ?.includes(op.value)
                  )}
                  callback={matchResultCallback}
                />
              ) : null}
              {tempSelectField === "Group By" ? (
                <GroupByReconciliationMatchResult
                  selectFieldOptions={(
                    matchResultData?.matchResult?.matchResultTypeOptions ||
                    matchResult.matchResultTypeOptions ||
                    []
                  ).map((e) => ({ value: e, label: e }))}
                  matcher={tempMatcherValue}
                  groupBy={matchResultData?.matchResult?.groupBy}
                  groupByGroups={matchResultData?.matchResult?.groupByGroups}
                  suggestedMatcher={
                    matchResultData?.matchResult?.suggestedMatcher
                  }
                  callback={matchResultCallback}
                />
              ) : null}
            </div>

            <div className="flex flex-col pt-2">
              <div className="flex">
                <Label className="justify-right ml-auto flex self-center pb-1 pr-1 font-medium">
                  Expected:
                </Label>
                <Label className="flex break-all pb-1">
                  {matchResultData?.matchResult?.expected || expectedValue}
                </Label>
              </div>
              <div className="form-row flex w-full border-t border-gray-25 pb-2" />
              <div className="flex">
                <Label className="justify-right ml-auto flex self-center pb-2 pl-6 pr-1 font-medium">
                  Actual:
                </Label>
                <Label className="flex pb-2">
                  {matchResultData?.matchResult?.actual || actualValue}
                </Label>
              </div>
            </div>
          </div>

          <ModalFooter className="-mt-3 border-none">
            <div className="flex w-full space-x-4">
              <Button
                buttonType="secondary"
                className="flex-1"
                onClick={() => {
                  setIsModalOpen(false);
                  setTempMatchResultType(updatedMatchResultType);
                  setTempMatcherValue(updatedMatcherValue);
                  if (isTentative)
                    callback(matcherId, "", "", "", "", false, true);
                }}
              >
                Cancel
              </Button>
              <Button
                id="reconcile-items-button"
                buttonType="primary"
                isSubmit
                disabled={
                  (!matchResultHasChanged() &&
                    !matchResultIsEdited() &&
                    !matchResultIsUpdated() &&
                    !isTentative) ||
                  matchResultData === null ||
                  updateDisabled()
                }
                className="flex-1"
                onClick={() => {
                  setIsModalOpen(false);
                  setUpdatedMatcherValue(tempMatcherValue);
                  setUpdatedMatchResultType(tempMatchResultType);
                  setUpdatedParserValue(parserValue);
                  setUpdatedTransactionFieldValue(transactionFieldValue);
                  setUpdatedStartDateValue(startDateValue);
                  setUpdatedEndDateValue(endDateValue);
                  setCurrentSelectField(tempSelectField);

                  const matcherVal =
                    tempSelectField === "Between"
                      ? `${String(
                          matchResultData?.matchResult?.startOffset
                        )}..${String(matchResultData?.matchResult?.endOffset)}`
                      : tempMatcherValue;

                  setTempMatcherValue(matcherVal);
                  setCurrentMatcherValue(matcherVal);
                  setCurrentMatched(
                    matchResultData?.matchResult.match || false
                  );
                  setOffsetStart(matchResultData?.matchResult?.startOffset);
                  setOffsetEnd(matchResultData?.matchResult?.endOffset);
                  setTempTransactionField(
                    matchResultData?.matchResult?.transactionField
                  );
                  setTempPaymentReferenceTypeValue(
                    matchResultData?.matchResult?.matcher
                  );
                  callback(
                    matcherId,
                    matcherVal || "",
                    parserValue || "",
                    transactionFieldValue || "",
                    tempMatchResultType || "",
                    matchResultHasChanged() ||
                      matchResultIsEdited() ||
                      isTentative,
                    false
                  );
                  setIsTentative(false);
                }}
              >
                {isTentative ? "Add Matcher" : "Update"}
              </Button>
            </div>
          </ModalFooter>
        </ModalContainer>
      </Modal>

      <div
        className="mb-1 flex w-full"
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}
      >
        {matchResultIsUpdated() || newMatcher ? (
          <Icon
            className="mr-1 self-center text-blue-400"
            iconName="circle"
            color="currentColor"
            size="s"
          />
        ) : (
          <Icon
            className="mr-1 self-center text-white"
            iconName="circle"
            color="currentColor"
            size="s"
          />
        )}

        <Clickable
          onClick={() => setIsModalOpen(true)}
          cursorStyle={clickable ? "pointer" : "default"}
        >
          <div
            className={`flex w-full flex-row justify-start overflow-hidden rounded  ${
              currentMatched
                ? ""
                : `bg-red-300 ${clickable ? "hover:bg-red-500" : ""}`
            }`}
          >
            {matcherChips("", currentMatched, hoverState)}

            {!currentMatched ? (
              <div className="ml-auto flex self-center">
                <Label className="mr-1 whitespace-nowrap italic text-red-600">
                  {clickable ? "Click to debug" : "Unmatched"}
                </Label>
                <Icon
                  className="mr-1 text-red-500"
                  iconName="error_outlined"
                  color="currentColor"
                  size="m"
                />
              </div>
            ) : null}
          </div>
        </Clickable>
        {(!hoverState || !isRemovable || !clickable) && (
          <Clickable onClick={() => null}>
            <div className="self-center">
              <Icon
                className="ml-1 self-center text-white"
                iconName="remove"
                color="currentColor"
                size="m"
                alignment="baseline"
              />
            </div>
          </Clickable>
        )}
        {hoverState && isRemovable && clickable && (
          <Clickable onClick={() => setOpenRemoveMatcherModal(true)}>
            <div className="self-center">
              <Icon
                className="ml-1 self-center text-gray-400"
                iconName="remove"
                color="currentColor"
                size="m"
                alignment="baseline"
              />
            </div>
          </Clickable>
        )}

        <Modal
          isOpen={openRemoveMatcherModal}
          title="Remove Matcher"
          onRequestClose={() => setOpenRemoveMatcherModal(false)}
        >
          <ModalContainer>
            <div className="p-2 py-4">
              <Label className="ml-auto mr-auto flex">
                Remove <b className="px-1">{matchResult.field}</b> matcher?
              </Label>
              {matcherChips("flex justify-center pt-2", true, false)}
            </div>

            <ModalFooter className="-mt-3 border-none">
              <div className="flex w-full space-x-4">
                <Button
                  buttonType="secondary"
                  className="flex-1"
                  onClick={() => {
                    setOpenRemoveMatcherModal(false);
                  }}
                >
                  Wait nevermind
                </Button>
                <Button
                  id="reconcile-items-button"
                  buttonType="primary"
                  isSubmit
                  className="flex-1"
                  onClick={() => {
                    callback(
                      matcherId,
                      "",
                      "",
                      selectFieldReverseLabelMap[
                        currentSelectField as string
                      ] as string,
                      "",
                      true,
                      true
                    );
                  }}
                >
                  Okay
                </Button>
              </div>
            </ModalFooter>
          </ModalContainer>
        </Modal>
      </div>
    </div>
  );
}

export default DatabaseReconciliationMatchResult;

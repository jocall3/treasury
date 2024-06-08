import React, { useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik, FormikProps } from "formik";
import { cn } from "~/common/utilities/cn";
import {
  MatchResult,
  MatchResultInput,
  Strategy,
  useReviewReconciliationStrategyMutation,
  useUpdateReconciliationStrategyMutation,
  useReconciliationStrategyResultLazyQuery,
  StrategyInput,
} from "../../generated/dashboard/graphqlSchema";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Clickable,
  FieldsRow,
  Icon,
  Label,
  Modal,
  ModalContainer,
  ModalFooter,
  SelectField,
  Toggle,
  Tooltip,
} from "../../common/ui-components";
import { FormikInputField } from "../../common/formik";
import colors from "../../common/styles/colors";
import DatabaseReconciliationMatchResult from "./DatabaseReconciliationMatchResult";
import EntityTableView from "./EntityTableView";
import { useDispatchContext } from "../MessageProvider";

const STYLE_MAPPING = {
  entityId: "table-entry-wide table-entry-hide-small",
};

const RESULT_MAPPING: Record<string, Record<string, string>> = {
  PaperItem: {
    __typename: "Transactable Type",
    id: "ID",
    amount: "Amount",
  },
  IncomingPaymentDetail: {
    __typename: "Transactable Type",
    id: "ID",
    prettyAmount: "Amount",
    prettyDirection: "Direction",
  },
  Return: {
    __typename: "Transactable Type",
    id: "ID",
    amount: "Amount",
  },
  Reversal: {
    __typename: "Transactable Type",
    id: "ID",
    paymentOrderAmount: "Amount",
  },
  ExpectedPayment: {
    __typename: "Transactable Type",
    id: "ID",
    prettyAmountRange: "Amount Range",
  },
  PaymentOrder: {
    __typename: "Transactable Type",
    id: "ID",
    prettyAmount: "Amount",
    prettyDirection: "Direction",
  },
};

interface DatabaseReconciliationStrategyProps {
  strategy: Strategy;
  transactionId: string;
}

function DatabaseReconciliationStrategy({
  strategy,
  transactionId,
}: DatabaseReconciliationStrategyProps) {
  interface FormValues {
    reconEnabledIf?: string | null | undefined;
    reconDisabledIf?: string | null | undefined;
  }

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const needsApproval = strategy.status === "needs_review";
  const [showReconResults, setShowReconResults] = useState(false);
  const [strategyName, setStrategyName] = useState(strategy.name);
  const [transactableMatchResultState, setTransactableMatchResultState] =
    useState<MatchResult[]>(strategy.transactableMatchResults || []);
  const [transactionMatchResultState, setTransactionMatchResultState] =
    useState<MatchResult[]>(strategy.transactionMatchResults || []);
  const matchResults = transactableMatchResultState.concat(
    transactionMatchResultState
  );

  const [
    transactableMatchResultInputState,
    setTransactableMatchResultInputState,
  ] = useState<MatchResultInput[]>(
    transactableMatchResultState.map((mr) => ({
      id: strategy.name + mr.matcherType + mr.field,
      matchResultType: mr.matchResultType,
      strategyName: strategy.name,
      field: mr.field,
      matcherType: mr.matcherType,
      matcher: mr.matcher,
      transactionField: mr.transactionField,
      parser: mr.parser,
      systemDefault: mr.systemDefault,
    }))
  );
  const [
    transactionMatchResultInputState,
    setTransactionMatchResultInputState,
  ] = useState<MatchResultInput[]>(
    transactionMatchResultState
      .filter((mr) => mr.field !== "reconciled")
      .map((mr) => ({
        id: strategy.name + mr.matcherType + mr.field,
        matchResultType: mr.matchResultType,
        strategyName: strategy.name,
        field: mr.field,
        matcherType: mr.matcherType,
        matcher: mr.matcher,
        transactionField: mr.transactionField,
        parser: mr.parser,
        systemDefault: mr.systemDefault,
      }))
  );
  const [
    paymentReferenceMatchResultState,
    setPaymentReferenceMatchResultState,
  ] = useState<MatchResult | null>(
    strategy.paymentReferenceMatchResult || null
  );
  const [
    paymentReferenceMatchResultInputState,
    setPaymentReferenceMatchResultInputState,
  ] = useState<MatchResultInput | null>(
    strategy.paymentReferenceMatchResult
      ? {
          id: "payment_reference",
          matchResultType: "payment_reference",
          strategyName: strategy.name,
          field: strategy.paymentReferenceMatchResult.field,
          matcherType: strategy.paymentReferenceMatchResult.matcherType,
          matcher: strategy.paymentReferenceMatchResult.matcher,
          transactionField:
            strategy.paymentReferenceMatchResult?.transactionField,
          parser: strategy.paymentReferenceMatchResult.parser,
          systemDefault: false,
        }
      : null
  );
  const [groupByState, setGroupByState] = useState<string[]>(strategy.groupBy);

  const [updatedMatchers, setUpdatedMatchers] = useState<string[]>([]);

  const [removedTransactableMatchers, setRemovedTransactableMatchers] =
    useState<string[]>([]);
  const [removedTransactionMatchers, setRemovedTransactionMatchers] = useState<
    string[]
  >([]);

  const matchResultCallback = (
    id: string,
    matcher: string,
    parser: string,
    transactionField: string,
    matchResultType: string,
    modified: boolean,
    tentative: boolean
  ) => {
    if (tentative) {
      setTransactableMatchResultState(
        transactableMatchResultState.filter(
          (mr) => `${strategy.name}${mr.matcherType}${mr.field}` !== id
        )
      );

      setTransactionMatchResultState(
        transactionMatchResultState.filter(
          (mr) => `${strategy.name}${mr.matcherType}${mr.field}` !== id
        )
      );

      setTransactableMatchResultInputState(
        transactableMatchResultInputState.filter((mr) => mr.id !== id)
      );

      setTransactionMatchResultInputState(
        transactionMatchResultInputState.filter((mr) => mr.id !== id)
      );

      if (
        strategy.transactableMatchResults
          ?.map((mr) => `${strategy.name}${mr.matcherType}${mr.field}`)
          ?.includes(id)
      ) {
        setRemovedTransactableMatchers([...removedTransactableMatchers, id]);
      }

      if (
        strategy.transactionMatchResults
          ?.map((mr) => `${strategy.name}${mr.matcherType}${mr.field}`)
          ?.includes(id)
      ) {
        setRemovedTransactionMatchers([...removedTransactionMatchers, id]);
      }

      if (id.endsWith("payment_reference")) {
        setPaymentReferenceMatchResultState(null);
        setPaymentReferenceMatchResultInputState(null);
      }
    } else {
      setTransactableMatchResultInputState(
        transactableMatchResultInputState.map((mri) => {
          if (mri.id === id) {
            return {
              ...mri,
              matcher,
              parser,
              matchResultType,
            };
          }
          return mri;
        })
      );
      setTransactionMatchResultInputState(
        transactionMatchResultInputState.map((mri) => {
          if (mri.id === id) {
            return { ...mri, matcher, matchResultType };
          }
          return mri;
        })
      );

      if (id.endsWith("group_by")) {
        const groupBy = matcher
          .slice(1, -1)
          .split(", ")
          .map((e) => e.slice(1));
        setGroupByState(groupBy);
      }

      if (id.endsWith("payment_reference")) {
        setPaymentReferenceMatchResultInputState({
          id,
          matchResultType,
          strategyName: strategy.name,
          field: "payment_reference",
          matcherType: "payment_reference",
          matcher,
          transactionField,
          parser,
          systemDefault: false,
        });
      }
    }

    if (modified) {
      setUpdatedMatchers([...updatedMatchers.filter((m) => m !== id), id]);
    } else {
      setUpdatedMatchers(updatedMatchers.filter((m) => m !== id));
    }

    if (removedTransactableMatchers.includes(id)) {
      setRemovedTransactableMatchers(
        removedTransactableMatchers.filter((rid) => rid !== id)
      );
    }
    if (removedTransactionMatchers.includes(id)) {
      setRemovedTransactionMatchers(
        removedTransactionMatchers.filter((rid) => rid !== id)
      );
    }
  };

  const { dispatchError } = useDispatchContext();

  const [
    updateReconciliationStrategy,
    { data: updateStrategyData, loading: updateStrategyLoading },
  ] = useUpdateReconciliationStrategyMutation();

  const [reviewReconciliationStrategy] =
    useReviewReconciliationStrategyMutation();

  const [amountMismatchToggle, setAmountMismatchToggle] = useState(
    strategy.allowAmountMismatch
  );
  const [ambiguousToggle, setAmbiguousToggle] = useState(
    strategy.allowAmbiguous
  );
  const [customToggle, setCustomToggle] = useState(strategy.custom);
  const [priority, setPriority] = useState(strategy.priority);
  const [resetToggle, setResetToggle] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [note, setNote] = useState<string | undefined>(undefined);

  const initialValues = {
    reconDisabledIf: strategy.reconDisabledIf,
    reconEnabledIf: strategy.reconEnabledIf,
  };

  const optionsHasChanged = () => {
    const reconEnabled =
      formikRef?.current?.values?.reconEnabledIf === undefined ||
      formikRef?.current?.values?.reconEnabledIf === ""
        ? null
        : formikRef?.current?.values?.reconEnabledIf;
    const reconDisabled =
      formikRef?.current?.values?.reconDisabledIf === undefined ||
      formikRef?.current?.values?.reconDisabledIf === ""
        ? null
        : formikRef?.current?.values?.reconDisabledIf;

    return (
      ambiguousToggle !== strategy.allowAmbiguous ||
      amountMismatchToggle !== strategy.allowAmountMismatch ||
      customToggle !== strategy.custom ||
      priority !== strategy.priority ||
      reconEnabled !== strategy.reconEnabledIf ||
      reconDisabled !== strategy.reconDisabledIf
    );
  };

  const strategyHasChanged = () =>
    updatedMatchers.length > 0 ||
    optionsHasChanged() ||
    (strategyName !== strategy.name && strategy.status !== "tentative");

  const resetStrategy = () => {
    setStrategyName(strategy.name);
    setTransactableMatchResultState(strategy.transactableMatchResults || []);
    setTransactionMatchResultState(strategy.transactionMatchResults || []);

    setTransactableMatchResultInputState(
      (strategy.transactableMatchResults || []).map((mr) => ({
        id: strategy.name + mr.matcherType + mr.field,
        matchResultType: mr.matchResultType,
        strategyName: strategy.name,
        field: mr.field,
        matcherType: mr.matcherType,
        matcher: mr.matcher,
        transactionField: mr.transactionField,
        parser: mr.parser,
        systemDefault: mr.systemDefault,
      }))
    );
    setTransactionMatchResultInputState(
      (strategy.transactionMatchResults || [])
        .filter((mr) => mr.field !== "reconciled")
        .map((mr) => ({
          id: strategy.name + mr.matcherType + mr.field,
          matchResultType: mr.matchResultType,
          strategyName: strategy.name,
          field: mr.field,
          matcherType: mr.matcherType,
          matcher: mr.matcher,
          transactionField: mr.transactionField,
          parser: mr.parser,
          systemDefault: mr.systemDefault,
        }))
    );
    setRemovedTransactableMatchers([]);
    setRemovedTransactionMatchers([]);

    setPaymentReferenceMatchResultState(
      strategy.paymentReferenceMatchResult || null
    );
    setPaymentReferenceMatchResultInputState(
      strategy.paymentReferenceMatchResult
        ? {
            id: "payment_reference",
            matchResultType: "payment_reference",
            strategyName: strategy.name,
            field: strategy.paymentReferenceMatchResult.field,
            matcherType: strategy.paymentReferenceMatchResult.matcherType,
            matcher: strategy.paymentReferenceMatchResult.matcher,
            transactionField:
              strategy.paymentReferenceMatchResult?.transactionField,
            parser: strategy.paymentReferenceMatchResult.parser,
            systemDefault: false,
          }
        : null
    );

    setGroupByState(strategy.groupBy);

    setAmountMismatchToggle(strategy.allowAmountMismatch);
    setAmbiguousToggle(strategy.allowAmbiguous);
    setCustomToggle(strategy.custom);
    setPriority(strategy.priority);
    void formikRef?.current?.setValues({
      reconEnabledIf: strategy.reconEnabledIf || "",
      reconDisabledIf: strategy.reconDisabledIf || "",
    });

    setUpdatedMatchers([]);
    setResetToggle(!resetToggle);
  };

  const [
    getReconciliationStrategyResults,
    { loading: resultsLoading, data: resultsData, error: resultsError },
  ] = useReconciliationStrategyResultLazyQuery({
    variables: {
      transactionId,
      strategy: {
        name: strategyName,
        vendor: strategy.vendor,
        transactableType: strategy.transactableType,
        paymentType: strategy.paymentType,
        role: strategy.role,
        transactionMatchResultInputs: transactionMatchResultInputState,
        transactableMatchResultInputs: transactableMatchResultInputState,
        paymentReferenceMatchResultInput: paymentReferenceMatchResultInputState,
        allowAmountMismatch: amountMismatchToggle,
        allowAmbiguous: ambiguousToggle,
        custom: customToggle,
        groupBy: groupByState,
        priority,
        reconDisabledIf:
          formikRef?.current?.values?.reconDisabledIf === ""
            ? null
            : formikRef?.current?.values?.reconDisabledIf,
        reconEnabledIf:
          formikRef?.current?.values?.reconEnabledIf === ""
            ? null
            : formikRef?.current?.values?.reconEnabledIf,
      } as StrategyInput,
    },
  });

  const reconciliationResults =
    !resultsLoading && !resultsError && resultsData
      ? resultsData?.reconciliationStrategyResult?.transactables || []
      : [];

  const [addTransactableMatcher, setAddTransactableMatcher] = useState(false);
  const [addTransactionMatcher, setAddTransactionMatcher] = useState(false);
  const [addPaymentReferenceMatcher, setAddPaymentReferenceMatcher] =
    useState(false);
  const [transactableHoverState, setTransactableHoverState] = useState(false);
  const [transactionHoverState, setTransactionHoverState] = useState(false);
  const [addPaymentReferenceHoverState, setAddPaymentReferenceHoverState] =
    useState(false);

  return (
    <div
      className={`mx-6 ${
        needsApproval || strategy.status !== "active"
          ? "border-4 border-purple-300a"
          : ""
      } ${!needsApproval || !strategy.parentStrategyId ? "mt-6" : ""}`}
    >
      <div>
        <div className="rounded-md border border-alpha-black-100 bg-white pb-4 pt-2">
          <div className="flex px-6 py-1">
            <div className="mr-auto flex">
              <Icon iconName="money_vs" className="mr-2 min-w-5 self-center" />
              {strategyHasChanged() && (
                <Icon
                  className="mr-2 self-center text-blue-400"
                  iconName="circle"
                  color="currentColor"
                  size="s"
                />
              )}
              {needsApproval ? (
                <span className="w-full self-center text-nowrap text-base font-medium">
                  {strategyName}
                </span>
              ) : (
                <textarea
                  className="w-full resize-none self-center text-nowrap text-base font-medium disabled:bg-white"
                  onChange={(e) => setStrategyName(e.target.value)}
                  value={
                    strategyName === "New Strategy" ? undefined : strategyName
                  }
                  placeholder="Enter strategy name"
                  rows={1}
                />
              )}
              {needsApproval && (
                <Label className="ml-3 flex justify-center self-center text-nowrap border-2 border-purple-300a bg-gray-50 p-1 font-mono font-bold italic text-purple-300a">
                  Suggested {strategy.parentStrategyId ? "Change" : "Strategy"}
                </Label>
              )}
              {strategy.status === "tentative" && (
                <Label className="ml-4 flex justify-center self-center text-nowrap border-2 border-purple-300a bg-gray-50 p-1 font-mono font-bold italic text-purple-300a">
                  Tentative
                </Label>
              )}
            </div>

            <div className="flex">
              {strategyHasChanged() ? (
                <Clickable
                  onClick={() => {
                    resetStrategy();
                  }}
                >
                  <div className="mb-2 mr-2 flex rounded-sm border px-2">
                    <Icon
                      className="self-center text-gray-500"
                      iconName="sync"
                      color="currentColor"
                      size="s"
                    />
                    <Label className="flex min-w-24 self-center p-1 text-xs hover:cursor-pointer">
                      Reset Changes
                    </Label>
                  </div>
                </Clickable>
              ) : null}

              {needsApproval && (
                <Label
                  className="ml-2 mr-2 flex flex-wrap self-center text-nowrap pb-2 font-mono font-bold"
                  labelPrefix="Suggested By:"
                >
                  {strategy.createdByName}
                </Label>
              )}

              <div className="flex self-center pb-2 pr-2">
                {matchResults.every((mr) => mr.match) ? (
                  <Icon
                    className="float-right text-green-500"
                    iconName="checkmark_circle"
                    color="currentColor"
                    size="xl"
                  />
                ) : (
                  <Icon
                    className="float-right self-center text-red-500"
                    iconName="remove_circle"
                    color="currentColor"
                    size="xl"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="border-mt-gray-200 mx-6 mr-6 border-t p-2" />

          {strategy.status === "tentative" && (
            <Label className="mb-1 flex w-full justify-center text-center italic">
              This tentative strategy has been auto-filled with matchers
              detected by our system. Feel free to edit below.
            </Label>
          )}

          <Formik
            initialValues={initialValues}
            enableReinitialize
            innerRef={formikRef}
            onSubmit={() => {}}
          >
            {() => (
              <Form>
                <div>
                  {needsApproval && strategy.note && (
                    <Label
                      className="mx-4 mb-2 w-full border bg-gray-25 p-2 italic"
                      labelPrefix="Note for reviewer:"
                    >
                      {strategy.note}
                    </Label>
                  )}
                  {transactableMatchResultState.filter(
                    (mr) => !mr.match || !mr.systemDefault
                  ).length > 0 &&
                    !customToggle && (
                      <Label className="pb-2 pl-6 text-base">
                        Transactable Matchers
                      </Label>
                    )}
                  <div className="pl-3">
                    {!customToggle &&
                      transactableMatchResultState
                        .filter((mr) => !mr.match || !mr.systemDefault)
                        .map((matchResult) => (
                          <DatabaseReconciliationMatchResult
                            key={`${matchResult.field}${
                              matchResult.matcherType
                            }${resetToggle ? "true" : "false"}`}
                            matchResult={matchResult}
                            strategyName={strategy.name}
                            matcherType="transactables"
                            transactionId={transactionId}
                            callback={matchResultCallback}
                            clickable={!needsApproval}
                            modalOpen={
                              matchResult.suggestedMatcher === "-new matcher-"
                            }
                          />
                        ))}
                  </div>

                  {!needsApproval &&
                    !addTransactableMatcher &&
                    !customToggle && (
                      <Clickable
                        onClick={() => setAddTransactableMatcher(true)}
                      >
                        <div
                          className="flex pb-1 pl-6"
                          onMouseEnter={() => setTransactableHoverState(true)}
                          onMouseLeave={() => setTransactableHoverState(false)}
                        >
                          <Icon
                            className="ml-2 text-gray-400"
                            iconName="add"
                            color="currentColor"
                            size="s"
                          />

                          {transactableHoverState && (
                            <Label className="ml-1 text-xs text-gray-500 hover:cursor-pointer">
                              Add Transactable Matcher
                            </Label>
                          )}
                        </div>
                      </Clickable>
                    )}

                  {addTransactableMatcher && (
                    <div className="flex">
                      <Clickable
                        onClick={() => setAddTransactableMatcher(false)}
                      >
                        <div className="justify-left self-center">
                          <Icon
                            className="ml-3 mr-2 flex self-center text-gray-400"
                            iconName="remove"
                            color="currentColor"
                            size="s"
                          />
                        </div>
                      </Clickable>
                      <div className="min-w-72">
                        <SelectField
                          handleChange={(e) => {
                            setAddTransactableMatcher(false);
                            let matchResultType;
                            let matcher;
                            if ((e as string).endsWith("_offset")) {
                              matchResultType = "date_offset";
                              matcher = "0..0";
                            } else if (
                              e === "short_id" ||
                              e === "short_numeric_id"
                            ) {
                              matchResultType = "short_id";
                              matcher = "vendor_description";
                            } else {
                              matchResultType =
                                e === "group_required" ? "is_true" : "is_null";
                              matcher = "";
                            }

                            setTransactableMatchResultState([
                              ...transactableMatchResultState,
                              {
                                field: e as string,
                                matcherType: "transactables",
                                matcher:
                                  matcher === null ? null : (matcher as string),
                                expected: "",
                                actual: "",
                                match: false,
                                transactionField: null,
                                parser: null,
                                system_default: false,
                                matchResultType:
                                  matchResultType === null
                                    ? null
                                    : (matchResultType as string),
                                suggestedMatcher: "-new matcher-",
                                systemDefault: false,
                              } as MatchResult,
                            ]);
                            setTransactableMatchResultInputState([
                              ...transactableMatchResultInputState,
                              {
                                id: `${strategy.name}transactables${
                                  e as string
                                }`,
                                strategyName: strategy.name,
                                field: e as string,
                                matcherType: "transactables",
                                matcher:
                                  matcher === null ? null : (matcher as string),
                                transactionField: null,
                                parser: null,
                                systemDefault: false,
                              } as MatchResultInput,
                            ]);
                          }}
                          id="select-id"
                          name="select"
                          selectValue={null}
                          placeholder="Select Matcher Type"
                          options={(
                            strategy.transactableMatchResultFields || []
                          )
                            .filter(
                              (f) =>
                                !transactableMatchResultState
                                  .map((mr) => mr.field)
                                  .includes(f)
                            )
                            .map((f) => ({ label: f, value: f }))}
                        />
                      </div>
                    </div>
                  )}

                  {transactionMatchResultState.filter(
                    (mr) => mr.field !== "reconciled"
                  ).length > 0 && (
                    <div className="flex pb-2 pl-6">
                      <Label className="text-base">Transaction Matchers</Label>
                      {removedTransactionMatchers.length > 0 && (
                        <Icon
                          className="ml-1 self-center text-blue-400"
                          iconName="circle"
                          color="currentColor"
                          size="s"
                        />
                      )}
                    </div>
                  )}
                  <div className="pl-3">
                    {transactionMatchResultState
                      .filter((mr) => mr.field !== "reconciled")
                      .map((matchResult) => (
                        <DatabaseReconciliationMatchResult
                          key={`${matchResult.field}${matchResult.matcherType}${
                            resetToggle ? "true" : "false"
                          }`}
                          matchResult={matchResult}
                          strategyName={strategy.name}
                          matcherType="transactions"
                          transactionId={transactionId}
                          callback={matchResultCallback}
                          clickable={!needsApproval}
                          modalOpen={
                            matchResult.suggestedMatcher === "-new matcher-"
                          }
                        />
                      ))}
                  </div>

                  {!needsApproval && !addTransactionMatcher && (
                    <Clickable onClick={() => setAddTransactionMatcher(true)}>
                      <div
                        className="flex pl-6"
                        onMouseEnter={() => setTransactionHoverState(true)}
                        onMouseLeave={() => setTransactionHoverState(false)}
                      >
                        <Icon
                          className="ml-2 text-gray-400"
                          iconName="add"
                          color="currentColor"
                          size="s"
                        />

                        {transactionHoverState && (
                          <Label className="ml-1 text-xs text-gray-500 hover:cursor-pointer">
                            Add Transaction Matcher
                          </Label>
                        )}
                      </div>
                    </Clickable>
                  )}

                  {addTransactionMatcher && (
                    <div className="flex">
                      <Clickable
                        onClick={() => setAddTransactionMatcher(false)}
                      >
                        <div className="justify-left self-center">
                          <Icon
                            className="ml-3 mr-2 flex self-center text-gray-400"
                            iconName="remove"
                            color="currentColor"
                            size="s"
                          />
                        </div>
                      </Clickable>
                      <div className="min-w-72">
                        <SelectField
                          handleChange={(e) => {
                            setAddTransactionMatcher(false);

                            setTransactionMatchResultState([
                              ...transactionMatchResultState,
                              {
                                field: e as string,
                                matcherType: "transactions",
                                matcher: "",
                                expected: "",
                                actual: "",
                                match: false,
                                system_default: false,
                                matchResultType: "is_null",
                                suggestedMatcher: "-new matcher-",
                                systemDefault: false,
                              } as MatchResult,
                            ]);
                            setTransactionMatchResultInputState([
                              ...transactionMatchResultInputState,
                              {
                                id: `${strategy.name}transactions${
                                  e as string
                                }`,
                                strategyName: strategy.name,
                                field: e as string,
                                matcherType: "transactions",
                                matcher: "",
                                systemDefault: false,
                              } as MatchResultInput,
                            ]);
                          }}
                          id="select-id"
                          name="select"
                          selectValue={null}
                          placeholder="Select Matcher Type"
                          options={(strategy.transactionMatchResultFields || [])
                            .filter(
                              (f) =>
                                !transactionMatchResultState
                                  .map((mr) => mr.field)
                                  .includes(f)
                            )
                            .map((f) => ({ label: f, value: f }))}
                        />
                      </div>
                    </div>
                  )}

                  {strategy.groupByMatchResult && !customToggle && (
                    <div className="pt-2">
                      <div className="flex w-full">
                        <Label className="w-24 pb-2 pl-6 text-base">
                          Group By
                        </Label>

                        <div className="w-full">
                          <DatabaseReconciliationMatchResult
                            key={`GroupBy-${resetToggle ? "true" : "false"}`}
                            matchResult={strategy.groupByMatchResult}
                            strategyName={strategy.name}
                            matcherType="group_by"
                            transactionId={transactionId}
                            callback={matchResultCallback}
                            clickable={!needsApproval}
                            removable={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    {paymentReferenceMatchResultState && !customToggle && (
                      <div className="my-1 flex w-full">
                        <Label className="w-44 self-center pl-6 text-base">
                          Payment Reference
                        </Label>

                        <div className="w-full">
                          <DatabaseReconciliationMatchResult
                            key={`${paymentReferenceMatchResultState.field}${
                              paymentReferenceMatchResultState.matcherType
                            }${resetToggle ? "true" : "false"}`}
                            matchResult={paymentReferenceMatchResultState}
                            strategyName={strategy.name}
                            matcherType="payment_reference"
                            transactionId={transactionId}
                            callback={matchResultCallback}
                            clickable={!needsApproval}
                            modalOpen={
                              paymentReferenceMatchResultState.suggestedMatcher ===
                              "-new matcher-"
                            }
                          />
                        </div>
                      </div>
                    )}
                    {!paymentReferenceMatchResultState &&
                      !needsApproval &&
                      !addPaymentReferenceMatcher && (
                        <Clickable
                          onClick={() => {
                            setPaymentReferenceMatchResultState({
                              field: "payment_reference",
                              matcherType: "payment_reference",
                              matcher: "",
                              expected: "",
                              actual: "",
                              match: false,
                              system_default: false,
                              matchResultType: "payment_reference",
                              suggestedMatcher: "-new matcher-",
                            } as MatchResult);
                            setAddPaymentReferenceMatcher(false);
                          }}
                        >
                          <div
                            className="flex"
                            onMouseEnter={() =>
                              setAddPaymentReferenceHoverState(true)
                            }
                            onMouseLeave={() =>
                              setAddPaymentReferenceHoverState(false)
                            }
                          >
                            <Label className="pl-6 text-base">
                              Payment Reference
                            </Label>
                            {strategy.paymentReferenceMatchResult && (
                              <Icon
                                className="ml-1 self-center text-blue-400"
                                iconName="circle"
                                color="currentColor"
                                size="s"
                              />
                            )}
                            <Icon
                              className="ml-1 self-center text-gray-400"
                              iconName="add"
                              color="currentColor"
                              size="s"
                            />
                            {addPaymentReferenceHoverState && (
                              <Label className="ml-1 self-center text-xs text-gray-500 hover:cursor-pointer">
                                Add Payment Reference
                              </Label>
                            )}
                          </div>
                        </Clickable>
                      )}
                  </div>
                </div>

                <div className="ml-2 mr-6">
                  <Accordion allowMultiple allowToggle>
                    <AccordionItem>
                      <AccordionButton className="hover:bg-gray-25">
                        <Label className="mr-1 text-base">Options</Label>
                        <Icon
                          className="mr-auto self-center"
                          iconName="circle"
                          color={
                            optionsHasChanged()
                              ? colors.blue["400"]
                              : colors.white
                          }
                          size="s"
                        />
                        {(ambiguousToggle ||
                          amountMismatchToggle ||
                          customToggle ||
                          priority) && (
                          <Label className="mr-2 italic text-gray-500">
                            {ambiguousToggle
                              ? `Ambiguous${
                                  amountMismatchToggle ||
                                  customToggle ||
                                  priority
                                    ? ", "
                                    : ""
                                }`
                              : ""}
                            {amountMismatchToggle
                              ? `Amount_Mismatch${
                                  customToggle || priority ? ", " : ""
                                }`
                              : ""}
                            {customToggle
                              ? `Custom${priority ? ", " : ""}`
                              : ""}
                            {priority ? `Priority: ${priority}` : ""}
                          </Label>
                        )}
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <FieldsRow columns={2}>
                          <Toggle
                            className="tailwind-class"
                            handleChange={() =>
                              setAmbiguousToggle(!ambiguousToggle)
                            }
                            checked={ambiguousToggle}
                            id="allow-ambiguous-toggle"
                            label="Ambiguous"
                            labelClassName="mr-6"
                            disabled={needsApproval || customToggle}
                          />
                          <div className="justify-right flex">
                            <Label className="justify-right mr-5 flex pr-2">
                              Priority
                            </Label>
                            <div className="min-w-20">
                              <SelectField
                                className="justify-right flex"
                                handleChange={(val) =>
                                  setPriority(val ? (val as number) : null)
                                }
                                options={[
                                  {
                                    label: "None",
                                    value: null,
                                  },
                                  ...[...Array(20).keys()].map((i) => ({
                                    label: i + 1,
                                    value: i + 1,
                                  })),
                                ]}
                                placeholder="None"
                                selectValue={priority}
                                disabled={needsApproval}
                              />
                            </div>
                          </div>
                        </FieldsRow>
                        <FieldsRow columns={2}>
                          <Toggle
                            className="tailwind-class"
                            handleChange={() =>
                              setAmountMismatchToggle(!amountMismatchToggle)
                            }
                            checked={amountMismatchToggle}
                            id="allow-amount-mismatch-toggle"
                            label="Amount Mismatch"
                            labelClassName="mr-6"
                            disabled={needsApproval || customToggle}
                          />
                          <div className="flex">
                            <Label className="justify-left mr-1 pr-2">
                              Enabled If
                            </Label>
                            <Field
                              className="justify-right"
                              name="reconEnabledIf"
                              id="reconEnabledIf"
                              component={FormikInputField}
                              disabled={needsApproval}
                            />
                          </div>
                        </FieldsRow>
                        <FieldsRow columns={2}>
                          <Toggle
                            className="tailwind-class"
                            handleChange={() => {
                              setCustomToggle(!customToggle);
                            }}
                            checked={customToggle}
                            id="custom-toggle"
                            label="Custom"
                            labelClassName="mr-6"
                            disabled={needsApproval}
                          />
                          <div className="flex">
                            <Label className="justify-left pr-2">
                              Disabled If
                            </Label>
                            <Field
                              className="justify-right"
                              name="reconDisabledIf"
                              id="reconDisabledIf"
                              component={FormikInputField}
                              disabled={needsApproval}
                            />
                          </div>
                        </FieldsRow>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Modal
                  isOpen={showReconResults}
                  title="Run Reconciliation"
                  onRequestClose={() => setShowReconResults(false)}
                >
                  <ModalContainer>
                    <Label className="ml-auto mr-auto mt-2 flex pb-2 text-base font-medium">
                      Reconciliation Results
                    </Label>

                    <div className="mx-2">
                      <EntityTableView
                        data={reconciliationResults}
                        loading={resultsLoading}
                        dataMapping={
                          reconciliationResults[0]?.__typename
                            ? RESULT_MAPPING[
                                reconciliationResults[0]?.__typename
                              ]
                            : RESULT_MAPPING.PaymentOrder
                        }
                        styleMapping={STYLE_MAPPING}
                        onQueryArgChange={async () =>
                          new Promise<void>((resolve) => {
                            resolve();
                          })
                        }
                      />
                    </div>

                    <ModalFooter>
                      <div className="flex w-full">
                        <Button
                          buttonType="secondary"
                          className="ml-auto mr-auto flex justify-center"
                          onClick={() => setShowReconResults(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </ModalFooter>
                  </ModalContainer>
                </Modal>

                <Modal
                  className="m-4 flex w-full max-w-6xl"
                  isOpen={showDiffModal}
                  title="Strategy Diff"
                  onRequestClose={() => setShowDiffModal(false)}
                >
                  <ModalContainer>
                    <div className="bg-gray-25">
                      <Label className="ml-auto mr-auto self-center py-2 align-middle text-base text-lg">
                        Diff Preview
                      </Label>
                      {updateStrategyData?.updateReconciliationStrategy && (
                        <div className="flex w-full flex-col bg-white p-2">
                          <div className="flex w-full">
                            {updateStrategyData?.updateReconciliationStrategy
                              ?.oldStrategy && (
                              <div>
                                <Label className="ml-auto mr-auto pb-2 text-base font-medium">
                                  Old Strategy
                                </Label>
                                <div className="mt-auto flex w-full">
                                  <div className="flex flex-col rounded-md border py-1">
                                    {updateStrategyData.updateReconciliationStrategy.oldStrategy.strategyConfig
                                      .split("\n")
                                      // prettier-ignore
                                      .map((line) =>
                                        // prettier-ignore
                                        <textarea
                                          className={cn(
                                            "text-md outline-non flex w-full resize-none whitespace-pre px-2 placeholder-gray-600",
                                            updateStrategyData.updateReconciliationStrategy?.newStrategy?.strategyConfig
                                              .split("\n")
                                              .includes(line)
                                              ?
                                                "disabled:bg-white"
                                              : "disabled:bg-red-100"
                                          )}
                                          onChange={() => {}}
                                          disabled
                                          value={line}
                                          rows={1}
                                          cols={60}
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div
                              className={` ml-auto ${
                                updateStrategyData?.updateReconciliationStrategy
                                  ?.oldStrategy
                                  ? ""
                                  : "w-full"
                              }`}
                            >
                              <Label className="ml-auto mr-auto pb-2 text-base font-medium">
                                New Strategy
                              </Label>
                              <div className="flex flex-col rounded-md border py-1">
                                {updateStrategyData.updateReconciliationStrategy.newStrategy?.strategyConfig
                                  .split("\n")
                                  .map((line) =>
                                    // prettier-ignore
                                    <textarea
                                      className={cn(
                                        "text-md outline-non flex w-full resize-none whitespace-pre px-2 placeholder-gray-600",
                                        updateStrategyData.updateReconciliationStrategy?.oldStrategy?.strategyConfig
                                          .split("\n")
                                          .includes(line)
                                          ? "disabled:bg-white"
                                          : "disabled:bg-green-100"
                                      )}
                                      onChange={() => {}}
                                      disabled
                                      value={line}
                                      rows={1}
                                      cols={60}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                          <Label className="ml-auto mr-auto mt-1 text-sm italic">
                            Strategies are side-scrolling
                          </Label>
                          <div className="flex w-full pt-1">
                            <textarea
                              className="ml-auto mr-auto flex w-3/4 resize-none rounded-md bg-gray-25 p-2 text-gray-600 placeholder-gray-600"
                              onChange={(e) => setNote(e.target.value)}
                              placeholder={`Leave a note for the reviewer about this ${
                                needsApproval ? "review" : "change"
                              } (optional)`}
                              value={note}
                              rows={3}
                              cols={60}
                            />
                          </div>
                        </div>
                      )}

                      <ModalFooter>
                        <Button onClick={() => setShowDiffModal(false)}>
                          Close
                        </Button>

                        <Modal
                          className=""
                          isOpen={showConfirmModal}
                          title="Confirm Approval"
                          onRequestClose={() => setShowConfirmModal(false)}
                        >
                          <ModalContainer>
                            <Label className="ml-auto mr-auto justify-center p-4 text-lg font-bold font-semibold">
                              Are you sure you want to accept this change?
                            </Label>

                            <ModalFooter className="bg-gray-50">
                              <Button
                                onClick={() => setShowConfirmModal(false)}
                              >
                                Wait nevermind
                              </Button>

                              <Button
                                buttonType="primary"
                                onClick={() => {
                                  void reviewReconciliationStrategy({
                                    variables: {
                                      input: {
                                        strategyId: strategy.id as string,
                                        vendorId: strategy.vendor,
                                        note,
                                        approved: true,
                                        transactionId,
                                      },
                                    },
                                  });
                                  window.location.reload();
                                }}
                              >
                                Yeah looks beautiful
                              </Button>
                            </ModalFooter>
                          </ModalContainer>
                        </Modal>

                        <Modal
                          className=""
                          isOpen={showRejectModal}
                          title="Confirm Rejection"
                          onRequestClose={() => setShowRejectModal(false)}
                        >
                          <ModalContainer>
                            <Label className="ml-auto mr-auto justify-center p-4 text-lg font-bold font-semibold">
                              Are you sure you want to reject this change?
                            </Label>

                            <ModalFooter className="bg-gray-50">
                              <Button onClick={() => setShowRejectModal(false)}>
                                Wait nevermind
                              </Button>

                              <Button
                                buttonType="destructive"
                                onClick={() => {
                                  void reviewReconciliationStrategy({
                                    variables: {
                                      input: {
                                        strategyId: strategy.id as string,
                                        vendorId: strategy.vendor,
                                        note,
                                        approved: false,
                                        transactionId,
                                      },
                                    },
                                  });
                                  window.location.reload();
                                }}
                              >
                                Yeah reject it already
                              </Button>
                            </ModalFooter>
                          </ModalContainer>
                        </Modal>

                        {needsApproval && strategy.userCanApprove && (
                          <>
                            <Button
                              className="ml-auto mr-3"
                              buttonType="destructive"
                              onClick={() => {
                                setShowRejectModal(true);
                              }}
                            >
                              Reject Change
                            </Button>
                            <Button
                              onClick={() => {
                                setShowConfirmModal(true);
                              }}
                              buttonType="primary"
                            >
                              Accept Change
                            </Button>
                          </>
                        )}
                        {!needsApproval && (
                          <Button
                            onClick={() => {
                              setShowDiffModal(false);
                              updateReconciliationStrategy({
                                variables: {
                                  input: {
                                    strategy: {
                                      name: strategyName || "blank_name",
                                      vendor: strategy.vendor,
                                      transactableType:
                                        strategy.transactableType,
                                      paymentType: strategy.paymentType,
                                      role: strategy.role,
                                      transactionMatchResultInputs:
                                        transactionMatchResultInputState,
                                      transactableMatchResultInputs:
                                        transactableMatchResultInputState,
                                      paymentReferenceMatchResultInput:
                                        customToggle
                                          ? null
                                          : paymentReferenceMatchResultInputState,
                                      allowAmountMismatch: amountMismatchToggle,
                                      allowAmbiguous: ambiguousToggle,
                                      custom: customToggle,
                                      groupBy: groupByState,
                                      priority,
                                      reconDisabledIf:
                                        formikRef?.current?.values
                                          ?.reconDisabledIf === ""
                                          ? null
                                          : formikRef?.current?.values
                                              ?.reconDisabledIf,
                                      reconEnabledIf:
                                        formikRef?.current?.values
                                          ?.reconEnabledIf === ""
                                          ? null
                                          : formikRef?.current?.values
                                              ?.reconEnabledIf,
                                      id: strategy.id as string,
                                      parentStrategyId:
                                        strategy.parentStrategyId,
                                      note,
                                    },
                                    preview: false,
                                    transactionId,
                                  },
                                },
                              })
                                .then((response) => {
                                  const errors =
                                    response?.data?.updateReconciliationStrategy
                                      ?.errors ?? [];
                                  if (errors.length === 0) {
                                    setShowDiffModal(true);
                                  }
                                })
                                .catch((error: Error) => {
                                  dispatchError(error.message);
                                });
                              window.location.reload();
                            }}
                          >
                            Submit for Review
                          </Button>
                        )}
                        {!strategy.userCanApprove && (
                          <div className="ml-2">
                            <Tooltip
                              className="flex"
                              data-tip="Only Recon team members can review strategies"
                            />
                            <ReactTooltip
                              multiline
                              data-place="top"
                              data-type="dark"
                              data-effect="float"
                            />
                          </div>
                        )}
                      </ModalFooter>
                    </div>
                  </ModalContainer>
                </Modal>

                {updateStrategyData?.updateReconciliationStrategy?.errors
                  ?.length ? (
                  <div className="mx-4 mb-4 mt-2 flex rounded-md border border-red-400 bg-red-200 px-3 py-1">
                    <Icon
                      className="mr-5 self-center text-red-400"
                      iconName="error_outlined"
                      color="currentColor"
                    />
                    <div className="flex flex-col">
                      {updateStrategyData.updateReconciliationStrategy.errors.map(
                        (error) => (
                          <div className="flex flex-col">
                            <Label>- {error}</Label>
                          </div>
                        )
                      )}
                    </div>
                    <Icon
                      className="ml-3 mr-3 self-center text-red-400"
                      iconName="error_outlined"
                      color="currentColor"
                    />
                  </div>
                ) : null}

                <div className="mt-2 flex">
                  <Button
                    className="ml-6 flex"
                    buttonType="primary"
                    onClick={() => {
                      void getReconciliationStrategyResults();
                      setShowReconResults(true);
                    }}
                  >
                    Test Reconciliation
                    <Icon
                      iconName="node_multiple"
                      color="currentColor"
                      className="text-white"
                    />
                  </Button>

                  {needsApproval && strategy.createdByCurrentUser ? (
                    <div className="ml-auto flex">
                      <Modal
                        title="Delete Suggested Change"
                        isOpen={showDeleteModal}
                        onRequestClose={() => setShowDeleteModal(false)}
                      >
                        <ModalContainer>
                          <Label className="ml-auto mr-auto justify-center p-4 text-lg italic">
                            Are you sure you want to delete this Suggested
                            Change?
                          </Label>

                          <ModalFooter className="bg-gray-25">
                            <Button
                              className="mr-auto"
                              buttonType="secondary"
                              onClick={() => setShowDeleteModal(false)}
                            >
                              No leave it alone
                            </Button>

                            <Button
                              className="ml-auto"
                              buttonType="destructive"
                              onClick={() => {
                                void reviewReconciliationStrategy({
                                  variables: {
                                    input: {
                                      strategyId: strategy.id as string,
                                      vendorId: strategy.vendor,
                                      note: "Deleted By Creator",
                                      approved: false,
                                      transactionId,
                                    },
                                  },
                                });
                                window.location.reload();
                              }}
                            >
                              Obliterate It
                            </Button>
                          </ModalFooter>
                        </ModalContainer>
                      </Modal>
                      <Button
                        buttonType="destructive"
                        className="ml-auto mr-6 flex"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Icon
                          iconName="clear_circle_outlined"
                          color="currentColor"
                          className="text-white"
                          size="s"
                        />
                        Delete My Suggested Change
                      </Button>
                    </div>
                  ) : (
                    <div className="ml-auto mr-6 flex">
                      {updateStrategyLoading && (
                        <ClipLoader
                          className="ml-auto mr-2 flex self-center"
                          size={22}
                          color={colors.gray["300"]}
                        />
                      )}
                      {updateStrategyData?.updateReconciliationStrategy?.errors
                        ?.length ? (
                        <div className="mr-2 flex self-center">
                          <Icon
                            iconName="error_outlined"
                            color="currentColor"
                            className="text-red-500"
                          />
                          <Label className="ml-1 self-center italic text-red-500">
                            Error
                          </Label>
                        </div>
                      ) : null}
                      <Button
                        buttonType="primary"
                        disabled={
                          (!strategyHasChanged() &&
                            !needsApproval &&
                            !(strategy.status === "tentative")) ||
                          updateStrategyLoading
                        }
                        className=""
                        onClick={() => {
                          updateReconciliationStrategy({
                            variables: {
                              input: {
                                strategy: {
                                  name: strategyName || "blank_name",
                                  vendor: strategy.vendor,
                                  transactableType: strategy.transactableType,
                                  paymentType: strategy.paymentType,
                                  role: strategy.role,
                                  transactionMatchResultInputs:
                                    transactionMatchResultInputState,
                                  transactableMatchResultInputs:
                                    transactableMatchResultInputState,
                                  paymentReferenceMatchResultInput: customToggle
                                    ? null
                                    : paymentReferenceMatchResultInputState,
                                  allowAmountMismatch: amountMismatchToggle,
                                  allowAmbiguous: ambiguousToggle,
                                  custom: customToggle,
                                  groupBy: groupByState,
                                  priority,
                                  reconDisabledIf:
                                    formikRef?.current?.values
                                      ?.reconDisabledIf === ""
                                      ? null
                                      : formikRef?.current?.values
                                          ?.reconDisabledIf,
                                  reconEnabledIf:
                                    formikRef?.current?.values
                                      ?.reconEnabledIf === ""
                                      ? null
                                      : formikRef?.current?.values
                                          ?.reconEnabledIf,
                                  id: strategy.id as string,
                                  parentStrategyId: strategy.parentStrategyId,
                                  note,
                                },
                                preview: true,
                                transactionId,
                              },
                            },
                          })
                            .then((response) => {
                              const errors =
                                response?.data?.updateReconciliationStrategy
                                  ?.errors ?? [];
                              if (errors.length === 0) {
                                setShowDiffModal(true);
                              }
                            })
                            .catch((error: Error) => {
                              dispatchError(error.message);
                            });
                        }}
                      >
                        <Icon
                          iconName="visible"
                          color="currentColor"
                          className="text-white"
                        />
                        {needsApproval
                          ? `Review ${
                              strategy.userCanApprove
                                ? "and Accept/Reject"
                                : "Change"
                            }`
                          : "Preview and Submit For Review"}
                      </Button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default DatabaseReconciliationStrategy;

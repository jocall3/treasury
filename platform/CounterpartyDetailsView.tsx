import React from "react";
import { connect } from "react-redux";
import { ClipLoader } from "react-spinners";
import { reduxForm, SubmitHandler } from "redux-form";
import { useMountEffect } from "~/common/utilities/useMountEffect";
import { submitCounterparty } from "../actions";
import CounterpartyDetailsForm from "./CounterpartyDetailsForm";
import {
  CounterpartyInput,
  UpsertCounterpartyMutationFn,
  useAuditableTextFieldLazyQuery,
  useCounterpartyDetailsViewQuery,
  useUpsertCounterpartyMutation,
} from "../../generated/dashboard/graphqlSchema";
import {
  Button,
  DateTime,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../common/ui-components";
import AuditableTextField from "./auditable_fields/AuditableTextField";
import { DispatchMessageFnType, useDispatchContext } from "../MessageProvider";

const COUNTERPARTY_MAPPING = {
  id: "ID",
  name: "Name",
  email: "Email",
  taxpayerIdentifier: "Taxpayer Identifier",
  sendRemittanceAdvice: "Remittance Notification",
  accountCollectionPending: "External Account Collection",
  accountingCategoryName: "Default Accounting Category",
  accountingLedgerClassName: "Default Accounting Class",
  verificationStatus: "Verification Status",
  createdAt: "Created At",
};

interface CounterpartyDetailsProps {
  setIsUpdatingCounterparty: (isUpdating: boolean) => void;
  errorMessage?: string;
  onPendingDocumentChange?: (docs: Record<string, Document>) => void;
}

interface ReduxProps {
  submitting: boolean;
  handleSubmit: SubmitHandler<
    Record<string, unknown>,
    CounterpartyDetailsProps,
    string
  >;
}

function CounterpartyDetails({
  setIsUpdatingCounterparty,
  handleSubmit,
  submitting,
  errorMessage,
  onPendingDocumentChange,
}: CounterpartyDetailsProps & ReduxProps) {
  return (
    <form autoComplete="off" className="form-create">
      <CounterpartyDetailsForm
        onPendingDocumentChange={onPendingDocumentChange}
      />

      <div className="form-group form-group-submit flex flex-row">
        <Button
          id="save-counterparty-details-btn"
          buttonType="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Save
        </Button>
        <Button
          className="ml-4"
          onClick={() => setIsUpdatingCounterparty(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        {submitting ? (
          <ClipLoader
            // Our usage if ClipLoader does not match the current types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            loaderStyle={{ verticalAlign: "middle", marginLeft: "1rem" }}
          />
        ) : undefined}
        {errorMessage && <span className="error-message">{errorMessage}</span>}
      </div>
    </form>
  );
}

const ReduxedCounterpartyDetails = reduxForm<
  Record<string, unknown>,
  CounterpartyDetailsProps
>({
  // a unique name for the form
  form: "counterparty",
})(CounterpartyDetails);

interface CounterpartyDetailsViewProps {
  counterpartyId: string;
  isUpdatingCounterparty: boolean;
  setIsUpdatingCounterparty: (isUpdating: boolean) => void;
  submitCounterparty: (
    data: CounterpartyInput,
    mutation: UpsertCounterpartyMutationFn,
    callback: () => void | null,
    pendingDocuments: Record<string, unknown> | null,
    dispatchError: DispatchMessageFnType["dispatchError"]
  ) => Promise<void>;
}

function CounterpartyDetailsView({
  counterpartyId,
  isUpdatingCounterparty,
  setIsUpdatingCounterparty,
  submitCounterparty: submitCounterpartyFunc,
}: CounterpartyDetailsViewProps) {
  const [upsertCounterparty] = useUpsertCounterpartyMutation();
  const { data, loading, refetch } = useCounterpartyDetailsViewQuery({
    variables: {
      id: counterpartyId,
    },
  });
  const { dispatchError } = useDispatchContext();
  const counterparty = !data || loading ? null : data.counterparty;
  const bulkImport = !data || loading ? null : data.bulkImport;

  useMountEffect((): void => {
    if (isUpdatingCounterparty) {
      void refetch();
    }
  });

  const successCallback = () => {
    setIsUpdatingCounterparty(false);
    void refetch();
  };

  return (
    <div className="counterparty-details-view">
      {!isUpdatingCounterparty && !loading && counterparty ? (
        <KeyValueTable
          data={{
            id: counterparty.id,
            name: counterparty.name,
            email: counterparty.email,
            sendRemittanceAdvice: counterparty.sendRemittanceAdvice
              ? "Enabled"
              : "Disabled",
            accountCollectionPending: counterparty.accountCollectionPending
              ? "Sent Account Collection Email"
              : null,
            taxpayerIdentifier: counterparty.hasTaxpayerIdentifier ? (
              <AuditableTextField
                graphqlQuery={useAuditableTextFieldLazyQuery}
                queryVariables={{
                  id: counterparty.id,
                  resourceName: "Counterparty",
                  fieldName: "taxpayerIdentifier",
                }}
                fieldName="auditableTextField"
              />
            ) : null,
            accountingCategoryName: counterparty.accountingCategory?.name,
            accountingLedgerClassName: counterparty.accountingLedgerClass?.name,
            createdAt: <DateTime timestamp={counterparty.createdAt} />,
            verificationStatus: counterparty.prettyVerificationStatus,
            bulkImport: bulkImport ? (
              <a href={`/bulk_imports/${bulkImport.id}`}>{bulkImport.id}</a>
            ) : null,
          }}
          dataMapping={{
            ...COUNTERPARTY_MAPPING,
            ...(bulkImport ? { bulkImport: "Bulk Import" } : {}),
          }}
          copyableData={["id", "email"]}
        />
      ) : null}
      {loading && !counterparty && (
        <KeyValueTableSkeletonLoader dataMapping={COUNTERPARTY_MAPPING} />
      )}
      {isUpdatingCounterparty && counterparty ? (
        <ReduxedCounterpartyDetails
          setIsUpdatingCounterparty={setIsUpdatingCounterparty}
          onSubmit={(values) =>
            submitCounterpartyFunc(
              {
                ...values,
                id: counterpartyId,
              },
              upsertCounterparty,
              successCallback,
              null,
              dispatchError
            )
          }
          initialValues={{
            name: counterparty.name,
            email: counterparty.email,
            send_remittance_advice: counterparty.sendRemittanceAdvice,
            accounting_category: counterparty.accountingCategory?.id,
            accounting_ledger_class: counterparty.accountingLedgerClass?.id,
          }}
        />
      ) : null}
    </div>
  );
}

export default connect(undefined, { submitCounterparty })(
  CounterpartyDetailsView
);

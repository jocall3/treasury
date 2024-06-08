import React from "react";
import {
  getIn,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import * as Yup from "yup";
import { Heading, ConfirmModal, Label } from "../../common/ui-components";
import { FormikErrorMessage, FormikInputField } from "../../common/formik";
import FormikKeyValueInput, {
  FieldTypeEnum,
} from "../../common/formik/FormikKeyValueInput";
import FormikCounterpartyAsyncSelect from "../../common/formik/FormikCounterpartyAsyncSelect";
import trackEvent from "../../common/utilities/trackEvent";
import { VIRTUAL_ACCOUNT_EVENTS } from "../../common/constants/analytics";
import {
  useUpdateVirtualAccountMutation,
  VirtualAccountViewQuery,
} from "../../generated/dashboard/graphqlSchema";
import { VIRTUAL_ACCOUNT } from "../../generated/dashboard/types/resources";
import { formatMetadata } from "../containers/virtual_account_form/virtualAccountUtils";
import { useDispatchContext } from "../MessageProvider";

interface MetadataValue {
  key: string;
  value: string;
}

interface FormValues {
  name: string;
  counterparty?: { label: string; value: string } | null;
  metadata?: Array<MetadataValue>;
}

const fieldInvalid = (
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  fieldName: string
) => (getIn(errors, fieldName) && getIn(touched, fieldName)) as boolean;

function EditVirtualAccountForm() {
  return (
    <Form>
      <div className="mb-3 mt-3">
        <div className="flex flex-row justify-between pb-2">
          <Label id="name" className="text-sm font-normal text-gray-800">
            Name
          </Label>
        </div>
        <Field
          id="name"
          name="name"
          placeholder="Enter account name"
          component={FormikInputField}
        />
        <FormikErrorMessage name="name" />
      </div>
      <div className="mt-3">
        <div className="flex flex-row items-center justify-between pb-2">
          <Label
            id="counterparty"
            className="text-sm font-normal text-gray-800"
          >
            Counterparty
          </Label>
          <span className="pl-2 text-xs font-normal text-text-muted">
            Optional
          </span>
        </div>
        <FormikCounterpartyAsyncSelect />
      </div>
      <div className="mt-3">
        <FormikKeyValueInput
          fieldType={FieldTypeEnum.Metadata}
          fieldInvalid={fieldInvalid}
          resource={VIRTUAL_ACCOUNT}
        />
      </div>
    </Form>
  );
}

interface EditVirtualAccountModalProps {
  setIsOpen: (isOpen: boolean) => void;
  virtualAccount: NonNullable<VirtualAccountViewQuery["virtualAccount"]>;
}

export default function EditVirtualAccountModal({
  setIsOpen,
  virtualAccount,
}: EditVirtualAccountModalProps) {
  const [updateVirtualAccount] = useUpdateVirtualAccountMutation();
  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const { id, name, counterparty } = virtualAccount;

  const processMetadata = (values: FormValues) => {
    const formattedMetadata: Record<string, string> = formatMetadata(
      values.metadata || []
    );

    /*
     * If user is trying to delete a key-value pair, add the pair back into
     * the mutation input but with a blank value (format expected by
     * MetadataService for metadata deletion)
     */
    const existingMetadata: Array<MetadataValue> = JSON.parse(
      virtualAccount.metadata
    ) as Array<MetadataValue>;

    existingMetadata.forEach((pair: { key: string; value: string }) => {
      if (!formattedMetadata[pair.key]) {
        formattedMetadata[pair.key] = "";
      }
    });

    return formattedMetadata;
  };

  const handleSubmit = async (values: FormValues) => {
    const processedMetadata = processMetadata(values);

    const result = await updateVirtualAccount({
      variables: {
        input: {
          id: id || "",
          name: values.name,
          counterpartyId: values.counterparty?.value,
          metadata: JSON.stringify(processedMetadata),
        },
      },
    });

    if (result?.data?.updateVirtualAccount) {
      const { virtualAccount: updatedVirtualAccount, errors } =
        result.data.updateVirtualAccount;
      setIsOpen(false);

      trackEvent(
        null,
        VIRTUAL_ACCOUNT_EVENTS.UPDATE_VIRTUAL_ACCOUNT_FORM_SUBMITTED
      );

      if (updatedVirtualAccount) {
        dispatchSuccess("Details saved successfully.");
        return;
      }
      if (errors) {
        dispatchError(errors[0]);
      }
    }
  };

  const validate = Yup.object({
    name: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{
        name,
        counterparty: counterparty
          ? {
              label: counterparty?.name,
              value: counterparty?.id,
            }
          : null,
        metadata: JSON.parse(virtualAccount.metadata) as Array<MetadataValue>,
      }}
      onSubmit={handleSubmit}
      validationSchema={validate}
    >
      {(form) => (
        <ConfirmModal
          title="Edit virtual account"
          isOpen
          onRequestClose={() => setIsOpen(false)}
          setIsOpen={() => setIsOpen(false)}
          confirmText={form.isSubmitting ? "Submitting..." : "Save"}
          confirmDisabled={form.isSubmitting}
          confirmType="confirm"
          onConfirm={() => {
            form.handleSubmit();
          }}
        >
          <Heading level="h1" size="l">
            {name}
          </Heading>
          <EditVirtualAccountForm />
        </ConfirmModal>
      )}
    </Formik>
  );
}

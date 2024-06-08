import React from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useCreateReconciliationSuggestionMutation } from "../../generated/dashboard/graphqlSchema";
import useErrorBanner from "../../common/utilities/useErrorBanner";
import {
  FormikErrorMessage,
  FormikInputField,
  FormikSelectField,
} from "../../common/formik";
import { Button, FieldGroup, Label } from "../../common/ui-components";

export interface Props {
  transactionId: string;
}

const validate = Yup.object({
  transactableId: Yup.string().required("Transactable ID is required"),
  transactableType: Yup.string().required("Transactable type is required"),
});

const TRANSACTABLE_OPTIONS = [
  { label: "Payment Order", value: "PaymentOrder" },
  { label: "Incoming Payment Detail", value: "IncomingPaymentDetail" },
  { label: "Return", value: "Return" },
  { label: "Reversal", value: "Reversal" },
  { label: "Paper Item", value: "PaperItem" },
];

export default function CreateReconciliationSuggestionForm({
  transactionId,
}: Props) {
  const [createReconciliationSuggestion] =
    useCreateReconciliationSuggestionMutation({
      refetchQueries: ["ReconciliationSuggestionsView"],
    });

  const flashError = useErrorBanner();

  const onSubmit = (transactableId: string, transactableType: string) => {
    createReconciliationSuggestion({
      variables: {
        input: {
          transactionId,
          transactableType,
          transactableId,
        },
      },
    })
      .then((result) => {
        if (result.errors) {
          flashError("Something went wrong!");
        } else if (
          result.data?.createReconciliationSuggestion?.errors?.length
        ) {
          flashError(result.data.createReconciliationSuggestion.errors[0]);
        }
      })
      .catch((err: Error) => {
        flashError(err.message);
      });
  };

  return (
    <Formik
      initialValues={{ transactableType: "", transactableId: "" }}
      onSubmit={({ transactableType, transactableId }, actions) => {
        onSubmit(transactableId, transactableType);
        actions.resetForm();
        actions.setSubmitting(false);
      }}
      validationSchema={validate}
    >
      {({ isSubmitting }) => (
        <Form>
          <FieldGroup>
            <Label id="transactableType">Transactable Type</Label>
            <Field
              id="transactableType"
              name="transactableType"
              component={FormikSelectField}
              options={TRANSACTABLE_OPTIONS}
            />
            <FormikErrorMessage name="transactableType" />
          </FieldGroup>
          <FieldGroup>
            <Label id="transactableId">Transactable ID</Label>
            <Field
              id="transactableId"
              name="transactableId"
              component={FormikInputField}
            />
            <FormikErrorMessage name="transactableId" />
          </FieldGroup>
          <Button buttonType="primary" isSubmit disabled={isSubmitting}>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
}

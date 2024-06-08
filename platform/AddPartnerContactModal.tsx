import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
} from "formik";
import { Alert, Input, Label, ConfirmModal } from "../../common/ui-components";
import { FormValues } from "../constants/partner_contact_form";
import {
  useOnboardingPartnerContactsHomeQuery,
  useUpsertOnboardingPartnerContactMutation,
} from "../../generated/dashboard/graphqlSchema";
import { EMAIL_REGEX } from "../../common/constants";
import { INITIAL_PAGINATION } from "./EntityTableView";

interface AddPartnerContactModalProps {
  isOpen: boolean;
  partnerId: string;
  existingId?: string;
  partnerContactFormValues: FormValues;
  handleModalClose: () => void;
}

function AddPartnerContactModal({
  isOpen,
  partnerId,
  existingId = "",
  partnerContactFormValues = {
    name: "",
    email: "",
    phone: "",
  },
  handleModalClose,
}: AddPartnerContactModalProps) {
  const [upsertContactErrorMessage, setUpsertContactErrorMessage] =
    useState<string>();
  const dispatch = useDispatch();
  const [upsertOnboardingPartnerContact] =
    useUpsertOnboardingPartnerContactMutation();
  const { data, loading, refetch } = useOnboardingPartnerContactsHomeQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: INITIAL_PAGINATION.perPage,
      partnerId,
    },
  });

  if (loading || !data) return <ClipLoader />;

  const validateForm = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name) {
      errors.name = "Required";
      setUpsertContactErrorMessage("Name is required");
    }
    if (!values.email) {
      errors.email = "Required";
      setUpsertContactErrorMessage("Email is required");
    }
    if (values.email && !EMAIL_REGEX.test(values.email)) {
      errors.email = "Please enter valid email";
      setUpsertContactErrorMessage("Please enter valid email");
    }
    return errors;
  };

  const submitPartnerContactDetails = async (formValues: FormValues) => {
    const { name, email, phone } = formValues;

    const result = await upsertOnboardingPartnerContact({
      variables: {
        input: {
          input: {
            ...(existingId && { id: existingId }),
            name: name ?? "",
            email,
            phone,
            partnerId,
          },
        },
      },
    });

    if (result.data?.upsertOnboardingPartnerContact?.errors.length === 0) {
      await refetch();
      setUpsertContactErrorMessage("");
      dispatch(handleModalClose);
    } else {
      setUpsertContactErrorMessage(
        result.data?.upsertOnboardingPartnerContact?.errors?.join(",")
      );
    }
  };

  return (
    <div className="outer-mt-container">
      <Formik
        initialValues={partnerContactFormValues}
        onSubmit={submitPartnerContactDetails}
        validate={validateForm}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, handleSubmit, resetForm }) => (
          <ConfirmModal
            title={existingId ? "Edit Contact" : "Create Contact"}
            isOpen={isOpen}
            onAfterOpen={() =>
              resetForm({
                values: {
                  name: partnerContactFormValues.name,
                  email: partnerContactFormValues.email,
                  phone: partnerContactFormValues.phone,
                },
              })
            }
            onRequestClose={handleModalClose}
            setIsOpen={handleModalClose}
            confirmText={existingId ? "Update" : "Create"}
            confirmType="confirm"
            onConfirm={handleSubmit}
            className="max-w-[420px]"
            bodyClassName="form-create form-create-wide form-create-rules"
          >
            {upsertContactErrorMessage && (
              <Alert
                onClear={() => setUpsertContactErrorMessage("")}
                alertType="danger"
              >
                {upsertContactErrorMessage}
              </Alert>
            )}
            <Form>
              <Field name="name" key="name">
                {({
                  field,
                  form,
                }: FieldProps<string> & FormikProps<FormValues>) => (
                  <div className="form-row mb-3 flex pt-5">
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={values?.name || ""}
                      onChange={(event) => {
                        void form.setFieldValue(field.name, event.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>
              <Field name="email" key="email">
                {({
                  field,
                  form,
                }: FieldProps<string> & FormikProps<FormValues>) => (
                  <div className="form-row mb-3 flex">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      value={values?.email || ""}
                      onChange={(event) => {
                        void form.setFieldValue(field.name, event.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>
              <Field name="phone" key="phone">
                {({
                  field,
                  form,
                }: FieldProps<string> & FormikProps<FormValues>) => (
                  <div className="form-row mb-3 flex">
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input
                      value={values?.phone || ""}
                      onChange={(event) => {
                        void form.setFieldValue(field.name, event.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          </ConfirmModal>
        )}
      </Formik>
    </div>
  );
}

export default AddPartnerContactModal;

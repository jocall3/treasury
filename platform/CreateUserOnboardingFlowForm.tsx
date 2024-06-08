import React, { useRef } from "react";
import { Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import {
  useCreateUserOnboardingFlowMutation,
  UserOnboardingFlow,
} from "../../../generated/dashboard/graphqlSchema";
import { Button, FieldGroup, Label } from "../../../common/ui-components";
import { FormikErrorMessage } from "../../../common/formik";
import FormikCounterpartyAsyncSelect, {
  CounterpartyOption,
} from "../../../common/formik/FormikCounterpartyAsyncSelect";
import FormikFlowAliasAsyncSelect, {
  FlowAliasOption,
} from "../../../common/formik/FormikFlowAliasAsyncSelect";
import useErrorBanner from "../../../common/utilities/useErrorBanner";

interface FormValues {
  counterparty?: CounterpartyOption;
  flowAlias?: FlowAliasOption;
}

interface CreateUserOnboardingFlowFormProps {
  onSuccess: (userOnboardingFlow: UserOnboardingFlow) => void;
}

function CreateUserOnboardingFlowForm({
  onSuccess,
}: CreateUserOnboardingFlowFormProps) {
  const flashError = useErrorBanner();
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const [createUserOnboardingFlowMutation] =
    useCreateUserOnboardingFlowMutation();

  const initialValues = {
    flowAlias: undefined,
    counterparty: undefined,
  };

  const validate = yup.object().shape({
    flowAlias: yup.object().required("Flow alias must be selected"),
  });

  const createUserOnboardingFlow = async (formValues: FormValues) => {
    const { flowAlias, counterparty } = formValues;

    if (!flowAlias) {
      flashError("Flow alias is required.");
      return;
    }

    await createUserOnboardingFlowMutation({
      variables: {
        input: {
          input: {
            flowAlias: flowAlias.value,
            counterpartyId: counterparty?.value,
          },
        },
      },
      onCompleted: (data) => {
        const userOnboardingFlow =
          data.createUserOnboardingFlow?.userOnboardingFlow;

        if (!userOnboardingFlow) {
          const errorMsg = data.createUserOnboardingFlow?.errors.join(",");
          flashError(errorMsg || "Error creating User Onboarding Flow.");
        } else {
          onSuccess(userOnboardingFlow);
        }
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnMount
      onSubmit={createUserOnboardingFlow}
      innerRef={formikRef}
      validationSchema={validate}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col space-y-6">
          <div className="pb-1 text-base font-medium">
            Create User Onboarding Flow
          </div>

          <FieldGroup>
            <Label id="flowAlias">Flow Alias</Label>
            <FormikFlowAliasAsyncSelect />
            <FormikErrorMessage name="flowAlias" />
          </FieldGroup>

          <FieldGroup>
            <Label id="counterparty">Counterparty</Label>
            <FormikCounterpartyAsyncSelect />
            <FormikErrorMessage name="counterparty" />
          </FieldGroup>

          <div className="pt-2">
            <Button
              buttonType="primary"
              isSubmit
              disabled={!isValid || isSubmitting}
            >
              Create User Onboarding Flow
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateUserOnboardingFlowForm;

import React, { useRef } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import {
  AppearanceVariables,
  FontFamily,
} from "@modern-treasury/modern-treasury-js";
import { Button, FieldGroup, Label } from "../../common/ui-components";
import {
  FormikErrorMessage,
  FormikInputField,
  FormikSelectField,
} from "../../common/formik";
import { makeOptionsFromEnum } from "../../app/utilities/selectUtilities";

interface AppearanceVariablesFormProps {
  isWorkflowMounted: boolean;
  onSubmit: (appearanceVariables: AppearanceVariables) => void;
}

function AppearanceVariablesForm({
  isWorkflowMounted,
  onSubmit,
}: AppearanceVariablesFormProps) {
  const formikRef = useRef<FormikProps<AppearanceVariables>>(null);
  const initialValues = {
    colorPrimary: "#2B71D4",
    fontFamily: FontFamily.inter,
    colorBackground: "#ffffff",
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnMount
      onSubmit={(appearanceVariables: AppearanceVariables, actions) => {
        onSubmit(appearanceVariables);
        actions.setSubmitting(false);
      }}
      innerRef={formikRef}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col space-y-6">
          <div className="text-base font-bold">Appearance Variables</div>
          <FieldGroup>
            <Label id="colorPrimary">Color Primary</Label>
            <Field
              id="colorPrimary"
              name="colorPrimary"
              type="color"
              component={FormikInputField}
            />
            <FormikErrorMessage name="colorPrimary" />
          </FieldGroup>

          <FieldGroup>
            <Label id="fontFamily">Font Family</Label>
            <Field
              id="fontFamily"
              name="fontFamily"
              component={FormikSelectField}
              options={makeOptionsFromEnum(FontFamily)}
            />
            <FormikErrorMessage name="fontFamily" />
          </FieldGroup>

          <FieldGroup>
            <Label id="colorBackground">Color Background</Label>
            <Field
              id="colorBackground"
              name="colorBackground"
              type="color"
              component={FormikInputField}
            />
            <FormikErrorMessage name="colorBackground" />
          </FieldGroup>

          <div className="pt-2">
            <Button buttonType="primary" isSubmit disabled={isSubmitting}>
              {isWorkflowMounted ? "Update Appearance" : "Mount Workflow"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AppearanceVariablesForm;

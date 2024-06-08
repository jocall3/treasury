import { Field, Form, Formik, FormikProps } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import { FormikInputField, FormikErrorMessage } from "../../common/formik";
import { IPAllowlistForm } from "./IPAllowlistForm";
import { Button, Label } from "../../common/ui-components";
import { PermissionFormValue } from "../containers/user_management/forms/types";
import PermissionsComponent from "../containers/user_management/forms/Permissions";
import { Permission } from "../../generated/dashboard/graphqlSchema";
import PermissionsTable from "../containers/user_management/PermissionsTable";

export interface APIKeyFormValues {
  name: string;
  ipAllowlist: string[];
  permissions: PermissionFormValue[];
  roles: string[];
}

interface APIKeyFormProps {
  initialValues: APIKeyFormValues;
  submitMutation: ({ name, roles, ipAllowlist, permissions }) => void;
  displayPermissions?: Permission[];
  id?: string;
}

function APIKeyForm({
  initialValues,
  submitMutation,
  displayPermissions,
  id,
}: APIKeyFormProps) {
  const formikRef = useRef<
    FormikProps<{
      permissions: PermissionFormValue[];
      name?: string;
      ipAllowlist?: string[];
      roles?: string[];
    }>
  >(null);

  const updating = !!id;

  const validate = () =>
    Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string(),
    });

  return (
    <div className="form-create form-create-wide">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => submitMutation(values)}
        innerRef={formikRef as React.RefObject<FormikProps<APIKeyFormValues>>}
        validationSchema={validate}
      >
        {({ values, setFieldValue }: FormikProps<APIKeyFormValues>) => (
          <Form>
            <div className="w-full">
              <Label id="name">Name</Label>
              <Field id="name" name="name" component={FormikInputField} />
              <FormikErrorMessage name="name" />
            </div>
            <div className="form-section">
              <IPAllowlistForm
                ipAllowlist={values.ipAllowlist}
                setIpAllowlist={(data) => {
                  void setFieldValue("ipAllowlist", data);
                }}
                enabled
              />
            </div>

            {updating ? (
              <div>
                <h3 className="h3-no-bottom-border">
                  <div className="header-hint">
                    You cannot edit the permissions assigned to a key once it
                    has been created.
                    {updating && (
                      <div>
                        If you need different permissions, create a new API key.
                      </div>
                    )}
                  </div>
                </h3>
                <h1 className="h1 mb-4 mt-8">Permissions</h1>
                <PermissionsTable permissions={displayPermissions || []} />
              </div>
            ) : (
              <PermissionsComponent formikRef={formikRef} values={values} />
            )}

            <div className="flex flex-row space-x-4 pt-8">
              <Button isSubmit buttonType="primary">
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default APIKeyForm;

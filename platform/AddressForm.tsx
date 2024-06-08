import React from "react";
import { Field } from "redux-form";
import { COUNTRY_CODES } from "../constants";
import { required } from "../../common/ui-components/validations";
import ReduxInputField from "../../common/deprecated_redux/ReduxInputField";
import { SelectField, Label, FieldGroup } from "../../common/ui-components";

interface AddressFormProps {
  fieldName: string;
  isDisabled?: boolean;
  address?: Record<string, unknown>;
  addressName: string;
  shouldValidate?: boolean;
}

function AddressForm({
  fieldName,
  isDisabled,
  address,
  addressName,
  shouldValidate,
}: AddressFormProps) {
  const validate = shouldValidate ? [required] : [];
  return (
    <div>
      <div className="subsection-row">
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.line1`}>Address Line 1</Label>
          <Field
            name={`${fieldName}.${addressName}.line1`}
            type="text"
            component={ReduxInputField}
            disabled={isDisabled}
            validate={validate}
          />
        </FieldGroup>
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.line2`}>Address Line 2</Label>
          <Field
            name={`${fieldName}.${addressName}.line2`}
            type="text"
            component={ReduxInputField}
            disabled={isDisabled}
          />
        </FieldGroup>
      </div>
      <div className="subsection-row">
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.locality`}>City</Label>
          <Field
            name={`${fieldName}.${addressName}.locality`}
            type="text"
            component={ReduxInputField}
            disabled={isDisabled}
            validate={validate}
          />
        </FieldGroup>
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.region`}>State</Label>
          <Field
            name={`${fieldName}.${addressName}.region`}
            type="text"
            component={ReduxInputField}
            disabled={isDisabled}
            validate={validate}
          />
        </FieldGroup>
      </div>

      <div className="subsection-row">
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.postal_code`}>
            Postal Code
          </Label>
          <Field
            name={`${fieldName}.${addressName}.postal_code`}
            type="text"
            component={ReduxInputField}
            disabled={isDisabled}
            validate={validate}
          />
        </FieldGroup>
        <FieldGroup>
          <Label id={`${fieldName}.${addressName}.country`}>Country</Label>
          <Field
            required
            name={`${fieldName}.${addressName}.country`}
            type="text"
            component={SelectField}
            disabled={isDisabled}
            options={COUNTRY_CODES}
            selectValue={address?.country}
            validate={validate}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default AddressForm;

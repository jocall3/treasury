import { Field } from "formik";
import React from "react";
import { FieldGroup, Label } from "../../common/ui-components";
import { CurrencyEnum } from "../../generated/dashboard/graphqlSchema";
import { FormikSelectField, FormikErrorMessage } from "../../common/formik";

const currencyOptions = Object.values(CurrencyEnum).map((value) => ({
  label: value,
  value,
}));

export interface CurrencySelectorProps {
  name?: string;
}

function CurrencySelector({ name }: CurrencySelectorProps) {
  return (
    <FieldGroup key="currency">
      <Label id="currency">Currency</Label>
      <Field
        id="currency"
        name={name || "currency"}
        options={currencyOptions}
        component={FormikSelectField}
      />
      <FormikErrorMessage name="currency" />
    </FieldGroup>
  );
}

export default CurrencySelector;

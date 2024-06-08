import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Field, FieldArray, change, reduxForm } from "redux-form";

import isNil from "lodash/isNil";

import AddressForm from "./AddressForm";
import CounterpartyAccountFormActions from "./CounterpartyAccountFormActions";
import ToggleableAddressForm from "./ToggleableAddressForm";
import { CounterpartyAccountRoutingDetails } from "./CounterpartyAccountRoutingDetails";
import {
  AccountCountryOptions,
  RoutingNumberField,
} from "./CounterpartyAccountCountryOptions";
import ReduxInputField from "../../common/deprecated_redux/ReduxInputField";
import ReduxSelectBar from "../../common/deprecated_redux/ReduxSelectBar";
import { FieldGroup, Label, SelectField } from "../../common/ui-components";

function AccountsSection({
  fields,
  accounts,
  reduxChange,
  formName,
  counterpartyName,
  isEdit,
}) {
  function pushNewAccount(accountCountryType) {
    const data = {
      party_address: {},
      account_country_type: accountCountryType,
    };
    fields.push(data);
  }

  function getData(index, dataName) {
    return accounts && !isNil(accounts[index]) ? accounts[index][dataName] : {};
  }

  const clearRoutingAndAccountNumbers = (account) => {
    Object.values(RoutingNumberField).forEach((routingNumber) => {
      if (routingNumber !== RoutingNumberField.SWIFT_CODE) {
        reduxChange(`${account}.${routingNumber}`, null, false, false);
        reduxChange(`${account}.${routingNumber}_touched`, false, false, false);
      }
    });
    reduxChange(`${account}.iban_account_number`, null, false, false);
    reduxChange(`${account}.account_number`, null, false, false);
  };

  let partyAddress;

  return (
    <div>
      {fields.map((account, index) => {
        partyAddress = getData(index, "party_address");
        return (
          <div key={account} className="form-subsection">
            <div className="border-mt-gray-200 grid grid-flow-col justify-between border-b py-4">
              <div>
                <SelectField
                  selectValue={getData(index, "account_country_type")}
                  classes="w-56"
                  disabled={isEdit}
                  options={AccountCountryOptions}
                  handleChange={(value) => {
                    reduxChange(
                      `${account}.account_country_type`,
                      value,
                      false,
                      false
                    );
                    clearRoutingAndAccountNumbers(account);
                  }}
                />
              </div>
              <CounterpartyAccountFormActions
                onDelete={() => fields.remove(index)}
              />
            </div>
            <div className="subsection-row my-2">
              <FieldGroup>
                <Label
                  id={`${account}.party_name`}
                  helpText="This is the name your counterparty has on their account.<br />It helps us route the payment to them correctly.<br />If the account name is the same as the name you put above, you may leave this blank."
                >
                  Name on Account
                </Label>
                <Field
                  placeholder={counterpartyName}
                  name={`${account}.party_name`}
                  component={ReduxInputField}
                  type="text"
                />
              </FieldGroup>

              <FieldGroup>
                <Label
                  id={`${account}.name`}
                  helpText="This is the nickname of this specific account.<br />This can help indicate the correct account when creating payment orders."
                >
                  Account Nickname
                </Label>
                <Field
                  name={`${account}.name`}
                  component={ReduxInputField}
                  type="text"
                />
              </FieldGroup>
            </div>
            {accounts[index].account_country_type !== "US_CHECKS_ONLY" && (
              <>
                <div className="mb-4 mr-4 max-w-24/25">
                  <Field
                    name={`${account}.party_type`}
                    label="Counterparty Type"
                    component={ReduxSelectBar}
                    selectOptions={[
                      {
                        text: "Business",
                        value: "business",
                        selectedClassName: "bg-cyan-600 text-white",
                      },
                      {
                        text: "Individual",
                        value: "individual",
                        selectedClassName: "bg-cyan-600 text-white",
                      },
                    ]}
                    helpText="This helps us determine how to route the payment to the counterparty. You may leave this blank if are not using electronic payments."
                  />
                </div>
                <div className="mb-4 mr-4 max-w-24/25">
                  <Field
                    name={`${account}.account_type`}
                    label="Account Type"
                    component={ReduxSelectBar}
                    selectOptions={[
                      {
                        text: "Checking",
                        value: "checking",
                        selectedClassName: "bg-cyan-600 text-white",
                      },
                      {
                        text: "Savings",
                        value: "savings",
                        selectedClassName: "bg-cyan-600 text-white",
                      },
                    ]}
                    helpText="You may leave this blank if you are not using electronic payments."
                  />
                </div>
                <CounterpartyAccountRoutingDetails
                  index={index}
                  account={account}
                  formName={formName}
                  getData={getData}
                  reduxChange={reduxChange}
                  accountCountryType={getData(index, "account_country_type")}
                />
                <ToggleableAddressForm
                  formName={formName}
                  fieldName={account}
                  address={partyAddress}
                  addressName="party_address"
                  reduxChange={reduxChange}
                />
              </>
            )}
            {accounts[index].account_country_type === "US_CHECKS_ONLY" && (
              <AddressForm
                fieldName={account}
                address={partyAddress}
                addressName="party_address"
                shouldValidate
              />
            )}
          </div>
        );
      })}

      <div>
        <SelectField
          name="accountCountryTypeSelect"
          selectValue={undefined}
          classes="w-52"
          placeholder="Add Bank Account"
          disabled={false}
          options={AccountCountryOptions}
          handleChange={(value) => {
            pushNewAccount(value);
          }}
          optionIcon
        />
      </div>
    </div>
  );
}

function CounterpartyAccountFormSection({
  formName,
  accounts,
  change: reduxChange,
  counterpartyName,
  isEdit,
}) {
  return (
    <FieldArray
      reduxChange={reduxChange}
      name="accounts"
      component={AccountsSection}
      accounts={accounts}
      formName={formName}
      counterpartyName={counterpartyName}
      isEdit={isEdit}
    />
  );
}

export default compose(
  connect(null, { change }),
  reduxForm({ form: "counterparty" })
)(CounterpartyAccountFormSection);

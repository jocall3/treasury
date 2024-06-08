import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field, change, formValueSelector } from "redux-form";
import { required, email } from "../../common/ui-components/validations";
import AccountingCategorySelect from "./AccountingCategorySelect";
import AccountingLedgerClassSelect from "./AccountingLedgerClassSelect";
import { loadLedgerEntities } from "../actions";
import ReduxCheckbox from "../../common/deprecated_redux/ReduxCheckbox";
import ReduxInputField from "../../common/deprecated_redux/ReduxInputField";
import {
  FieldGroup,
  FieldsRow,
  Label,
  SelectField,
  Tooltip,
} from "../../common/ui-components";
import Gon from "../../common/utilities/gon";
import { useDispatchContext } from "../MessageProvider";

const ledgerTypeOptions = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
];

function CounterpartyDetailsForm({
  accounting_category: accountingCategory,
  accounting_ledger_class: accountingLedgerClass,
  ledger_type: ledgerType,
  change: reduxChange,
  loadLedgerEntities: loadLedgerEntitiesFunc,
  newCounterpartyForm,
}) {
  const { dispatchError } = useDispatchContext();
  useEffect(() => {
    loadLedgerEntitiesFunc(
      { ledger_sync_type: ["account", "ledger_class"] },
      null,
      dispatchError
    );
  }, [loadLedgerEntitiesFunc, dispatchError]);

  const {
    ui: {
      ledger: {
        id: ledgerId = "",
        ledger_classes_enabled: ledgerClassesEnabled = false,
        auto_sync_counterparties_enabled: autoSyncCounterpartiesEnabled = false,
      } = {},
    },
  } = Gon.gon ?? {};

  function onAccountingCategoryChange(value) {
    reduxChange("accounting_category", value, false, false);
  }

  function onAccountingLedgerClassChange(value) {
    reduxChange("accounting_ledger_class", value, false, false);
  }

  function onledgerTypeChange(value) {
    reduxChange("ledger_type", value, false, false);
  }

  return (
    <div className="form-section">
      <div className="mb-2 w-full mint-md:w-72">
        <FieldGroup>
          <Label id="name">Counterparty Name</Label>
          <Field
            name="name"
            type="text"
            component={ReduxInputField}
            validate={[required]}
            required
          />
        </FieldGroup>
      </div>
      <FieldsRow centered={false} columns={2} gap={4} className="items-end">
        <div className="mb-0 w-full mint-md:mb-2 mint-md:w-72">
          <FieldGroup>
            <Label id="email">Email</Label>
            <Field
              name="email"
              type="text"
              component={ReduxInputField}
              validate={[email]}
              helpText="This field is optional. If you'd like us to onboard the counterparty for you, we'll need their email."
            />
          </FieldGroup>
        </div>
        <div className="mb-1 flex items-center">
          <FieldGroup direction="left-to-right">
            <Field name="send_remittance_advice" component={ReduxCheckbox} />
            <Label className="ml-2">Email counterparty when paid</Label>
          </FieldGroup>
        </div>
      </FieldsRow>
      {ledgerId && (
        <div className="form-section mt-6">
          <h3>
            <span>Default Accounting Details</span>
            <span className="addendum">OPTIONAL</span>
            <Tooltip
              className="tooltip-holder"
              data-tip="These accounting details will be pre-selected when creating a payment order involving this counterparty."
            />
          </h3>
          <div className="form-row flex">
            <Field
              label="Accounting Category"
              helpText="This is the list of accounting categories we've pulled from your accounting system."
              component={AccountingCategorySelect}
              name="accounting_category"
              selectValue={accountingCategory}
              handleChange={onAccountingCategoryChange}
            />
            {ledgerClassesEnabled && (
              <Field
                label="Accounting Class"
                helpText="This is the list of accounting classes we've pulled from your accounting system."
                component={AccountingLedgerClassSelect}
                name="accounting_ledger_class"
                selectValue={accountingLedgerClass}
                handleChange={onAccountingLedgerClassChange}
              />
            )}
          </div>
          {autoSyncCounterpartiesEnabled && newCounterpartyForm && (
            <div className="form-row flex">
              <FieldGroup direction="top-to-bottom">
                <Label
                  helpText="This counterparty will be synced as the selected type when it is auto synced to your ledger."
                  id="ledger_type"
                >
                  Ledger Type
                </Label>
                <SelectField
                  name="ledger_type"
                  handleChange={onledgerTypeChange}
                  selectValue={ledgerType}
                  options={ledgerTypeOptions}
                />
              </FieldGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const selector = formValueSelector("counterparty");
function mapStateToProps(state) {
  return {
    accounting_category: selector(state, "accounting_category"),
    accounting_ledger_class: selector(state, "accounting_ledger_class"),
    ledger_type: selector(state, "ledger_type"),
  };
}

export default compose(
  connect(mapStateToProps, { change, loadLedgerEntities }),
  reduxForm({ form: "counterparty" })
)(CounterpartyDetailsForm);

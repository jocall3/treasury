import React, { useState, useEffect } from "react";
import isNil from "lodash/isNil";
import { connect } from "react-redux";
import requestApi from "../../common/utilities/requestApi";
import { loadLedgerEntities } from "../actions";
import AccountingSubsidiarySelect from "./AccountingSubsidiarySelect";
import ReduxCheckbox from "../../common/deprecated_redux/ReduxCheckbox";
import { Button, FieldGroup, Label } from "../../common/ui-components";
import { useDispatchContext } from "../MessageProvider";
import Gon from "../../common/utilities/gon";

function AccountingLedgerSettingsForm({
  isSubView,
  loadLedgerEntities: loadLedgerEntitiesFunc,
}) {
  const {
    ui: { ledger },
  } = Gon.gon ?? {};
  const [state, setState] = useState(ledger);
  const { dispatchError, dispatchSuccess } = useDispatchContext();

  useEffect(() => {
    loadLedgerEntitiesFunc(
      { ledger_sync_type: ["subsidiary"] },
      null,
      dispatchError
    );
  }, [loadLedgerEntitiesFunc, dispatchError]);

  function submitForm(e, data) {
    if (!isNil(e)) {
      e.preventDefault();
    }

    const method = "PATCH";
    const action = `/accounting/ledgers/${state.id}`;

    requestApi(action, null, method, data)
      .json(() => {
        dispatchSuccess("Ledger data updated");
      })
      .catch((error) => {
        try {
          const {
            errors: { message },
          } = JSON.parse(error.message);
          dispatchError(message);
        } catch {
          dispatchError(
            "Sorry but we couldn't save this ledger data. Please check for anything that is invalid"
          );
        }
      });
  }

  function onUpdateLedgerSettings(e) {
    const data = {
      ledger_classes_enabled: state.ledger_classes_enabled,
      auto_sync_counterparties_enabled: state.auto_sync_counterparties_enabled,
      auto_sync_payment_orders_enabled: state.auto_sync_payment_orders_enabled,
    };

    submitForm(e, data);
  }

  function onUpdateVendorSpecificSettings(e) {
    const data = {
      default_subsidiary_id: state.default_subsidiary_id,
    };

    submitForm(e, data);
  }

  function handleChange(newState) {
    setState(newState);

    if (isSubView) {
      submitForm(null, newState);
    }
  }

  function toggleClassesEnabled() {
    handleChange({
      ...state,
      ledger_classes_enabled: !state.ledger_classes_enabled,
    });
  }

  function toggleCounterpartySyncingEnabled() {
    handleChange({
      ...state,
      auto_sync_counterparties_enabled: !state.auto_sync_counterparties_enabled,
    });
  }

  function togglePaymentOrderSyncingEnabled() {
    handleChange({
      ...state,
      auto_sync_payment_orders_enabled: !state.auto_sync_payment_orders_enabled,
    });
  }

  function onDefaultSubsidiaryIdChange(target) {
    handleChange({ ...state, default_subsidiary_id: target });
  }

  return (
    <>
      <div className="mt-container">
        <form className="form-create">
          <div className="form-section">
            <h3>Ledger Settings</h3>
            <FieldGroup direction="left-to-right">
              <ReduxCheckbox
                id="ledger_classes_enabled"
                name="ledger_classes_enabled"
                input={{
                  onChange: toggleClassesEnabled,
                  checked: state.ledger_classes_enabled,
                }}
              />
              <Label
                id="ledger_classes_enabled_label"
                helpText="When enabled, you can select an accounting class on each Payment Order.<br />When synced, Payment Orders will be associated to the assigned class."
              >
                Enable Ledger Classes
              </Label>
            </FieldGroup>
            <FieldGroup direction="left-to-right">
              <ReduxCheckbox
                id="auto_sync_counterparties_enabled"
                name="auto_sync_counterparties_enabled"
                input={{
                  onChange: toggleCounterpartySyncingEnabled,
                  checked: state.auto_sync_counterparties_enabled,
                }}
              />
              <Label
                id="auto_sync_counterparties_enabled_label"
                helpText="When enabled, counterparties will be automatically synced when they are created.<br />Given that a Counterparty can represent one or more accounting entities (e.g. Customer, Vendor, etc.), <br />to allow auto-syncing, you must select a Default Accounting Type for each Counterparty."
              >
                Auto Sync Counterparties
              </Label>
            </FieldGroup>
            <FieldGroup direction="left-to-right">
              <ReduxCheckbox
                id="auto_sync_payment_orders_enabled"
                name="auto_sync_payment_orders_enabled"
                input={{
                  onChange: togglePaymentOrderSyncingEnabled,
                  checked: state.auto_sync_payment_orders_enabled,
                }}
              />
              <Label
                id="auto_sync_payment_orders_enabled_label"
                helpText="When enabled, payment orders will be automatically synced.<br />Payment Orders are synced to your bank when when their status<br />transitions to Sent, meaning it has been sent to the bank."
              >
                Auto Sync Payment Orders
              </Label>
            </FieldGroup>
          </div>
          {!isSubView && (
            <div className="form-section">
              <Button buttonType="primary" onClick={onUpdateLedgerSettings}>
                Update Ledger Settings
              </Button>
            </div>
          )}
        </form>
      </div>
      {ledger.vendor === "NetSuite" && (
        <div className="mt-container">
          <form className="form-create">
            <div className="form-section">
              <h3>NetSuite Settings</h3>
              <div className="form-row form-row-full flex">
                <AccountingSubsidiarySelect
                  label="Default Subsidiary"
                  helpText="This is the Subsidiary we will use when syncing records to your ledger."
                  name="default_subsidiary_id"
                  input={{
                    value: state.default_subsidiary_id,
                    onChange: onDefaultSubsidiaryIdChange,
                  }}
                />
              </div>
            </div>
            {!isSubView && (
              <div className="form-section">
                <Button
                  buttonType="primary"
                  onClick={onUpdateVendorSpecificSettings}
                >{`Update ${ledger.vendor} Settings`}</Button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default connect(null, {
  loadLedgerEntities,
})(AccountingLedgerSettingsForm);

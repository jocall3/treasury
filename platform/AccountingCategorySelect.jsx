import React, { useMemo } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { FieldGroup, Label, SelectField } from "../../common/ui-components";

const ACCOUNT_ORDER = ["asset", "equity", "expense", "liability", "revenue"];

function AccountingCategorySelect({
  metadata,
  label,
  helpText,
  ledgerEntities,
  input: { name, value: selectValue, onChange: handleChange },
  disabled,
}) {
  const ledgerAccountOptions = useMemo(() => {
    const options = {};

    ledgerEntities.allIds.forEach((id) => {
      const ledgerEntity = ledgerEntities.byId[id];

      if (ledgerEntity.ledger_sync_type === "account") {
        const {
          id: value,
          data: { classification, name: optionLabel },
        } = ledgerEntity;
        if (!options[classification]) {
          options[classification] = [];
        }

        options[classification].push({ value, label: optionLabel, metadata });
      }
    });

    return ACCOUNT_ORDER.map((key) => ({
      label: key,
      options: options[key],
    }));
  }, [ledgerEntities.allIds, ledgerEntities.byId, metadata]);

  return (
    <FieldGroup direction="top-to-bottom">
      <Label id={name}>{label}</Label>
      <SelectField
        selectValue={selectValue}
        helpText={helpText}
        disabled={isEmpty(ledgerEntities.allIds) || disabled}
        options={ledgerAccountOptions}
        handleChange={handleChange}
        name={name}
      />
    </FieldGroup>
  );
}

const mapStateToProps = (state) => ({
  ledgerEntities: state.ledgerEntities,
});

export default connect(mapStateToProps, {})(AccountingCategorySelect);

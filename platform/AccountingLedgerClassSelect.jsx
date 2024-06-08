import React, { useMemo } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { FieldGroup, Label, SelectField } from "../../common/ui-components";

function AccountingLedgerClassSelect({
  label,
  helpText,
  ledgerEntities,
  input: { name, value: selectValue, onChange: handleChange },
  disabled,
}) {
  const ledgerClassOptions = useMemo(() => {
    const options = [];

    ledgerEntities.allIds.forEach((id) => {
      const ledgerEntity = ledgerEntities.byId[id];

      if (ledgerEntity.ledger_sync_type === "ledger_class") {
        const {
          id: value,
          data: { name: optionLabel },
        } = ledgerEntity;
        options.push({ value, label: optionLabel });
      }
    });

    return options;
  }, [ledgerEntities.allIds, ledgerEntities.byId]);

  return (
    <FieldGroup>
      <Label id={name}>{label}</Label>
      <SelectField
        selectValue={selectValue}
        helpText={helpText}
        disabled={isEmpty(ledgerEntities.allIds) || disabled}
        options={ledgerClassOptions}
        handleChange={handleChange}
        name={name}
      />
    </FieldGroup>
  );
}

const mapStateToProps = (state) => ({
  ledgerEntities: state.ledgerEntities,
});

export default connect(mapStateToProps, {})(AccountingLedgerClassSelect);

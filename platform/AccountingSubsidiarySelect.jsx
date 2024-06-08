import React, { useMemo } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { FieldGroup, Label, SelectField } from "../../common/ui-components";

function AccountingSubsidiarySelect({
  label,
  helpText,
  ledgerEntities,
  input: { value: selectValue, onChange: handleChange },
}) {
  const subsidiaryOptions = useMemo(() => {
    const options = [];

    ledgerEntities.allIds.forEach((id) => {
      const ledgerEntity = ledgerEntities.byId[id];

      if (ledgerEntity.ledger_sync_type === "subsidiary") {
        const {
          ledger_resource_id: value,
          data: { name },
        } = ledgerEntity;
        options.push({ value, label: name });
      }
    });

    return options;
  }, [ledgerEntities.allIds, ledgerEntities.byId]);

  return (
    <FieldGroup direction="top-to-bottom">
      <Label id="accountingSubsidiarySelect">{label}</Label>
      <SelectField
        selectValue={selectValue}
        helpText={helpText}
        disabled={isEmpty(ledgerEntities.allIds)}
        options={subsidiaryOptions}
        handleChange={handleChange}
        name="accountingSubsidiarySelect"
      />
    </FieldGroup>
  );
}

const mapStateToProps = (state) => ({
  ledgerEntities: state.ledgerEntities,
});

export default connect(mapStateToProps, {})(AccountingSubsidiarySelect);

import React from "react";
import CounterpartySelect from "../../containers/CounterpartySelect";

function CounterpartySearch({ field, disabled, query, updateQuery, label }) {
  function onChange(value) {
    updateQuery({ [field]: value });
  }

  return (
    <CounterpartySelect
      label={label}
      name={field}
      onChange={onChange}
      counterpartyId={query[field]}
      disabled={disabled}
    />
  );
}

CounterpartySearch.defaultProps = {
  label: "Counterparty",
};

export default CounterpartySearch;

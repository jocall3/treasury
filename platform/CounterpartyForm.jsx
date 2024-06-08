import React from "react";
import { compose } from "redux";
import { reduxForm, formValueSelector, Field, change } from "redux-form";
import { connect } from "react-redux";
import { ClipLoader } from "react-spinners";
import CounterpartyDetailsForm from "./CounterpartyDetailsForm";
import CounterpartyAccountFormSection from "./CounterpartyAccountFormSection";
import DocumentUploadContainer from "../containers/DocumentUploadContainer";
import { Button } from "../../common/ui-components";
import { COUNTERPARTY } from "../../generated/dashboard/types/resources";
import MetadataInput from "./MetadataInput";

function CounterpartyForm({
  handleSubmit,
  submitting,
  accounts,
  name,
  onPendingDocumentChange,
  change: reduxChange,
}) {
  return (
    <form autoComplete="off" className="form-create">
      <CounterpartyDetailsForm
        newCounterpartyForm
        onPendingDocumentChange={onPendingDocumentChange}
      />
      <div className="form-section">
        <h3>
          <span>Bank Accounts</span>
          <span className="addendum">OPTIONAL</span>
        </h3>

        <CounterpartyAccountFormSection
          counterpartyName={name}
          accounts={accounts}
          formName="counterparty"
        />
      </div>
      <div className="form-section">
        <h3>
          <span>Counterparty Metadata</span>
          <span className="addendum">OPTIONAL</span>
        </h3>
        <Field
          name="receiving_entity_metadata"
          component={MetadataInput}
          props={{
            resource: COUNTERPARTY,
            onChange: (metadata) => {
              reduxChange("receiving_entity_metadata", {
                ...metadata,
              });
            },
          }}
        />
      </div>
      <div className="form-section">
        <h3>
          <span>Documents</span>
          <span className="addendum">OPTIONAL</span>
        </h3>
        <DocumentUploadContainer
          skipInitialFetch
          enableSave={false}
          documentable_type="Counterparty"
          onPendingDocumentChange={onPendingDocumentChange}
        />
      </div>
      <div className="form-group">
        <Button
          buttonType="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Create
        </Button>
        {submitting ? (
          <ClipLoader
            loaderStyle={{ verticalAlign: "middle", marginLeft: "1rem" }}
          />
        ) : undefined}
      </div>
    </form>
  );
}

const selector = formValueSelector("counterparty");
function mapStateToProps(state) {
  return {
    accounts: selector(state, "accounts"),
    name: selector(state, "name"),
  };
}

export default compose(
  connect(mapStateToProps, { change }),
  reduxForm({ form: "counterparty" })
)(CounterpartyForm);

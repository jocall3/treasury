import isEmpty from "lodash/isEmpty";
import { startSubmit, stopSubmit } from "redux-form";
import requestApi from "../../common/utilities/requestApi";
import { actions } from "../slices/counterparties";
import { createDocuments } from "./documents";

const transformAddress = (data) =>
  data && {
    id: data.id,
    line1: data.line1,
    line2: data.line2,
    line3: data.line3,
    locality: data.locality,
    region: data.region,
    country: data.country,
    postalCode: data.postal_code,
  };

export const transformExternalAccount = (data) =>
  data && {
    id: data.id,
    partyAddress: transformAddress(data.party_address),
    name: data.name,
    partyName: data.party_name,
    accountType: data.account_type,
    partyType: data.party_type,
    partyIdentifier: data.party_identifier,
    accountNumber: data.account_number,
    accountNumberTouched: data.account_number_touched,
    abaRoutingNumber: data.aba_routing_number,
    abaRoutingNumberTouched: data.aba_routing_number_touched,
    caCpaRoutingNumber: data.ca_cpa_routing_number,
    caCpaRoutingNumberTouched: data.ca_cpa_routing_number_touched,
    dkInterbankClearingCodeRoutingNumber:
      data.dk_interbank_clearing_code_routing_number,
    dkInterbankClearingCodeRoutingNumberTouched:
      data.dk_interbank_clearing_code_routing_number_touched,
    auBsbRoutingNumber: data.au_bsb_routing_number,
    auBsbRoutingNumberTouched: data.au_bsb_routing_number_touched,
    gbSortCodeRoutingNumber: data.gb_sort_code_routing_number,
    gbSortCodeRoutingNumberTouched: data.gb_sort_code_routing_number_touched,
    ibanAccountNumber: data.iban_account_number,
    ibanAccountNumberTouched: data.iban_account_number_touched,
    hkInterbankClearingCodeRoutingNumber:
      data.hk_interbank_clearing_code_routing_number,
    hkInterbankClearingCodeRoutingNumberTouched:
      data.hk_interbank_clearing_code_routing_number_touched,
    huInterbankClearingCodeRoutingNumber:
      data.hu_interbank_clearing_code_routing_number,
    huInterbankClearingCodeRoutingNumberTouched:
      data.hu_interbank_clearing_code_routing_number_touched,
    idSknbiCodeRoutingNumber: data.id_sknbi_code_routing_number,
    idSknbiCodeRoutingNumberTouched: data.id_sknbi_code_routing_number_touched,
    nzNationalClearingCodeRoutingNumber:
      data.nz_national_clearing_code_routing_number,
    nzNationalClearingCodeRoutingNumberTouched:
      data.nz_national_clearing_code_routing_number_touched,
    seBankgiroClearingCodeRoutingNumber:
      data.se_bankgiro_clearing_code_routing_number,
    seBankgiroClearingCodeRoutingNumberTouched:
      data.se_bankgiro_clearing_code_routing_number_touched,
    swiftCode: data.swift_code,
    swiftCodeTouched: data.swift_code_touched,
    inIfscRoutingNumber: data.in_ifsc_routing_number,
    inIfscRoutingNumberTouched: data.in_ifsc_routing_number_touched,
    jpZenginCodeRoutingNumber: data.jp_zengin_code_routing_number,
    jpZenginCodeRoutingNumberTouched:
      data.jp_zengin_code_routing_number_touched,
  };

export const transformCounterparty = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  taxpayerIdentifier: data.taxpayer_identifier,
  ledgerType: data.ledger_type,
  metadata: JSON.stringify(data.metadata),
  sendRemittanceAdvice: data.send_remittance_advice,
  accountingCategory: data.accounting_category,
  accountingLedgerClass: data.accounting_ledger_class,
  accounts: data.accounts ? data.accounts.map(transformExternalAccount) : null,
});

export function submitCounterparty(
  values,
  upsertCounterpartyMutation,
  successCallback,
  pendingDocuments,
  dispatchError
) {
  return (dispatch) => {
    const accounts = values.accounts || null;

    const metadata = values.receiving_entity_metadata
      ? values.receiving_entity_metadata
      : null;

    const data = {
      ...values,
      accounts,
      ...(metadata && { metadata }),
    };

    dispatch(startSubmit("counterparty"));

    upsertCounterpartyMutation({
      variables: { input: { input: transformCounterparty(data) } },
    })
      .then(
        ({
          data: {
            upsertCounterparty: { counterparty: returnedCounterparty, errors },
          },
        }) => {
          if (errors.length) {
            dispatchError(errors);
            dispatch(stopSubmit("counterparty"));
          } else if (!values.id) {
            createDocuments(
              returnedCounterparty.id,
              "Counterparty",
              pendingDocuments
            ).then((failures) => {
              if (!isEmpty(failures)) {
                window.location.href = `/counterparties/${returnedCounterparty.id}?hadDocumentFailures=true`;
              } else {
                window.location.href = `/counterparties/${returnedCounterparty.id}`;
              }
            });
          } else if (successCallback) {
            dispatch(actions.setOne(returnedCounterparty));
            successCallback();
          }
        }
      )
      .catch((error) => {
        try {
          const {
            errors: { message },
          } = JSON.parse(error.message);
          dispatchError(message);
        } catch (e) {
          dispatchError("An error occurred");
        }

        dispatch(stopSubmit("counterparty"));
      });
  };
}

export function collectCounterpartyAccount(
  counterpartyId,
  invitationData,
  dispatchSuccess,
  dispatchError
) {
  return (dispatch) => {
    const data = {
      invitationData: {
        ...invitationData,
        custom_redirect: invitationData.customRedirect,
        fields: Object.keys(invitationData.fields).filter(
          (f) => invitationData.fields[f]
        ),
      },
    };

    return requestApi(
      `/counterparties/${counterpartyId}/collect_account`,
      null,
      "POST",
      data
    )
      .res(() => {
        dispatchSuccess("Invite Successfully Sent");
      })
      .catch((error) => {
        try {
          const {
            errors: { message },
          } = JSON.parse(error.message);
          dispatchError(message);
        } catch (e) {
          const minutesRemaining = parseInt(
            parseInt(
              error.response.headers.get("X-Notification-Limit-Reset"),
              10
            ) / 60,
            10
          );
          dispatchError(
            `Too many email invites sent, try again in ${minutesRemaining} minutes.`
          );
        }

        dispatch(stopSubmit("counterparty"));
      });
  };
}

export function archiveCounterparty(id, dispatchSuccess, dispatchError) {
  return (dispatch) =>
    requestApi(`/counterparties/${id}`, null, "DELETE")
      .json((jsonData) => {
        dispatchSuccess("Counterparty successfully deleted");
        dispatch(
          actions.updateOne({
            id,
            changes: { discarded_at: jsonData.discarded_at },
          })
        );
      })
      .catch((error) => {
        try {
          const {
            errors: { message },
          } = JSON.parse(error.message);
          dispatchError(message);
        } catch (e) {
          dispatchError("An error occurred");
        }
      });
}

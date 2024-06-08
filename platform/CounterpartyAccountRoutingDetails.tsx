/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useState } from "react";
import { Field, FormAction, GenericField, Validator } from "redux-form";
import { isEmpty, isNil } from "lodash";
import {
  validAbaRoutingNumber,
  validSwiftRoutingNumber,
  validAccountNumber,
  validCaCpaRoutingNumber,
  validDkInterbankClearingCode,
  validAuGbSortCode,
  validHkInterbankClearingCode,
  validHuInterbankClearingCode,
  validIdSknbiCode,
  validInIfscNumber,
  validJpZenginCode,
  validSeBankgiroClearingCode,
  validNzNationalClearingCode,
  required,
} from "../../common/ui-components/validations";
import requestApi from "../../common/utilities/requestApi";
import {
  AccountCountryType,
  RoutingNumberField,
  AccountNumberField,
} from "./CounterpartyAccountCountryOptions";
import ReduxInputField from "../../common/deprecated_redux/ReduxInputField";
import { Clickable } from "../../common/ui-components";

interface CustomProps {
  type: string;
  label: string;
  required?: boolean;
  optionalLabel?: "Required" | "Optional" | null;
  helpText?: string;
}

const FieldCustom = Field as new () => GenericField<CustomProps>;

type Validations = Array<{ (value: string): string | undefined }>;
export interface RoutingFieldInfo {
  fieldName: string;
  label: string;
  validations: Validations;
}
// This field info is also used for the inline counterparty create:
// containers/payment_order_form/create_counterparty/InlineCounterpartyAccountRoutingDetails.tsx
export const USInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.ABA,
  label: "ABA Routing Number",
  validations: [validAbaRoutingNumber],
};
export const AUInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.AU_BSB,
  label: "Australian BSB Number",
  validations: [validAuGbSortCode],
};
export const CAInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.CA_CPA,
  label: "Canadian Routing Number",
  validations: [validCaCpaRoutingNumber],
};
export const DKInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.DK_INTERBANK_CLEARING_CODE,
  label: "Danish Interbank Clearing Code",
  validations: [validDkInterbankClearingCode],
};
export const GBInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.GB_SORT_CODE,
  label: "British Sort Code",
  validations: [validAuGbSortCode],
};
export const HKInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.HK_INTERBANK_CLEARING_CODE,
  label: "Hong Kong Interbank Clearing Code",
  validations: [validHkInterbankClearingCode],
};
export const HUInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.HU_INTERBANK_CLEARING_CODE,
  label: "Hungarian Interbank Clearing Code",
  validations: [validHuInterbankClearingCode],
};
export const IDInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.ID_SKNBI_CODE,
  label: "Indonesian SKNBI Code",
  validations: [validIdSknbiCode],
};
export const INInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.IN_IFSC,
  label: "IFSC Code",
  validations: [validInIfscNumber],
};
export const JPInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.JP_ZENGIN_CODE,
  label: "Zengin Code",
  validations: [validJpZenginCode],
};
export const NZInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.NZ_NATIONAL_CLEARING_CODE,
  label: "New Zealand National Clearing Code",
  validations: [validNzNationalClearingCode],
};
export const SEInfo: RoutingFieldInfo = {
  fieldName: RoutingNumberField.SE_BANKGIRO_CLEARING_CODE,
  label: "Swedish Clearing Number",
  validations: [validSeBankgiroClearingCode],
};

interface AccountNumberRoutingDetailProps {
  index: number;
  account: unknown;
  getData(index: number, field: string): string;
  reduxChange(
    field: string,
    value: unknown,
    touch?: boolean,
    persistentSubmitErrors?: boolean
  ): FormAction;
  validators: Array<Validator>;
}

function AccountNumberRoutingDetail({
  index,
  account,
  getData,
  reduxChange,
  validators,
}: AccountNumberRoutingDetailProps) {
  return isEmpty(getData(index, "account_number")) ||
    !getData(index, "account_number").includes("•") ? (
    <FieldCustom
      name={`${account}.account_number`}
      type="text"
      component={ReduxInputField}
      label="Account Number"
      validate={validators}
      onChange={(event, newValue) => {
        reduxChange(`${account}.account_number`, newValue, false, false);
        reduxChange(`${account}.account_number_touched`, true, false, false);
      }}
    />
  ) : (
    <div>
      <ReduxInputField
        disabled
        label="Account Number"
        input={{ value: getData(index, "account_number"), onChange: () => {} }}
      >
        <Clickable
          onClick={() => {
            reduxChange(`${account}.account_number`, null, false, false);
            reduxChange(
              `${account}.account_number_touched`,
              true,
              false,
              false
            );
          }}
          id="delete-account-number-btn"
        >
          <span className="text-blue-500">Delete Account Number</span>
        </Clickable>
      </ReduxInputField>
    </div>
  );
}

interface CounterpartyAccountRoutingDetailsProps {
  index: number;
  account: unknown;
  accountCountryType: AccountCountryType;
  getData(index: number, field: string): string;
  reduxChange(
    field: string,
    value: unknown,
    touch?: boolean,
    persistentSubmitErrors?: boolean
  ): FormAction;
}

export function CounterpartyAccountRoutingDetails({
  index,
  account,
  accountCountryType,
  getData,
  reduxChange,
}: CounterpartyAccountRoutingDetailsProps) {
  const [bankName, setBankName] = useState<string>();

  const fetchBankDetails = (routingNumber: string) => {
    if (isNil(routingNumber) || routingNumber.length !== 9) {
      return;
    }
    requestApi(
      `/counterparties/bank_details?routing_number=${routingNumber}`,
      null,
      "GET"
    )
      .json(({ bank_name }) => setBankName(bank_name as string))
      .catch(() => null); // do nothing
  };

  // Extra routing fields could have been set through the API
  const [extraFieldInfos, setExtraFieldInfos] = useState<
    Array<RoutingFieldInfo>
  >([]);

  const getRoutingFieldInfo = (): RoutingFieldInfo | undefined => {
    switch (accountCountryType) {
      case AccountCountryType.US:
        return USInfo;
      case AccountCountryType.AU:
        return AUInfo;
      case AccountCountryType.CA:
        return CAInfo;
      case AccountCountryType.DK:
        return DKInfo;
      case AccountCountryType.GB:
        return GBInfo;
      case AccountCountryType.HK:
        return HKInfo;
      case AccountCountryType.HU:
        return HUInfo;
      case AccountCountryType.ID:
        return IDInfo;
      case AccountCountryType.IN:
        return INInfo;
      case AccountCountryType.JP:
        return JPInfo;
      case AccountCountryType.SE:
        return SEInfo;
      case AccountCountryType.NZ:
        return NZInfo;
      case AccountCountryType.International:
      case AccountCountryType.EU:
      case AccountCountryType.USChecksOnly:
      default:
        return undefined;
    }
  };

  const hasMultipleCountries =
    Object.values(RoutingNumberField).reduce(
      (result, field) =>
        !isEmpty(getData(index, field)) &&
        field !== RoutingNumberField.SWIFT_CODE
          ? result + 1
          : result,
      0
    ) > 1;

  const nonAddressOnlyFields = [
    ...Object.values(RoutingNumberField),
    ...Object.values(AccountNumberField),
  ];

  // Checks if there are no routing numbers(including Swift Code) or account_number
  // AND that there is an address for a given account
  const addressOnly =
    nonAddressOnlyFields.every((field) => isEmpty(getData(index, field))) &&
    getData(index, "partyAddress");
  const displayIBAN = () =>
    [
      AccountCountryType.GB,
      AccountCountryType.EU,
      AccountCountryType.International,
    ].includes(accountCountryType) ||
    !isEmpty(getData(index, "iban_account_number"));
  const requiredSwiftCode = () =>
    [AccountCountryType.International, AccountCountryType.EU].includes(
      accountCountryType
    ) && !hasMultipleCountries;
  const routingFieldInfo = getRoutingFieldInfo();

  useEffect(() => {
    // When editing routing details, the account_country_type wasn't persisted, can infer from set fields
    const inferAccountCountryType = () => {
      let value = AccountCountryType.International;
      if (hasMultipleCountries) {
        value = AccountCountryType.International;
      } else if (getData(index, RoutingNumberField.ABA)) {
        value = AccountCountryType.US;
      } else if (getData(index, RoutingNumberField.AU_BSB)) {
        value = AccountCountryType.AU;
      } else if (getData(index, RoutingNumberField.CA_CPA)) {
        value = AccountCountryType.CA;
      } else if (
        getData(index, RoutingNumberField.DK_INTERBANK_CLEARING_CODE)
      ) {
        value = AccountCountryType.DK;
      } else if (getData(index, RoutingNumberField.GB_SORT_CODE)) {
        value = AccountCountryType.GB;
      } else if (
        getData(index, RoutingNumberField.HK_INTERBANK_CLEARING_CODE)
      ) {
        value = AccountCountryType.HK;
      } else if (
        getData(index, RoutingNumberField.HU_INTERBANK_CLEARING_CODE)
      ) {
        value = AccountCountryType.HU;
      } else if (getData(index, RoutingNumberField.ID_SKNBI_CODE)) {
        value = AccountCountryType.ID;
      } else if (getData(index, RoutingNumberField.IN_IFSC)) {
        value = AccountCountryType.IN;
      } else if (getData(index, RoutingNumberField.JP_ZENGIN_CODE)) {
        value = AccountCountryType.JP;
      } else if (getData(index, RoutingNumberField.NZ_NATIONAL_CLEARING_CODE)) {
        value = AccountCountryType.NZ;
      } else if (getData(index, RoutingNumberField.SE_BANKGIRO_CLEARING_CODE)) {
        value = AccountCountryType.SE;
      } else if (
        getData(index, "iban_account_number") &&
        getData(index, "swift_code")
      ) {
        value = AccountCountryType.EU;
      } else if (addressOnly) {
        value = AccountCountryType.USChecksOnly;
      }
      reduxChange(`${account}.account_country_type`, value, false, false);
    };

    // 'International' may have multiple country's routing number
    if (accountCountryType === AccountCountryType.International) {
      const fieldInfos: Array<RoutingFieldInfo> = [];
      [
        USInfo,
        AUInfo,
        CAInfo,
        DKInfo,
        GBInfo,
        HKInfo,
        HUInfo,
        IDInfo,
        INInfo,
        JPInfo,
        SEInfo,
        NZInfo,
      ].forEach((info) => {
        if (
          !isEmpty(getData(index, info.fieldName)) ||
          getData(index, `${info.fieldName}_touched`)
        ) {
          fieldInfos.push(info);
        }
      });
      setExtraFieldInfos(fieldInfos);
    } else if (!accountCountryType) {
      inferAccountCountryType();
    }
  }, [
    getData,
    index,
    account,
    accountCountryType,
    reduxChange,
    hasMultipleCountries,
    addressOnly,
  ]);

  return (
    <>
      {routingFieldInfo && (
        <div className="subsection-row">
          <FieldCustom
            name={`${account}.${routingFieldInfo.fieldName}`}
            required
            type="text"
            component={ReduxInputField}
            label={routingFieldInfo.label}
            validate={
              accountCountryType === AccountCountryType.US
                ? routingFieldInfo.validations
                : routingFieldInfo.validations.concat([required])
            }
            onBlur={(event, routingNumber: string) =>
              fetchBankDetails(routingNumber)
            }
            onChange={(event, newValue) => {
              reduxChange(
                `${account}.${routingFieldInfo.fieldName}`,
                newValue,
                false,
                true
              );
              reduxChange(
                `${account}.${routingFieldInfo.fieldName}_touched`,
                true,
                false,
                false
              );
              setBankName(undefined);
            }}
            helpText={
              accountCountryType === AccountCountryType.US
                ? "You may leave this blank if are not using electronic payments."
                : undefined
            }
          >
            {bankName ? <span>{bankName}</span> : null}
          </FieldCustom>
          <AccountNumberRoutingDetail
            index={index}
            account={account}
            getData={getData}
            reduxChange={reduxChange}
            validators={[validAccountNumber]}
          />
        </div>
      )}
      {extraFieldInfos && (
        <div className="subsection-row">
          {extraFieldInfos.map((extraFieldInfo, extraFieldIndex) => (
            <div className={extraFieldIndex > 1 ? "mt-3" : ""}>
              <FieldCustom
                name={`${account}.${extraFieldInfo.fieldName}`}
                type="text"
                component={ReduxInputField}
                label={extraFieldInfo.label}
                validate={extraFieldInfo.validations}
                onChange={(event, newValue) => {
                  reduxChange(
                    `${account}.${extraFieldInfo.fieldName}`,
                    newValue,
                    false,
                    true
                  );
                  reduxChange(
                    `${account}.${extraFieldInfo.fieldName}_touched`,
                    true,
                    false,
                    false
                  );
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="subsection-row">
        <FieldCustom
          name={`${account}.swift_code`}
          required={requiredSwiftCode()}
          optionalLabel={!requiredSwiftCode() ? "Optional" : null}
          type="text"
          component={ReduxInputField}
          label="SWIFT Code"
          validate={
            requiredSwiftCode()
              ? [required, validSwiftRoutingNumber]
              : [validSwiftRoutingNumber]
          }
          helpText="Required for sending international wire or SEPA transfers."
          onChange={(event, newValue) => {
            reduxChange(`${account}.swift_code`, newValue, false, false);
            reduxChange(`${account}.swift_code_touched`, true, false, false);
          }}
        />
        {displayIBAN() &&
          (isEmpty(getData(index, "iban_account_number")) ||
          !getData(index, "iban_account_number").includes("•") ? (
            <FieldCustom
              name={`${account}.iban_account_number`}
              required={accountCountryType === AccountCountryType.EU}
              // eslint-disable-next-line max-len
              optionalLabel={
                accountCountryType !== AccountCountryType.EU &&
                accountCountryType !== AccountCountryType.International
                  ? "Optional"
                  : null
              }
              type="text"
              component={ReduxInputField}
              validate={
                accountCountryType === AccountCountryType.EU ? [required] : []
              }
              label="IBAN Number"
              helpText="Required for sending international wire or SEPA transfers."
              onChange={(event, newValue) => {
                reduxChange(
                  `${account}.iban_account_number`,
                  newValue,
                  false,
                  false
                );
                reduxChange(
                  `${account}.iban_account_number_touched`,
                  true,
                  false,
                  false
                );
              }}
            />
          ) : (
            <div>
              <ReduxInputField
                disabled
                label="IBAN Number"
                input={{
                  value: getData(index, "iban_account_number"),
                  onChange: () => {},
                }}
              >
                <Clickable
                  id="delete-iban-number-btn"
                  onClick={() => {
                    reduxChange(
                      `${account}.iban_account_number`,
                      null,
                      false,
                      false
                    );
                    reduxChange(
                      `${account}.iban_account_number_touched`,
                      true,
                      false,
                      false
                    );
                  }}
                >
                  <span className="text-blue-500">Delete IBAN Number</span>
                </Clickable>
              </ReduxInputField>
            </div>
          ))}
      </div>
      {accountCountryType === AccountCountryType.International && (
        <div className="subsection-row">
          <AccountNumberRoutingDetail
            index={index}
            account={account}
            getData={getData}
            reduxChange={reduxChange}
            validators={[validAccountNumber]}
          />
        </div>
      )}
    </>
  );
}

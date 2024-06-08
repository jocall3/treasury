import React from "react";
import { capitalize } from "lodash";
import { ACCOUNT_CAPABILITIES } from "../../common/constants/analytics";
import { InternalAccountViewQuery } from "../../generated/dashboard/graphqlSchema";
import {
  Icon,
  IndexTable,
  IndexTableSkeletonLoader,
} from "../../common/ui-components";

export type AccountCapabilitiesProps = NonNullable<
  InternalAccountViewQuery["internalAccount"]
>["accountCapabilities"];
type AccountCapabilitiesItem = AccountCapabilitiesProps[number];

type ICapabilities = {
  key: string;
  value: string;
};

export const ACCOUNT_CAPABILITIES_MAPPING = {
  paymentType: "Payment Type",
  credit: "Credit (Pay)",
  debit: "Debit (Charge)",
};

const STYLE_MAPPING = {
  credit: "!pb-1 !pt-1.5 items-center",
  debit: "!pb-1 !pt-1.5 items-center",
};

// Make sure you also add your payment type to:
// - `app/javascript/src/app/constants/index.ts`
// - `app/javascript/src/app/containers/payment_order_form/PaymentMethod.tsx`
// - `app/models/payment_order.rb
export const CAPABILITY_MAP = {
  ach: { name: "ACH" },
  au_becs: { name: "Australian BECS", extra: true },
  bacs: { name: "Bacs", extra: true },
  book: { creditOnly: true, name: "Book", extra: true },
  card: { creditOnly: true, name: "Card", extra: true },
  chats: { name: "Hong Kong CHATS", creditOnly: true, extra: true },
  check: { creditOnly: true, name: "Check" },
  cross_border: {
    creditOnly: true,
    name: "Cross Border",
    extra: true,
    foreignExchangeCapable: true,
  },
  dk_nets: { name: "Denmark Nets", creditOnly: true, extra: true },
  eft: { name: "EFT", extra: true },
  hu_ics: { name: "Hungary ICS", creditOnly: true, extra: true },
  interac: { name: "Interac e-Transfer", extra: true },
  masav: { name: "Masav", extra: true },
  neft: { name: "NEFT", extra: true },
  nics: { name: "NICS", extra: true },
  nz_becs: { name: "New Zealand BECS", extra: true },
  provxchange: { name: "ProvXchange", extra: true, creditOnly: true },
  rtp: { name: "RTP", extra: true },
  se_bankgirot: { name: "Swedish Bankgirot", extra: true },
  sen: { name: "SEN", extra: true },
  sepa: { name: "SEPA", extra: true },
  sknbi: { name: "SKNBI", extra: true },
  sic: { name: "SIC", extra: true },
  signet: { name: "Signet", extra: true },
  wire: { name: "Wire" },
  zengin: { name: "Zengin", extra: true },
};

function boolToIcon(bool: boolean) {
  return bool ? (
    <Icon
      className="text-green-500"
      iconName="done"
      color="currentColor"
      size="m"
    />
  ) : (
    <Icon
      className="text-red-600"
      iconName="clear"
      color="currentColor"
      size="m"
    />
  );
}

function formatCapabilities(
  capabilities: Array<Record<string, unknown>>,
  mapping: Record<string, unknown>
) {
  const { name, creditOnly } = mapping;

  const credit = !!capabilities.find(
    (capability) => capability.direction === "credit"
  );
  const creditIcon = boolToIcon(credit);

  const debit = !!capabilities.find(
    (capability) => capability.direction === "debit"
  );
  const debitIcon = boolToIcon(debit);

  return {
    credit: creditIcon,
    debit: creditOnly ? "N/A" : debitIcon,
    paymentType: name,
    id: name,
  };
}

function formatAccountCapabilities(
  accountCapabilities: AccountCapabilitiesProps
) {
  return {
    data: Object.keys(CAPABILITY_MAP).reduce(
      (acc: Array<Record<string, unknown>>, capabilityKey: string) => {
        const mapping = CAPABILITY_MAP[capabilityKey] as Record<
          string,
          unknown
        >;
        const capabilities = accountCapabilities.filter(
          (capability: Record<string, unknown>) =>
            capability.paymentType === capabilityKey
        );

        if (mapping.extra && !capabilities.length) {
          return acc;
        }
        return acc.concat([formatCapabilities(capabilities, mapping)]);
      },
      []
    ),
    expandedData:
      accountCapabilities?.length > 0
        ? Object.keys(CAPABILITY_MAP).reduce(
            (
              acc: Record<string, Array<ICapabilities>>,
              capabilityKey: string
            ) => {
              const mapping: Record<string, unknown> = CAPABILITY_MAP[
                capabilityKey
              ] as Record<string, unknown>;

              const capabilities = accountCapabilities
                .filter(
                  (capability) => capability.paymentType === capabilityKey
                )
                .sort((a, b) => {
                  if (a.direction.toUpperCase() < b.direction.toUpperCase())
                    return -1;
                  if (a.direction.toUpperCase() > b.direction.toUpperCase())
                    return 1;
                  return 0;
                });

              const key = mapping?.name as string;

              if (key && capabilities.length) {
                acc[key] = [];
                capabilities.forEach((capability: AccountCapabilitiesItem) => {
                  acc[key].push({
                    key: `${key} ${capitalize(
                      capability.direction
                    )} Currencies`,
                    value: capability.anyCurrency
                      ? "All Currencies Enabled"
                      : capability.currencies.join(", "),
                  });
                  if (capability.prettyPaymentSubtypes) {
                    acc[key].push({
                      key: `${key} ${capitalize(
                        capability.direction
                      )} SEC Codes`,
                      value: capability.prettyPaymentSubtypes.join(", "),
                    });
                  }
                });
              }
              return acc;
            },
            {}
          )
        : undefined,
  };
}

function AccountCapabilities({
  accountId,
  accountCapabilities,
}: {
  accountId: string;
  accountCapabilities: AccountCapabilitiesProps | undefined;
}): JSX.Element {
  const loadingView: JSX.Element = (
    <IndexTableSkeletonLoader
      headers={Object.keys(ACCOUNT_CAPABILITIES_MAPPING)}
      numRows={5}
    />
  );

  if (!accountCapabilities) {
    return loadingView;
  }

  const { data, expandedData } = formatAccountCapabilities(accountCapabilities);

  return (
    <div id="accountCapabilitiesTable">
      <IndexTable
        disableBulkActions
        enableActions
        dataMapping={ACCOUNT_CAPABILITIES_MAPPING}
        styleMapping={STYLE_MAPPING}
        data={data}
        expandedData={expandedData}
        trackOnViewClick={{
          properties: { internal_account_id: accountId },
          show: ACCOUNT_CAPABILITIES.DETAILS_BUTTON_SHOW,
          hide: ACCOUNT_CAPABILITIES.DETAILS_BUTTON_HIDE,
        }}
      />
    </div>
  );
}

export default AccountCapabilities;

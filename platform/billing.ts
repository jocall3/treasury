import type { Dispatch } from "react";
import { AnyAction } from "redux";
import requestApi from "../../common/utilities/requestApi";
import { DispatchMessageFnType } from "../MessageProvider";

export const BILLING_DATA_LOAD = "BILLING_DATA_LOAD";
export const UPDATE_BILLING_CONTACT = "UPDATE_BILLING_CONTACT";

export enum CardNetwork {
  Visa = "VISA",
  Mastercard = "MC",
  AmericanExpress = "AMEX",
  Discover = "DISC",
}

export interface BillingContact {
  name: string | null;
  path: string | null;
  email: string;
}

export interface OrdwaySubscriptionSettings {
  plan_id: string;
  is_active_subscription: boolean;
  next_charge_date: string | null;
  billing_contacts: Array<BillingContact>;
  self_serve_plan_id: string;
  invoices: Array<{
    date: string;
    id: string;
    amount: number;
    currency: string;
  }>;
}

export interface BillingData {
  billing_settings?: {
    last4: string;
    network: CardNetwork;
    expiry: string;
  };
  ordway_subscription_settings?: OrdwaySubscriptionSettings;
  can_view_billing_usage?: boolean;
}

export interface UpdateBillingContactAction {
  type: "UPDATE_BILLING_CONTACT";
  billingContacts: Array<string>;
}

export function updateBillingContact(
  billingContacts: Array<string>
): UpdateBillingContactAction {
  return {
    type: UPDATE_BILLING_CONTACT,
    billingContacts,
  };
}

type UpdateBillingContactDispatch = Dispatch<AnyAction>;

export type UpdateBillingContactDispatchFn = (
  dispatch: UpdateBillingContactDispatch
) => Promise<void>;

export function updateBillingContacts(
  contacts: Array<string>,
  dispatchError: DispatchMessageFnType["dispatchError"]
) {
  return (dispatch: UpdateBillingContactDispatch) =>
    requestApi("/settings/billing/update_billing_contacts", null, "POST", {
      contacts,
    })
      .json((billingContacts) => {
        dispatch(updateBillingContact(billingContacts as Array<string>));
      })
      .catch(() => dispatchError("Could not update billing contacts"));
}

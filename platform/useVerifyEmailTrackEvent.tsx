import { useEffect } from "react";
import requestApi from "./requestApi";
import { SIGN_UP_EVENTS } from "../constants/analytics";
import { sendSegmentWebSourceSpecificTrackEvent } from "./trackEvent";

export default function useVerifyEmailTrackEvent() {
  useEffect(() => {
    if (window.gon.registration?.user_sign_up_flow_completed) {
      sendSegmentWebSourceSpecificTrackEvent(
        SIGN_UP_EVENTS.SANDBOX_SIGNUP_FRONTEND_COMPLETED
      );
      sendSegmentWebSourceSpecificTrackEvent(
        SIGN_UP_EVENTS.SANDBOX_SIGNUP_EMAIL_ADDRESS_VERIFIED
      );
      requestApi("/analytics/unset_user_sign_up_flow_completed", null, "POST");
    }
  }, []);
}

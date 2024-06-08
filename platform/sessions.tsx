import requestApi from "../../common/utilities/requestApi";
import { DispatchMessageFnType } from "../MessageProvider";

export function logOut(dispatchError: DispatchMessageFnType["dispatchError"]) {
  return (): Promise<void> =>
    requestApi("/session", null, "DELETE")
      .json((jsonData) => {
        window.location.href = (jsonData as { url: string }).url;
      })
      .catch(() => {
        dispatchError("Sorry but we were unable to log you out");
      });
}

export function logOutOfSignupFlow(
  dispatchError: DispatchMessageFnType["dispatchError"]
) {
  return (): Promise<void> =>
    requestApi("/auth/log_out_of_signup_flow", null, "DELETE")
      .json((jsonData) => {
        window.location.href = (jsonData as { url: string }).url;
      })
      .catch(() => {
        dispatchError("Sorry but we were unable to log you out");
      });
}

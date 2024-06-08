import { isNil } from "lodash";

export function toggleLiveMode(redirect?: string, liveMode?: boolean) {
  return () => {
    let endpoint = "/session/toggle_live_mode";
    if (redirect) endpoint += `?redirect=${redirect}`;
    if (!isNil(liveMode)) endpoint += `&live_mode=${liveMode.toString()}`;

    window.location.href = endpoint.toString();
  };
}

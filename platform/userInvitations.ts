import requestApi from "../../common/utilities/requestApi";
import { stringify } from "../../common/utilities/queryString";
import { DispatchMessageFnType } from "../MessageProvider";

export interface UserInvitation {
  id: string;
  email: string;
  discarded_at: string | null;
  live_groups: Array<string>;
  test_groups: Array<string>;
}

export function acceptUserInvitation(
  id: string,
  token: string | null,
  organizationId: string | "unknown",
  data: Record<string, unknown>,
  dispatchError: DispatchMessageFnType["dispatchError"]
) {
  return (): Promise<void> =>
    requestApi(
      `/public/user_invitations/${id}/accept?${stringify({
        token,
      })}&organization_id=${organizationId}`,
      null,
      "POST",
      data
    )
      .json(() => {
        if (organizationId === "unknown") {
          window.location.href = "/";
        } else {
          window.location.href = `/auth/organizations/${organizationId}`;
        }
      })
      .catch((error: Error) => {
        try {
          const {
            errors: { message },
          } = JSON.parse(error.message) as { errors: { message: string } };
          dispatchError(message);
        } catch (e) {
          dispatchError("Sorry but we couldn't accept this user invitation");
        }
      });
}

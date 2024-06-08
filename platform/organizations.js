import { startSubmit, stopSubmit } from "redux-form";
import requestApi from "../../common/utilities/requestApi";

export function submitOrganization(
  values,
  action,
  method,
  dispatchSuccess,
  dispatchError
) {
  return (dispatch) => {
    const data = {
      ...values,
    };

    dispatch(startSubmit("organization"));

    requestApi(action, null, method, data)
      .json(() => {
        window.location.href = "/admin";
        dispatchSuccess("Organization successfully created");
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

        dispatch(stopSubmit("organization"));
      });
  };
}

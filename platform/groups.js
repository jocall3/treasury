import requestApi from "../../common/utilities/requestApi";

export function updateGroup(id, data, dispatchSuccess, dispatchError) {
  return () => {
    const method = id ? "PATCH" : "POST";
    const action = id ? `/settings/roles/${id}` : "/settings/roles";

    requestApi(action, null, method, data)
      .json((jsonData) => {
        window.location.href = `/settings/roles/${jsonData.id}`;
        dispatchSuccess("Success!");
      })
      .catch((error) => {
        const {
          errors: { message },
        } = JSON.parse(error.message);
        dispatchError(message);
      });
  };
}

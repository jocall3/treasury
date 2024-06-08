import { startSubmit, stopSubmit } from "redux-form";
import requestApi from "../../common/utilities/requestApi";
import webhookEventTypes from "../constants/webhookEventTypes";
import {
  webhookEventString,
  ALL_EVENTS_KEY,
} from "../components/WebhookEndpointForm";

export function deleteWebhookEndpoint(
  id,
  refetch,
  dispatchSuccess,
  dispatchError
) {
  return () => {
    requestApi(`/developers/webhooks/${id}`, null, "DELETE")
      .json(() => {
        dispatchSuccess("Webhook Endpoint Successfully Deleted");
        refetch();
      })
      .catch((error) => {
        const {
          errors: { message },
        } = JSON.parse(error.message);
        dispatchError(message);
      });
  };
}

function configuredEvents(values) {
  // The backend expects an empty object to represent all events being sent
  if (values.webhookEventConfiguration === ALL_EVENTS_KEY) {
    return {};
  }
  // Otherwise convert the redux form data to a structure the backend expects
  return Object.keys(webhookEventTypes).reduce((acc, entity) => {
    const selectedEvents = webhookEventTypes[entity].events.filter(
      (event) => values[webhookEventString(entity, event)]
    );
    if (selectedEvents.length) {
      acc[entity] = selectedEvents;
    }
    return acc;
  }, {});
}

export function toggleWebhookEndpointEnabled(
  enabled,
  webhookEndpoint,
  initial_configuration,
  refetch,
  dispatchSuccess,
  dispatchError
) {
  return () => {
    const data = {
      enabled,
      url: webhookEndpoint.url,
      configured_events: configuredEvents(initial_configuration),
    };

    requestApi(
      `/developers/webhooks/${webhookEndpoint.id}`,
      null,
      "PATCH",
      data
    )
      .json(() => {
        dispatchSuccess(`Webhook Endpoint ${enabled ? "Enabled" : "Paused"}`);
        refetch();
      })
      .catch((error) => {
        const {
          errors: { message },
        } = JSON.parse(error.message);
        dispatchError(message);
      });
  };
}

export function submitWebhookEndpoint(
  values,
  action,
  method,
  dispatchSuccess,
  dispatchError
) {
  return (dispatch) => {
    const data = {
      url: values.url,
      username: values.username || null,
      password: values.password || null,
      disable_basic_auth: values.disableBasicAuth || null,
      configured_events: configuredEvents(values),
      rate_limit: values.rateLimit || null,
    };

    dispatch(startSubmit("webhookEndpoint"));

    requestApi(action, null, method, data)
      .json((jsonData) => {
        window.location.href = `/developers/webhooks/${jsonData.id}`;
        dispatchSuccess("Webhook Endpoint Updated");
      })
      .catch((error) => {
        const {
          errors: { message },
        } = JSON.parse(error.message);
        dispatchError(message);
        dispatch(stopSubmit("webhookEndpoint"));
      });
  };
}

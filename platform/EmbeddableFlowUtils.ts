import {
  AppearanceVariables,
  EmbeddableFlowCreateOptions,
  EmbeddableFlowError,
} from "@modern-treasury/modern-treasury-js";

const DEVELOPMENT_HOSTNAME = "localhost";
const DEVELOPMENT_ENVIRONMENT = "development";

const DEMO_HOSTNAME = "demo.moderntreasury.com";
const DEMO_ENVIRONMENT = "demo";

export function embeddableFlowCreateOptions(
  clientToken: string,
  appearanceVariables: AppearanceVariables
): EmbeddableFlowCreateOptions {
  const options: EmbeddableFlowCreateOptions = {
    clientToken,
    variables: appearanceVariables,
    onError: (error: EmbeddableFlowError) => {
      // eslint-disable-next-line no-console
      console.log("Error: ", error);
    },
    onSuccess: (result: object) => {
      // eslint-disable-next-line no-console
      console.log("Success: ", result);
    },
  };

  if (window.location.hostname.endsWith(DEVELOPMENT_HOSTNAME)) {
    return Object.assign(options, { environment: DEVELOPMENT_ENVIRONMENT });
  }
  if (window.location.hostname.endsWith(DEMO_HOSTNAME)) {
    return Object.assign(options, { environment: DEMO_ENVIRONMENT });
  }
  return options;
}

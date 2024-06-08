import * as Sentry from "@sentry/browser";
import { useLiveConfigurationViewQuery } from "~/generated/dashboard/graphqlSchema";

/*
  IMPORTANT:  useLiveConfiguration hook should only be used for temporary changes 
  that are meant to last for 30 days or less in the codebase. If your modification is
  intended to be permanent, consider a more appropriate and sustainable solution. Please
  add a comment with a ticket linked for removal with your usage.
*/
interface UseLiveConfigurationProps {
  featureName: string;
}

export default function useLiveConfiguration({
  featureName,
}: UseLiveConfigurationProps) {
  const { data, loading, error } = useLiveConfigurationViewQuery({
    variables: { featureName },
  });

  const enabled = data?.liveConfiguration?.flag;

  if (enabled === null) {
    Sentry.captureException(
      new Error(`Something went wrong using ${featureName}.`)
    );
  }

  return [enabled, loading, error];
}

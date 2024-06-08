import React from "react";
import { useUserOnboardingEmbeddableFlowDemoQuery } from "../../../generated/dashboard/graphqlSchema";
import { KeyValueTableSkeletonLoader } from "../../../common/ui-components";
import EmbeddableFlowDemo from "../EmbeddableFlowDemo";
import NotFound from "../../../errors/components/NotFound";

interface UserOnboardingEmbeddableFlowDemoProps {
  match: {
    params: {
      id: string;
    };
  };
}

function UserOnboardingEmbeddableFlowDemo({
  match: {
    params: { id },
  },
}: UserOnboardingEmbeddableFlowDemoProps) {
  const { data, loading, error } = useUserOnboardingEmbeddableFlowDemoQuery({
    variables: {
      id,
    },
  });

  if (loading && !data?.userOnboardingFlow) {
    return (
      <div className="pt-8">
        <KeyValueTableSkeletonLoader />
      </div>
    );
  }

  if (error || !data?.userOnboardingFlow) {
    return <NotFound message="Error loading User Onboarding Flow" />;
  }

  const { clientToken } = data.userOnboardingFlow;

  return <EmbeddableFlowDemo clientToken={clientToken} />;
}

export default UserOnboardingEmbeddableFlowDemo;

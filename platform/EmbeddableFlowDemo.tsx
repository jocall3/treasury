import React, { useEffect, useState } from "react";
import {
  AppearanceVariables,
  loadModernTreasury,
  ModernTreasury,
  EmbeddableFlow,
} from "@modern-treasury/modern-treasury-js";
import "highlight.js/styles/rainbow.css";
import { Link } from "react-router-dom";
import { usePublishableKeysDemoSelectQuery } from "../../generated/dashboard/graphqlSchema";
import AppearanceVariablesForm from "./AppearanceVariablesForm";
import { embeddableFlowCreateOptions } from "./EmbeddableFlowUtils";
import useErrorBanner from "../../common/utilities/useErrorBanner";
import {
  Code,
  CopyableText,
  Label,
  SelectValue,
} from "../../common/ui-components";
import PublishableKeySelectField from "../../app/components/PublishableKeySelectField";

const PUBLISHABLE_KEY_UI = "/developers/publishable_keys";
const MOUNT_HERE = "put-iframe-here";

interface EmbeddableFlowDemoProps {
  clientToken: string;
}

function EmbeddableFlowDemo({ clientToken }: EmbeddableFlowDemoProps) {
  const flashError = useErrorBanner();

  const [modernTreasury, setModernTreasury] = useState<ModernTreasury>();
  const [embeddableFlow, setEmbeddableFlow] = useState<EmbeddableFlow>();

  const { loading, data, error } = usePublishableKeysDemoSelectQuery();
  const [selectedKey, setSelectedKey] = useState<SelectValue>();
  const publishableKey = data?.publishableKeys.edges[0]?.node;
  const [codeVariables, setCodeVariables] = useState<Record<string, string>>({
    colorPrimary: "#2B71D4",
    fontFamily: "Inter",
    colorBackground: "#ffffff",
  });

  useEffect(() => {
    if (publishableKey) {
      const initModernTreasury = async () => {
        const loadedModernTreasury = await loadModernTreasury(
          selectedKey ? (selectedKey.value as string) : publishableKey.key
        );

        if (loadedModernTreasury) {
          setModernTreasury(loadedModernTreasury);
        }
      };

      void initModernTreasury();
    }
  }, [publishableKey, selectedKey]);

  if ((data && !data.publishableKeys.edges.length) || error) {
    return (
      <div className="pb-4 pt-4 text-sm text-gray-800">
        No publishable keys were found. Create one here: &nbsp;&nbsp;
        <Link to={PUBLISHABLE_KEY_UI}> Publishable Keys </Link>
      </div>
    );
  }

  const onSubmitAppearanceVariables = (
    appearanceVariables: AppearanceVariables
  ) => {
    if (!modernTreasury) {
      flashError("Error loading modern-treasury.js");
      return;
    }

    const options = embeddableFlowCreateOptions(
      clientToken,
      appearanceVariables
    );

    if (!embeddableFlow) {
      const newEmbeddableFlow = modernTreasury.createEmbeddableFlow(options);
      newEmbeddableFlow.mount(`#${MOUNT_HERE}`);

      setEmbeddableFlow(newEmbeddableFlow);
    } else if (embeddableFlow) {
      embeddableFlow.update({ variables: appearanceVariables });
    }

    setCodeVariables(appearanceVariables as Record<string, string>);
  };

  const code = () => `const mt = ModernTreasury('${
    selectedKey
      ? (selectedKey.value as string)
      : (publishableKey?.key as string)
  }');
    \nconst embeddableFlow = mt.createEmbeddableFlow(${JSON.stringify(
      embeddableFlowCreateOptions(clientToken, codeVariables),
      null,
      2
    )});
    \nembeddableFlow.mount("#put-iframe-here");
    `;

  return (
    <>
      <div className="pb-4 pt-4 text-sm text-gray-800">
        <span className="text-gray-500">client_token: </span>
        {clientToken}
      </div>
      <div className="grid grid-cols-6 gap-4 pt-8">
        <div className="col-span-2">
          {!loading && data && (
            <div className="w-full">
              <div className="pb-4 text-base font-bold">Workflow Variables</div>
              <Label
                helpText="This key will be used to load your workflow object."
                id="publishableKey"
              >
                Publishable Key
              </Label>
              <PublishableKeySelectField
                selectValue={
                  selectedKey
                    ? selectedKey.label
                    : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      `${publishableKey?.name} · ${publishableKey?.prettyDomainAllowlist}`
                }
                onChange={setSelectedKey as (value: SelectValue | null) => void}
                disabled={!!embeddableFlow}
              />
            </div>
          )}
          <AppearanceVariablesForm
            isWorkflowMounted={!!embeddableFlow}
            onSubmit={onSubmitAppearanceVariables}
          />
        </div>
        <div className="col-span-4 mr-16">
          {embeddableFlow && (
            <h1 className="pb-10 text-center">
              Hint: 021000021 is a valid routing number
            </h1>
          )}
          <div className="flex justify-center">
            <div id={MOUNT_HERE} className="w-1/2" />
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="pb-4 pt-8 text-base font-bold">
          <CopyableText text={code()}>Code</CopyableText>
        </div>
        <Code
          className="rounded-md bg-background-dark p-4"
          codeClassName="text-gray-100"
          text={code()}
          language="javascript"
        />
      </div>
    </>
  );
}

export default EmbeddableFlowDemo;

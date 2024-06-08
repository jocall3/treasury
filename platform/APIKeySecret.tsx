import React, { useState } from "react";
import { cn } from "~/common/utilities/cn";
import {
  ButtonClickEventTypes,
  Clickable,
  CopyableText,
} from "~/common/ui-components";

function APIKeySecret({
  secret,
  onShowApiKeySecret,
  loading,
}: {
  secret: string;
  onShowApiKeySecret: () => void;
  loading: boolean;
}) {
  const [showFullSecret, setShowFullSecret] = useState(false);

  if (!secret) {
    return null;
  }

  const truncatedSecret = `•••• ${secret.slice(
    secret.length - 4,
    secret.length
  )}`;

  const keySecret = showFullSecret && !loading ? secret : truncatedSecret;

  const handleClick = (event: ButtonClickEventTypes) => {
    event.stopPropagation();

    if (!showFullSecret) {
      onShowApiKeySecret();
    }
    setShowFullSecret(!showFullSecret);
  };

  return (
    <div className="fs-exclude flex items-center">
      {showFullSecret ? (
        <CopyableText text={keySecret}>
          <code>{keySecret}</code>
        </CopyableText>
      ) : (
        <code>{truncatedSecret}</code>
      )}
      <div
        className={cn("btn hover:text-green-800", {
          "pl-0": showFullSecret,
        })}
      >
        <Clickable onClick={handleClick}>
          <span className="ml-2 text-green-500 hover:text-green-600">
            {showFullSecret ? "Hide" : "Show"}
          </span>
        </Clickable>
      </div>
    </div>
  );
}

export default APIKeySecret;

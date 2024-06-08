import React from "react";
import NotFoundSVG from "../../../images/not_found.svg";
import {
  Button,
  ButtonClickEventTypes,
  Clickable,
} from "../../common/ui-components";
import LogoModernTreasury from "../../common/ui-components/Assets/LogoModernTreasury";
import { handleLinkClick } from "../../common/utilities/handleLinkClick";

export interface NotFoundProps {
  message?: string;
  subtext?: string | React.ReactNode;
  ctaText?: string;
  enableCta?: boolean;
  hideCta?: boolean;
  onCtaClick?: (event: ButtonClickEventTypes) => void;
}

const goHome = (event: ButtonClickEventTypes) => {
  handleLinkClick("/", event);
};

/**
 * Primarily used for the 404 page, this can also be used when a resource
 * is expected to be present but cannot be found.
 */
function NotFound({
  message = "Page not found.",
  subtext = "We can’t find the page you’re looking for.",
  ctaText = "Home",
  enableCta = true,
  onCtaClick = goHome,
  hideCta = false,
}: NotFoundProps) {
  return (
    <div className="mx-auto grid w-full max-w-4xl content-center gap-6 justify-self-center p-6 mint-sm:grid-cols-2 mint-sm:items-center">
      <Clickable onClick={goHome}>
        <div className="max-w-2xs justify-self-center mint-sm:absolute mint-sm:top-6">
          <LogoModernTreasury />
        </div>
      </Clickable>
      <img
        className="mx-auto w-3/4 grow mint-sm:w-full"
        alt="Page not found"
        src={NotFoundSVG as string}
      />
      <div className="grid grid-flow-row justify-items-center gap-2 text-center mint-sm:justify-items-start mint-sm:text-left">
        <div className="text-2xl text-gray-800">{message}</div>
        <div className="text-lg text-gray-400">{subtext}</div>
        {!hideCta && onCtaClick && (
          <Button
            buttonType="primary"
            className="mt-2"
            disabled={!enableCta}
            onClick={(event: ButtonClickEventTypes) => onCtaClick(event)}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default NotFound;

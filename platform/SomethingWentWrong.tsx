import React from "react";
import NotFound, { NotFoundProps } from "./NotFound";

export type SomethingWentWrongProps = NotFoundProps;

/**
 * A utility component for rendering a generic "Something went wrong" visual and message.
 */
export default function SomethingWentWrong({
  message = "Something went wrong.",
  subtext = "",
  ...args
}: SomethingWentWrongProps) {
  return <NotFound message={message} subtext={subtext} {...args} />;
}

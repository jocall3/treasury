import React from "react";
import { Button } from "../../common/ui-components";
import useObjectUrl from "../../common/utilities/useObjectUrl";

export interface ContentDownloadButtonProps {
  filename: string;
  content: string;
  children: string;
}

function ContentDownloadButton({
  filename,
  content,
  children,
}: ContentDownloadButtonProps) {
  const objectUrl = useObjectUrl(content);
  return (
    <a href={objectUrl} download={filename}>
      <Button buttonType="primary">{children}</Button>
    </a>
  );
}

export default ContentDownloadButton;

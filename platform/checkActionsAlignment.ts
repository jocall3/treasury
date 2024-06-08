import { RefObject } from "react";

export const checkActionsAlignment = (
  actionsRef: RefObject<HTMLInputElement | null>,
  setAnchorPosition: (anchorPosition: "right" | "left") => void
) => {
  const checkActions = () => {
    if (actionsRef?.current) {
      // (gfu) Temp: if left portion of element is < 250px from outer element, treat as left aligned.
      const leftAligned = actionsRef.current.getBoundingClientRect().left < 250;
      if (leftAligned) {
        setAnchorPosition("left");
      } else {
        setAnchorPosition("right");
      }
    }
  };

  window.addEventListener("resize", checkActions);
  return () => {
    window.removeEventListener("resize", checkActions);
  };
};

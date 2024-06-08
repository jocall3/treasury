import React, { useRef, useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import ReactTooltip from "react-tooltip";
import TruncateString from "react-truncate-string";
import { v4 as uuidv4 } from "uuid";
import { useSpring, animated } from "react-spring";
import { createPortal } from "react-dom";
import { cn } from "~/common/utilities/cn";
import { getDrawerContent } from "~/common/utilities/getDrawerContent";
import {
  ButtonProps,
  Drawer,
  Icon,
  IconProps,
  LoadingDots,
  Tag,
  TagProps,
} from "~/common/ui-components";

export interface AITagProps
  extends Omit<TagProps, "size">,
    Omit<TagProps, "color"> {
  /** Sets the message of the tooltip. */
  fieldName?: string;
  /** Sets the string inside the tag. */
  message: string;
  /** Sets the styling inside the chip. */
  state: "match" | "partial_match" | "no_match";
  /** Sets the key for the tag. */
  tagKey?: React.Key;
}

/** Shows a property that is either an AI match, a partial match, or a no-match.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-ui-ai-suggestions-aitag--docs)
 */
export function AITag({
  buttonProps,
  className,
  fieldName,
  message,
  state,
  tagKey,
}: AITagProps) {
  const uuid = uuidv4();
  const textElementRef = useRef<HTMLInputElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  useEffect(() => {
    const checkOverflow = () => {
      if (textElementRef?.current) {
        // 140 is roughly the max width of the text contents of a tag
        const overflow = textElementRef.current.scrollWidth > 140;
        setIsOverflow(overflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  let iconName = "" as IconProps["iconName"];

  switch (state) {
    case "match":
      iconName = "checkmark_circle";
      break;
    case "partial_match":
      iconName = "time_30_s";
      break;
    case "no_match":
      iconName = "clear_circle_outlined";
      break;
    default:
      iconName = "clear_circle_outlined";
      break;
  }

  return (
    <Tag
      buttonProps={buttonProps}
      className={cn("group/item max-h-5 max-w-fit", className)}
      color={state === "match" ? "purple" : "gray"}
      data-tip={fieldName}
      data-tooltip-id={uuid}
      icon={{ iconName, size: "s" }}
      key={tagKey}
      size="small"
    >
      <span
        data-tip={`${message}`}
        data-for={uuid}
        className="w-full flex-1"
        ref={textElementRef}
      >
        <TruncateString text={message} />
      </span>
      {isOverflow && (
        <>
          {createPortal(
            <ReactTooltip
              id={uuid}
              className="break-word max-w-md"
              data-place="top"
              data-effect="float"
              multiline
            />,
            document.body
          )}
        </>
      )}
    </Tag>
  );
}
AITag.displayName = "AITag";

const ANIMATION_CLASSES = "transition-color ease-in-out";
const ANIMATION_CLASSES_WITH_DURATION =
  "transition-color duration-300 ease-in-out";
const ANIMATION_DELAYS = [
  "[animation-delay:_0s]",
  "[animation-delay:_0.05s]",
  "[animation-delay:_0.1s]",
  "[animation-delay:_0.15s]",
  "[animation-delay:_0.2s]",
  "[animation-delay:_0.25s]",
  "[animation-delay:_0.3s]",
  "[animation-delay:_0.35s]",
  "[animation-delay:_0.4s]",
  "[animation-delay:_0.45s]",
];

export interface AISuggestionProps extends UIContainerProps {
  /** Id of the associated entity. Needed to get the drawer content. */
  id?: string;
  /** Sets the styling inside the chip. */
  matches: AITagProps[];
  /** Sets the onClick action for the "Reconcile" button. */
  onClick?: ButtonProps["onClick"];
  /** Sets the path of the drawer. */
  path?: string;
  /** Sets the key for the suggestion. */
  suggestionKey?: React.Key;
  /** Sets the typename needed to get the Drawer content. */
  typename?: string;
}

/** Displays a series of properties that make up an AI suggestion.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-ui-ai-suggestions-aisuggestion--docs)
 */
export function AISuggestion({
  id,
  matches,
  onClick,
  path,
  suggestionKey,
  typename,
}: AISuggestionProps) {
  const suggestionRow = (
    <div
      className={cn(
        "group/suggestion relative flex w-full cursor-pointer items-center justify-between gap-2 rounded bg-alpha-black-50 pl-4 hover:bg-alpha-black-100",
        ANIMATION_CLASSES_WITH_DURATION
      )}
      key={suggestionKey}
    >
      <div className="flex items-center gap-2">
        {matches.map((match, index) => (
          <AITag
            {...match}
            key={index}
            tagKey={index}
            className={cn("animate-fadeIn opacity-0", ANIMATION_DELAYS[index])}
          />
        ))}
      </div>
      <div className="invisible sticky right-0 flex h-full items-center gap-2 bg-gradient-to-r from-transparent from-10% via-20% to-purple-100 to-40% px-4 py-2 ps-20 group-hover/suggestion:visible">
        {onClick && (
          <button
            className={cn(
              "reconcile-button rounded-sm px-2 py-1 text-sm font-medium hover:bg-white",
              ANIMATION_CLASSES
            )}
            type="button"
            onClick={(e) => {
              if (
                (e.target as HTMLDivElement).classList.contains(
                  "reconcile-button"
                )
              ) {
                e.stopPropagation();
              }
              onClick(e);
            }}
          >
            Reconcile
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Drawer path={path} trigger={suggestionRow}>
      {typename && id && getDrawerContent(typename, id)}
    </Drawer>
  );
}
AISuggestion.displayName = "AISuggestion";

export interface AISuggestionCardProps extends UIContainerProps {
  /** Builds out the row of a suggested entity with sub-items that match properties of the item selected by a user. */
  suggestions: AISuggestionProps[];
  /** When `true`, styles a loading state. */
  loading?: boolean;
  /** When `true`, styles an errored state. */
  error?: boolean;
  /** Sets the title of the card. */
  title?: string;
}

/** Shows AI suggestions in a card with a title header.
 *
 * [View in the MINT Documentation ↗](https://mt.style/?path=/docs/app-ui-ai-suggestions-aisuggestioncard--docs)
 */
export function AISuggestionCard({
  error,
  loading,
  suggestions,
  title,
}: AISuggestionCardProps) {
  const [ref, { height }] = useMeasure();
  const animatedProps = useSpring({
    height: height || 0,
  });

  return (
    <animated.div style={{ ...animatedProps }} className="min-w-0">
      <div
        className={cn(
          "relative rounded-lg border-2 border-double border-transparent bg-ai-looping-gradient-with-border bg-300% bg-origin-border transition-all [background-clip:content-box,_border-box]",
          loading && "animate-backgroundPulse"
        )}
        ref={ref}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full bg-ai-looping-gradient bg-300% opacity-25",
            suggestions?.length > 0 ? "py-4" : "py-2",
            loading && "animate-backgroundPulse"
          )}
        />
        <div
          className={cn(
            "flex flex-col gap-4 px-4",
            suggestions?.length > 0 ? "py-4" : "py-2"
          )}
        >
          {loading ? (
            <div className="flex justify-center">
              <div className="flex gap-2 font-medium">
                <Icon iconName="flare" />
                <div className="flex gap-1">
                  Loading
                  <LoadingDots />
                </div>
              </div>
            </div>
          ) : (
            <>
              {!error && title && (
                <div className="flex items-center justify-center gap-2 font-medium">
                  <Icon iconName="flare" size="s" />
                  {title}
                </div>
              )}
              {suggestions.length > 0 && !error && (
                <div className="grid gap-2 overflow-x-scroll">
                  {suggestions.map((suggestion, index) => (
                    <AISuggestion
                      {...suggestion}
                      key={index}
                      suggestionKey={index}
                    />
                  ))}
                </div>
              )}
              {error && (
                <div className="text-center font-medium italic">
                  No suggestions found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </animated.div>
  );
}
AISuggestionCard.displayName = "AISuggestionCard";

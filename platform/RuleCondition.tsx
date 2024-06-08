import React from "react";
import {
  RuleConditionFragment,
  RuleValue,
} from "../../../generated/dashboard/graphqlSchema";

interface RuleConditionProps {
  ruleCondition: RuleConditionFragment;
  includeLinks?: boolean;
}

function RuleCondition({
  ruleCondition,
  includeLinks = true,
}: RuleConditionProps): JSX.Element | null {
  const { prettyKey, prettyOperator, prettyValue } = ruleCondition;

  if (prettyValue.length === 0) {
    // @TODO(@lukecivantos): This is very bad. I want to log while still returning null.
    return null;
  }

  const valueContent = prettyValue.map(
    (ruleValue: RuleValue, index: number): JSX.Element => {
      const { prettyContent, path } = ruleValue;

      const startingSpace = index === 0 ? " " : null;

      let content: JSX.Element;
      let key: string;
      if (path && includeLinks) {
        key = path;
        content = (
          <React.Fragment key={key}>
            {startingSpace}
            <a href={path}>{prettyContent}</a>
          </React.Fragment>
        );
      } else {
        key = prettyContent;
        content = (
          <React.Fragment key={`${key}_${index}`}>
            {startingSpace}
            {prettyContent}
          </React.Fragment>
        );
      }

      if (prettyValue.length === 1) {
        return content;
      }

      return <li key={key}>{content}</li>;
    }
  );

  return (
    <>
      {`${prettyKey} ${prettyOperator}`}
      {prettyValue.length !== 1 && ":"}
      {valueContent}
    </>
  );
}

export default RuleCondition;

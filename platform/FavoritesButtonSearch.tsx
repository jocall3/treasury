import React, { useState } from "react";
import { Button, Icon } from "~/common/ui-components";
import { SHOW_FAVORITES } from "~/common/constants/analytics";
import trackEvent from "../../../common/utilities/trackEvent";

interface QueryType {
  favoritesOnly: "true" | "false";
}

interface FavoritesButtonSearchProps {
  disabled: boolean;
  query: QueryType;
  updateQuery: (input: Record<string, unknown>) => void;
}

const { SHOW_FAVORITES_CLICKED, SHOW_FAVORITES_UNCLICKED } = SHOW_FAVORITES;

export default function FavoritesButtonSearch({
  disabled,
  query,
  updateQuery,
}: FavoritesButtonSearchProps) {
  const [selected, setSelected] = useState<boolean>(
    JSON.parse(query.favoritesOnly || "false") as boolean
  );

  return (
    <div className="flex self-start">
      <Button
        onClick={() => {
          updateQuery({ favoritesOnly: !selected });
          setSelected(!selected);
          trackEvent(
            null,
            selected ? SHOW_FAVORITES_UNCLICKED : SHOW_FAVORITES_CLICKED
          );
        }}
        disabled={disabled}
        hideFocusOutline
      >
        <Icon
          iconName={selected ? "star_outlined" : "star"}
          color="currentColor"
          className="text-gray-600"
        />
        <span className="font-medium">
          {selected ? "Show all" : "Show favorites"}
        </span>
      </Button>
    </div>
  );
}

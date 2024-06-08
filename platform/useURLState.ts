import { useState } from "react";

interface UseURLStateProps {
  /** The initial or "default" state (will not be encoded in URL). */
  initialState: Record<string, string>;
}

export function useURLState({
  initialState,
}: UseURLStateProps): [
  Record<string, string>,
  (state: Record<string, string>) => void,
] {
  const queryParams = new URLSearchParams(window.location.search);
  const keys = Object.keys(initialState);

  // Set state to URL values if present
  const stateObj = {};
  Object.assign(
    stateObj,
    ...keys.map((k) => ({
      [k]: queryParams.get(k) ? queryParams.get(k) : initialState[k],
    }))
  );

  const [state, setState] = useState<Record<string, string>>(stateObj);

  const onChange = (newState: Record<string, string>) => {
    const mergedState = { ...state, ...newState };
    setState(mergedState);

    const searchParams = new URLSearchParams(window.location.search);
    keys.forEach((k) => {
      if (mergedState[k] !== initialState[k]) {
        searchParams.set(k, mergedState[k]);
      } else {
        searchParams.delete(k);
      }
    });
    const searchParamsString =
      searchParams.toString() && `?${searchParams.toString()}`;
    const newUrl = `${window.location.pathname}${searchParamsString}`;
    window.history.replaceState(null, "", newUrl);
  };

  return [state, onChange];
}

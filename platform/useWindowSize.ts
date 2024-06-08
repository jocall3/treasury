import { useEffect } from "react";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import { updateWindowSize } from "../actions/windowSize";

function useWindowSize(): void {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateWindowSize(window.innerWidth));
    window.addEventListener(
      "resize",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      debounce(() => {
        dispatch(updateWindowSize(window.innerWidth));
      }, 100)
    );
  }, [dispatch]);
}

export default useWindowSize;

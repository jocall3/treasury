import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BarLoader } from "react-spinners";
import colors from "../styles/colors";

/**
 * Since we are not running a single page app and reload the entire
 * page everytime you navigate, show the loading bar when the app
 * begins to unload
 */
function useNavigationLoadingBar(): void {
  useEffect(
    () =>
      window.addEventListener("beforeunload", () => {
        ReactDOM.render(
          <div
            className="fixed left-0 top-0 z-50 h-1 w-full"
            id="navigation-loading-bar"
          >
            <BarLoader color={colors.green["500"]} width="100%" />
          </div>,
          document.body.appendChild(document.createElement("DIV"))
        );
      }),
    []
  );
}

export default useNavigationLoadingBar;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import requestApi from "./requestApi";

const usePageViewTracking = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      // TODO(compliance): due to dynamic routing, server side page view tracking is not working unless we call the
      // backend explicitly. Ideally we should expose a page view tracking endpoint on the server side. That will
      // require updating analytics context with the correct data. This is a custom hook until that is implemented.
      requestApi(location.pathname, null, "GET");
    } catch (e) {
      // swallow the exception to avoid breaking the app for an analytics tracking failure
    }
  }, [location]);
};

export default usePageViewTracking;

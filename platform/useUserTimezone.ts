import moment from "moment";
import Gon from "./gon";

export default function useUserTimezone() {
  // Eventually we want to deprecate Gon and replace it
  // with a query to CurrentUser instead
  return Gon.gon?.ui?.userTimezone ?? moment.tz.guess();
}

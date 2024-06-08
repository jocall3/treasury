import { useDispatchContext } from "../../app/MessageProvider";

export default function useSuccessBanner() {
  const { dispatchSuccess } = useDispatchContext();
  return dispatchSuccess;
}

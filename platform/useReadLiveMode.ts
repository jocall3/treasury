export function useReadLiveMode(): boolean {
  return window.gon.ui?.isLiveMode;
}

export function readLiveMode(): boolean {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useReadLiveMode();
}

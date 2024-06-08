import { EffectCallback, useEffect } from "react";

// The useMountEffect hook will run the provided function only once on component mount.
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (func: EffectCallback) => useEffect(func, []);

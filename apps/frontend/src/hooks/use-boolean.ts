import { useCallback, useState } from "react";

export function useBoolean(defaultValue = false) {
  const [value, set] = useState(defaultValue);

  const on = useCallback(() => set(true), []);
  const off = useCallback(() => set(false), []);
  const toggle = useCallback(() => set((value) => !value), []);

  return { value, set, on, off, toggle };
}

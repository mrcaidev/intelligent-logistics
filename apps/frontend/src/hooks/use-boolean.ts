import { useState } from "react";

export function useBoolean(defaultValue = false) {
  const [value, set] = useState(defaultValue);

  const on = () => set(true);
  const off = () => set(false);
  const toggle = () => set((value) => !value);

  return { value, set, on, off, toggle };
}

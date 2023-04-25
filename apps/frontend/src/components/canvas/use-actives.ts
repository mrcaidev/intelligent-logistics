import { useGlobalState } from "contexts/global-state";
import { useEffect, useRef, useState } from "react";

export function useActives() {
  const { activeIds } = useGlobalState();

  const currentIndexRef = useRef(0);

  const [actives, setActives] = useState<string[]>([]);

  useEffect(() => {
    const change = () => {
      if (currentIndexRef.current >= activeIds.length) {
        currentIndexRef.current = 0;
        setTimeout(() => setActives([]), 1500);
        return;
      }
      currentIndexRef.current++;
      setActives(activeIds.slice(0, currentIndexRef.current));
      setTimeout(change, 500);
    };

    change();
  }, [activeIds]);

  return actives;
}

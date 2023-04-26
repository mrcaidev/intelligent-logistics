import { useGlobalState } from "contexts/global-state";
import { useEffect, useRef, useState } from "react";

export function useActives() {
  const { activePath } = useGlobalState();

  const currentIndexRef = useRef(0);

  const [actives, setActives] = useState<string[]>([]);

  useEffect(() => {
    const change = () => {
      if (currentIndexRef.current >= activePath.length) {
        currentIndexRef.current = 0;
        setTimeout(() => setActives([]), 1500);
        return;
      }
      currentIndexRef.current++;
      setActives(activePath.slice(0, currentIndexRef.current));
      setTimeout(change, 500);
    };

    change();
  }, [activePath]);

  return actives;
}

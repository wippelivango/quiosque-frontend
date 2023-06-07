import { useCallback, useRef } from "react";

export const useDebounce = (delay = 1000, notDelayInFirstTime = true) => {
  const debouncing = useRef<NodeJS.Timeout>();
  const isFirsTime = useRef(notDelayInFirstTime);

  const debounce = useCallback((func: () => void) => {
    if (isFirsTime.current) {
      isFirsTime.current = false;
      func();
    } else {
      if (debouncing.current) {
        clearTimeout(debouncing.current);
      }
      debouncing.current = setTimeout(() => func(), delay);
    }
  }, [delay]);

  return { debounce };
};
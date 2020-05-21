import { useState, useMemo } from "react";
import { calculate } from "./patterns";
import { useDebounce } from "react-use";

const useCalculation = ({ filters, immediate = false }) => {
  const [state, setState] = useState(null);

  useDebounce(
    () => {
      if (filters) {
        calculate(filters)
          .then(setState)
          .catch(() => setState(null));
      } else {
        setState(null);
      }
    },
    immediate ? 0 : 500,
    [filters]
  );

  const { minMaxPattern, minWeekValue, patterns, quantiles } = state || {};

  return useMemo(
    () => ({ minMaxPattern, minWeekValue, patterns, quantiles, filters }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
};

export default useCalculation;

import { useState, useMemo, useContext } from "react";
import { calculate } from "./patterns";
import { useDebounce } from "react-use";
import { QuantileContext } from "../components";

const useCalculation = ({ filters, immediate = false }) => {
  const [state, setState] = useState(null);
  const [quantileRange] = useContext(QuantileContext);

  useDebounce(
    () => {
      if (filters) {
        calculate({ filters, quantileRange })
          .then(setState)
          .catch(() => setState(null));
      } else {
        setState(null);
      }
    },
    immediate ? 0 : 500,
    [filters, quantileRange]
  );

  const { minMaxPattern, minWeekValue, patterns, quantiles } = state || {};

  return useMemo(
    () => ({ minMaxPattern, minWeekValue, patterns, quantiles, filters }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
};

export default useCalculation;

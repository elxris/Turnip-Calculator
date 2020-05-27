import { useReducer } from "react";
import { useCalculation } from "./index";

const initialState = {
  rewindEnabled: false,
  rewindFilters: [],
};

const reducer = (state = initialState, action) => {
  const { rewindEnabled, filters, indexInHistory } = action.payload;
  if (rewindEnabled) {
    return {
      ...state,
      rewindEnabled,
      rewindFilters: filters.map((filter, idx) => {
        if (idx > indexInHistory) {
          // Ignore values beyond the selected point in history
          return null;
        }
        return filter;
      }),
    };
  }

  return state;
};

const useTimeTravel = (filters) => {
  const [{ rewindEnabled, rewindFilters }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Get prediction/minMax values based on rewindFilters
  // if rewindEnabled is true
  const calcInput = rewindEnabled ? rewindFilters : filters;
  const result = useCalculation({ filters: calcInput });

  if (rewindEnabled) {
    // Draw "Daily Price" based on the user's actual input.
    // This allows the user to see their actual turnip prices graphed
    // compared to past projections as they evolved.
    result.filters = filters;
  }

  return [dispatch, result];
};

export default useTimeTravel;

import { useReducer } from "react";

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
          return null;
        }
        return filter;
      }),
    };
  }

  return initialState;
};

const useChartReducer = () => [...useReducer(reducer, initialState)];

export default useChartReducer;

import { useReducer } from "react";

const initialState = {
  rewindEnabled: false,
  indexInHistory: null, // will be integer representing index in user input array
  rewindFilters: [].fill(null),
};

const reducer = (state = initialState, action) => {
  const { rewindEnabled, filters, indexInHistory } = action.payload;
  if (rewindEnabled) {
    return {
      ...state,
      rewindEnabled: true,
      rewindFilters: filters.map((filter, idx) => {
        if (typeof indexInHistory === "number" && idx > indexInHistory) {
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

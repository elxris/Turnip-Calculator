import { useReducer } from "react";

export const CHART_STATES = {
  DEFAULT: "DEFAULT",
  REWIND: "REWIND",
};

const initialState = {
  chartState: CHART_STATES.DEFAULT,
  indexInHistory: null, // will be integer representing index in user input array
};

const reducer = (state = initialState, action) => ({
  ...state,
  ...action.payload,
});

const useChartReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    state,
    dispatch,
    chartStates: CHART_STATES,
  };
};

export default useChartReducer;

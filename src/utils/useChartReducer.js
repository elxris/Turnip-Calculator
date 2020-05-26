import { createContext, useReducer } from "react";

const ChartContext = createContext();

export const CHART_STATES = {
  DEFAULT: "DEFAULT",
  REWIND: "REWIND",
};

export const CHART_ACTIONS = {
  UPDATE_STATE: "UPDATE_STATE",
};

const initialState = {
  chartState: CHART_STATES.DEFAULT,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHART_ACTIONS.UPDATE_STATE:
      return {
        ...state,
        chartState: action.payload.chartState,
      };
    default:
      return state;
  }
};

const useChartReducer = () => {
  return [...useReducer(reducer, initialState), ChartContext];
};

export default useChartReducer;

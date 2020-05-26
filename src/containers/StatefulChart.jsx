import React from "react";
import { Chart } from "../components";

const StatefulChart = ({ state, ...props }) => {
  console.log("stateful chart", state);

  return <Chart {...props} />;
};

export default StatefulChart;

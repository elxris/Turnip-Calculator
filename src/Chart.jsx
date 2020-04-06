import React, { useLayoutEffect, useRef } from "react";
import { arrayOf, number } from "prop-types";
import Chart from "chart.js";
import zip from "lodash.zip";
import {
  possiblePatterns,
  patternReducer,
  averageReducer,
} from "./v2/optimizer";
import { Box } from "@material-ui/core";
import { useWindowSize, useOrientation, useMeasure } from "react-use";
import { useEffect } from "react";

const generateData = (filter) => {
  const patterns = possiblePatterns(filter);
  const minMaxPattern = patternReducer(patterns);
  const minMaxData = zip(...minMaxPattern);
  const avgPattern = patternReducer(patterns, averageReducer);
  const avgData = zip(...avgPattern);

  return [
    {
      label: "Yours",
      data: filter.slice(1),
      fill: false,
      backgroundColor: "#EF8341",
      borderColor: "#EF8341",
    },
    {
      label: "Average",
      data: avgData[0] ? avgData[0].map(Math.trunc) : [],
      backgroundColor: "#F0E16F",
      borderColor: "#F0E16F",
      pointRadius: 0,
      fill: false,
    },
    {
      label: "Maximum",
      data: minMaxData[1],
      backgroundColor: "#7FD1A5",
      borderColor: "#7FD1A5",
      fill: 1,
    },
    {
      label: "Minimum",
      data: minMaxData[0],
      backgroundColor: "#88C9A1",
      borderColor: "#88C9A1",
      fill: 1,
    },
  ];
};

const ChartComponent = ({ filter }) => {
  const canvas = useRef();
  const chart = useRef();

  useLayoutEffect(() => {
    const ctx = canvas.current.getContext("2d");
    chart.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: generateData(filter),
        labels: "Mon Tue Wed Thu Fri Sat"
          .split(" ")
          .reduce((acc, day) => [...acc, `${day} AM`, `${day} PM`], []),
      },
      options: {
        maintainAspectRatio: false,
        showLines: true,
        tooltips: {
          intersect: false,
          mode: "index",
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 300,
              },
            },
          ],
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!chart.current) return;
    chart.current.data.datasets = generateData(filter);
    chart.current.update();
  }, [filter]);

  return (
    <Box p={2} mt={2} borderRadius={16} bgcolor="bkgs.mainAlt">
      <canvas ref={canvas} width={600} height={400} />
    </Box>
  );
};

ChartComponent.propTypes = {
  filter: arrayOf(number).isRequired,
};

export default ChartComponent;

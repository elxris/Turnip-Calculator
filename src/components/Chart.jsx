import React, { useRef, useCallback, useEffect } from "react";
import { arrayOf, number } from "prop-types";
import Chart from "chart.js";
import zip from "lodash.zip";
import merge from "lodash.merge";
import { Box } from "@material-ui/core";
import { useDebounce } from "react-use";
import { useTranslation } from "react-i18next";
import { calculate } from "../utils";

Chart.defaults.defaultFontFamily = "Arial Rounded MT Bold";

const createGenerteData = (t) => (filter) => {
  let { patterns, avgPattern, minMaxPattern, minWeekValue } = calculate(filter);

  console.log(JSON.stringify({ patterns }));

  const minMaxData = zip(...minMaxPattern);

  return [
    {
      label: t("Buy Price"),
      data: new Array(12).fill(filter[0] || null),
      fill: true,
      backgroundColor: "transparent",
      borderColor: "#7B6C53",
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [5, 15],
    },
    {
      label: t("Guaranteed Min"),
      data: new Array(12).fill(minWeekValue || null),
      fill: true,
      backgroundColor: "transparent",
      borderColor: "#007D75",
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [3, 6],
    },
    {
      label: t("Daily Price"),
      data: Array.from({ length: 12 }, (v, i) => filter[i + 1] || null),
      fill: false,
      backgroundColor: "#EF8341",
      borderColor: "#EF8341",
    },
    {
      label: t("Average"),
      data: avgPattern || new Array(12).fill(null),
      backgroundColor: "#F0E16F",
      borderColor: "#F0E16F",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
    {
      label: t("Maximum"),
      data: minMaxData[1] || new Array(12).fill(null),
      backgroundColor: "#A5D5A5",
      borderColor: "#A5D5A5",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
    {
      label: t("Minimum"),
      data: minMaxData[0] || new Array(12).fill(null),
      backgroundColor: "#88C9A1",
      borderColor: "#88C9A1",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
    ...patterns.reduce((acc, pattern) => {
      const minMaxData = zip(...pattern);
      return [
        ...acc,
        {
          label: "submax",
          data: minMaxData[1] || new Array(12).fill(null),
          backgroundColor: `RGBA(165, 213, 165, ${
            pattern.probability * Math.log2(patterns.length + 1)
          })`,
          borderColor: `transparent`,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: 3,
        },
        {
          label: "submin",
          data: minMaxData[0] || new Array(12).fill(null),
          backgroundColor: `RGBA(136, 201, 161, ${
            pattern.probability * Math.log2(patterns.length + 1)
          })`,
          borderColor: `transparent`,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: 3,
        },
      ];
    }, []),
  ];
};

const createGetLabels = (t) => () => {
  return t("Mon Tue Wed Thu Fri Sat")
    .split(" ")
    .reduce(
      (acc, day) => [...acc, `${day} ${t("AM")}`, `${day} ${t("PM")}`],
      []
    );
};

const chartOptions = {
  maintainAspectRatio: false,
  showLines: true,
  tooltips: {
    intersect: false,
    mode: "index",
    filter: ({ datasetIndex }) => datasetIndex < 6,
  },
  scales: {
    y: {
      gridLines: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 400,
    },
  },
  elements: {
    line: {
      cubicInterpolationMode: "monotone",
    },
  },
  legend: {
    labels: {
      filter: ({ text = "" }) => !text.includes("sub"),
    },
  },
};

const ChartComponent = ({ filters }) => {
  const canvas = useRef();
  const chart = useRef();
  const { t } = useTranslation();
  const generateData = useCallback(createGenerteData(t), [t]);
  const getLabels = useCallback(createGetLabels(t), [t]);

  // onMount effect
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    chart.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: generateData(filters),
        labels: getLabels(),
      },
      options: chartOptions,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Language labels chart effect
  useEffect(() => {
    if (!chart.current) return;
    // this is necessary, or else labels won't change language until reload
    const newLabels = getLabels();
    merge(chart.current.data.labels, newLabels);
    chart.current.update();
  }, [getLabels]);

  // Filters / Data effect
  useDebounce(
    () => {
      if (!chart.current) return;
      // regerates chart in the new
      const newData = generateData(filters, t);
      merge(chart.current.data.datasets, newData);
      chart.current.data.datasets.length = newData.length;
      chart.current.update();
    },
    500,
    [filters, generateData]
  );

  // Fix for mobile tooltip
  const tooltipTimeout = useRef();
  const onTouchEnd = useCallback(() => {
    clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => {
      if (!chart.current) return;
      chart.current.options.tooltips.enabled = false;
      chart.current.update();
    }, 3000);
  }, []);
  const onTouchStart = useCallback(() => {
    if (!chart.current) return;
    chart.current.options.tooltips.enabled = true;
    chart.current.update();
  }, []);
  // Clear timeout if unmount
  useEffect(() => {
    return () => {
      clearTimeout(tooltipTimeout.current);
    };
  }, []);

  return (
    <Box
      p={[0.5, 1, 2]}
      mt={2}
      borderRadius={16}
      bgcolor="bkgs.chart"
      width={1}
      height={400}
    >
      <canvas
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
        unselectable={"on"}
        ref={canvas}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
      />
    </Box>
  );
};

ChartComponent.propTypes = {
  filters: arrayOf(number).isRequired,
};

export default ChartComponent;

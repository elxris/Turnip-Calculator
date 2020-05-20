import mockPatterns from "./mockPatterns.json";
import { range, quantile } from "d3-array";
const wasm = import("patterns");

// The lower score, the better.
const calculateScore = (filters, pattern) => {
  return pattern.reduce(
    (prev, [min, max], i) =>
      prev +
      (filters[i + 1]
        ? filters[i + 1] < min
          ? min - filters[i + 1]
          : filters[i + 1] > max
          ? filters[i + 1] - max
          : 0
        : 0),
    0
  );
};
const heuristicFilter = (filters, patterns) => {
  const scores = new Map();
  patterns.forEach((pattern) => {
    scores.set(pattern, calculateScore(filters, pattern));
  });
  patterns.sort(
    (patternA, patternB) => scores.get(patternA) - scores.get(patternB)
  );
  const firstScore = scores.get(patterns[0]);
  return patterns.filter((pattern) => scores.get(pattern) <= firstScore * 1.1);
};

const possiblePatterns = async (filters) => {
  const probabilities = [140, 105, 55, 100]; // out of 400

  let wasmPatterns;
  try {
    wasmPatterns = JSON.parse((await wasm).calculate(filters.join("-")));
  } catch (error) {
    console.warn(error);
    wasmPatterns = mockPatterns;
  }

  const all = wasmPatterns.map(([patternNumber, ...pattern]) => {
    pattern.pattern = patternNumber;
    return pattern;
  });

  const results = heuristicFilter(filters, all);
  const countPerPattern = results.reduce(
    (acc, pattern) => {
      acc[pattern.pattern]++;
      return acc;
    },
    [0, 0, 0, 0]
  );
  const allPatternsProb = countPerPattern.reduce(
    (acc, count, i) => (count ? acc + probabilities[i] : acc),
    0
  );
  return results.map((pattern) => {
    pattern.probability =
      probabilities[pattern.pattern] /
      allPatternsProb /
      countPerPattern[pattern.pattern];
    return pattern;
  });
};

// Take all patternsOptions and make them single [min, max] values.
const minMaxReducer = (prev, current) => {
  return prev.map(([min, max], i) => {
    const [newMin, newMax] = current[i];
    return [min > newMin ? newMin : min, max < newMax ? newMax : max];
  });
};

// This reducer will get all-week minimum.
const minPricePointsReducer = ([a], [b]) => [Math.max(a, b)];
const minWeekReducer = (prev, current, i) => {
  const [a] = current.reduce(minPricePointsReducer);
  const [b] = i === 1 ? prev.reduce(minPricePointsReducer) : prev;
  return [Math.min(a, b)];
};

// This will generate samples of uniform distribution used for quantiles.
const samplesReducer = (prev, current, i) => {
  let arr = prev;
  if (i === 1) {
    arr = Array.from({ length: 12 }, (v, i) => i);
    return arr.map((index) => {
      const [a, b] = prev[index];
      const [c, d] = current[index];
      const stepA = 0.1 * (1 / prev.probability);
      const stepB = 0.1 * (1 / current.probability);
      return range(a, b + 1, stepA).concat(range(c, d + 1, stepB));
    });
  } else {
    return prev.map((value, index) => {
      const [a, b] = current[index];
      const step = 0.1 * (1 / current.probability);
      return value.concat(range(a, b + 1, step));
    });
  }
};

const patternReducer = (allPatterns, reducer) => {
  if (allPatterns.length === 1) {
    return [allPatterns[0], allPatterns[0]].reduce(reducer);
  }
  return allPatterns.reduce(reducer);
};

const calculateQuantiles = (patterns) => {
  const samples = patternReducer(patterns, samplesReducer);
  return [0.25, 0.5, 0.75].map((q) => {
    return samples.map((daySamples, i) => Math.floor(quantile(daySamples, q)));
  });
};

const calculate = async (filter) => {
  let patterns = await possiblePatterns(filter);
  const minMaxPattern = patternReducer(patterns, minMaxReducer);
  const [minWeekValue] = patternReducer(patterns, minWeekReducer);
  const quantiles = calculateQuantiles(patterns);

  const result = {
    minMaxPattern,
    minWeekValue,
    patterns,
    quantiles,
  };

  return result;
};

export { calculate };
